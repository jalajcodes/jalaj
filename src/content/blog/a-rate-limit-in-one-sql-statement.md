---
title: 'A rate limit in one SQL statement'
description: 'How PostDaily enforces a daily AI allowance with a single atomic upsert, and why it avoids the race in my cache-api.'
date: 2026-11-26
tags: [sql, postdaily, api-design, typescript]
---

[PostDaily](https://postdaily.jalaj.fyi) can run on shared server keys, so it needs a daily limit on AI calls per account, or one enthusiastic user could drain the budget. The whole check fits in a single SQL statement, and it is the fix for the exact bug I described in [my cache-api review](/blog/a-size-limited-cache-api-and-the-race-i-left-in-it).

## The rules

- Text generation: **40** requests per day. Images: **5** per day. Both can be changed with `AI_DAILY_LIMIT` and `AI_IMAGE_DAILY_LIMIT`.
- The owner (the first account created) is never limited, and neither is anyone using their own API key.
- A limit of `0` switches that kind of AI off for everyone who is limited.

## The tempting version

The obvious way is to read the count, compare it, then write:

```ts
const row = await db.get('SELECT count FROM ai_usage WHERE ...')
if (row.count >= limit) return false
await db.run('UPDATE ai_usage SET count = count + 1 WHERE ...')
return true
```

That has a gap between the read and the write. Two requests that arrive together can both read 39, both pass, and both increment, so the account gets 41. It is the same check-then-act shape as the overfilled cache.

## The version that cannot overshoot

PostDaily does it in one statement, with a unique key on `(user_id, day, kind)`:

```ts
const r = await db.run(
  `INSERT INTO ai_usage (user_id, day, kind, count) VALUES (?, ?, ?, 1)
   ON CONFLICT (user_id, day, kind) DO UPDATE SET count = count + 1 WHERE count < ?`,
  userId, today(), kind, limit,
)
return r.changes > 0
```

Read it in three cases:

1. **First call of the day:** no row exists, so the insert creates one with `count = 1`. One row changed, so it is allowed.
2. **Later calls under the limit:** the insert conflicts, the update increments the count, and the `WHERE count < ?` is true. One row changed, so it is allowed.
3. **At the limit:** the insert conflicts, but the `WHERE` is false, so nothing is updated. Zero rows changed, so it is refused.

The check and the increment are the same operation, so the database serializes them. The caller does not need a transaction or a lock, because there is no moment between "look" and "write" for another request to slip into.

## Small choices around it

- **The owner is checked first and skipped.** `isOwner` looks up the oldest user, and if it is you, the function returns `true` straight away without touching the table.
- **The day is a UTC date.** `new Date().toISOString().slice(0, 10)` is simple and consistent, but it means the allowance resets at UTC midnight, not at the user's midnight. That is a trade I accepted for simplicity, and it would be the first thing to change if users complained.
- **Reading usage is separate from taking it.** `allowance()` returns today's `used` and `limit` for the UI, and it is a plain read, since showing a number does not need to be atomic.

## The takeaway

Whenever you catch yourself writing "check a number, then change it", ask whether the database can do both in one statement. `INSERT ... ON CONFLICT DO UPDATE ... WHERE` is a very small tool that makes "increment unless over the limit" safe by construction. It works for rate limits, quotas, seat counts and stock, anywhere an `if` in application code would leave a gap.

The code is in `apps/api/src/lib/usage.ts` in the [PostDaily repo](https://github.com/jalajcodes/postdaily).
