[EN](../README.md) | **FR**

<div>
  <img src="https://browserux.com/img/logos/logo-browserux-preload-assets-300.png" alt="logo vite-plugin-preload-assets"/>
</div>

# vite-plugin-preload-assets

`vite-plugin-preload-assets` est un plugin Vite conçu pour améliorer les performances en injectant automatiquement les balises `<link rel="preload">` et `<link rel="preconnect">` pour les ressources critiques (images, polices, JS et CSS) au moment du build.

[![npm version](https://img.shields.io/npm/v/vite-plugin-preload-assets.svg)](https://www.npmjs.com/package/vite-plugin-preload-assets)
![vite compatibility](https://img.shields.io/badge/Vite-646CFF.svg?logo=vite&logoColor=white)

## Fonctionnalités

- 📷 Précharge automatiquement les images marquées avec `data-preload` — indépendant de l'ordre des attributs
- 🖼️ Supporte `srcset` : toutes les URL candidates sont préchargées automatiquement
- ⚡ Ajoute `fetchpriority="high"` sur les images explicitement préchargées
- 🌗 Gère les variantes dark (si utilisation de [browserux-theme-switcher](https://github.com/Effeilo/browserux-theme-switcher)) et les précharge également (ex: `logo-dark.png`)
- 🔤 Précharge les polices via la configuration (`fontsToPreload`) — `crossorigin` ajouté automatiquement conformément à la spec
- 🧠 Utilise `rel="modulepreload"` pour les fichiers JS critiques (correct pour la sortie ESM de Vite)
- 🎨 Précharge les fichiers CSS critiques en les retrouvant dynamiquement dans le bundle via des noms fournis dans la config
- 🌐 Ajoute automatiquement les balises `<link rel="preconnect">` pour Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`)
- 🔁 Déduplique les balises injectées — aucun doublon même entre la config et le HTML
- 🚀 Optimise le chargement initial sans effort manuel
- 🧼 Aucune modification HTML nécessaire

> **Note :** Ce plugin s'exécute uniquement lors du `vite build`. Les balises de préchargement ne sont pas injectées en mode développement.

## Installation

```bash
npm install vite-plugin-preload-assets --save-dev
```

## Utilisation

Dans le fichier `vite.config.ts`, `vite.config.js` ou `vite.config.mjs` :

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

## Préchargement des images

Il suffit d'ajouter l'attribut `data-preload` sur une image dans le HTML :

```html
<img src="/img/logo.png" data-preload width="100" height="100" alt="Logo">
```

Le plugin injectera automatiquement :

```html
<link rel="preload" href="/img/logo.png" as="image" fetchpriority="high">
```

L'attribut `data-preload` peut être placé n'importe où sur la balise — avant ou après `src`.

### Support du srcset

Si l'image possède un attribut `srcset`, toutes les URL candidates sont préchargées :

```html
<img
  src="/img/hero.jpg"
  srcset="/img/hero-400.jpg 400w, /img/hero-800.jpg 800w"
  data-preload
  alt="Hero"
>
```

Le plugin injectera :

```html
<link rel="preload" href="/img/hero.jpg" as="image" fetchpriority="high">
<link rel="preload" href="/img/hero-400.jpg" as="image">
<link rel="preload" href="/img/hero-800.jpg" as="image">
```

### Support du mode dark

Si l'image a une variante dark et qu'on utilise le Web Component [browserux-theme-switcher](https://github.com/Effeilo/browserux-theme-switcher), on peut ajouter la classe `has-dark` :

```html
<img src="/img/logo.png" class="has-dark" data-preload alt="Logo">
```

Le plugin injectera alors les deux versions :

```html
<link rel="preload" href="/img/logo.png" as="image" fetchpriority="high">
<link rel="preload" href="/img/logo-dark.png" as="image">
```

## Paramètres disponibles

### imagesToPreload

Permet de précharger manuellement des images critiques utilisées hors de `index.html` (ex : dans des composants React) :

```js
imagesToPreload: [
  '/img/logo.png',
  '/img/hero.jpg'
]
```

Le plugin injectera automatiquement :

```html
<link rel="preload" href="/img/logo.png" as="image" fetchpriority="high">
<link rel="preload" href="/img/hero.jpg" as="image" fetchpriority="high">
```

### fontsToPreload

Liste des polices à précharger manuellement.

```js
fontsToPreload: [
  {
    href: '/fonts/Inter.woff2',  // URL (relative ou absolue)
    type: 'font/woff2',          // MIME type (par défaut : 'font/woff2')
  },
  {
    href: 'https://fonts.googleapis.com/css2?family=Dosis:wght@200..800&display=swap',
    as: 'style',                 // Permet de surcharger le type (par défaut : 'font')
    crossorigin: true
  }
]
```

- Vous pouvez surcharger l'attribut `as` (`'font'` par défaut) pour des cas spécifiques, comme Google Fonts.
- Si vous préchargez une feuille de style CSS depuis Google Fonts, utilisez `as: 'style'`.

> **`crossorigin` est désormais automatique pour les polices.** Conformément à la spec HTML, le préchargement de polices nécessite toujours l'attribut `crossorigin`, même pour les polices same-origin — son absence amène le navigateur à ignorer silencieusement le hint. Le plugin l'ajoute automatiquement quand `as === 'font'`. Il n'est plus nécessaire de spécifier `crossorigin: true` pour les polices locales.

> Si `as` est différent de `'font'`, le plugin ignorera automatiquement l'attribut `type` pour éviter les avertissements du navigateur.

### preloadGoogleFonts

Permet d'injecter automatiquement les balises `preconnect` nécessaires à l'optimisation du chargement des polices Google Fonts :

```js
preloadGoogleFonts: true
```

Cela injectera automatiquement dans le `<head>` :

```html
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

### criticalJs

Liste des noms de fichiers JS à précharger (sans hash), ou fonction dynamique selon la page HTML en cours.

#### Utilisation simple (tableau) :

```js
criticalJs: ['main', 'app']
```

Cela matchera des fichiers comme :
- `/assets/main-abc123.js`
- `/assets/app-def456.js`

Et injectera des balises `rel="modulepreload"` (correct pour la sortie ESM de Vite) :

```html
<link rel="modulepreload" href="/assets/main-abc123.js" crossorigin>
```

> **Pourquoi `modulepreload` plutôt que `preload` ?** Vite génère des modules ES par défaut. `rel="modulepreload"` est sémantiquement correct pour l'ESM : il précharge et parse le graphe de modules, et fonctionne toujours en mode CORS.

#### Utilisation avancée (par page HTML) :

```js
criticalJs: (path) => {
  if (path === '/index.html') return ['main']
  if (path.includes('/blog/')) return ['blog']
  return []
}
```

Permet de cibler les fichiers critiques en fonction de la page (utile pour les sites multipages).

### criticalCss

Identique à `criticalJs`, mais pour les fichiers CSS générés.

#### Utilisation simple (tableau) :

```js
criticalCss: ['main', 'style']
```

Cela matchera :
- `/assets/main-abc123.css`
- `/assets/style-xyz789.css`

#### Utilisation avancée (par page HTML) :

```js
criticalCss: (path) => {
  if (path === '/index.html') return ['main']
  if (path.includes('/blog/')) return ['blog']
  return []
}
```

## Fonctionnement

- Le plugin s'exécute uniquement pendant le build (hook `transformIndexHtml`)
- Il parcourt le HTML et le bundle Vite
- Il injecte les balises `<link rel="preload">` au tout début du `<head>` (`head-prepend`)
- Les balises en double (même `rel` + `href`) sont automatiquement dédupliquées

## Bonnes pratiques

L'usage de `preload` permet d'améliorer les performances perçues à condition d'être utilisé avec discernement.

Voici quelques conseils :

- Ne préchargez que l'essentiel
- N'utilisez pas `preload` sur toutes les images : cela surcharge inutilement le réseau.
- Préchargez uniquement :
    - les polices critiques utilisées immédiatement
    - les images visibles au-dessus de la ligne de flottaison (above the fold)
    - les fichiers JS ou CSS nécessaires au rendu initial
- Évitez de précharger les ressources secondaires
- Ne préchargez pas les images d'arrière-plan décoratives ou les assets non critiques.
- Ne préchargez pas tous les chunks JS : utilisez `criticalJs` uniquement pour le ou les fichiers d'entrée principaux.
- Ne remplacez pas `prefetch` ou `lazy loading`
- `preload` n'est pas un substitut à `loading="lazy"` pour les images.

> Objectif : aider le navigateur à prioriser le chargement des vraies ressources critiques, et non tout charger en avance, ce qui aurait l'effet inverse.

## Licence

**Licence MIT**, Libre d'utilisation, de modification et de distribution.
