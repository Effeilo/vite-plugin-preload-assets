# Contribuer

Les contributions sont les bienvenues. Que vous souhaitiez signaler un bug, suggérer une amélioration ou soumettre une pull request, n'hésitez pas à participer.

---

## Signaler un problème

Ouvrez une issue sur le dépôt GitHub pour :

- Signaler un bug ou un comportement inattendu.
- Suggérer une amélioration ou une nouvelle fonctionnalité.
- Discuter d'une idée avant de soumettre une pull request.

Lors du signalement d'un bug, précisez :

- Votre version de Node.js (`node -v`)
- Votre version de Vite (`vite --version`)
- Votre version de `vite-plugin-preload-assets`
- Votre configuration du plugin (objet d'options)
- La fonctionnalité concernée (images, polices, JS, CSS, Google Fonts)
- La sortie HTML injectée si applicable
- Une reproduction minimale (`vite.config.js` + HTML d'exemple)

---

## Soumettre une pull request

1. Forkez le dépôt.
2. Créez une branche dédiée :

```bash
git checkout -b ma-proposition
```

3. Effectuez vos modifications.
4. Exécutez la suite de tests :

```bash
npm test
```

5. Compilez le plugin pour vérifier la sortie :

```bash
npm run build
```

6. Committez avec un message clair :

```bash
git commit -m "Fix: description de la modification"
```

7. Poussez la branche et ouvrez une pull request sur GitHub.

---

## Exécuter en local

```bash
# Installer les dépendances
npm install

# Exécuter les tests unitaires
npm test

# Exécuter les tests en mode watch
npm run test:watch

# Compiler le plugin
npm run build

# Mode watch
npm run dev
```

---

## Bonnes pratiques

- Restez fidèle au périmètre focalisé du plugin : injecter des hints preload et preconnect dans le HTML lors du build.
- Ne modifiez que ce qui est nécessaire. Les changements ciblés sont plus faciles à relire.
- Ajoutez ou mettez à jour les tests pour tout comportement que vous modifiez. La suite de tests utilise Vitest.
- Vérifiez que la déduplication fonctionne toujours après tout changement de la logique d'injection des balises.
- Confirmez que `apply: 'build'` est préservé, le plugin ne doit jamais s'exécuter en mode dev.
- Vérifiez que l'ordre des attributs sur les balises `<img>` n'affecte pas la détection de `data-preload`.
- Confirmez que `crossorigin` est toujours ajouté pour les préchargements de polices (`as === 'font'`).
- Consultez le [changelog](../../CHANGELOG.md) pour comprendre l'historique des décisions.

---

## Structure du projet

```
├── dist/
│   └── src/
│       ├── index.js        sortie ESM compilée
│       └── index.d.ts      déclarations TypeScript
├── src/
│   └── index.ts            source du plugin, toute la logique dans un seul fichier
├── tests/
│   └── index.test.ts       39 tests unitaires (Vitest)
├── docs/                   documentation en anglais
├── fr/docs/                documentation en français
├── tsconfig.json
└── package.json
```

---

## Remerciements

`vite-plugin-preload-assets` est construit avec :

- [TypeScript](https://www.typescriptlang.org/), langage typé et compilateur
- [Vite](https://vite.dev/), outil de build et API plugin
- [Vitest](https://vitest.dev/), framework de tests unitaires
