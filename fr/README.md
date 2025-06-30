[EN](../README.md) | **FR**

<div>
  <img src="https://browserux.com/assets/img/logo/logo-vite-plugin-preload-assets.png" alt="logo vite-plugin-preload-assets"/>
</div>

# vite-plugin-preload-assets

`vite-plugin-preload-assets` est un plugin Vite conçu pour améliorer les performances en injectant automatiquement les balises `<link rel="preload">` et `<link rel="preconnect">` pour les ressources critiques (images, polices, JS et CSS) au moment du build.

[![npm version](https://img.shields.io/npm/v/vite-plugin-preload-assets.svg)](https://www.npmjs.com/package/vite-plugin-preload-assets)
![vite compatibility](https://img.shields.io/badge/Vite-646CFF.svg?logo=vite&logoColor=white)

## Fonctionnalités

- 📷 Précharge automatiquement les images marquées avec `data-preload`
- 🔤 Précharge les polices via la configuration (`fontsToPreload`)
- 🧠 Précharge les fichiers JS/CSS critiques en les retrouvant dynamiquement dans le bundle via des noms fournis dans la config
- 🌐 Ajoute automatiquement les balises `<link rel="preconnect">` pour Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`)
- 🚀 Optimise le chargement initial sans effort manuel
- 🧼 Aucune modification HTML nécessaire

## Installation

```bash
npm install vite-plugin-preload-assets --save-dev
```
## Utilisation

Dans le fichier `vite.config.ts`, `vite.config.js` ou `vite.config.mjs` :

```js
import autoPreloadPlugin from 'vite-plugin-preload-assets'

export default {
    plugins: [
        autoPreloadPlugin({
            preloadGoogleFonts: true,
            fontsToPreload: [
                {
                    href: '/fonts/Inter.woff2',
                    type: 'font/woff2',
                    crossorigin: true
                }
            ],
            criticalJs: ['main'],
            criticalCss: ['main']
        })
    ]
}
```

## Paramètres disponibles

### fontsToPreload

Liste des polices à précharger manuellement.

```js
fontsToPreload: [
  {
    href: '/fonts/Inter.woff2',  // URL (relative ou absolue)
    type: 'font/woff2',          // MIME type (par défaut : 'font/woff2')
    crossorigin: true            // Ajoute l'attribut `crossorigin`
  },
  {
    href: 'https://fonts.googleapis.com/css2?family=Dosis:wght@200..800&display=swap',
    type: 'font/woff2',
    crossorigin: true
  }
]
```

> Si Google Fonts est utilisé, on peut inclure leur URL CSS directement en preload. Crossorigin doit être présent pour éviter les erreurs de CORS.

### preloadGoogleFonts

Permet d’injecter automatiquement les balises `preconnect` nécessaires à l’optimisation du chargement des polices Google Fonts :

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

## Préchargement des images 

Il te suffit d'ajouter l'attribut data-preload sur une image dans le HTML :

```html
<img src="/img/logo.png" data-preload width="100" height="100" alt="Logo">
```

Le plugin injectera automatiquement :

```html
<link rel="preload" href="/img/logo.png" as="image">
```

## Fonctionnement

- Le plugin s’exécute pendant le build (hook transformIndexHtml)
- Il parcourt le HTML et le bundle Vite
- Il injecte les balises `<link rel="preload">` au tout début du `<head>` (`head-prepend`)

## Bonnes pratiques

L’usage de `preload` permet d’améliorer les performances perçues à condition d’être utilisé avec discernement.

Voici quelques conseils :

- Ne préchargez que l’essentiel
- N'utilisez pas `preload` sur toutes les images : cela surcharge inutilement le réseau.
- Préchargez uniquement :
    - les polices critiques utilisées immédiatement
    - les images visibles au-dessus de la ligne de flottaison (above the fold)
    - les fichiers JS ou CSS nécessaires au rendu initial
- Évitez de précharger les ressources secondaires
- Ne préchargez pas les images d’arrière-plan décoratives ou les assets non critiques.
- Ne préchargez pas tous les chunks JS : utilisez `criticalJs` uniquement pour le ou les fichiers d’entrée principaux.
- Ne remplacez pas `prefetch` ou `lazy loading`
- preload n’est pas un substitut à `loading="lazy"` pour les images.

> Objectif : aider le navigateur à prioriser le chargement des vraies ressources critiques, et non tout charger en avance, ce qui aurait l’effet inverse.

## Licence

**Licence MIT**, Libre d’utilisation, de modification et de distribution.