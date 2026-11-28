---
title: 'A circular theme switch with the View Transitions API'
emoji: '🌗'
description: 'How the theme toggle on this site grows a circle from your click, plus the fallbacks and the small bugs it needed.'
date: 2026-11-27
tags: [css, javascript, astro, ux]
---

When you click the theme button on this site, the new theme grows outward from where you clicked, like a spreading circle. It is about 25 lines of JavaScript on top of the browser's View Transitions API, and a few details are worth writing down.

## How the effect works

`document.startViewTransition(callback)` takes a screenshot of the page, runs your callback (which changes the theme), takes another screenshot, and then animates between the two. By default it cross-fades. The two screenshots are exposed as pseudo-elements, `::view-transition-old(root)` and `::view-transition-new(root)`, which you can animate yourself.

The circle is a `clip-path` on the new snapshot:

```js
const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
const t = document.startViewTransition(apply)
t.ready.then(() =>
  root.animate(
    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
    { duration: 650, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
  ),
)
```

The radius `r` is the distance from the click to the farthest corner of the window. That is the smallest circle guaranteed to cover the whole screen, so the animation ends exactly as it finishes covering the last corner.

## Turning off the default cross-fade

If the default animations are left on, the cross-fade fights the circle. The fix is a few lines of CSS, scoped by a class that the script adds only while the theme transition runs:

```css
html.vt-theme::view-transition-old(root),
html.vt-theme::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
html.vt-theme::view-transition-new(root) { z-index: 2; }
```

The scoping matters on this site. It also uses `@view-transition { navigation: auto; }` for page-to-page transitions, which animate the same `root` pseudo-elements. Without the `vt-theme` class, the theme switch would have changed how page navigation looks as well. The class is removed when the transition finishes (`t.finished.finally(...)`).

## Fallbacks

Two cases skip the effect entirely and just switch the theme:

```js
if (!document.startViewTransition || reduce) return apply()
```

Browsers without the API still work, and so do people who have asked their system for reduced motion.

## The keyboard bug I fixed

My first version read `clientX` and `clientY` from the click. That is fine for a mouse, but when you activate a button with the keyboard (Enter or Space), the browser reports the coordinates as `0, 0`. The circle would then grow from the top-left corner of the page. The fix is to detect keyboard activation and use the button's own centre:

```js
const x = me.detail === 0 ? box.left + box.width / 2 : me.clientX
const y = me.detail === 0 ? box.top + box.height / 2 : me.clientY
```

A mouse click has `detail >= 1`, while a keyboard-triggered click has `detail === 0`, which is the simplest reliable way to tell them apart.

## No flash on load

None of this helps if the page loads in the wrong theme first. A tiny inline script in the `<head>` reads the saved choice from `localStorage` (the site defaults to dark if there is none) and sets `data-theme` on `<html>` before anything is painted. The theme button itself shows a sun or a moon with plain CSS (`dark:block` and `dark:hidden`), so it is correct on the first frame as well.

## Takeaways

- The View Transitions API gives you the two snapshots, and you decide what happens between them. A `clip-path` circle is only a few lines.
- Scope your overrides with a class, especially if another transition already uses the same pseudo-elements.
- Test the keyboard path, because `clientX` and `clientY` quietly lie when there was no pointer.
