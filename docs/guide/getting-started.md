# Getting started

## Installation

```bash
npm install vite-plugin-preload-assets --save-dev
```

---

## Minimal configuration

```js
// vite.config.js
import { defineConfig } from 'vite';
import preloadAssets from 'vite-plugin-preload-assets';

export default defineConfig({
  plugins: [
    preloadAssets({}),
  ],
});
```

With no options, the plugin only processes `<img data-preload>` tags found in HTML. All other features require explicit configuration.

---

## TypeScript config

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import preloadAssets from 'vite-plugin-preload-assets';

export default defineConfig({
  plugins: [
    preloadAssets({
      fontsToPreload: [{ href: '/fonts/MyFont.woff2' }],
      criticalJs: ['main'],
      criticalCss: ['main'],
    }),
  ],
});
```

---

## Full configuration example

```js
import { defineConfig } from 'vite';
import preloadAssets from 'vite-plugin-preload-assets';

export default defineConfig({
  plugins: [
    preloadAssets({
      // Manually preload images not in index.html (e.g. loaded by React/Vue)
      imagesToPreload: ['/images/hero.jpg', '/images/logo.png'],

      // Preload local fonts
      fontsToPreload: [
        { href: '/fonts/MyFont-Regular.woff2' },
        { href: '/fonts/MyFont-Bold.woff2' },
        // Preload Google Fonts CSS as a stylesheet
        { href: 'https://fonts.googleapis.com/css2?family=Inter', as: 'style' },
      ],

      // Add preconnect hints for Google Fonts
      preloadGoogleFonts: true,

      // Preload critical CSS and JS bundles by entry name
      criticalCss: ['main'],
      criticalJs: ['main'],
    }),
  ],
});
```

---

## Marking images in HTML

Add `data-preload` to any `<img>` tag you want preloaded:

```html
<img src="/images/hero.jpg" alt="Hero image" data-preload />
<img src="/images/logo.png" alt="Logo" class="has-dark" data-preload />
```

The attribute can appear anywhere on the tag, attribute order does not matter.

---

## Build only

The plugin only runs during `vite build`. It has no effect in `vite dev`.
