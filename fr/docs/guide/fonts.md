# Polices

## `fontsToPreload`

Préchargez des fichiers de polices locaux ou distants en les listant dans `fontsToPreload` :

```js
preloadAssets({
  fontsToPreload: [
    { href: '/fonts/MaPolice-Regular.woff2' },
    { href: '/fonts/MaPolice-Bold.woff2' },
  ],
})
```

Injecte :

```html
<link rel="preload" href="/fonts/MaPolice-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/MaPolice-Bold.woff2" as="font" type="font/woff2" crossorigin>
```

---

## `crossorigin`, automatique et requis

Selon la spec HTML, les préchargements de polices **nécessitent toujours l'attribut `crossorigin`**, même pour les polices de même origine. Sans lui, le navigateur ignore silencieusement le hint de préchargement et récupère la police à nouveau quand elle est effectivement nécessaire.

Le plugin ajoute `crossorigin` automatiquement pour toutes les entrées où `as === 'font'`, vous n'avez pas besoin de le spécifier.

---

## Attribut `type`

Le type MIME par défaut pour les préchargements de polices est `font/woff2`. Si vous devez précharger un format différent, spécifiez-le explicitement :

```js
fontsToPreload: [
  { href: '/fonts/MaPolice.woff', type: 'font/woff' },
  { href: '/fonts/MaPolice.ttf', type: 'font/ttf' },
]
```

L'attribut `type` n'est injecté que quand `as === 'font'`. Il est omis pour les autres valeurs `as`.

---

## Override de `as`

Le champ `as` vaut `'font'` par défaut. Surchargez-le pour précharger d'autres types de ressources depuis la liste des polices, par exemple, une feuille de style Google Fonts CSS :

```js
fontsToPreload: [
  // Précharger une feuille de style Google Fonts comme CSS
  {
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap',
    as: 'style',
  },
]
```

Quand `as !== 'font'` :
- Aucun attribut `type` n'est ajouté.
- `crossorigin` n'est ajouté que s'il est explicitement défini à `true`.

---

## Preconnect Google Fonts

Activez la connexion anticipée aux serveurs Google Fonts avec `preloadGoogleFonts` :

```js
preloadAssets({
  preloadGoogleFonts: true,
})
```

Injecte deux hints preconnect :

```html
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

Ces hints indiquent au navigateur d'effectuer la résolution DNS, la connexion TCP et la négociation TLS pour les serveurs de polices de Google avant toute requête de police. Utilisez-les dès que vous chargez des polices depuis Google Fonts.
