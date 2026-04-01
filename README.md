**EN** | [FR](./fr/README.md)

<div>
  <img src="https://browserux.com/img/logos/logo-browserux-preload-assets-300.png" alt="logo vite-plugin-preload-assets"/>
</div>

# vite-plugin-preload-assets

`vite-plugin-preload-assets` is a Vite plugin designed to improve performance by automatically injecting `<link rel="preload">` and `<link rel="preconnect">` tags for critical resources (images, fonts, JS, and CSS) at build time.

[![npm version](https://img.shields.io/npm/v/vite-plugin-preload-assets.svg)](https://www.npmjs.com/package/vite-plugin-preload-assets)
![vite compatibility](https://img.shields.io/badge/Vite-646CFF.svg?logo=vite&logoColor=white)

## Features

- 📷 Automatically preloads images marked with `data-preload` — attribute order independent
- 🖼️ Supports `srcset`: all candidate URLs are preloaded automatically
- ⚡ Adds `fetchpriority="high"` on explicitly preloaded images
- 🌗 Handles dark mode variants (when using [browserux-theme-switcher](https://github.com/Effeilo/browserux-theme-switcher)) and preloads them as well (e.g. `logo-dark.png`)
- 🔤 Preloads fonts via configuration (`fontsToPreload`) — `crossorigin` added automatically per spec
- 🧠 Uses `rel="modulepreload"` for critical JS files (correct for Vite's ESM output)
- 🎨 Preloads critical CSS files by matching configured names dynamically in the build output
- 🌐 Automatically injects `<link rel="preconnect">` tags for Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`)
- 🔁 Deduplicates injected tags — no duplicate hints even across config and HTML
- 🚀 Optimizes initial load performance with zero manual effort
- 🧼 No manual HTML changes required

> **Note:** This plugin only runs during `vite build`. Preload tags are not injected in development mode.

## Installation

```bash
npm install vite-plugin-preload-assets --save-dev
```

## Usage

In the `vite.config.ts`, `vite.config.js`, or `vite.config.mjs` file:

```js
import preloadAssetsPlugin from 'vite-plugin-preload-assets'

export default {
    plugins: [
        preloadAssetsPlugin({
            preloadGoogleFonts: true,
            fontsToPreload: [
                {
                    href: '/fonts/Inter.woff2',
                    type: 'font/woff2'
                }
            ],
            criticalJs: ['main'],
            criticalCss: ['main']
        })
    ]
}
```

## Image Preloading

Simply add the `data-preload` attribute to an image in your HTML:

```html
<img src="/img/logo.png" data-preload width="100" height="100" alt="Logo">
```

The plugin will automatically inject:

```html
<link rel="preload" href="/img/logo.png" as="image" fetchpriority="high">
```

The `data-preload` attribute can be placed anywhere on the tag — before or after `src`.

### Support for srcset

If the image has a `srcset` attribute, all candidate URLs are preloaded:

```html
<img
  src="/img/hero.jpg"
  srcset="/img/hero-400.jpg 400w, /img/hero-800.jpg 800w"
  data-preload
  alt="Hero"
>
```

This will inject:

```html
<link rel="preload" href="/img/hero.jpg" as="image" fetchpriority="high">
<link rel="preload" href="/img/hero-400.jpg" as="image">
<link rel="preload" href="/img/hero-800.jpg" as="image">
```

### Support for dark mode variants

If your image also supports dark mode and is used with the [browserux-theme-switcher](https://github.com/Effeilo/browserux-theme-switcher), you can add the `has-dark` class:

```html
<img src="/img/logo.png" class="has-dark" data-preload alt="Logo">
```

This will inject both versions:

```html
<link rel="preload" href="/img/logo.png" as="image" fetchpriority="high">
<link rel="preload" href="/img/logo-dark.png" as="image">
```

This ensures both light and dark versions are loaded early and switch instantly on theme change.

## Available options

### imagesToPreload

Explicitly preload images that are not in `index.html` (e.g. used in React components):

```js
imagesToPreload: [
  '/img/logo.png',
  '/img/hero.jpg'
]
```

This will generate:

```html
<link rel="preload" href="/img/logo.png" as="image" fetchpriority="high">
<link rel="preload" href="/img/hero.jpg" as="image" fetchpriority="high">
```

### fontsToPreload

List of fonts to preload manually.

```js
fontsToPreload: [
  {
    href: '/fonts/Inter.woff2',  // URL (relative or absolute)
    type: 'font/woff2',          // MIME type (default: 'font/woff2')
  },
  {
    href: 'https://fonts.googleapis.com/css2?family=Dosis:wght@200..800&display=swap',
    as: 'style',                 // Override preload type (default: 'font')
    crossorigin: true
  }
]
```

- You can override the `as` attribute (`'font'` by default) to support custom cases like Google Fonts CSS.
- If you're preloading a CSS file from Google Fonts, use `as: 'style'`.

> **`crossorigin` is now automatic for font preloads.** Per the HTML spec, font preloads always require `crossorigin`, even for same-origin fonts — omitting it causes the browser to silently ignore the hint. The plugin adds it automatically when `as === 'font'`. You no longer need to specify `crossorigin: true` for local fonts.

> If `as` is not set to `'font'`, the plugin will automatically skip the `type` attribute to avoid preload warnings.

### preloadGoogleFonts

Automatically injects the `preconnect` tags needed to optimize the loading of Google Fonts:

```js
preloadGoogleFonts: true
```

This will automatically inject the following into the `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

### criticalJs

List of JS file names to preload (without hash), or a function to dynamically resolve them based on the current HTML page path.

#### Basic usage (array):

```js
criticalJs: ['main', 'app']
```

This will match files like:
- `/assets/main-abc123.js`
- `/assets/app-def456.js`

And inject `rel="modulepreload"` tags (correct for Vite's ESM output):

```html
<link rel="modulepreload" href="/assets/main-abc123.js" crossorigin>
```

> **Why `modulepreload` instead of `preload`?** Vite bundles ES modules by default. `rel="modulepreload"` is semantically correct for ESM: it both preloads and parses the module graph, and always operates in CORS mode.

#### Advanced usage (per page):

```js
criticalJs: (path) => {
  if (path === '/index.html') return ['main']
  if (path.includes('/blog/')) return ['blog']
  return []
}
```

This allows per-page targeting in multi-page apps.

### criticalCss

Same as `criticalJs`, but for generated CSS files.

#### Basic usage (array):

```js
criticalCss: ['main', 'style']
```

Matches:
- `/assets/main-abc123.css`
- `/assets/style-xyz789.css`

#### Advanced usage (per page):

```js
criticalCss: (path) => {
  if (path === '/index.html') return ['main']
  if (path.includes('/blog/')) return ['blog']
  return []
}
```

## How it works

- The plugin runs during the build phase only (using the `transformIndexHtml` hook)
- It scans the HTML and the Vite bundle
- It injects `<link rel="preload">` tags at the very beginning of the `<head>` (`head-prepend`)
- Duplicate tags (same `rel` + `href`) are automatically deduplicated

## Best Practices

Using `preload` can improve perceived performance, but only when used wisely.

Here are some tips:

- Only preload what's essential
- Don't use `preload` on all images, this can unnecessarily overload the network.
- Preload only:
  - Critical fonts used immediately
  - Images visible above the fold
  - JS or CSS files required for the initial render
- Avoid preloading secondary assets
- Do not preload decorative background images or non-critical assets.
- Don't preload all JS chunks, use `criticalJs` only for main entry files.
- Don't replace `prefetch` or `lazy loading`
- `preload` is not a substitute for `loading="lazy"` on images.

> Goal: help the browser prioritize the loading of truly critical resources, not to load everything upfront, which can have the opposite effect.

## License

**MIT License**, Free to use, modify, and distribute.
