[EN](../README.md) | **FR**

<div>
  <img src="https://browserux.com/img/logos/logo-browserux-preload-assets-300.png" alt="logo vite-plugin-preload-assets"/>
</div>

# BrowserUX Preload Assets

**Boostez les performances de votre interface web en préchargeant intelligemment les ressources critiques.**

BrowserUX Preload Assets est un plugin Vite configurable qui simplifie l'injection des balises `<link rel="preload">` et `<link rel="preconnect">` pour les images, polices, fichiers JS et CSS essentiels. Grâce à une configuration explicite ou aux attributs de balisage HTML, vous gardez le contrôle sur les ressources prioritaires lors du chargement initial. Compatible avec les thèmes clair/sombre (via BrowserUX Theme Switcher) et Google Fonts, il améliore la vitesse de rendu.

- [Site du projet](https://browserux.com/fr/preload-assets/)
- [Documentation](./docs/index.md)
- [Changelog](./CHANGELOG.md)

<br>

[![npm version](https://img.shields.io/npm/v/vite-plugin-preload-assets.svg)](https://www.npmjs.com/package/vite-plugin-preload-assets)
![Vite compatibility](https://img.shields.io/badge/Vite-4%2B-646CFF.svg?logo=vite&logoColor=white)

## Fonctionnalités

- 📷 Précharge automatiquement les images marquées avec `data-preload`, indépendant de l'ordre des attributs
- 🖼️ Supporte `srcset` : toutes les URL candidates sont préchargées automatiquement
- ⚡ Ajoute `fetchpriority="high"` sur les images explicitement préchargées
- 🌗 Gère les variantes dark (classe `has-dark`) et précharge les deux versions
- 🔤 Précharge les polices via la configuration, `crossorigin` ajouté automatiquement conformément à la spec
- 🧠 Utilise `rel="modulepreload"` pour les fichiers JS critiques (correct pour la sortie ESM de Vite)
- 🎨 Précharge les fichiers CSS critiques en les retrouvant dynamiquement dans le bundle via des noms d'entrée
- 🌐 Injecte automatiquement les balises `<link rel="preconnect">` pour Google Fonts
- 🔁 Déduplique toutes les balises injectées, aucun doublon entre la config et le HTML
- 🏗️ Build uniquement, ne s'exécute jamais en mode développement (`apply: 'build'`)
- 🚀 Aucune dépendance à l'exécution
- 🧼 Aucune modification HTML requise au-delà de `data-preload` sur les images

## Installation

```bash
npm install vite-plugin-preload-assets --save-dev
```

## Utilisation

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

Ajoutez `data-preload` sur une image dans votre HTML pour la précharger automatiquement :

```html
<img src="/img/hero.jpg" data-preload alt="Hero">
```

## Paramètres

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `imagesToPreload` | `string[]` | — |   URLs d'images à précharger explicitement (pour les images absentes du HTML source) |
| `fontsToPreload` | `FontPreload[]` | — |   Ressources de polices à précharger |
| `criticalJs` | `string[] \| (filename: string) => string[]` | — |   Noms d'entrées à matcher contre les fichiers JS du bundle |
| `criticalCss` | `string[] \| (filename: string) => string[]` | — |   Noms d'entrées à matcher contre les fichiers CSS du bundle |
| `preloadGoogleFonts` | `boolean` | `false` | Injecte `<link rel="preconnect">` pour `fonts.googleapis.com` et `fonts.gstatic.com` |

**Type `FontPreload` :**

```ts
type FontPreload = {
  href: string              // URL du fichier de police (requis)
  type?: string             // Type MIME, défaut : 'font/woff2' (quand as === 'font')
  as?: 'font' | 'style'    // Défaut : 'font'
  crossorigin?: boolean     // Ajouté automatiquement quand as === 'font'
}
```

## Documentation

**Guide**

- [Introduction](./docs/guide/introduction.md)
- [Démarrage](./docs/guide/getting-started.md)
- [Fonctionnement](./docs/guide/how-it-works.md)
- [Préchargement des images](./docs/guide/images.md)
- [Préchargement des polices](./docs/guide/fonts.md)
- [Assets critiques](./docs/guide/critical-assets.md)

**Référence**

- [Options](./docs/reference/options.md)
- [Hooks](./docs/reference/hooks.md)
- [Utilitaires](./docs/reference/utils.md)

**Référence complémentaire**

- [Compatibilité](./docs/compatibility.md)
- [Contribuer](./docs/contributing.md)

## Licence

MIT © 2026 [Effeilo](https://github.com/Effeilo)
