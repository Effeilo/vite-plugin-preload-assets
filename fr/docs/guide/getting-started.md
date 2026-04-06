# Démarrage

## Installation

```bash
npm install vite-plugin-preload-assets --save-dev
```

---

## Configuration minimale

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

Sans options, le plugin traite uniquement les balises `<img data-preload>` trouvées dans le HTML. Toutes les autres fonctionnalités nécessitent une configuration explicite.

---

## Configuration TypeScript

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import preloadAssets from 'vite-plugin-preload-assets';

export default defineConfig({
  plugins: [
    preloadAssets({
      fontsToPreload: [{ href: '/fonts/MaPolice.woff2' }],
      criticalJs: ['main'],
      criticalCss: ['main'],
    }),
  ],
});
```

---

## Exemple de configuration complète

```js
import { defineConfig } from 'vite';
import preloadAssets from 'vite-plugin-preload-assets';

export default defineConfig({
  plugins: [
    preloadAssets({
      // Précharger manuellement des images absentes de index.html (ex. composants React/Vue)
      imagesToPreload: ['/images/hero.jpg', '/images/logo.png'],

      // Précharger des polices locales
      fontsToPreload: [
        { href: '/fonts/MaPolice-Regular.woff2' },
        { href: '/fonts/MaPolice-Bold.woff2' },
        // Précharger une CSS Google Fonts comme feuille de style
        { href: 'https://fonts.googleapis.com/css2?family=Inter', as: 'style' },
      ],

      // Ajouter des hints preconnect pour Google Fonts
      preloadGoogleFonts: true,

      // Précharger les bundles CSS et JS critiques par nom d'entrée
      criticalCss: ['main'],
      criticalJs: ['main'],
    }),
  ],
});
```

---

## Marquer les images dans le HTML

Ajoutez `data-preload` à toute balise `<img>` que vous souhaitez précharger :

```html
<img src="/images/hero.jpg" alt="Image hero" data-preload />
<img src="/images/logo.png" alt="Logo" class="has-dark" data-preload />
```

L'attribut peut apparaître n'importe où sur la balise, l'ordre des attributs n'a pas d'importance.

---

## Build uniquement

Le plugin ne s'exécute que lors de `vite build`. Il n'a aucun effet dans `vite dev`.
