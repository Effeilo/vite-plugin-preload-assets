# Fonts

## `fontsToPreload`

Preload local or remote font files by listing them in `fontsToPreload`:

```js
preloadAssets({
  fontsToPreload: [
    { href: '/fonts/MyFont-Regular.woff2' },
    { href: '/fonts/MyFont-Bold.woff2' },
  ],
})
```

This injects:

```html
<link rel="preload" href="/fonts/MyFont-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/MyFont-Bold.woff2" as="font" type="font/woff2" crossorigin>
```

---

## `crossorigin`, automatic and required

Per the HTML spec, font preloads **always require the `crossorigin` attribute**, even for same-origin fonts. Without it, the browser silently ignores the preload hint and fetches the font again when it is actually needed.

The plugin adds `crossorigin` automatically for all entries where `as === 'font'`, you do not need to specify it.

---

## `type` attribute

The default MIME type for font preloads is `font/woff2`. If you need to preload a different format, specify it explicitly:

```js
fontsToPreload: [
  { href: '/fonts/MyFont.woff', type: 'font/woff' },
  { href: '/fonts/MyFont.ttf', type: 'font/ttf' },
]
```

The `type` attribute is only injected when `as === 'font'`. It is omitted for other `as` values.

---

## Overriding `as`

The `as` field defaults to `'font'`. Override it to preload other resource types from the font list, for example, a Google Fonts CSS stylesheet:

```js
fontsToPreload: [
  // Preload a Google Fonts stylesheet as CSS
  {
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap',
    as: 'style',
  },
]
```

When `as !== 'font'`:
- No `type` attribute is added.
- `crossorigin` is only added if explicitly set to `true`.

---

## Google Fonts preconnect

Enable early connection to Google Fonts servers with `preloadGoogleFonts`:

```js
preloadAssets({
  preloadGoogleFonts: true,
})
```

This injects two preconnect hints:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

These hints tell the browser to complete the DNS lookup, TCP connection, and TLS handshake for Google's font servers before any font request is made. Use this whenever you load fonts from Google Fonts.
