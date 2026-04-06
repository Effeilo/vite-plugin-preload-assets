# vite-plugin-preload-assets

`vite-plugin-preload-assets` is a Vite plugin that automatically injects `<link rel="preload">` and `<link rel="preconnect">` tags into the HTML during production builds. It helps the browser prioritize loading of critical assets, fonts, images, JS bundles, and CSS files, without any manual tag writing.

---

## Documentation

### Guide

- [Introduction](guide/introduction.md), what the plugin does, when to use it, features overview
- [Getting started](guide/getting-started.md), installation and minimal configuration
- [How it works](guide/how-it-works.md), transformIndexHtml hook, injection order, deduplication
- [Images](guide/images.md), `data-preload`, `srcset`, dark mode, `imagesToPreload`
- [Fonts](guide/fonts.md), `fontsToPreload`, Google Fonts preconnect, `crossorigin` rules
- [Critical JS and CSS](guide/critical-assets.md), `criticalJs`, `criticalCss`, per-page functions

### Reference

- [Options](reference/options.md), all plugin options with types and defaults
- [Hooks](reference/hooks.md), Vite lifecycle hook used by the plugin
- [Utilities](reference/utils.md), exported utility functions

### Other

- [Compatibility](compatibility.md), Node.js, Vite versions, dependencies
- [Contributing](contributing.md), how to report issues and submit pull requests
- [Changelog](../CHANGELOG.md)

---

## Quick example

```js
// vite.config.js
import { defineConfig } from 'vite';
import preloadAssets from 'vite-plugin-preload-assets';

export default defineConfig({
  plugins: [
    preloadAssets({
      fontsToPreload: [
        { href: '/fonts/MyFont.woff2' },
      ],
      preloadGoogleFonts: true,
      criticalJs: ['main'],
      criticalCss: ['main'],
    }),
  ],
});
```

In HTML, mark images with `data-preload` to have them preloaded automatically:

```html
<img src="/images/hero.jpg" alt="Hero" data-preload />
```
