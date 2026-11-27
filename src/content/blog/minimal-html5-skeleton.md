---
title: 'A minimal HTML5 skeleton'
description: 'The few things every index.html should contain.'
date: 2020-06-26
tags: [html]
---

I often start projects from scratch instead of reaching for a framework. [HTML5 Boilerplate](https://html5boilerplate.com/) is a great resource, but it is more than a standard project needs.

A minimal `index.html` should always contain a few things.

## Declare the document type

`<!doctype html>`

## Define the character encoding

`<meta charset="utf-8">`

## Define the viewport

`<meta name="viewport" content="width=device-width, initial-scale=1">` optimizes for mobile and prevents zoom and horizontal scroll.

## Put it together

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Page title</title>
  </head>
  <body></body>
</html>
```
