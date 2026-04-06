# Compatibilité

---

## Prérequis d'environnement

| Environnement | Version minimale | Raison |
|---|---|---|
| Node.js | 18+ | ESM natif, compilation TypeScript |
| Vite | 4+ | Hook `transformIndexHtml` avec contexte bundle |

---

## Compatibilité Vite

| Version Vite | Statut |
|---|---|
| Vite 4.x | Supporté |
| Vite 5.x | Supporté |
| Vite 6.x | Supporté |

Le plugin utilise l'API plugin Vite standard (`transformIndexHtml`, `HtmlTagDescriptor`, `apply: 'build'`) et ne repose sur aucun élément interne spécifique à une version.

---

## Support navigateur des balises injectées

Le plugin injecte des resource hints HTML standard. Support navigateur par type de balise :

| Balise | Chrome | Firefox | Safari | Edge |
|---|---|---|---|---|
| `<link rel="preload">` | 50+ | 85+ | 11.1+ | 17+ |
| `<link rel="modulepreload">` | 66+ | 115+ | 17+ | 66+ |
| `<link rel="preconnect">` | 46+ | 39+ | 11.1+ | 79+ |
| `fetchpriority` sur `<link>` | 102+ | 132+ | 17.2+ | 102+ |

Les hints non supportés sont silencieusement ignorés par le navigateur, ils n'ont aucun effet négatif sur les fonctionnalités.

---

## Compatibilité frameworks

Le plugin fonctionne avec tout projet Vite. Il traite les fichiers HTML directement et ne dépend d'aucun framework frontend.

| Framework / Configuration | Statut | Notes |
|---|---|---|
| HTML vanilla (MPA) | Supporté | Fonctionnalité complète |
| React (Vite) | Supporté | Utiliser `imagesToPreload` pour les images des composants |
| Vue 3 (Vite) | Supporté | Utiliser `imagesToPreload` pour les images des composants |
| Svelte (Vite) | Supporté | Utiliser `imagesToPreload` pour les images des composants |
| Astro | Compatible | Le plugin s'exécute sur la transformation HTML de Vite |

---

## Format de module

Le plugin est **ESM natif uniquement** (`"type": "module"`).

```js
// Supporté
import preloadAssets from 'vite-plugin-preload-assets';

// Non supporté
const preloadAssets = require('vite-plugin-preload-assets');
```

---

## Dépendances

| Package | Type | Rôle |
|---|---|---|
| [vite](https://vite.dev/) | Pair | Types de l'API plugin (`Plugin`, `HtmlTagDescriptor`) |
| [typescript](https://www.typescriptlang.org/) | Dev | Compilateur |
| [vitest](https://vitest.dev/) | Dev | Framework de tests unitaires (39 tests) |
| [@types/node](https://www.npmjs.com/package/@types/node) | Dev | Déclarations de types Node.js |

Aucune dépendance à l'exécution.
