**EN** | [FR](./fr/README.md)

<div>
  <img src="https://browserux.com/img/logos/logo-browserux-preload-assets-300.png" alt="logo vite-plugin-preload-assets"/>
</div>

# BrowserUX Preload Assets

**Boost your web interface performance by intelligently preloading critical resources.**

BrowserUX Preload Assets is a configurable Vite plugin that simplifies the injection of `<link rel="preload">` and `<link rel="preconnect">` tags for essential images, fonts, JS, and CSS files. Using explicit configuration or HTML markup attributes, you stay in control of which resources are prioritized during the initial load. Compatible with light/dark themes (via BrowserUX Theme Switcher) and Google Fonts, it improves rendering speed.

- [Project website](https://browserux.com/preload-assets/)
- [Documentation](./docs/index.md)
- [Changelog](./CHANGELOG.md)

<br>

[![npm version](https://img.shields.io/npm/v/vite-plugin-preload-assets.svg)](https://www.npmjs.com/package/vite-plugin-preload-assets)
![Vite compatibility](https://img.shields.io/badge/Vite-4%2B-646CFF.svg?logo=vite&logoColor=white)

## Features

- 📷 Automatically preloads images marked with `data-preload`, attribute order independent
- 🖼️ Supports `srcset`: all candidate URLs are preloaded automatically
- ⚡ Adds `fetchpriority="high"` on explicitly preloaded images
- 🌗 Handles dark mode variants (`has-dark` class) and preloads both light and dark versions
- 🔤 Preloads fonts via configuration, `crossorigin` added automatically per spec
- 🧠 Uses `rel="modulepreload"` for critical JS files (correct for Vite's ESM output)
- 🎨 Preloads critical CSS files by matching configured entry names against the build output
- 🌐 Injects `<link rel="preconnect">` tags for Google Fonts automatically
- 🔁 Deduplicates all injected tags, no duplicate hints across config and HTML
- 🏗️ Build-only, never runs in development mode (`apply: 'build'`)
- 🚀 Zero runtime dependencies
- 🧼 No manual HTML changes required beyond `data-preload` on images

## Installation

```bash
npm install vite-plugin-preload-assets --save-dev
```

## Usage

```js
// vite.config.js
import preloadAssets from 'vite-plugin-preload-assets'

export default {
  plugins: [
    preloadAssets({
      preloadGoogleFonts: true,
      fontsToPreload: [
        { href: '/fonts/Inter.woff2' }
      ],
      criticalJs: ['main'],
      criticalCss: ['main']
    })
  ]
}
```

Add `data-preload` to any image in your HTML to preload it automatically:

```html
<img src="/img/hero.jpg" data-preload alt="Hero">
```

## Parameters

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `imagesToPreload` | `string[]` | — |   Image URLs to preload explicitly (for images outside the HTML source) |
| `fontsToPreload` | `FontPreload[]` | — |   Font resources to preload |
| `criticalJs` | `string[] \| (filename: string) => string[]` | — |   Entry names to match against JS files in the build bundle |
| `criticalCss` | `string[] \| (filename: string) => string[]` | — |   Entry names to match against CSS files in the build bundle |
| `preloadGoogleFonts` | `boolean` | `false` | Inject `<link rel="preconnect">` for `fonts.googleapis.com` and `fonts.gstatic.com` |

**`FontPreload` type:**

```ts
type FontPreload = {
  href: string              // Font file URL (required)
  type?: string             // MIME type, default: 'font/woff2' (when as === 'font')
  as?: 'font' | 'style'    // Default: 'font'
  crossorigin?: boolean     // Added automatically when as === 'font'
}
```

## Documentation

**Guide**

- [Introduction](./docs/guide/introduction.md)
- [Getting started](./docs/guide/getting-started.md)
- [How it works](./docs/guide/how-it-works.md)
- [Image preloading](./docs/guide/images.md)
- [Font preloading](./docs/guide/fonts.md)
- [Critical assets](./docs/guide/critical-assets.md)

**Reference**

- [Options](./docs/reference/options.md)
- [Hooks](./docs/reference/hooks.md)
- [Utilities](./docs/reference/utils.md)

**Additional reference**

- [Compatibility](./docs/compatibility.md)
- [Contributing](./docs/contributing.md)

## License

MIT © 2026 [Effeilo](https://github.com/Effeilo)
