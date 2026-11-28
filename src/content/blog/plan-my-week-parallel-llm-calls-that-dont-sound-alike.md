---
title: 'Plan my week: parallel LLM calls that don''t sound alike'
emoji: '🗓️'
description: 'How PostDaily writes a week of LinkedIn posts at once: rotating themes and formats, small parallel chunks, retries and tolerant parsing.'
date: 2026-11-25
tags: [ai, llm, typescript, postdaily]
---

One of the features in [PostDaily](https://postdaily.jalaj.fyi) is "Plan my week": click once, and it writes a draft for every free posting slot in the next seven days. Writing one post with an LLM is easy. Writing up to ten, quickly, so that they do not all read the same, took a few specific decisions.

## Start from the slots, not the prompt

The planner begins with your free posting slots, capped at ten (`PLAN_MAX`). Each slot gets a content pillar and a format, assigned by rotating through two lists:

```ts
const plan = slots.map((slot, i) => ({
  slot,
  pillar: pillars[i % pillars.length],
  format: PLAN_FORMATS[i % PLAN_FORMATS.length],
}))
```

The two rotations run on different cycles on purpose. If you have three pillars and the app has seven formats, theme and format pairs do not line up the same way each week. The formats are written as instructions, such as "a personal story with a turning point", "a clear, slightly contrarian opinion" or "a mistake the author made and what changed after".

## Many small calls instead of one big one

All ten posts could go in one request, but the code splits them into chunks of two (`PLAN_CHUNK`) and runs the chunks in parallel. The comment in the code gives the reason: small chunks finish faster on free models. It also limits the damage when something goes wrong, since a failed call loses two posts, not ten.

```ts
const results = await Promise.allSettled(
  chunks.map((chunk) => write(chunk).catch(() => write(chunk))),
)
```

Two details are packed into that line. `Promise.allSettled` waits for every chunk without one failure cancelling the others. And each chunk is retried once on failure, because free models fail now and then: they are busy, or they return malformed JSON.

## Partial success is a real result

After the retries, the route decides what to do:

```ts
if (results.every((r) => r.status === 'rejected')) throw (results[0] as PromiseRejectedResult).reason
// ...
return c.json({ items, missing: plan.length - items.length })
```

If every chunk failed, it is an error. Otherwise the user gets the drafts that worked, plus a `missing` count. The request also accepts an `exclude` list of slots that already have a fresh draft on screen, so "try again" fills only the gaps instead of rewriting everything.

## Telling parallel calls about each other

Parallel calls cannot see one another's output, which is how you get ten posts that all open the same way. Two things reduce that. Each call is given the full list of recent posts to avoid repeating, up to ten, drawn from posts the app has learned your voice from plus your current drafts and queue. And the prompt says one more thing that I think matters:

> Be specific to the author; if a post needs a personal detail you don't have, write around it rather than inventing facts.

A scheduled-post tool that makes up your personal anecdotes is worse than no tool, so the instruction pushes the model to write around a missing detail.

## Parsing output you do not control

The model is asked to answer with only JSON, in the shape `{"posts": ["...", "..."]}`. Models do not always comply, so the parser accepts four shapes for each item, a plain string or an object with `content`, `text` or `post`:

```ts
const item = z.union([
  z.string(),
  z.object({ content: z.string() }).transform((o) => o.content),
  z.object({ text: z.string() }).transform((o) => o.text),
  z.object({ post: z.string() }).transform((o) => o.post),
])
```

The result is trimmed to the number of items asked for, and any markdown is stripped, since LinkedIn shows plain text.

## Scheduling is a separate, forgiving step

Planning only creates drafts. Putting them on the calendar is a second request, `/plan/schedule`, which skips, rather than rejects, any item that is no longer a draft, has empty content, or has a time in the past. One stale item should not throw away the rest of a batch.

## What I would carry into other LLM features

- **Assign the variety yourself.** Do not hope the model varies its posts: give each call a different theme and format.
- **Keep calls small and independent, and expect some to fail.** Retry once, accept partial results, and report what is missing.
- **Be liberal in what you parse.** A schema that accepts a few reasonable shapes costs a few lines and saves a failed request.

The code is in `apps/api/src/routes/main.ts` and `apps/api/src/ai/writer.ts` in the [PostDaily repo](https://github.com/jalajcodes/postdaily).
