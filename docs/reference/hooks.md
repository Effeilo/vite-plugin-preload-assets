# Hooks

`vite-plugin-preload-assets` uses one Vite plugin hook.

---

## `transformIndexHtml`

**Vite hook:** [`transformIndexHtml`](https://vite.dev/guide/api-plugin.html#transformindexhtml)

Called for each HTML file during the build. The plugin receives the full HTML string and the build context object (`ctx`), which includes `ctx.bundle` (the map of all output files) and `ctx.filename` (the absolute path of the current HTML file).

The hook returns the original HTML unchanged, plus an array of `HtmlTagDescriptor` objects representing the tags to inject.

### Execution order

For each HTML file:

1. Scan HTML for `<img data-preload>` tags, extract `src`, `srcset`, and `has-dark` class.
2. Process `imagesToPreload` from config.
3. Inject Google Fonts preconnect if `preloadGoogleFonts: true`.
4. Process `fontsToPreload` from config.
5. Scan `ctx.bundle` for CSS files matching `criticalCss` entry names.
6. Scan `ctx.bundle` for JS files matching `criticalJs` entry names.

All tags are collected in a single array, deduplicated by `rel::href`, then returned to Vite for injection into `<head>`.

### `apply: 'build'`

The plugin is registered with `apply: 'build'`, which tells Vite to only load this plugin during production builds. The hook is never called during `vite dev`.
