# Options

All options are passed to the plugin function. All options are optional.

```ts
type PreloadAssetsOptions = {
  imagesToPreload?: string[]
  fontsToPreload?: FontPreload[]
  criticalJs?: string[] | ((filename: string) => string[])
  criticalCss?: string[] | ((filename: string) => string[])
  preloadGoogleFonts?: boolean
}
```

---

## `imagesToPreload`

**Type:** `string[]`, **Default:** `undefined`

A list of image URLs to preload manually. Used for images not present in the HTML source (e.g. loaded by a React or Vue component at runtime).

Each URL is injected as:

```html
<link rel="preload" href="..." as="image" fetchpriority="high">
```

```js
preloadAssets({ imagesToPreload: ['/images/hero.jpg', '/images/avatar.png'] })
```

---

## `fontsToPreload`

**Type:** `FontPreload[]`, **Default:** `undefined`

A list of font resources to preload. Each entry is an object:

```ts
type FontPreload = {
  href: string        // URL of the font file (required)
  type?: string       // MIME type, default: 'font/woff2' (only when as === 'font')
  as?: 'font' | 'style'  // Default: 'font'
  crossorigin?: boolean   // Added automatically when as === 'font'
}
```

```js
preloadAssets({
  fontsToPreload: [
    { href: '/fonts/MyFont-Regular.woff2' },
    { href: '/fonts/MyFont-Bold.woff2', type: 'font/woff2' },
    { href: 'https://fonts.googleapis.com/css2?family=Inter', as: 'style' },
  ],
})
```

`crossorigin` is added automatically for `as === 'font'` entries, this is required by the HTML spec for font preloads to take effect.

---

## `preloadGoogleFonts`

**Type:** `boolean`, **Default:** `false`

Injects two `<link rel="preconnect">` hints for Google Fonts servers:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

```js
preloadAssets({ preloadGoogleFonts: true })
```

---

## `criticalCss`

**Type:** `string[] | ((filename: string) => string[])`, **Default:** `undefined`

Entry names to match against CSS files in the build bundle. Each matched file gets a `<link rel="preload" as="style">` tag.

```js
// Array form
preloadAssets({ criticalCss: ['main'] })

// Function form, per-page
preloadAssets({
  criticalCss: (path) => path === '/index.html' ? ['main'] : [],
})
```

A file matches an entry name if its basename starts with `entryName-` or `entryName.`.

---

## `criticalJs`

**Type:** `string[] | ((filename: string) => string[])`, **Default:** `undefined`

Entry names to match against JS files in the build bundle. Each matched file gets a `<link rel="modulepreload" crossorigin>` tag.

```js
// Array form
preloadAssets({ criticalJs: ['main'] })

// Function form, per-page
preloadAssets({
  criticalJs: (path) => {
    if (path === '/index.html') return ['main'];
    if (path.startsWith('/blog')) return ['main', 'blog'];
    return ['main'];
  },
})
```

`rel="modulepreload"` is used (not `rel="preload" as="script"`) because Vite outputs ESM by default. It is semantically correct and always operates in CORS mode.
