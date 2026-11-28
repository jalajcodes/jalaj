// Scores API for "Shoot the page". The site itself is static files; only /api/* runs this Worker
// (see `run_worker_first` in wrangler.jsonc), so normal page loads never touch it. Scores live in D1.
//
// The D1 database (`jalaj-fyi`) is shared by the whole site, so everything this feature creates is prefixed
// `leaderboard_`. A future feature should create its own prefixed tables the same way.
//
// Anyone can call this API, so the scores are self-reported by the visitor's browser. The checks below raise the
// bar (a server-issued run id, a plausible amount of play time, one use per run, rate limits) but cannot make a
// leaderboard tamper-proof. What is stored: the chosen name, the score, the time, and a one-way hash of the IP
// address that is used only for rate limiting.

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  run(): Promise<{ meta: { changes?: number } }>
  all<T = unknown>(): Promise<{ results: T[] }>
  first<T = unknown>(): Promise<T | null>
}
interface D1Database {
  prepare(query: string): D1PreparedStatement
  batch(statements: D1PreparedStatement[]): Promise<unknown[]>
}
interface Env {
  DB: D1Database
  ADMIN_TOKEN?: string // set with `wrangler secret put ADMIN_TOKEN`; the admin routes are off without it
}

const MIN_SCORE = 51 // a score has to be more than 50 to go on the board
const MAX_SCORE = 20_000
const TOP_N = 20
const MIN_PLAY_SECONDS = 8
const MAX_POINTS_PER_SECOND = 80 // generous: a perfect run scores roughly 60 to 100 points a second
const MAX_RUN_AGE_MS = 2 * 60 * 60 * 1000
const SUBMISSIONS_PER_HOUR = 3
const RUNS_PER_HOUR = 40
const HOUR = 60 * 60 * 1000

// Unambiguous profanity only, matched against the name with spaces and symbols removed.
const BLOCKED = ['fuck', 'shit', 'bitch', 'cunt', 'whore', 'slut', 'nigg', 'fagg', 'nazi', 'rape']

const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      ...headers,
    },
  })
const fail = (status: number, error: string) => json({ error }, status)

let ready: Promise<unknown> | null = null
const init = (db: D1Database) =>
  (ready ??= db
    .batch([
      db.prepare(
        'CREATE TABLE IF NOT EXISTS leaderboard_scores (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, score INTEGER NOT NULL, created_at INTEGER NOT NULL, ip_hash TEXT NOT NULL)',
      ),
      db.prepare(
        'CREATE INDEX IF NOT EXISTS leaderboard_scores_rank ON leaderboard_scores (score DESC, created_at ASC)',
      ),
      db.prepare('CREATE INDEX IF NOT EXISTS leaderboard_scores_ip ON leaderboard_scores (ip_hash, created_at)'),
      db.prepare(
        'CREATE TABLE IF NOT EXISTS leaderboard_runs (id TEXT PRIMARY KEY, started_at INTEGER NOT NULL, ip_hash TEXT NOT NULL, used INTEGER NOT NULL DEFAULT 0)',
      ),
      db.prepare('CREATE INDEX IF NOT EXISTS leaderboard_runs_ip ON leaderboard_runs (ip_hash, started_at)'),
    ])
    .catch((e) => {
      ready = null
      throw e
    }))

