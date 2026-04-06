# Critical JS and CSS

## How entry matching works

The plugin scans Vite's output bundle and matches files by entry name. A file matches if its basename (without path prefix) starts with `entryName-` or `entryName.`:

| Entry name | File | Matches? |
|---|---|---|
| `main` | `assets/main-abc123.js` | Yes |
| `main` | `assets/main.css` | Yes |
| `main` | `assets/maintenance.js` | No |
| `blog` | `assets/blog-xyz.js` | Yes |

This works without any `rollupOptions.input` configuration, the matching is done against the actual filenames in the build output.

---

## `criticalCss`

Preload CSS bundles that match the given entry names:

```js
preloadAssets({
  criticalCss: ['main'],
})
```

This injects (for a file like `assets/main-abc123.css`):

```html
<link rel="preload" href="/assets/main-abc123.css" as="style">
```

No `crossorigin` is added for same-origin CSS preloads (adding it could cause cache mismatches).

---

## `criticalJs`

Preload JS bundles that match the given entry names:

```js
preloadAssets({
  criticalJs: ['main'],
})
```

This injects (for a file like `assets/main-abc123.js`):

```html
<link rel="modulepreload" href="/assets/main-abc123.js" crossorigin>
```

`rel="modulepreload"` is used instead of `rel="preload" as="script"` because Vite outputs ES modules by default. `modulepreload` is semantically correct for ESM: it both preloads and parses the module, and always operates in CORS mode.

---

## Multiple entry names

Pass multiple entry names to preload several bundles:

```js
preloadAssets({
  criticalJs: ['main', 'vendor'],
  criticalCss: ['main'],
})
```

---

## Per-page configuration with functions

For multi-page projects where different pages need different critical assets, pass a function instead of an array. The function receives the current HTML file path relative to the project root and returns an array of entry names:

```js
preloadAssets({
  criticalJs: (path) => {
    if (path === '/index.html') return ['main'];
    if (path.startsWith('/blog')) return ['main', 'blog'];
    return ['main'];
  },
  criticalCss: (path) => {
    if (path === '/index.html') return ['main'];
    return ['main'];
  },
})
```

The `path` argument is always a `/`-prefixed string relative to `process.cwd()`, normalized for Windows (`\` → `/`).

---

## Combining with `data-preload`

`criticalJs`, `criticalCss`, images, and fonts are all processed in the same `transformIndexHtml` call. Tags from all sources are merged and deduplicated before injection.
