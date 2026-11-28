// "Shoot the page": an Asteroids-style game that runs over whatever page you are on. Bullets destroy the words
// and letters of the real page; a few drifting rocks add the classic danger. Loaded only when you start it.
// Exiting reloads the page, which puts every word back.

interface Rock { x: number; y: number; vx: number; vy: number; size: 1 | 2 | 3; r: number; shape: number[]; rot: number; vr: number }
interface Bullet { x: number; y: number; px: number; py: number; vx: number; vy: number; life: number }
interface Bit { x: number; y: number; vx: number; vy: number; life: number; color: string }

const TAU = Math.PI * 2
const RADIUS = { 1: 14, 2: 26, 3: 44 } as const
const POINTS = { 1: 100, 2: 50, 3: 20 } as const
const SKIP = 'script,style,noscript,svg,canvas,textarea,input,select,option,.sr-only,.ci,[data-asteroids],#preloader'
const BEST_KEY = 'jj-asteroids-best'
const SOUND_KEY = 'jj-asteroids-sound'
let active = false

export function startAsteroids() {
  if (active) return
  if (document.documentElement.classList.contains('intro-run')) return
  active = true

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const touch = matchMedia('(pointer: coarse)').matches
  const css = getComputedStyle(document.documentElement)
  const col = (name: string) => css.getPropertyValue(name).trim()
  let best = 0
  try { best = Number(localStorage.getItem(BEST_KEY)) || 0 } catch {}

  // ---- turn the page's text into targets ----
  document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('in'))
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => {
      if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT
      const p = n.parentElement
      return !p || p.closest(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    },
  })
  const nodes: Text[] = []
  while (walker.nextNode()) nodes.push(walker.currentNode as Text)
  for (const node of nodes) {
    const frag = document.createDocumentFragment()
    for (const part of node.nodeValue!.split(/(\s+)/)) {
      if (!part) continue
      if (/^\s+$/.test(part)) frag.append(part)
      else {
        const s = document.createElement('span')
        s.className = 'sh-w'
        s.textContent = part
        frag.append(s)
      }
    }
    node.replaceWith(frag)
  }
  const targets = [...document.querySelectorAll<HTMLElement>('.sh-w, .ci')].filter((el) => el.getClientRects().length > 0)
  const total = Math.max(1, targets.length)
  let destroyed = 0

  // ---- overlay ----
  const root = document.createElement('div')
  root.setAttribute('data-asteroids', '')
  root.style.cssText = 'position:fixed;inset:0;z-index:2147483000;pointer-events:none'
  const canvas = document.createElement('canvas')
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%'
  root.append(canvas)
  const ctx = canvas.getContext('2d')!
  const status = document.createElement('p')
  status.setAttribute('role', 'status')
  status.className = 'sr-only'
  root.append(status)
  const topBar = document.createElement('div')
  topBar.style.cssText = `position:absolute;top:${innerWidth < 640 ? 106 : 70}px;right:12px;display:flex;gap:8px;pointer-events:none`
  const pill = (label: string) => {
    const b = document.createElement('button')
    b.type = 'button'
    b.textContent = label
    b.style.cssText = `pointer-events:auto;cursor:pointer;font:600 13px ${'"JetBrains Mono Variable", ui-monospace, monospace'};padding:6px 12px;border-radius:999px;border:1px solid ${col('--line')};background:${col('--bg')};color:${col('--fg')}`
    return b
  }
  const soundBtn = pill('Sound on (M)')
  const exitBtn = pill('Exit (Esc)')
  topBar.append(soundBtn, exitBtn)
  root.append(topBar)
  document.body.append(root)
  document.documentElement.style.overflow = 'hidden'
  document.body.style.userSelect = 'none'
  ;(document.activeElement as HTMLElement | null)?.blur?.()
  status.textContent = 'Shoot the page started. Use the arrow keys to fly, space to fire, escape to exit.'


  // ---- sound: synthesised with Web Audio, so there are no audio files to download ----
  let soundOn = true
  try { soundOn = localStorage.getItem(SOUND_KEY) !== 'off' } catch {}
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  let ac: AudioContext | null = null
  let master: GainNode | null = null
  let noiseBuf: AudioBuffer | null = null
  let rumble: GainNode | null = null
  try {
    if (AC) {
      ac = new AC()
      master = ac.createGain()
      master.gain.value = 0.28
      master.connect(ac.destination)
      const len = Math.floor(ac.sampleRate * 1.5)
      noiseBuf = ac.createBuffer(1, len, ac.sampleRate)
      const d = noiseBuf.getChannelData(0)
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    }
  } catch { ac = null }
  // Browsers only let audio start after a click or key press, so wake it on any input.
  const awake = () => { if (ac && ac.state === 'suspended') void ac.resume().catch(() => {}) }
  const can = () => !!ac && !!master && soundOn && ac.state === 'running'
  const tone = (type: OscillatorType, f0: number, f1: number, dur: number, vol: number, delay = 0) => {
    if (!can()) return
    const t = ac!.currentTime + delay
    const o = ac!.createOscillator(), g = ac!.createGain()
    o.type = type
    o.frequency.setValueAtTime(f0, t)
    o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur)
    g.gain.setValueAtTime(vol, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g).connect(master!)
    o.start(t)
    o.stop(t + dur + 0.03)
  }
  const noise = (dur: number, vol: number, from: number, to: number, delay = 0) => {
    if (!can() || !noiseBuf) return
    const t = ac!.currentTime + delay
    const src = ac!.createBufferSource(), f = ac!.createBiquadFilter(), g = ac!.createGain()
    src.buffer = noiseBuf
    f.type = 'lowpass'
    f.frequency.setValueAtTime(from, t)
    f.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + dur)
    g.gain.setValueAtTime(vol, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    src.connect(f).connect(g).connect(master!)
    src.start(t)
    src.stop(t + dur + 0.03)
  }
  // The engine rumble is one looping, filtered noise whose volume follows the thrust key.
  const thrustSound = (on: boolean) => {
    if (!ac || !master) return
    if (!can()) { rumble?.gain.setTargetAtTime(0, ac.currentTime, 0.05); return }
    if (!rumble && noiseBuf) {
      const src = ac.createBufferSource(), f = ac.createBiquadFilter()
      rumble = ac.createGain()
      rumble.gain.value = 0
      src.buffer = noiseBuf
      src.loop = true
      f.type = 'lowpass'
      f.frequency.value = 220
      src.connect(f).connect(rumble).connect(master)
      src.start()
    }
    rumble?.gain.setTargetAtTime(on ? 0.5 : 0, ac.currentTime, 0.06)
  }
  const sfx = {
    start: () => { tone('square', 330, 660, 0.12, 0.2); tone('square', 660, 990, 0.12, 0.18, 0.1) },
    fire: () => tone('square', 900, 180, 0.11, 0.16),
    text: () => tone('triangle', 420 + Math.random() * 180, 200, 0.07, 0.22),
    rock: (size: 1 | 2 | 3) => {
      const dur = [0.15, 0.28, 0.45][size - 1]
      noise(dur, 0.8, [1800, 1500, 1200][size - 1], 160)
      tone('sawtooth', [220, 150, 95][size - 1], 35, dur, 0.4)
    },
    ship: () => { noise(0.8, 0.9, 2600, 90); tone('sawtooth', 240, 30, 0.7, 0.35) },
    wave: () => { tone('square', 200, 200, 0.09, 0.15); tone('square', 260, 260, 0.09, 0.15, 0.12) },
    over: () => [330, 262, 196, 147].forEach((f, i) => tone('triangle', f, f * 0.97, 0.32, 0.3, i * 0.28)),
    cleared: () => [392, 494, 587, 784].forEach((f, i) => tone('square', f, f, 0.18, 0.2, i * 0.12)),
  }
  const setSound = (on: boolean) => {
    soundOn = on
    try { localStorage.setItem(SOUND_KEY, on ? 'on' : 'off') } catch {}
    soundBtn.textContent = on ? 'Sound on (M)' : 'Sound off (M)'
    status.textContent = on ? 'Sound on' : 'Sound off'
    if (on) { awake(); setTimeout(sfx.text, 60) } else thrustSound(false)
  }
  soundBtn.textContent = soundOn ? 'Sound on (M)' : 'Sound off (M)'
  awake()
  setTimeout(sfx.start, 90)
  document.addEventListener('visibilitychange', () => {
    if (!ac) return
    if (document.hidden) void ac.suspend().catch(() => {})
    else awake()
  })

  let W = 0, H = 0
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2)
    W = innerWidth; H = innerHeight
    canvas.width = W * dpr; canvas.height = H * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()
  addEventListener('resize', resize)

  // ---- game state ----
  const keys = new Set<string>()
  const ship = { x: W / 2, y: H / 2, vx: 0, vy: 0, a: -Math.PI / 2, invuln: 1.5, cool: 0 }
  let rocks: Rock[] = [], bullets: Bullet[] = [], bits: Bit[] = []
  let score = 0, lives = 3, wave = 0, mode: 'play' | 'over' | 'cleared' = 'play', tPlay = 0

  const makeRock = (x: number, y: number, size: 1 | 2 | 3): Rock => {
    const r = RADIUS[size], sp = (80 - size * 18) * (0.6 + Math.random() * 0.8), dir = Math.random() * TAU
    return { x, y, vx: Math.cos(dir) * sp, vy: Math.sin(dir) * sp, size, r, rot: Math.random() * TAU, vr: (Math.random() - 0.5) * 1.2, shape: Array.from({ length: 10 }, () => 0.72 + Math.random() * 0.45) }
  }
  const spawnWave = () => {
    wave++
    for (let i = 0; i < 2 + wave; i++) {
      let x = 0, y = 0
      do { x = Math.random() * W; y = Math.random() * H } while (Math.hypot(x - ship.x, y - ship.y) < 220)
      rocks.push(makeRock(x, y, 3))
    }
  }
  spawnWave()

  const burst = (x: number, y: number, color: string, n = 8) => {
    for (let i = 0; i < (reduce ? 3 : n); i++) {
      const a = Math.random() * TAU, s = 40 + Math.random() * 160
      bits.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.5 + Math.random() * 0.3, color })
    }
  }

  const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - innerHeight)
  const shift = (dy: number) => {
    ship.y -= dy
    rocks.forEach((r) => (r.y -= dy))
    bullets.forEach((b) => { b.y -= dy; b.py -= dy })
    bits.forEach((b) => (b.y -= dy))
  }
  const scrollBy = (d: number) => {
    const before = scrollY
    scrollTo({ top: before + d, behavior: 'instant' })
    shift(scrollY - before)
  }

  const hitText = (x: number, y: number) => {
    const el = document.elementFromPoint(x, y) as HTMLElement | null
    const t = el?.closest?.('.sh-w, .ci') as HTMLElement | null
    if (!t || t.classList.contains('sh-dead')) return false
    t.classList.add('sh-dead')
    destroyed++
    score += 10
    burst(x, y, col('--brand'), 6)
    sfx.text()
    return true
  }

  const killShip = () => {
    lives--
    burst(ship.x, ship.y, col('--hot'), 24)
    sfx.ship()
    if (lives <= 0) return finish('over')
    Object.assign(ship, { x: W / 2, y: H / 2, vx: 0, vy: 0, a: -Math.PI / 2, invuln: 2.2 })
  }

  // ---- leaderboard: a score above 50 can be posted under a name. It needs the scores API, so without it (a plain dev
  // server, or offline) every part of this stays hidden. ----
  const SCORES_API = '/api/scores'
  const NAME_KEY = 'jj-asteroids-name'
  const MIN_POST = 51
  type Entry = { name: string; score: number }
  const FONT = '"JetBrains Mono Variable", ui-monospace, monospace'
  let runId: string | null = null
  let board: Entry[] | null = null
  let posted: { name: string; score: number; rank: number } | null = null
  let dismissed = false

  const loadBoard = async () => {
    try {
      const r = await fetch(SCORES_API)
      if (r.ok) board = ((await r.json()) as { scores: Entry[] }).scores
    } catch {}
  }
  // Every game gets an id from the server; a score can only be posted against one, once.
  void (async () => {
    try {
      const r = await fetch(`${SCORES_API}/start`, { method: 'POST' })
      if (r.ok) runId = ((await r.json()) as { runId: string }).runId
    } catch {}
  })()
  void loadBoard()

  const postScore = async (name: string) => {
    const r = await fetch(SCORES_API, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ runId, name, score }),
    })
    const data = (await r.json().catch(() => ({}))) as { error?: string; rank?: number; name?: string; scores?: Entry[] }
    if (!r.ok) throw new Error(data.error || 'Could not save your score. Try again.')
    posted = { name: data.name ?? name, score, rank: data.rank ?? 0 }
    if (data.scores) board = data.scores
    try { localStorage.setItem(NAME_KEY, posted.name) } catch {}
    status.textContent = `Saved. You are number ${posted.rank} on the leaderboard.`
  }

  const panel = document.createElement('div')
  panel.style.cssText = `position:absolute;left:50%;top:calc(50% + 112px);transform:translateX(-50%);width:min(92vw,360px);max-height:calc(50% - 200px);overflow:auto;pointer-events:auto;display:none;box-sizing:border-box;padding:12px 14px;border-radius:14px;border:1px solid ${col('--line')};background:${col('--bg')};color:${col('--fg')};font:500 13px ${FONT};line-height:1.45`
  root.append(panel)

  const renderPanel = () => {
    panel.replaceChildren()
    const add = (tag: string, css: string, text?: string, parent: HTMLElement = panel) => {
      const el = document.createElement(tag)
      el.style.cssText = css
      if (text) el.textContent = text
      parent.append(el)
      return el
    }
    const muted = col('--muted')
    if (mode === 'play') { panel.style.display = 'none'; return }

    if (score >= MIN_POST && runId && !posted && !dismissed) {
      add('div', 'font-weight:700;margin-bottom:8px', `You scored ${score}. Add your name to the leaderboard?`)
      const form = add('form', 'display:flex;gap:6px') as HTMLFormElement
      const input = add('input', `flex:1;min-width:0;padding:7px 10px;border-radius:8px;border:1px solid ${col('--line')};background:${col('--bg-soft')};color:${col('--fg')};font:inherit`, '', form) as HTMLInputElement
      input.type = 'text'
      input.maxLength = 16
      input.placeholder = 'Your name'
      input.autocomplete = 'off'
      input.setAttribute('aria-label', 'Your name for the leaderboard')
      try { input.value = localStorage.getItem(NAME_KEY) ?? '' } catch {}
      const btn = (label: string, primary: boolean) => {
        const b = add('button', `padding:7px 12px;border-radius:8px;cursor:pointer;font:inherit;font-weight:700;border:1px solid ${primary ? col('--brand') : col('--line')};background:${primary ? col('--brand') : 'transparent'};color:${primary ? col('--brand-ink') : col('--fg')}`, label, form) as HTMLButtonElement
        b.type = primary ? 'submit' : 'button'
        return b
      }
      const postBtn = btn('Post', true)
      const skipBtn = btn('Skip', false)
      const msg = add('div', `margin-top:6px;min-height:1.2em;color:${col('--hot')}`)
      add('div', `margin-top:2px;font-size:11px;color:${muted}`, 'Public. Only your name and score are shown.')
      msg.setAttribute('role', 'alert')
      form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const name = input.value.trim()
        if (name.length < 2) { msg.textContent = 'Use at least 2 characters.'; return }
        postBtn.disabled = true
        msg.textContent = ''
        try { await postScore(name) } catch (err) { msg.textContent = (err as Error).message; postBtn.disabled = false; return }
        renderPanel()
      })
      skipBtn.addEventListener('click', () => { dismissed = true; renderPanel() })
      panel.style.display = 'block'
      if (!touch) setTimeout(() => input.focus(), 60)
      return
    }

    if (!board) { panel.style.display = 'none'; return }
    add('div', 'font-weight:700;margin-bottom:4px', posted ? `You are number ${posted.rank}. Top players` : 'Top players')
    if (!board.length) add('div', `color:${muted}`, `No scores yet. Be the first with ${MIN_POST} or more.`)
    board.slice(0, 5).forEach((e, i) => {
      const mine = !!posted && e.name === posted.name && e.score === posted.score
      const row = add('div', `display:flex;justify-content:space-between;gap:12px;${mine ? `color:${col('--brand')};font-weight:700` : ''}`)
      add('span', 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap', `${i + 1}. ${e.name}`, row)
      add('span', '', String(e.score), row)
    })
    if (!posted && score < MIN_POST) add('div', `margin-top:4px;color:${muted}`, `Score ${MIN_POST} or more to join.`)
    const link = add('a', `display:inline-block;margin-top:6px;color:${col('--brand')}`, 'Full leaderboard →') as HTMLAnchorElement
    link.href = '/leaderboard'
    panel.style.display = 'block'
  }

  const finish = (m: 'over' | 'cleared') => {
    mode = m
    thrustSound(false)
    if (m === 'over') sfx.over(); else sfx.cleared()
    if (score > best) { best = score; try { localStorage.setItem(BEST_KEY, String(best)) } catch {} }
    status.textContent = `${m === 'over' ? 'Game over' : 'Page cleared'}. Score ${score}. Best ${best}.`
    renderPanel()
    void loadBoard().then(() => { if (mode !== 'play' && !panel.querySelector('form')) renderPanel() })
  }

  const update = (dt: number) => {
    tPlay += dt
    const turn = (keys.has('right') ? 1 : 0) - (keys.has('left') ? 1 : 0)
    ship.a += turn * 4.4 * dt
    if (keys.has('up')) { ship.vx += Math.cos(ship.a) * 440 * dt; ship.vy += Math.sin(ship.a) * 440 * dt }
    const damp = Math.pow(0.45, dt)
    ship.vx *= damp; ship.vy *= damp
    const sp = Math.hypot(ship.vx, ship.vy)
    if (sp > 520) { ship.vx *= 520 / sp; ship.vy *= 520 / sp }
    ship.x += ship.vx * dt; ship.y += ship.vy * dt
    ship.invuln = Math.max(0, ship.invuln - dt)

    // sides wrap. Top and bottom scroll the page, so the whole page can be cleared.
    if (ship.x < -12) ship.x = W + 12
    if (ship.x > W + 12) ship.x = -12
    if (ship.y > H + 12) {
      const room = maxScroll() - scrollY
      if (room > 2) scrollBy(Math.min(room, H * 0.85)); else ship.y = -12
    } else if (ship.y < -12) {
      if (scrollY > 2) scrollBy(-Math.min(scrollY, H * 0.85)); else ship.y = H + 12
    }

    // firing (hold space)
    ship.cool -= dt
    if (keys.has('fire') && ship.cool <= 0) {
      ship.cool = 0.17
      const vx = Math.cos(ship.a) * 640 + ship.vx * 0.5, vy = Math.sin(ship.a) * 640 + ship.vy * 0.5
      const nx = ship.x + Math.cos(ship.a) * 16, ny = ship.y + Math.sin(ship.a) * 16
      bullets.push({ x: nx, y: ny, px: nx, py: ny, vx, vy, life: 1.1 })
      sfx.fire()
    }

    // bullets: shoot text and rocks
    for (const b of bullets) {
      b.px = b.x; b.py = b.y
      b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt
      if (b.x < 0 || b.x > W) b.life = 0
      if (b.life <= 0) continue
      if (hitText(b.x, b.y) || hitText((b.x + b.px) / 2, (b.y + b.py) / 2)) { b.life = 0; continue }
      for (const r of rocks) {
        if (Math.hypot(b.x - r.x, b.y - r.y) < r.r) {
          b.life = 0
          score += POINTS[r.size]
          burst(r.x, r.y, col('--fg'), 10)
          sfx.rock(r.size)
          r.r = -1
          if (r.size > 1) { rocks.push(makeRock(r.x, r.y, (r.size - 1) as 1 | 2), makeRock(r.x, r.y, (r.size - 1) as 1 | 2)) }
          break
        }
      }
    }
    bullets = bullets.filter((b) => b.life > 0)
    rocks = rocks.filter((r) => r.r > 0)

    for (const r of rocks) {
      r.x += r.vx * dt; r.y += r.vy * dt; r.rot += r.vr * dt
      if (r.x < -r.r) r.x = W + r.r
      if (r.x > W + r.r) r.x = -r.r
      if (r.y < -r.r) r.y = H + r.r
      if (r.y > H + r.r) r.y = -r.r
      if (!ship.invuln && Math.hypot(r.x - ship.x, r.y - ship.y) < r.r + 9) { killShip(); break }
    }
    if (!rocks.length && mode === 'play') { spawnWave(); sfx.wave() }
    if (mode === 'play' && destroyed >= total * 0.97) finish('cleared')
  }

  const poly = (r: Rock) => {
    ctx.beginPath()
    r.shape.forEach((m, i) => {
      const a = r.rot + (i / r.shape.length) * TAU
      const x = r.x + Math.cos(a) * r.r * m, y = r.y + Math.sin(a) * r.r * m
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
    })
    ctx.closePath()
  }

  const mono = (px: number, w = 600) => `${w} ${px}px "JetBrains Mono Variable", ui-monospace, monospace`
  const centered = (text: string, y: number, font: string, color: string) => {
    ctx.font = font; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.fillText(text, W / 2, y)
  }

  const draw = () => {
    ctx.clearRect(0, 0, W, H)
    const brand = col('--brand'), hot = col('--hot'), fg = col('--fg'), muted = col('--muted'), bg = col('--bg')
    ctx.lineWidth = 2; ctx.lineJoin = 'round'

    ctx.strokeStyle = fg
    for (const r of rocks) { poly(r); ctx.fillStyle = bg; ctx.globalAlpha = 0.55; ctx.fill(); ctx.globalAlpha = 1; ctx.stroke() }

    ctx.fillStyle = brand
    for (const b of bullets) { ctx.beginPath(); ctx.arc(b.x, b.y, 3, 0, TAU); ctx.fill() }
    for (const b of bits) { ctx.globalAlpha = Math.max(0, b.life * 2); ctx.fillStyle = b.color; ctx.fillRect(b.x - 1.5, b.y - 1.5, 3, 3) }
    ctx.globalAlpha = 1

    if (lives > 0 && !(ship.invuln > 0 && Math.floor(tPlay * 10) % 2)) {
      ctx.save(); ctx.translate(ship.x, ship.y); ctx.rotate(ship.a)
      ctx.strokeStyle = brand; ctx.lineWidth = 2.5
      ctx.beginPath(); ctx.moveTo(16, 0); ctx.lineTo(-11, -10); ctx.lineTo(-6, 0); ctx.lineTo(-11, 10); ctx.closePath()
      ctx.fillStyle = bg; ctx.fill(); ctx.stroke()
      if (keys.has('up') && mode === 'play') { ctx.strokeStyle = hot; ctx.beginPath(); ctx.moveTo(-8, -5); ctx.lineTo(-20 - Math.random() * 6, 0); ctx.lineTo(-8, 5); ctx.stroke() }
      ctx.restore()
    }

    // HUD
    const pct = Math.min(100, Math.round((destroyed / total) * 100))
    const ships = '▲'.repeat(Math.max(0, lives))
    const hud = W < 640 ? `Score ${score}   ${ships}   ${pct}%` : `Score ${score}   Lives ${ships}   Page destroyed ${pct}%   Best ${best}`
    ctx.font = mono(13)
    const w = ctx.measureText(hud).width + 28
    ctx.globalAlpha = 0.82; ctx.fillStyle = bg
    ctx.beginPath(); ctx.roundRect(W / 2 - w / 2, 66, w, 30, 15); ctx.fill(); ctx.globalAlpha = 1
    ctx.strokeStyle = col('--line'); ctx.lineWidth = 1; ctx.stroke()
    centered(hud, 85, mono(13), fg)
    if (tPlay < 6 && mode === 'play') centered(touch ? 'Use the buttons below to fly and fire' : '← → rotate    ↑ thrust    Space fire    M sound    Esc exit', touch ? H - 104 : H - 40, mono(14), muted)

    if (mode !== 'play') {
      ctx.globalAlpha = 0.86; ctx.fillStyle = bg; ctx.fillRect(0, H / 2 - 90, W, 190); ctx.globalAlpha = 1
      centered(mode === 'over' ? 'Game over' : 'Page cleared!', H / 2 - 30, '400 40px Righteous, ui-sans-serif, sans-serif', mode === 'over' ? hot : brand)
      centered(`Score ${score}   Best ${best}`, H / 2 + 8, mono(16), fg)
      centered(touch ? 'Tap • to play again' : 'Space: play again     Esc: exit', H / 2 + 44, mono(14), muted)
    }
  }

  // ---- loop ----
  let last = performance.now()
  const frame = (t: number) => {
    const dt = Math.min(0.05, (t - last) / 1000)
    last = t
    if (mode === 'play') update(dt)
    thrustSound(mode === 'play' && keys.has('up'))
    for (const b of bits) { b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt }
    bits = bits.filter((b) => b.life > 0)
    draw()
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)

  // ---- input ----
  const MAP: Record<string, string> = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', ArrowUp: 'up', KeyW: 'up', Space: 'fire' }
  const exit = () => location.reload() // reloading puts every destroyed word back
  const restart = () => { try { sessionStorage.setItem('jj-shoot', '1') } catch {} ; location.reload() }
  const typing = (e: Event) => (e.target as HTMLElement | null)?.matches?.('input,textarea,select')
  const down = (e: KeyboardEvent) => {
    if (typing(e)) return
    awake()
    if (e.code === 'Escape') { e.preventDefault(); return exit() }
    if (e.code === 'KeyM') { e.preventDefault(); return setSound(!soundOn) }
    const k = MAP[e.code]
    if (!k) return
    e.preventDefault()
    if (mode !== 'play') { if (e.code === 'Space' && !e.repeat) restart(); return }
    keys.add(k)
  }
  const up = (e: KeyboardEvent) => {
    const k = MAP[e.code]
    if (!k || typing(e)) return
    e.preventDefault() // stops Space from "clicking" a focused button
    keys.delete(k)
  }
  addEventListener('keydown', down, true)
  addEventListener('keyup', up, true)
  exitBtn.addEventListener('click', exit)
  soundBtn.addEventListener('click', () => setSound(!soundOn))
  addEventListener('pointerdown', awake, true)
  addEventListener('blur', () => keys.clear())

  if (touch) {
    const bar = document.createElement('div')
    bar.style.cssText = 'position:absolute;left:0;right:0;bottom:14px;display:flex;justify-content:space-between;padding:0 14px;pointer-events:none'
    const mk = (label: string, key: string, wide = false) => {
      const b = document.createElement('button')
      b.type = 'button'; b.textContent = label; b.setAttribute('aria-label', key)
      b.style.cssText = `pointer-events:auto;touch-action:none;user-select:none;-webkit-user-select:none;width:${wide ? 92 : 64}px;height:64px;border-radius:32px;border:1px solid ${col('--line')};background:${col('--bg')};color:${col('--brand')};font:600 22px ui-monospace,monospace;opacity:.92`
      const on = (e: Event) => { e.preventDefault(); if (mode === 'play') keys.add(key); else if (key === 'fire') restart() }
      const off = (e: Event) => { e.preventDefault(); keys.delete(key) }
      b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointercancel', off); b.addEventListener('pointerleave', off)
      return b
    }
    const left = document.createElement('div'), right = document.createElement('div')
    left.style.cssText = right.style.cssText = 'display:flex;gap:10px'
    left.append(mk('◀', 'left'), mk('▶', 'right'))
    right.append(mk('▲', 'up'), mk('•', 'fire', true))
    bar.append(left, right)
    root.append(bar)
  }
}