const ipHash = async (request: Request) => {
  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown'
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${ip}|jalaj.fyi`))
  return [...new Uint8Array(digest)]
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

const cleanName = (raw: unknown) => {
  if (typeof raw !== 'string') return null
  const name = raw.normalize('NFKC').replace(/\s+/g, ' ').trim()
  if (name.length < 2 || name.length > 16) return null
  if (!/^[\p{L}\p{N} ._-]+$/u.test(name)) return null
  const squashed = name.toLowerCase().replace(/[^a-z0-9]/g, '')
  return BLOCKED.some((w) => squashed.includes(w)) ? null : name
}

interface ScoreRow {
  name: string
  score: number
  at: number
}
const WEEK_MS = 7 * 24 * 60 * 60 * 1000
// `since` limits the board to recent scores (the weekly board); 0 means all time.
const topScores = async (db: D1Database, since = 0) =>
  (
    await db
      .prepare(
        'SELECT name, score, created_at AS at FROM leaderboard_scores WHERE created_at >= ? ORDER BY score DESC, created_at ASC LIMIT ?',
      )
      .bind(since, TOP_N)
      .all<ScoreRow>()
  ).results

async function readBody(request: Request) {
  const text = await request.text()
  if (text.length > 1024) return null
  try {
    return JSON.parse(text) as Record<string, unknown>
  } catch {
    return null
  }
}

// Compare two strings without leaking where they differ (both are hashed first, then compared in full).
const sameSecret = async (a: string, b: string) => {
  const h = async (x: string) => new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(x)))
  const [x, y] = await Promise.all([h(a), h(b)])
  let diff = 0
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i]
  return diff === 0
}

// /api/admin/*: list recent scores and delete one. Needs `Authorization: Bearer <ADMIN_TOKEN>`.
async function admin(request: Request, env: Env, url: URL) {
  if (!env.ADMIN_TOKEN) return fail(503, 'Admin is not set up')
  const given = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')
  if (!given || !(await sameSecret(given, env.ADMIN_TOKEN))) return fail(401, 'Unauthorized')
  await init(env.DB)
  if (url.pathname === '/api/admin/scores' && request.method === 'GET') {
    const rows = await env.DB.prepare(
      'SELECT id, name, score, created_at AS at FROM leaderboard_scores ORDER BY created_at DESC LIMIT 200',
    ).all<ScoreRow & { id: number }>()
    return json({ scores: rows.results })
  }
  const m = url.pathname.match(/^\/api\/admin\/scores\/(\d+)$/)
  if (m && request.method === 'DELETE') {
    const r = await env.DB.prepare('DELETE FROM leaderboard_scores WHERE id = ?').bind(Number(m[1])).run()
    return json({ deleted: r.meta.changes })
  }
  return fail(404, 'Not found')
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const db = env.DB
    try {
      if (url.pathname.startsWith('/api/admin/')) {
        const origin = request.headers.get('origin')
        if (origin && new URL(origin).host !== url.host) return fail(403, 'Forbidden')
        return await admin(request, env, url)
      }
      if (!url.pathname.startsWith('/api/scores')) return fail(404, 'Not found')

      // Browsers send an Origin header on cross-site requests; refuse any that are not ours.
      const origin = request.headers.get('origin')
      if (origin && new URL(origin).host !== url.host) return fail(403, 'Forbidden')

      await init(db)
      const now = Date.now()

      // GET /api/scores: the top scores
      if (url.pathname === '/api/scores' && request.method === 'GET') {
        const since = url.searchParams.get('period') === 'week' ? now - WEEK_MS : 0
        return json({ min: MIN_SCORE, scores: await topScores(db, since) }, 200, {
          'cache-control': 'public, max-age=15',
        })
      }

      // POST /api/scores/start: called when a game begins. The id it returns is needed to submit a score.
      if (url.pathname === '/api/scores/start' && request.method === 'POST') {
        const ip = await ipHash(request)
        const recent = await db
          .prepare('SELECT COUNT(*) AS n FROM leaderboard_runs WHERE ip_hash = ? AND started_at > ?')
          .bind(ip, now - HOUR)
          .first<{ n: number }>()
        if ((recent?.n ?? 0) >= RUNS_PER_HOUR) return fail(429, 'Too many games started. Try again later.')
        const runId = crypto.randomUUID()
        await db.batch([
          db.prepare('INSERT INTO leaderboard_runs (id, started_at, ip_hash) VALUES (?, ?, ?)').bind(runId, now, ip),
          db.prepare('DELETE FROM leaderboard_runs WHERE started_at < ?').bind(now - 24 * HOUR),
        ])
        return json({ runId })
      }

      // POST /api/scores: submit a score { runId, name, score }
      if (url.pathname === '/api/scores' && request.method === 'POST') {
        const body = await readBody(request)
        if (!body) return fail(400, 'Bad request')
        const name = cleanName(body.name)
        if (!name) return fail(422, 'Pick a different name: 2 to 16 letters, numbers or spaces, and keep it friendly.')
        const score = body.score
        if (typeof score !== 'number' || !Number.isInteger(score) || score < MIN_SCORE || score > MAX_SCORE) {
          return fail(422, `Scores above ${MIN_SCORE - 1} go on the board.`)
        }
        if (typeof body.runId !== 'string') return fail(400, 'Bad request')

        const run = await db
          .prepare('SELECT started_at, used FROM leaderboard_runs WHERE id = ?')
          .bind(body.runId)
          .first<{ started_at: number; used: number }>()
        if (!run) return fail(404, 'That game was not found. Play again to post a score.')
        if (run.used) return fail(409, 'That game was already submitted. Play again to post a new score.')
        if (now - run.started_at > MAX_RUN_AGE_MS) return fail(409, 'That game is too old. Play again.')
        const seconds = (now - run.started_at) / 1000
        if (seconds < Math.max(MIN_PLAY_SECONDS, score / MAX_POINTS_PER_SECOND)) {
          return fail(422, 'That score came in faster than the game allows.')
        }

        const ip = await ipHash(request)
        const recent = await db
          .prepare('SELECT COUNT(*) AS n FROM leaderboard_scores WHERE ip_hash = ? AND created_at > ?')
          .bind(ip, now - HOUR)
          .first<{ n: number }>()
        if ((recent?.n ?? 0) >= SUBMISSIONS_PER_HOUR) return fail(429, 'That is plenty for one hour. Try again later.')

        // Claim the run first so the same game cannot be submitted twice, even by parallel requests.
        const claimed = await db
          .prepare('UPDATE leaderboard_runs SET used = 1 WHERE id = ? AND used = 0')
          .bind(body.runId)
          .run()
        if (claimed.meta.changes !== 1) return fail(409, 'That game was already submitted.')

        await db
          .prepare('INSERT INTO leaderboard_scores (name, score, created_at, ip_hash) VALUES (?, ?, ?, ?)')
          .bind(name, score, now, ip)
          .run()
        const above = await db
          .prepare('SELECT COUNT(*) AS n FROM leaderboard_scores WHERE score > ?')
          .bind(score)
          .first<{ n: number }>()
        return json({ ok: true, name, rank: (above?.n ?? 0) + 1, scores: await topScores(db) })
      }

      return fail(405, 'Method not allowed')
    } catch (error) {
      console.error(error)
      return fail(500, 'Something went wrong')
    }
  },
}
