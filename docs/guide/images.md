# Images

## `data-preload` attribute

Add `data-preload` to any `<img>` tag in your HTML to have it preloaded automatically:

```html
<img src="/images/hero.jpg" alt="Hero" data-preload />
```

This injects:

```html
<link rel="preload" href="/images/hero.jpg" as="image" fetchpriority="high">
```

The attribute is detected regardless of its position on the tag, it does not need to come after `src`.

---

## `srcset` support

If the image has a `srcset` attribute, all candidate URLs are preloaded individually:

```html
<img
  src="/images/hero.jpg"
  srcset="/images/hero-480.jpg 480w, /images/hero-800.jpg 800w"
  data-preload
/>
```

This injects:

```html
<link rel="preload" href="/images/hero.jpg" as="image" fetchpriority="high">
<link rel="preload" href="/images/hero-480.jpg" as="image">
<link rel="preload" href="/images/hero-800.jpg" as="image">
```

The `src` preload gets `fetchpriority="high"`. The `srcset` candidates do not.

---

## Dark mode variants

Images that have the class `has-dark` automatically get their dark mode counterpart preloaded. The dark variant URL is derived by inserting `-dark` before the file extension:

```html
<img src="/images/logo.png" class="has-dark" data-preload />
```

This injects:

```html
<link rel="preload" href="/images/logo.png" as="image" fetchpriority="high">
<link rel="preload" href="/images/logo-dark.png" as="image">
```

This convention is compatible with [`browserux-theme-switcher`](https://github.com/Effeilo/browserux-theme-switcher), which swaps images by appending `-dark` before the extension.

---

## `imagesToPreload` config option

For images not present in `index.html`, for example, images loaded inside React or Vue components, use the `imagesToPreload` config option:

```js
preloadAssets({
  imagesToPreload: [
    '/images/hero.jpg',
    '/images/avatar.png',
  ],
})
```

Each URL is injected as:

```html
<link rel="preload" href="/images/hero.jpg" as="image" fetchpriority="high">
```

`fetchpriority="high"` is added to all manually listed images.

---

## Deduplication

If the same image URL appears in both `data-preload` (HTML) and `imagesToPreload` (config), only one preload tag is injected.
