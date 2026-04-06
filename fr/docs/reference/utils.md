# Utilitaires

`vite-plugin-preload-assets` exporte deux fonctions utilitaires utilisées en interne par le plugin. Elles sont disponibles pour un usage externe si nécessaire.

---

## `matchesEntry()`

**Fichier :** `src/index.ts`

Vérifie si un nom de fichier de bundle correspond à un nom d'entrée donné.

### Signature

```ts
function matchesEntry(fileName: string, entryName: string): boolean
```

### Règles de matching

- Le préfixe de chemin (ex. `assets/`) est supprimé.
- Le basename doit commencer par `nomEntree-` ou `nomEntree.`

### Exemples

```js
import { matchesEntry } from 'vite-plugin-preload-assets';

matchesEntry('assets/main-abc123.js', 'main')   // → true
matchesEntry('assets/main.css', 'main')          // → true
matchesEntry('assets/maintenance.js', 'main')    // → false
matchesEntry('assets/blog-xyz.js', 'blog')       // → true
```

---

## `getRelativeHtmlPath()`

**Fichier :** `src/index.ts`

Convertit le chemin absolu d'un fichier HTML en une chaîne de chemin relatif au projet, normalisée pour Windows (barres obliques inversées remplacées par des barres obliques).

### Signature

```ts
function getRelativeHtmlPath(filename: string): string
```

### Exemples

```js
import { getRelativeHtmlPath } from 'vite-plugin-preload-assets';

// Sur un projet à /home/user/monapp :
getRelativeHtmlPath('/home/user/monapp/dist/index.html')      // → '/dist/index.html'
getRelativeHtmlPath('/home/user/monapp/dist/blog/index.html') // → '/dist/blog/index.html'
```

C'est la valeur passée à la forme fonction de `criticalJs` et `criticalCss`.
