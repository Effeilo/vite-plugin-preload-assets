# vite-plugin-preload-assets

`vite-plugin-preload-assets` est un plugin Vite qui injecte automatiquement des balises `<link rel="preload">` et `<link rel="preconnect">` dans le HTML lors des builds de production. Il aide le navigateur à prioriser le chargement des ressources critiques, polices, images, bundles JS et CSS, sans écrire manuellement aucune balise.

---

## Documentation

### Guide

- [Introduction](guide/introduction.md), ce que fait le plugin, quand l'utiliser, fonctionnalités
- [Démarrage](guide/getting-started.md), installation et configuration minimale
- [Fonctionnement](guide/how-it-works.md), hook transformIndexHtml, ordre d'injection, déduplication
- [Images](guide/images.md), `data-preload`, `srcset`, mode sombre, `imagesToPreload`
- [Polices](guide/fonts.md), `fontsToPreload`, preconnect Google Fonts, règles `crossorigin`
- [JS et CSS critiques](guide/critical-assets.md), `criticalJs`, `criticalCss`, fonctions par page

### Référence

- [Options](reference/options.md), toutes les options du plugin avec types et valeurs par défaut
- [Hooks](reference/hooks.md), hook Vite utilisé par le plugin
- [Utilitaires](reference/utils.md), fonctions utilitaires exportées

### Autres

- [Compatibilité](compatibility.md), Node.js, versions Vite, dépendances
- [Contribuer](contributing.md), signaler des problèmes et soumettre des pull requests
- [Changelog](../../CHANGELOG.md)

---

## Exemple rapide

```js
// vite.config.js
import { defineConfig } from 'vite';
import preloadAssets from 'vite-plugin-preload-assets';

export default defineConfig({
  plugins: [
    preloadAssets({
      fontsToPreload: [
        { href: '/fonts/MaPolice.woff2' },
      ],
      preloadGoogleFonts: true,
      criticalJs: ['main'],
      criticalCss: ['main'],
    }),
  ],
});
```

Dans le HTML, marquez les images avec `data-preload` pour les précharger automatiquement :

```html
<img src="/images/hero.jpg" alt="Hero" data-preload />
```
