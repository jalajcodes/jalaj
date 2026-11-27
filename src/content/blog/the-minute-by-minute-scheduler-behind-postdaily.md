---
title: 'The scheduler behind PostDaily, one minute at a time'
description: 'Four background jobs, one function that runs every minute, and the small patterns that stop it from double-sending or double-posting.'
date: 2026-11-25
tags: [typescript, postdaily, cloudflare, backend]
---

[PostDaily](https://postdaily.jalaj.fyi) does a handful of things when you are not looking at it: it publishes queued posts, writes the day's ideas, reminds you to post, and nudges you to reply to comments. All of it comes from one function, `runScheduledTick`, which runs once a minute. On the Mac it is called from a timer, and on Cloudflare from a Cron Trigger. The interesting part is not the schedule, it is keeping a job that runs 1,440 times a day from doing anything twice.

## Four jobs, three try/catch blocks

The tick runs each job in its own `try`/`catch`:

```ts
export async function runScheduledTick() {
  try { await publishDue() } catch (e) { console.error('[scheduler] publish', e) }
  try { await engagementNudges() } catch (e) { console.error('[scheduler] nudges', e) }
  try { await dailyJobs() } catch (e) { console.error('[scheduler] daily', e) }
}
```

That is deliberate. A bug in the reminder code should never stop a scheduled post from going out, so a failure in one job is logged and the next one still runs.

## "Stuck" is not the same as "failed"

`publishDue` starts by looking for posts that have been in the `publishing` state for more than ten minutes. That only happens if a run died halfway through, for example the process was killed. The code marks those posts as failed, but it does not retry them:

```ts
await db.run(
  "UPDATE posts SET status='failed', error='Publishing was interrupted. Check LinkedIn before retrying.', updated_at=? WHERE status='publishing' AND updated_at < ?",
  nowIso(),
  new Date(Date.now() - 10 * 60_000).toISOString(),
)
```

The error message says why: if the run died after LinkedIn accepted the post but before the database was updated, retrying would publish it twice. For something that posts under your name, a duplicate is worse than a missed post, so the safe move is to hand the decision to a human.

## Claim first, then act

The engagement nudge fires about 40 minutes after a post goes live. The query finds posts that are due, but two overlapping runs could both find the same post. The fix is to claim the row with a conditional update and only continue if the update actually changed something:

```ts
const claimed = await db.run('UPDATE posts SET nudge_sent = 1 WHERE id = ? AND nudge_sent = 0', p.id)
if (!claimed.changes || !p.engagement_nudge) continue
```

Only the run that flips `nudge_sent` from 0 to 1 gets to send the notification. The same code skips posts older than three hours, so a long outage does not produce a burst of "reply to comments now" messages for posts that went live yesterday.

## Daily jobs run at most once

The morning ideas and the reminder are "once per day, after a certain time". The code stores the date it last ran and writes today's date before doing the work:

```ts
if (s.dailyIdeas && row.last_ideas_date !== today && now.hour >= 7) {
  await db.run('UPDATE settings SET last_ideas_date = ? WHERE user_id = ?', today, id)
  // ...then generate the ideas
}
```

The trade-off is real: if the AI call fails, the ideas are not retried until tomorrow, because the day is already marked as done. The error is caught and logged. I chose at-most-once over at-least-once here, because the failure mode of the other choice is a user getting five sets of ideas, or five reminders, in one morning.

Time zones are handled with Luxon, so "from 07:00" and "reminder at 18:30" mean the user's local time. The reminder compares `now.toFormat("HH:mm") >= s.reminderTime`, which works as a plain string comparison because both sides are zero-padded.

## Warnings that escalate, and reset

The LinkedIn token expires, and the app warns at 7 days, at 1 day, and once when it has expired. Each level gets a number, and a warning is only sent when it is higher than the last one sent:

```ts
const WARNING_LEVEL = { '7d': 1, '1d': 2, expired: 3 } as const
// ...
if (sent && WARNING_LEVEL[sent] >= WARNING_LEVEL[due]) return
```

If the user reconnects and the token is no longer close to expiry, the stored level is cleared, so the next expiry warns again from the start.

## One job per user

The daily jobs loop over every user and run each inside `withUser(id, ...)`. That way AI calls inside the job use that user's own API key rather than a shared one.

## What I would take from it

- Run every job on a short, fixed schedule and make each one safe to run twice. Then a skipped tick or a duplicate tick does not matter.
- Write "I own this" to the database before the slow work, not after.
- Decide on purpose whether each job should fail towards "maybe twice" or "maybe never", and write the choice down in a comment.

The code is in `apps/api/src/scheduler.ts` in the [PostDaily repo](https://github.com/jalajcodes/postdaily).
