---
title: 'A size-limited cache API, and the race I left in it'
description: 'A review of my own cache-api: what it does well, where it can overfill under load, and how I would fix it.'
date: 2025-02-09
tags: [nodejs, api-design, express]
---

[`cache-api`](https://github.com/jalajcodes/cache-api) is a small Express service that stores key-value pairs with a hard size limit, documented with Swagger. I built it as an exercise, and rereading the code, it is a nice little case study: a few decisions I would make again, and one real bug.

## What it is

- **Express** for routing, **Sequelize** with **SQLite** for storage, **swagger-jsdoc** for the docs.
- A `CacheService` with `set`, `get`, `delete`, `has`, `size`, `clear`, `getStats` and `cleanupOldEntries`.
- A maximum number of items, read from `MAX_CACHE_SIZE` (default `10`).

## Choices I would repeat

**Values are stored as JSON text, transparently.** The model uses a getter and setter, so callers deal in plain values while the column holds a string:

```js
value: {
  type: DataTypes.TEXT,
  get() { return JSON.parse(this.getDataValue('value')) },
  set(value) { this.setDataValue('value', JSON.stringify(value)) },
},
```

**The primary key is the cache key**, so `findByPk(key)` is the lookup, and a `timestamp` index keeps the age-based cleanup query cheap.

**The full cache has its own status code.** Posting to a full cache returns `507 Insufficient Storage`, not a generic 500, and the Swagger docs list it. That is the right signal for a client to act on.

**Stats are cheap and useful.** `getStats` returns the total, the oldest and newest timestamps, `maxSize` and `remainingSpace`, fetched in parallel:

```js
const [total, oldest, newest] = await Promise.all([
  CacheItem.count(),
  CacheItem.findOne({ order: [['timestamp', 'ASC']] }),
  CacheItem.findOne({ order: [['timestamp', 'DESC']] }),
])
```

## The bug: check, then insert

Here is the heart of `set`:

```js
const [count, existingItem] = await Promise.all([
  CacheItem.count(),
  CacheItem.findByPk(key),
])

if (count >= this.maxSize && !existingItem) {
  throw new Error('Cache is full')
}

// ...then update or create
```

It checks the count, and then, in a separate step, inserts. Those are two statements with nothing tying them together. If the cache holds 9 items out of a limit of 10 and two requests with new keys arrive at the same moment, both read `count = 9`, both pass the check, and both insert. The cache now has 11 items. Under light use you will never see it, which is what makes this kind of bug survive.

## How I would fix it

The goal is to make "check the size and insert" one atomic step. A few options, from simplest to most robust:

1. **Wrap it in a transaction** with an exclusive lock. With SQLite, write transactions are serialized, so a `BEGIN IMMEDIATE` around the count and insert closes the gap.
2. **Enforce it in the database.** A trigger that aborts an insert when the row count is at the limit makes the invariant impossible to break from any code path.
3. **Change the policy.** Instead of rejecting when full, evict the oldest entry (the `timestamp` index is already there for it). That turns "full" from an error into normal behaviour, and it is what most people expect from a cache anyway.

I would pick option 3 with option 1 underneath, and keep the 507 behaviour behind a setting for anyone who prefers a hard limit.

## Smaller things I would change

- **Control flow by string matching.** The route decides between a 507 and a 500 with `error.message === 'Cache is full'`, and the service rethrows only that message unwrapped. A small `CacheFullError` class and an `instanceof` check would be sturdier than comparing strings.
- **Every method wraps errors in a new message**, which loses the original stack. Letting unexpected errors bubble up to the existing error-handling middleware would be cleaner.
- **No tests for the limit.** A test that fires many concurrent `set` calls against a limit of 5 and asserts the count never exceeds 5 would have caught the race on day one.

## Takeaway

"Check a limit, then act" is a bug shape worth recognising anywhere: balances, rate limits, seat counts, stock. If correctness depends on nothing changing between the check and the write, it needs a lock, a transaction or a constraint, not just an `if`.
