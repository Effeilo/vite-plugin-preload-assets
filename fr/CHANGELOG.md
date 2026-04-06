[EN](../CHANGELOG.md) | **FR**

<div>
  <img src="https://browserux.com/img/logos/logo-browserux-preload-assets-300.png" alt="logo vite-plugin-preload-assets"/>
</div>

# 📦 Changelog

Toutes les modifications importantes de ce projet seront documentées ici.

Ce format suit les recommandations de [Keep a Changelog](https://keepachangelog.com/fr-1.0.0/)
et le projet respecte le [versionnage sémantique](https://semver.org/lang/fr/).

---

<br>

## [1.3.1] – 06-04-2026

### 🛠 Corrigé

- Ajout de `rootDir` dans `tsconfig.json` pour résoudre l'erreur TypeScript 5.x causée par l'absence de répertoire racine explicite quand `declarationDir` est défini
- Mise à jour de `moduleResolution` de la valeur dépréciée `"node"` vers `"bundler"` pour la compatibilité TypeScript 5.x

---

<br>

## [1.3.0] – 01-04-2026

### ✨ Ajout

- **Support du `srcset` :** les images avec un attribut `srcset` ont désormais toutes leurs URL candidates préchargées automatiquement
- **`fetchpriority="high"`** est maintenant injecté sur toutes les images explicitement préchargées (`data-preload` et `imagesToPreload`) pour renforcer la priorité de chargement
- **Déduplication des balises :** les hints identiques (même `rel` + `href`) sont dédupliqués, aucun doublon même si la même URL apparaît à la fois dans le HTML et dans la config
- **Tests unitaires :** 39 tests couvrant toutes les fonctionnalités via [Vitest](https://vitest.dev)

### 🛠️ Corrections

- **`crossorigin` automatique pour les polices :** conformément à la spec HTML, le préchargement de polices nécessite toujours l'attribut `crossorigin`, même pour les polices same-origin. Son absence amenait le navigateur à ignorer silencieusement le hint. L'attribut est désormais ajouté automatiquement quand `as === 'font'`. Il n'est plus nécessaire de spécifier `crossorigin: true` pour les polices locales
- **`rel="modulepreload"` pour les fichiers JS :** remplace `rel="preload" as="script"` par `rel="modulepreload"`, sémantiquement correct pour la sortie ESM de Vite et permettant le parsing du graphe de modules
- **Détection des images indépendante de l'ordre des attributs :** `data-preload` est désormais détecté quelle que soit sa position sur la balise `<img>`, il n'est plus obligatoire de le placer après `src`
- **Suppression du `crossorigin` inutile sur les CSS same-origin :** ajouter `crossorigin` sur des preloads CSS same-origin pouvait provoquer des incohérences de cache ; il est désormais omis
- **Suppression du code mort** dans la résolution `criticalCss` / `criticalJs` (branche `?.[currentPath]` jamais atteignable)
- **Suppression de la garde redondante `ctx &&`**, `ctx` est toujours défini dans `transformIndexHtml`
- **Tableau `tags` typé** en `HtmlTagDescriptor[]` au lieu de `any[]`

<br>

---

<br>

## [1.2.3] – 03-07-2025

### 🛠️ Correction

- L'attribut `type="font/woff2"` n'est ajouté que si `as === 'font'`
- Évite les avertissements du navigateur lors du preload de feuilles CSS Google Fonts avec `as: 'style'`

<br>

---

<br>

## [1.2.2] – 03-07-2025

### ✨ Ajout

- Ajout de la possibilité de surcharger l'attribut `as` dans `fontsToPreload`
  - Utile pour précharger une feuille de style Google Fonts via `as: 'style'`

<br>

---

<br>

## [1.2.0] – 01-07-2025

### ✨ Ajout

- Nouvelle option `imagesToPreload` :
  - Permet de précharger manuellement des images critiques utilisées hors de `index.html` (ex : composants React)
  - Injection automatique des balises `<link rel="preload" href="..." as="image">`

<br>

---

<br>

## [1.1.1] – 30-06-2025

### 🛠️ Amélioration

- Compatibilité avec Vite v6 (ajout de `^6.0.0` dans `peerDependencies`)

<br>

---

<br>

## [1.1.0] – 30-06-2025

### ✨ Ajout

- Prise en charge des variantes dark des images :
  - Si une image possède la classe `has-dark`, le plugin précharge automatiquement la version correspondante en `*-dark.ext`
  - Compatible avec [`browserux-theme-switcher`](https://github.com/Effeilo/browserux-theme-switcher)

<br>

---

<br>

## [1.0.0] – 29-06-2025

### ✨ Ajout

- Première version de `vite-plugin-preload-assets`
- Injection automatique des balises `<link rel="preload">` et `<link rel="preconnect">` au moment du build
- Prise en charge de :
  - Préchargement d'images via l'attribut `data-preload`
  - Préchargement de polices via la configuration (`fontsToPreload`)
  - Détection dynamique des fichiers JS/CSS critiques à partir de noms d'entrée
  - Configuration dynamique par page avec `criticalJs` / `criticalCss` en fonction
  - Ajout automatique des balises `preconnect` pour Google Fonts

### 🛠️ Optimisation

- Fonctionne sans configurer `rollupOptions.input` pour les sites multipages
- N'insère que les ressources critiques nécessaires à chaque page
- Normalise le chemin HTML pour permettre une correspondance simple en config

<br>

---
