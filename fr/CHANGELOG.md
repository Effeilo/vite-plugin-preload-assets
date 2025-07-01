[EN](../CHANGELOG.md) | **FR**

<div>
  <img src="https://browserux.com/assets/img/logo/logo-vite-plugin-preload-assets.png" alt="logo vite-plugin-preload-assets"/>
</div>

# 📦 Changelog

Toutes les modifications importantes de ce projet seront documentées ici.

Ce format suit les recommandations de [Keep a Changelog](https://keepachangelog.com/fr-1.0.0/)
et le projet respecte le [versionnage sémantique](https://semver.org/lang/fr/).

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
  - Préchargement d’images via l’attribut `data-preload`
  - Préchargement de polices via la configuration (`fontsToPreload`)
  - Détection dynamique des fichiers JS/CSS critiques à partir de noms d’entrée
  - Configuration dynamique par page avec `criticalJs` / `criticalCss` en fonction
  - Ajout automatique des balises `preconnect` pour Google Fonts

### 🛠️ Optimisation

- Fonctionne sans configurer `rollupOptions.input` pour les sites multipages
- N’insère que les ressources critiques nécessaires à chaque page
- Normalise le chemin HTML pour permettre une correspondance simple en config

<br>

---