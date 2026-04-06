# Introduction

## What it does

`vite-plugin-preload-assets` injects resource hints into the `<head>` of every HTML file produced by Vite. It runs at build time only, nothing changes in development mode.

The plugin handles five categories of assets:

| Category | Tag injected | How discovered |
|---|---|---|
| Images with `data-preload` | `<link rel="preload" as="image">` | HTML scanning via regex |
| Images listed in config | `<link rel="preload" as="image">` | `imagesToPreload` option |
| Google Fonts | `<link rel="preconnect">` ×2 | `preloadGoogleFonts: true` |
| Local/remote fonts | `<link rel="preload" as="font">` | `fontsToPreload` option |
| Critical CSS bundles | `<link rel="preload" as="style">` | `criticalCss` + bundle scan |
| Critical JS bundles | `<link rel="modulepreload">` | `criticalJs` + bundle scan |

All injected tags are deduplicated, the same `rel` + `href` combination is never injected twice.

---

## When to use it

- You have above-the-fold images that are discovered late (e.g. in CSS or JS) and want to preload them.
- You use custom fonts and want to eliminate font flash (FOUT/FOIT).
- You use Google Fonts and want `preconnect` hints to speed up the DNS/TLS handshake.
- You want the browser to start fetching your main JS/CSS bundles before the parser reaches the `<script>` tags.

---

## What it does not do

- It does not run in development mode (`apply: 'build'` only).
- It does not generate a resource manifest or analyze actual bundle sizes.
- It does not inject tags for every asset, only the ones you explicitly configure or mark with `data-preload`.

---

## Features

- Scans HTML for `<img data-preload>` regardless of attribute order
- `srcset` support, all candidate URLs in the attribute are preloaded
- Dark mode image variants, images with class `has-dark` get their `*-dark.ext` counterpart preloaded
- `fetchpriority="high"` on all preloaded images
- Manual image list via `imagesToPreload`
- Font preloads with automatic `crossorigin` (required per HTML spec)
- `as` override for font entries (e.g. `as: 'style'` for Google Fonts CSS)
- Google Fonts `preconnect` for `fonts.googleapis.com` and `fonts.gstatic.com`
- Critical CSS preload matched by entry name from the Vite bundle
- Critical JS using `rel="modulepreload"` (correct for Vite's ESM output)
- Per-page dynamic configuration via functions for `criticalJs` and `criticalCss`
- Tag deduplication across all injection sources
- 39 unit tests via Vitest
- Native ESM, TypeScript, bundled type declarations
- No runtime dependencies
