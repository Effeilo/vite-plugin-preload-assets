**EN** | [FR](./fr/CHANGELOG.md)

<div>
  <img src="https://browserux.com/assets/img/logo/logo-vite-plugin-preload-assets.png" alt="logo vite-plugin-preload-assets"/>
</div>

# 📦 Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com)  
and this project adheres to [Semantic Versioning](https://semver.org).

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