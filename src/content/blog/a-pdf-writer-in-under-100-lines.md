---
title: 'A PDF writer in under 100 lines'
description: 'How PostDaily turns canvas slides into a LinkedIn carousel PDF in the browser, with no library.'
date: 2026-11-25
tags: [typescript, pdf, postdaily]
---

LinkedIn "carousels" are not a special format. They are PDF documents that LinkedIn lets you swipe through. When I added carousels to [PostDaily](https://postdaily.jalaj.fyi), I needed to turn a handful of slides into a PDF, inside the browser, and I did not want to pull in a PDF library for what turned out to be a very small job.

## The slides are already images

PostDaily draws each slide on a `1080 × 1350` canvas, which is LinkedIn's 4:5 document shape. So by the time I need a PDF, every page is just a picture. That simplifies things: a PDF page can show a JPEG edge to edge, and that is all I need.

## What a PDF actually is

A PDF is a list of numbered objects, followed by a table (the `xref`) that records the byte offset of each one. For a document where each page is one image, the objects are:

1. the **catalog**, which points at the page tree
2. the **page tree**, which lists every page
3. an **info** object with the title
4. three objects per page: the **page**, its **content stream**, and the **image**

The content stream is one line. It scales the image to the page size and draws it:

```text
q 540 0 0 675 0 0 cm /Im0 Do Q
```

The image object is where the trick lives. The `DCTDecode` filter means "this stream is a JPEG", so you can paste the bytes that `canvas.toDataURL('image/jpeg')` gave you straight into the file with no re-encoding:

```ts
push(
  `<< /Type /XObject /Subtype /Image /Width ${p.width} /Height ${p.height} ` +
    `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.jpeg.length} >>\nstream\n`,
)
push(p.jpeg)
push('\nendstream\nendobj\n')
```

## Tracking offsets

The only fiddly part is the `xref` table. As the writer pushes chunks, it keeps a running `length`, and each time an object starts it records `offsets[n] = length`. At the end it writes one line per object, with the offset padded to ten digits:

```ts
const startObj = (n: number) => {
  offsets[n] = length
  push(`${n} 0 obj\n`)
}

// ...later, after all the pages:
push(`xref\n0 ${count}\n0000000000 65535 f \n`)
for (let n = 1; n < count; n++) push(`${String(offsets[n]).padStart(10, '0')} 00000 n \n`)
```

Pages are sized at half the pixel dimensions (`1080 × 1350` becomes `540 × 675` points), which gives a sensible on-screen size.

## LinkedIn has a size limit

The writer is the easy half. The other half is that LinkedIn caps the document size, and PostDaily's limit is `MAX_DOCUMENT_BYTES = 1_400_000`. Photo-heavy slides can blow past that, so the carousel builder tries progressively lower JPEG qualities until the whole PDF fits:

```ts
for (const q of [0.88, 0.78, 0.66, 0.52, 0.4]) {
  const pages = canvases.map((c) => ({
    jpeg: dataUrlToBytes(c.toDataURL('image/jpeg', q)),
    width: SLIDE_W,
    height: SLIDE_H,
  }))
  const pdf = buildPdf(pages, title)
  if (pdf.length <= MAX_DOCUMENT_BYTES) return toDataUrl(pdf)
}
throw new Error('The carousel is too large. Try fewer slides or images.')
```

If even the lowest quality is too big, the user gets a clear error rather than a silently rejected upload.

## Two small gotchas

- **Don't spread big arrays.** Turning the PDF bytes into a base64 string with `String.fromCharCode(...bytes)` throws on large inputs, because every byte becomes a function argument. PostDaily does it in chunks of `0x8000`.
- **Keep the title ASCII.** The title is only metadata, so non-ASCII characters are dropped and `\`, `(` and `)` are escaped, which keeps the literal string valid.

## The trade-off

Every page is a flat JPEG, so the text in a carousel PDF is not selectable or searchable. For LinkedIn slides, which are designed to be looked at rather than read as a document, I think that is the right call, and it keeps the writer tiny. The nice side effect is that because it has no dependencies, the same file runs in the browser, in Node and in React Native, which matters because PostDaily's shared package is meant to be reused by a future mobile app.

The code lives in `packages/shared/src/pdf.ts` in the [PostDaily repo](https://github.com/jalajcodes/postdaily).
