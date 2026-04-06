# Images

## Attribut `data-preload`

Ajoutez `data-preload` à toute balise `<img>` de votre HTML pour la précharger automatiquement :

```html
<img src="/images/hero.jpg" alt="Hero" data-preload />
```

Injecte :

```html
<link rel="preload" href="/images/hero.jpg" as="image" fetchpriority="high">
```

L'attribut est détecté indépendamment de sa position sur la balise, il n'a pas besoin d'être après `src`.

---

## Support `srcset`

Si l'image a un attribut `srcset`, toutes les URLs candidates sont préchargées individuellement :

```html
<img
  src="/images/hero.jpg"
  srcset="/images/hero-480.jpg 480w, /images/hero-800.jpg 800w"
  data-preload
/>
```

Injecte :

```html
<link rel="preload" href="/images/hero.jpg" as="image" fetchpriority="high">
<link rel="preload" href="/images/hero-480.jpg" as="image">
<link rel="preload" href="/images/hero-800.jpg" as="image">
```

Le préchargement `src` reçoit `fetchpriority="high"`. Les candidates `srcset` n'en ont pas.

---

## Variantes mode sombre

Les images ayant la classe `has-dark` ont automatiquement leur contrepartie en mode sombre préchargée. L'URL de la variante sombre est dérivée en insérant `-dark` avant l'extension :

```html
<img src="/images/logo.png" class="has-dark" data-preload />
```

Injecte :

```html
<link rel="preload" href="/images/logo.png" as="image" fetchpriority="high">
<link rel="preload" href="/images/logo-dark.png" as="image">
```

Cette convention est compatible avec [`browserux-theme-switcher`](https://github.com/Effeilo/browserux-theme-switcher), qui échange les images en ajoutant `-dark` avant l'extension.

---

## Option de config `imagesToPreload`

Pour les images absentes de `index.html`, par exemple, des images chargées dans des composants React ou Vue, utilisez l'option `imagesToPreload` :

```js
preloadAssets({
  imagesToPreload: [
    '/images/hero.jpg',
    '/images/avatar.png',
  ],
})
```

Chaque URL est injectée comme :

```html
<link rel="preload" href="/images/hero.jpg" as="image" fetchpriority="high">
```

`fetchpriority="high"` est ajouté sur toutes les images listées manuellement.

---

## Déduplication

Si la même URL d'image apparaît à la fois dans `data-preload` (HTML) et `imagesToPreload` (config), une seule balise de préchargement est injectée.
