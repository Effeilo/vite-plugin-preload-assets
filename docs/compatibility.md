# Compatibility

---

## Environment requirements

| Environment | Minimum version | Reason |
|---|---|---|
| Node.js | 18+ | Native ESM, TypeScript compilation |
| Vite | 4+ | `transformIndexHtml` hook with bundle context |

---

## Vite compatibility

| Vite version | Status |
|---|---|
| Vite 4.x | Supported |
| Vite 5.x | Supported |
| Vite 6.x | Supported |

The plugin uses the standard Vite plugin API (`transformIndexHtml`, `HtmlTagDescriptor`, `apply: 'build'`) and does not rely on any version-specific internals.

---

## Browser support for injected tags

The plugin injects standard HTML resource hints. Browser support for each tag type:

| Tag | Chrome | Firefox | Safari | Edge |
|---|---|---|---|---|
| `<link rel="preload">` | 50+ | 85+ | 11.1+ | 17+ |
| `<link rel="modulepreload">` | 66+ | 115+ | 17+ | 66+ |
| `<link rel="preconnect">` | 46+ | 39+ | 11.1+ | 79+ |
| `fetchpriority` on `<link>` | 102+ | 132+ | 17.2+ | 102+ |

Unsupported hints are silently ignored by the browser, they have no negative effect on functionality.

---

## Framework compatibility

The plugin works with any Vite-based project. It processes HTML files directly and does not depend on any frontend framework.

| Framework / Setup | Status | Notes |
|---|---|---|
| Vanilla HTML (MPA) | Supported | Full feature set |
| React (Vite) | Supported | Use `imagesToPreload` for component images |
| Vue 3 (Vite) | Supported | Use `imagesToPreload` for component images |
| Svelte (Vite) | Supported | Use `imagesToPreload` for component images |
| Astro | Compatible | Plugin runs on Vite's HTML transform |

---

## Module format

The plugin is **native ESM only** (`"type": "module"`).

```js
// Supported
import preloadAssets from 'vite-plugin-preload-assets';

// Not supported
const preloadAssets = require('vite-plugin-preload-assets');
```

---

## Dependencies

| Package | Type | Role |
|---|---|---|
| [vite](https://vite.dev/) | Peer | Plugin API types (`Plugin`, `HtmlTagDescriptor`) |
| [typescript](https://www.typescriptlang.org/) | Dev | Compiler |
| [vitest](https://vitest.dev/) | Dev | Unit test framework (39 tests) |
| [@types/node](https://www.npmjs.com/package/@types/node) | Dev | Node.js type declarations |

No runtime dependencies.
