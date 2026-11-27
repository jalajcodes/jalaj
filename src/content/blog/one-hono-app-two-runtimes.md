---
title: 'One Hono app, two runtimes'
description: 'How PostDaily runs the same API as a Node server on a Mac and as a Cloudflare Worker.'
date: 2026-11-27
tags: [hono, cloudflare, typescript, postdaily]
---

[PostDaily](https://postdaily.jalaj.fyi) runs in two places. On my Mac it is a Node server with a SQLite file. In the cloud it is a Cloudflare Worker with a D1 database. Both serve the same API from the same code. Here is how that is put together, and the one thing about it that I still find a bit smelly.

## The shape

The API is a [Hono](https://hono.dev) app. All of its routes, middleware and error handling live in one function, `createApp()`, which knows nothing about where it is running. Each runtime then gets a thin entry file that wires in the parts that differ:

```text
apps/api/src/
  app.ts       createApp(): the routes, shared by both runtimes
  node.ts      Mac entry: SQLite, Claude-login AI, macOS notifications, 1-minute timer
  worker.ts    Cloudflare entry: D1, Cron Trigger, static assets
  runtime/     env.ts, sqlite.ts, d1.ts
```

The differences between the two are small enough to fit in a table:

| | Mac (Node) | Cloudflare |
|---|---|---|
| Database | SQLite file | D1 |
| Scheduler | 60-second `setInterval` | Cron Trigger every minute |
| Config | `process.env` | Worker bindings |

## Config that works on both

Node reads secrets from `process.env`. A Worker gets them as bindings on the `env` object that is passed to each handler. To keep the rest of the code from caring, there is one tiny module:

```ts
type Vars = Record<string, unknown>
let current: Vars = {}

export function setEnv(vars: Vars) {
  current = vars
}

export function env(key: string): string | undefined {
  const v = current[key]
  return typeof v === 'string' && v !== '' ? v : undefined
}

export const runtime = () => (env('RUNTIME') === 'worker' ? 'worker' : 'node')
```

Each entry file calls `setEnv` once at startup, tagging itself with `RUNTIME: "node"` or `"worker"`. After that, routes just call `env("WEB_URL")`. The CORS rule in `app.ts` is a good example. The browser may only call the API from the web app's own origin, and that origin comes from config or falls back to the request's own origin:

```ts
cors({
  origin: (origin, c) => {
    const allowed = env('WEB_URL') ?? new URL(c.req.url).origin
    return origin === allowed ? origin : null
  },
})
```

## The database behind one interface

SQLite and D1 have different APIs, so each gets a small adapter (`sqliteDb` and `d1Db`) that exposes the same `db.get` / `db.all` / `db.run` shape, with `?` placeholders. Routes write plain SQL against that:

```ts
const sub = await db.get<{ user_id: string }>(
  'SELECT user_id FROM push_subscriptions WHERE endpoint = ?',
  endpoint,
)
```

Each entry file picks the adapter with `setDb(...)`. Because both databases speak SQLite's dialect, the same queries run on both, and migrations are shared too: the Worker uses D1 migrations and the Node server applies the same ones on start.

## The two entry files

The Node entry also serves the built web app and starts a timer for the scheduler:

```ts
serve({ fetch: app.fetch, port }, () => {
  runScheduledTick()
  setInterval(runScheduledTick, 60_000)
})
```

The Worker entry exports `fetch` and `scheduled`. Cloudflare's Cron Trigger calls `scheduled` every minute, which is the same job the timer does on the Mac:

```ts
export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    init(env)
    return app.fetch(request, env, ctx as any)
  },
  scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    init(env)
    ctx.waitUntil(runScheduledTick())
  },
}
```

## Errors in one place

Because there is a single app, there is a single `onError`. It maps the error type to an HTTP status, so a validation error is a 400, a hit usage limit is a 429, and a failure from an AI provider is a 502. That behaviour is identical wherever the app runs.

## The smell

Look at `init(env)` in the Worker: it calls `setEnv` and `setDb` on every request, writing to module-level variables. It works because a Worker's bindings never change within an isolate, so every request writes the same values. But global mutable state that is "set before use" is easy to get wrong, and it would break the moment two requests needed different config. If the app grew, I would pass a context object through Hono instead (`c.get("db")`, `c.env`) and delete the globals.

For a personal app that has to run in exactly two places, I think the trade is fine: the globals keep the route code short and free of plumbing, and the whole difference between the two runtimes fits in about 75 lines of entry code.
