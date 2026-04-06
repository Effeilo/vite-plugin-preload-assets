# Options

Toutes les options sont passées à la fonction du plugin. Toutes les options sont optionnelles.

```ts
type PreloadAssetsOptions = {
  imagesToPreload?: string[]
  fontsToPreload?: FontPreload[]
  criticalJs?: string[] | ((filename: string) => string[])
  criticalCss?: string[] | ((filename: string) => string[])
  preloadGoogleFonts?: boolean
}
```

---

## `imagesToPreload`

**Type :** `string[]`, **Défaut :** `undefined`

Une liste d'URLs d'images à précharger manuellement. Utilisée pour les images absentes du HTML source (ex. chargées par un composant React ou Vue à l'exécution).

Chaque URL est injectée comme :

```html
<link rel="preload" href="..." as="image" fetchpriority="high">
```

```js
preloadAssets({ imagesToPreload: ['/images/hero.jpg', '/images/avatar.png'] })
```

---

## `fontsToPreload`

**Type :** `FontPreload[]`, **Défaut :** `undefined`

Une liste de ressources de polices à précharger. Chaque entrée est un objet :

```ts
type FontPreload = {
  href: string             // URL du fichier de police (requis)
  type?: string            // Type MIME, défaut : 'font/woff2' (uniquement quand as === 'font')
  as?: 'font' | 'style'   // Défaut : 'font'
  crossorigin?: boolean    // Ajouté automatiquement quand as === 'font'
}
```

```js
preloadAssets({
  fontsToPreload: [
    { href: '/fonts/MaPolice-Regular.woff2' },
    { href: '/fonts/MaPolice-Bold.woff2', type: 'font/woff2' },
    { href: 'https://fonts.googleapis.com/css2?family=Inter', as: 'style' },
  ],
})
```

`crossorigin` est ajouté automatiquement pour les entrées `as === 'font'`, requis par la spec HTML pour que les préchargements de polices prennent effet.

---

## `preloadGoogleFonts`

**Type :** `boolean`, **Défaut :** `false`

Injecte deux hints `<link rel="preconnect">` pour les serveurs Google Fonts :

```html
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

```js
preloadAssets({ preloadGoogleFonts: true })
```

---

## `criticalCss`

**Type :** `string[] | ((filename: string) => string[])`, **Défaut :** `undefined`

Noms d'entrées à matcher contre les fichiers CSS dans le bundle de build. Chaque fichier matché reçoit une balise `<link rel="preload" as="style">`.

```js
// Forme tableau
preloadAssets({ criticalCss: ['main'] })

// Forme fonction, par page
preloadAssets({
  criticalCss: (path) => path === '/index.html' ? ['main'] : [],
})
```

Un fichier matche un nom d'entrée si son basename commence par `nomEntree-` ou `nomEntree.`.

---

## `criticalJs`

**Type :** `string[] | ((filename: string) => string[])`, **Défaut :** `undefined`

Noms d'entrées à matcher contre les fichiers JS dans le bundle de build. Chaque fichier matché reçoit une balise `<link rel="modulepreload" crossorigin>`.

```js
// Forme tableau
preloadAssets({ criticalJs: ['main'] })

// Forme fonction, par page
preloadAssets({
  criticalJs: (path) => {
    if (path === '/index.html') return ['main'];
    if (path.startsWith('/blog')) return ['main', 'blog'];
    return ['main'];
  },
})
```

`rel="modulepreload"` est utilisé (pas `rel="preload" as="script"`) parce que Vite produit de l'ESM par défaut. Il est sémantiquement correct et fonctionne toujours en mode CORS.
