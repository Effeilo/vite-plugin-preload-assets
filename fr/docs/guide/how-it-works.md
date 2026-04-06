# Fonctionnement

## Cycle de vie Vite

Le plugin enregistre un seul hook Vite :

- **`transformIndexHtml`**, appelé pour chaque fichier HTML produit par le build. Reçoit la chaîne HTML et le contexte du build (incluant le bundle). Retourne le HTML original plus un tableau de descripteurs de balises à injecter.

Le plugin utilise `apply: 'build'`, il est complètement inactif lors de `vite dev`.

---

## Ordre d'injection

Toutes les balises sont injectées avec `injectTo: 'head-prepend'`, les plaçant au tout début du `<head>`. Cela garantit que le navigateur découvre les hints de préchargement le plus tôt possible lors du parsing du HTML.

L'ordre d'injection dans `<head>` suit l'ordre dans lequel le plugin traite chaque catégorie :

1. Images depuis `data-preload` (scan HTML)
2. Images depuis `imagesToPreload` (config)
3. Preconnect Google Fonts (si `preloadGoogleFonts: true`)
4. Préchargements de polices depuis `fontsToPreload`
5. CSS critiques depuis `criticalCss`
6. JS critiques depuis `criticalJs`

---

## Déduplication

Toutes les balises injectées sont suivies dans un `Set` indexé par `rel::href`. Si la même combinaison serait injectée deux fois, par exemple, une URL d'image présente à la fois dans `data-preload` et `imagesToPreload`, seule la première occurrence est conservée.

---

## Scan HTML

Le plugin scanne la chaîne HTML pour les balises `<img>` contenant l'attribut `data-preload` via une regex qui matche indépendamment de l'ordre des attributs :

```
/<img\b[^>]*\bdata-preload\b[^>]*>/gi
```

Pour chaque correspondance :
1. L'attribut `src` est extrait et préchargé avec `fetchpriority="high"`.
2. Si un attribut `srcset` est présent, chaque URL candidate est extraite et préchargée individuellement.
3. Si la balise a `class="... has-dark ..."`, la variante sombre (URL avec `-dark` avant l'extension) est également préchargée.

---

## Scan du bundle

Pour `criticalCss` et `criticalJs`, le plugin itère sur `ctx.bundle`, la map de tous les fichiers de sortie du build en cours. Il matche les fichiers avec l'utilitaire `matchesEntry()` :

- Un fichier matche un nom d'entrée si son basename commence par `nomEntree-` ou `nomEntree.`
- Exemple : l'entrée `"main"` matche `assets/main-abc123.js` et `assets/main.css`, mais pas `assets/maintenance.js`.

Cette approche fonctionne sans aucune configuration `rollupOptions.input`, le matching est fait sur les noms de fichiers réels de la sortie de build.

---

## Configuration par page

`criticalJs` et `criticalCss` peuvent être des fonctions plutôt que des tableaux. La fonction reçoit le chemin du fichier HTML courant relatif à la racine du projet (ex. `/blog/index.html`) et retourne un tableau de noms d'entrées. Cela permet à différentes pages de précharger différents bundles :

```js
criticalJs: (path) => {
  if (path === '/') return ['main'];
  if (path.startsWith('/blog')) return ['main', 'blog'];
  return ['main'];
}
```
