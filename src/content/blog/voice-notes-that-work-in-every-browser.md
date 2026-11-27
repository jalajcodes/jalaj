---
title: 'Voice notes that work in every browser'
description: 'Live dictation where the browser supports it, and a recording plus Whisper fallback where it does not.'
date: 2026-11-25
tags: [typescript, cloudflare, whisper, postdaily]
---

I wanted [PostDaily](https://postdaily.jalaj.fyi) to let you ramble a thought into your phone and get tidy drafts back. The browser has a speech-recognition API, so how hard could it be? Hard enough that the feature ended up with two completely different code paths.

## Path one: live dictation

Chrome, Edge and Safari ship `SpeechRecognition` (prefixed `webkitSpeechRecognition` in some). It is great: words appear on screen as you speak, and the audio is handled by the browser, not by my server.

```ts
const rec = new (window.SpeechRecognition ?? window.webkitSpeechRecognition)()
rec.lang = navigator.language || 'en-US'
rec.continuous = true
rec.interimResults = true
```

The `interimResults` flag is what makes it feel live. Each result is either final (settled text) or interim (the browser's current guess), and the UI shows both.

## Where it breaks

Brave, Arc and Firefox, and many in-app browsers, either do not implement it or fail with errors like `network` or `service-not-allowed`. The error codes are the signal. PostDaily maps them to friendly messages, and a specific list of them (`LIVE_UNAVAILABLE`) means "this browser will never do live dictation".

## Path two: record, then transcribe

When live dictation cannot work, the app switches to recording the audio and sending it to the server. The decision is made inside one hook, `useVoiceNote`, and it remembers the choice so the user is not surprised twice:

```ts
if (code && (LIVE_UNAVAILABLE.includes(code) || code === 'unsupported') && recordingSupported()) {
  setMode('record')
  localStorage.setItem(MODE_KEY, 'record')
  setNotice(
    "Live dictation isn't available in this browser, so PostDaily records your voice note " +
      'and turns it into text when you tap Stop.',
  )
  void record() // and start right now
}
```

Note the last line: it does not make the user tap the mic again. It starts recording straight away.

## Transcribing on Cloudflare

On the Cloudflare deployment the server uses Workers AI's Whisper, which has a free daily allowance (about 200 audio minutes). On the Mac server there is no Workers AI, so it uses OpenAI's `whisper-1` if an API key is set, and otherwise tells you what is missing.

Whisper turned out to need more care than I expected. The fast model, `whisper-large-v3-turbo`, sometimes errors on Cloudflare's side. So the transcribe function treats it as unreliable:

- Every call has a **25-second timeout**.
- When Turbo fails, it is **skipped for 10 minutes** (a cooldown), so users are not repeatedly waiting on a model that is down.
- It falls back to the original `@cf/openai/whisper`, with **one retry**.

```ts
const TURBO_COOLDOWN_MS = 10 * 60_000
let turboDownUntil = 0

if (Date.now() >= turboDownUntil) {
  try {
    const out = await withTimeout(
      ai.run(WHISPER_MODEL, { audio: toBase64(audio), vad_filter: true }),
      25_000,
      'Whisper Turbo',
    )
    return (out?.text ?? '').trim()
  } catch (e) {
    turboDownUntil = Date.now() + TURBO_COOLDOWN_MS
  }
}
```

One more quirk: the two models want the audio in different shapes. Turbo takes base64, while the original Whisper takes the bytes as an array of numbers (`Array.from(audio)`). Incidentally, base64 encoding has the same trap as in any browser or Worker code: spreading a large `Uint8Array` into `String.fromCharCode` overflows the stack, so it is done in `0x8000`-byte chunks.

Uploads are capped at 10 MB (`MAX_AUDIO_BYTES`), so a very long ramble gets a clear error.

## What I would tell past me

- **Treat the free, fast model as best effort.** A timeout, a cooldown and a slower fallback cost very little code and turned a flaky feature into a dependable one.
- **Let error codes drive the fallback.** The app does not sniff user agents. It tries the good path and reads the error.
- **Remember the decision.** Persisting `record` mode means a Brave user hits the explanation once, not every time.

The relevant files are `useVoiceNote.ts`, `speech.ts` and `ai/transcribe.ts` in the [PostDaily repo](https://github.com/jalajcodes/postdaily).
