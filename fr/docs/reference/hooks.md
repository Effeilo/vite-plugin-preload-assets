# Hooks

`vite-plugin-preload-assets` utilise un seul hook du plugin Vite.

---

## `transformIndexHtml`

**Hook Vite :** [`transformIndexHtml`](https://vite.dev/guide/api-plugin.html#transformindexhtml)

Appelé pour chaque fichier HTML lors du build. Le plugin reçoit la chaîne HTML complète et l'objet contexte du build (`ctx`), qui inclut `ctx.bundle` (la map de tous les fichiers de sortie) et `ctx.filename` (le chemin absolu du fichier HTML courant).

Le hook retourne le HTML original inchangé, plus un tableau d'objets `HtmlTagDescriptor` représentant les balises à injecter.

### Ordre d'exécution

Pour chaque fichier HTML :

1. Scanner le HTML pour les balises `<img data-preload>`, extraire `src`, `srcset` et la classe `has-dark`.
2. Traiter `imagesToPreload` depuis la config.
3. Injecter le preconnect Google Fonts si `preloadGoogleFonts: true`.
4. Traiter `fontsToPreload` depuis la config.
5. Scanner `ctx.bundle` pour les fichiers CSS matchant les noms d'entrées `criticalCss`.
6. Scanner `ctx.bundle` pour les fichiers JS matchant les noms d'entrées `criticalJs`.

Toutes les balises sont collectées dans un tableau unique, dédupliquées par `rel::href`, puis retournées à Vite pour injection dans `<head>`.

### `apply: 'build'`

Le plugin est enregistré avec `apply: 'build'`, ce qui indique à Vite de ne charger ce plugin que lors des builds de production. Le hook n'est jamais appelé lors de `vite dev`.
