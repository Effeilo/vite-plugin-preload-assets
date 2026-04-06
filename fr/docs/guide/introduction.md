# Introduction

## Ce que fait le plugin

`vite-plugin-preload-assets` injecte des hints de ressources dans le `<head>` de chaque fichier HTML produit par Vite. Il s'exécute uniquement lors du build, rien ne change en mode développement.

Le plugin gère cinq catégories de ressources :

| Catégorie | Balise injectée | Comment découvert |
|---|---|---|
| Images avec `data-preload` | `<link rel="preload" as="image">` | Scan HTML par regex |
| Images listées en config | `<link rel="preload" as="image">` | Option `imagesToPreload` |
| Google Fonts | `<link rel="preconnect">` ×2 | `preloadGoogleFonts: true` |
| Polices locales/distantes | `<link rel="preload" as="font">` | Option `fontsToPreload` |
| Bundles CSS critiques | `<link rel="preload" as="style">` | `criticalCss` + scan du bundle |
| Bundles JS critiques | `<link rel="modulepreload">` | `criticalJs` + scan du bundle |

Toutes les balises injectées sont dédupliquées, la même combinaison `rel` + `href` n'est jamais injectée deux fois.

---

## Quand l'utiliser

- Vous avez des images above-the-fold découvertes tardivement (dans du CSS ou du JS) et souhaitez les précharger.
- Vous utilisez des polices personnalisées et voulez éliminer le flash de police (FOUT/FOIT).
- Vous utilisez Google Fonts et voulez des hints `preconnect` pour accélérer la négociation DNS/TLS.
- Vous souhaitez que le navigateur commence à récupérer vos bundles JS/CSS principaux avant que le parser n'atteigne les balises `<script>`.

---

## Ce qu'il ne fait pas

- Il ne s'exécute pas en mode développement (`apply: 'build'` uniquement).
- Il ne génère pas de manifeste de ressources ni n'analyse les tailles des bundles.
- Il n'injecte pas de balises pour toutes les ressources, uniquement celles que vous configurez explicitement ou marquez avec `data-preload`.

---

## Fonctionnalités

- Scanne le HTML pour les balises `<img data-preload>` indépendamment de l'ordre des attributs
- Support `srcset`, toutes les URLs candidates dans l'attribut sont préchargées
- Variantes d'images en mode sombre, les images avec la classe `has-dark` ont leur contrepartie `*-dark.ext` préchargée
- `fetchpriority="high"` sur toutes les images préchargées
- Liste d'images manuelle via `imagesToPreload`
- Préchargement de polices avec `crossorigin` automatique (requis par la spec HTML)
- Override `as` pour les entrées de polices (ex. `as: 'style'` pour les CSS Google Fonts)
- `preconnect` Google Fonts pour `fonts.googleapis.com` et `fonts.gstatic.com`
- Préchargement CSS critique matché par nom d'entrée depuis le bundle Vite
- JS critique avec `rel="modulepreload"` (correct pour la sortie ESM de Vite)
- Configuration dynamique par page via fonctions pour `criticalJs` et `criticalCss`
- Déduplication des balises depuis toutes les sources d'injection
- 39 tests unitaires via Vitest
- ESM natif, TypeScript, déclarations de types incluses
- Aucune dépendance à l'exécution
