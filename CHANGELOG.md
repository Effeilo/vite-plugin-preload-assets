**EN** | [FR](./fr/CHANGELOG.md)

<div>
  <img src="https://browserux.com/img/logos/logo-browserux-preload-assets-300.png" alt="logo vite-plugin-preload-assets"/>
</div>

# 📦 Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com)
and this project adheres to [Semantic Versioning](https://semver.org).

---

<br>

## [1.3.1] – 2026-04-06

### 🛠 Fixed

- Added `rootDir` to `tsconfig.json` to resolve TypeScript 5.x error caused by missing explicit root directory when `declarationDir` is set
- Updated `moduleResolution` from deprecated `"node"` to `"bundler"` for TypeScript 5.x compatibility

---

<br>

## [1.3.0] – 2026-04-01

### ✨ Added

- **`srcset` support:** images with a `srcset` attribute now have all their candidate URLs preloaded automatically
- **`fetchpriority="high"`** is now injected on all explicitly preloaded images (`data-preload` and `imagesToPreload`) to reinforce browser prioritization
- **Tag deduplication:** identical preload hints (same `rel` + `href`) are deduplicated, no redundant tags even when the same URL appears in both HTML and config
- **Unit tests:** 39 tests covering all features via [Vitest](https://vitest.dev)

### 🛠️ Fixed

- **`crossorigin` now automatic for font preloads:** per the HTML spec, font preloads always require the `crossorigin` attribute, even for same-origin fonts. Omitting it caused the browser to silently discard the hint. The attribute is now added automatically when `as === 'font'`. No need to specify `crossorigin: true` for local fonts anymore
- **`rel="modulepreload"` for JS files:** replaced `rel="preload" as="script"` with `rel="modulepreload"`, which is semantically correct for Vite's ESM output and enables module graph parsing
- **Attribute order independent image detection:** the `data-preload` attribute is now detected regardless of its position on the `<img>` tag, it no longer needs to come after `src`
- **Removed unnecessary `crossorigin` on same-origin CSS preloads:** adding `crossorigin` to same-origin CSS preloads could cause cache mismatches; it is now omitted
- **Removed dead code** in `criticalCss` / `criticalJs` resolution (unreachable branch `?.[currentPath]`)
- **Removed redundant `ctx &&` guard**, `ctx` is always defined inside `transformIndexHtml`
- **Typed `tags` array** as `HtmlTagDescriptor[]` instead of `any[]`

<br>

---

<br>

## [1.2.3] – 2025-07-03

### 🛠️ Fixed

- `type="font/woff2"` is now only added when `as === 'font'`
- Prevents browser warnings when preloading Google Fonts CSS with `as: 'style'`

<br>

---

<br>

## [1.2.2] – 2025-07-03

### ✨ Added

- Support for overriding the `as` attribute in `fontsToPreload`
  - Useful for preloading Google Fonts CSS with `as: 'style'`

<br>

---

<br>

## [1.2.0] – 2025-07-01

### ✨ Added

- New `imagesToPreload` option:
  - Allows manually preloading images not present in `index.html` (e.g. React components)
  - Injects `<link rel="preload" href="..." as="image">` automatically

<br>

---

<br>

## [1.1.1] – 2025-06-30

### 🛠️ Improvement

- Compatibility with Vite v6 (added `^6.0.0` in `peerDependencies`)

<br>

---

<br>

## [1.1.0] – 2025-06-30

### ✨ Added

- Support for dark mode image variants:
  - If an image has the class `has-dark`, the plugin will automatically preload the corresponding `*-dark.ext` version.
  - Compatible with [`browserux-theme-switcher`](https://github.com/Effeilo/browserux-theme-switcher)

<br>

---

<br>

## [1.0.0] – 2025-06-29

### ✨ Added

- Initial release of `vite-plugin-preload-assets`
- Injects `<link rel="preload">` and `<link rel="preconnect">` tags at build time
- Supports:
  - Preloading images via `data-preload` attribute
  - Font preloading via config (`fontsToPreload`)
  - Critical JS/CSS detection based on entry names
  - Per-page dynamic configuration with function-based `criticalJs` / `criticalCss`
  - Auto-injection of `preconnect` for Google Fonts

### 🛠️ Optimized

- Respects multi-page projects without needing `rollupOptions.input`
- Skips preload for irrelevant resources per page
- Normalizes HTML path for safe config matching

<br>

---
