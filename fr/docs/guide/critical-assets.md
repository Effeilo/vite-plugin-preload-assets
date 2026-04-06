# JS et CSS critiques

## Fonctionnement du matching par entrée

Le plugin scanne le bundle de sortie Vite et matche les fichiers par nom d'entrée. Un fichier matche si son basename (sans préfixe de chemin) commence par `nomEntree-` ou `nomEntree.` :

| Nom d'entrée | Fichier | Matche ? |
|---|---|---|
| `main` | `assets/main-abc123.js` | Oui |
| `main` | `assets/main.css` | Oui |
| `main` | `assets/maintenance.js` | Non |
| `blog` | `assets/blog-xyz.js` | Oui |

Cela fonctionne sans aucune configuration `rollupOptions.input`, le matching est fait sur les noms de fichiers réels de la sortie de build.

---

## `criticalCss`

Préchargez les bundles CSS qui matchent les noms d'entrées donnés :

```js
preloadAssets({
  criticalCss: ['main'],
})
```

Injecte (pour un fichier comme `assets/main-abc123.css`) :

```html
<link rel="preload" href="/assets/main-abc123.css" as="style">
```

Aucun `crossorigin` n'est ajouté pour les préchargements CSS de même origine (l'ajouter pourrait causer des incohérences de cache).

---

## `criticalJs`

Préchargez les bundles JS qui matchent les noms d'entrées donnés :

```js
preloadAssets({
  criticalJs: ['main'],
})
```

Injecte (pour un fichier comme `assets/main-abc123.js`) :

```html
<link rel="modulepreload" href="/assets/main-abc123.js" crossorigin>
```

`rel="modulepreload"` est utilisé à la place de `rel="preload" as="script"` parce que Vite produit des modules ES par défaut. `modulepreload` est sémantiquement correct pour l'ESM : il précharge et parse le module, et fonctionne toujours en mode CORS.

---

## Plusieurs noms d'entrées

Passez plusieurs noms d'entrées pour précharger plusieurs bundles :

```js
preloadAssets({
  criticalJs: ['main', 'vendor'],
  criticalCss: ['main'],
})
```

---

## Configuration par page avec des fonctions

Pour les projets multi-pages où différentes pages ont besoin de ressources critiques différentes, passez une fonction plutôt qu'un tableau. La fonction reçoit le chemin du fichier HTML courant relatif à la racine du projet et retourne un tableau de noms d'entrées :

```js
preloadAssets({
  criticalJs: (path) => {
    if (path === '/index.html') return ['main'];
    if (path.startsWith('/blog')) return ['main', 'blog'];
    return ['main'];
  },
  criticalCss: (path) => {
    if (path === '/index.html') return ['main'];
    return ['main'];
  },
})
```

L'argument `path` est toujours une chaîne préfixée par `/` relative à `process.cwd()`, normalisée pour Windows (`\` → `/`).

---

## Combinaison avec `data-preload`

`criticalJs`, `criticalCss`, images et polices sont tous traités dans le même appel `transformIndexHtml`. Les balises de toutes les sources sont fusionnées et dédupliquées avant injection.
