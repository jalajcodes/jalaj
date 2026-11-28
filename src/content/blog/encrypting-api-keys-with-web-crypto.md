---
title: 'Storing users'' API keys with Web Crypto'
emoji: '🔐'
description: 'AES-GCM, HKDF and a bit of associated data: how PostDaily keeps API keys write-only and safe from a database leak.'
date: 2026-11-26
tags: [typescript, security, postdaily, cloudflare]
---

[PostDaily](https://postdaily.jalaj.fyi) lets you paste your own OpenRouter, Anthropic or OpenAI key into the web app, so the AI calls use your account rather than mine. That means the server stores secrets that belong to other people. Here is how it is done, using only the Web Crypto API that both Node and Cloudflare Workers provide.

## The rules I set

- **Write-only.** Once saved, a key is never sent back to the browser. The app can show only the last four characters.
- **A database leak alone should not reveal keys.** So the keys are encrypted, with a secret that lives outside the database.
- **The same code on both runtimes.** `crypto.subtle` exists in Node and in Workers, so there is no native dependency.

## Encryption: AES-256-GCM

AES-GCM encrypts and also authenticates, so a tampered ciphertext fails to decrypt instead of producing garbage. Each save uses a fresh random 12-byte IV:

```ts
const iv = crypto.getRandomValues(new Uint8Array(12))
const ct = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv, additionalData: aad(userId, provider) },
  await cryptoKey(),
  new TextEncoder().encode(apiKey),
)
```

The table stores the ciphertext, the IV and the last four characters, and nothing else.

## Deriving the key with HKDF

The encryption key is not the server secret itself. It is derived from `KEYS_SECRET` with HKDF-SHA-256, using a fixed salt and a version label:

```ts
const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), 'HKDF', false, ['deriveKey'])
const key = await crypto.subtle.deriveKey(
  { name: 'HKDF', hash: 'SHA-256', salt: new TextEncoder().encode('postdaily-api-keys'), info: new TextEncoder().encode('v1') },
  base,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt', 'decrypt'],
)
```

The derived key is cached in a module variable, and the cache is keyed by the secret, so changing the secret rebuilds it. Saving is refused unless the secret is at least 16 characters.

## The detail I like most: associated data

GCM can bind extra, unencrypted data to a ciphertext. PostDaily binds `userId:provider`:

```ts
const aad = (userId: string, provider: KeyProvider) => new TextEncoder().encode(`${userId}:${provider}`)
```

Decryption only succeeds if the same value is supplied. So if someone with write access to the database copied one user's row onto another user, or moved an OpenAI key into the Anthropic slot, decryption would fail rather than hand the key over. It costs one line and closes a whole class of row-shuffling attacks.

## Failing quietly, on purpose

If a key cannot be decrypted, `getUserKey` logs a warning (`was KEYS_SECRET changed?`) and returns `null`. The caller then falls back to the server's own key, if there is one:

```ts
export async function resolveKey(provider: KeyProvider) {
  const userId = currentUserId()
  const own = userId ? await getUserKey(userId, provider) : null
  if (own) return { key: own, source: 'user' }
  const server = env(ENV_KEY[provider])
  return server ? { key: server, source: 'server' } : null
}
```

Returning the `source` matters too, because the rest of the app uses it to decide whether the daily AI allowance applies.

## Where it is weaker than it looks

- **Length is not strength.** The only check is 16 or more characters. HKDF assumes the input already has high entropy, which is true for a random secret and false for a human-chosen password. If a person might type the secret, a slow password hash such as PBKDF2 or Argon2 is the right tool.
- **Rotating the secret orphans every key.** The `v1` label leaves room for versioning, but today there is no re-encryption path. Changing `KEYS_SECRET` means users add their keys again.
- **Memory still holds plaintext briefly.** Decrypted keys exist in the request while they are used. Encryption at rest protects a leaked database, not a compromised server.

That is a reasonable line for a personal app: protect the stored data, be honest about what the design does not cover, and make the failure mode a clear message rather than a crash.

The code is in `apps/api/src/lib/keystore.ts` in the [PostDaily repo](https://github.com/jalajcodes/postdaily).
