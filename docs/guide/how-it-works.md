# How it works

## Vite lifecycle

The plugin registers one Vite hook:

- **`transformIndexHtml`**, called for each HTML file produced by the build. Receives the HTML string and the build context (including the bundle). Returns the original HTML plus an array of tag descriptors to inject.

The plugin uses `apply: 'build'`, it is completely inactive during `vite dev`.

---

## Injection order

All tags are injected with `injectTo: 'head-prepend'`, placing them at the very beginning of `<head>`. This ensures the browser discovers preload hints as early as possible when parsing the HTML.

The injection order within `<head>` follows the order in which the plugin processes each category:

1. Images from `data-preload` (HTML scan)
2. Images from `imagesToPreload` (config)
3. Google Fonts preconnect (if `preloadGoogleFonts: true`)
4. Font preloads from `fontsToPreload`
5. Critical CSS from `criticalCss`
6. Critical JS from `criticalJs`

---

## Deduplication

All injected tags are tracked in a `Set` keyed by `rel::href`. If the same combination would be injected twice, for example, an image URL that appears in both `data-preload` and `imagesToPreload`, only the first occurrence is kept.

---

## HTML scanning

The plugin scans the HTML string for `<img>` tags containing the `data-preload` attribute using a regex that matches regardless of attribute order:

```
/<img\b[^>]*\bdata-preload\b[^>]*>/gi
```

For each match:
1. The `src` attribute is extracted and preloaded with `fetchpriority="high"`.
2. If a `srcset` attribute is present, each candidate URL is extracted and preloaded individually.
3. If the tag has `class="... has-dark ..."`, the dark variant (`src` with `-dark` before the extension) is also preloaded.

---

## Bundle scanning

For `criticalCss` and `criticalJs`, the plugin iterates over `ctx.bundle`, the map of all output files in the current build. It matches files using the `matchesEntry()` utility:

- A file matches an entry name if its basename starts with `entryName-` or `entryName.`
- Example: entry `"main"` matches `assets/main-abc123.js` and `assets/main.css`, but not `assets/maintenance.js`.

This approach works without any `rollupOptions.input` configuration, the plugin infers matches from the actual output filenames.

---

## Per-page configuration

`criticalJs` and `criticalCss` can be functions instead of arrays. The function receives the current HTML file's path relative to the project root (e.g. `/blog/index.html`) and returns an array of entry names. This allows different pages to preload different bundles:

```js
criticalJs: (path) => {
  if (path === '/') return ['main'];
  if (path.startsWith('/blog')) return ['main', 'blog'];
  return ['main'];
}
```
