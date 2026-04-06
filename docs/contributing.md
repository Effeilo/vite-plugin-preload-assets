# Contributing

Contributions are welcome. Whether you want to report a bug, suggest an improvement, or submit a pull request, feel free to participate.

---

## Reporting an issue

Open an issue on the GitHub repository to:

- Report a bug or unexpected behavior.
- Suggest an improvement or new feature.
- Discuss an idea before submitting a pull request.

When reporting a bug, include:

- Your Node.js version (`node -v`)
- Your Vite version (`vite --version`)
- Your `vite-plugin-preload-assets` version
- Your plugin configuration (options object)
- Which feature is affected (images, fonts, JS, CSS, Google Fonts)
- The injected HTML output if applicable
- A minimal reproduction (`vite.config.js` + sample HTML)

---

## Submitting a pull request

1. Fork the repository.
2. Create a dedicated branch:

```bash
git checkout -b my-change
```

3. Make your changes.
4. Run the test suite:

```bash
npm test
```

5. Build the plugin to verify output:

```bash
npm run build
```

6. Commit with a clear message:

```bash
git commit -m "Fix: description of the change"
```

7. Push the branch and open a pull request on GitHub.

---

## Running locally

```bash
# Install dependencies
npm install

# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Build the plugin
npm run build

# Watch mode
npm run dev
```

---

## Good practices

- Stay within the focused scope of the plugin: injecting preload and preconnect hints into HTML at build time.
- Only change what is necessary. Targeted changes are easier to review.
- Add or update tests for any behavior you modify. The test suite uses Vitest.
- Verify deduplication still works after any change to tag injection logic.
- Confirm that `apply: 'build'` is preserved, the plugin must never run in dev mode.
- Verify that attribute order on `<img>` tags does not affect `data-preload` detection.
- Confirm that `crossorigin` is always added for font preloads (`as === 'font'`).
- Consult the [changelog](../CHANGELOG.md) to understand the history of past decisions.

---

## Project structure

```
├── dist/
│   └── src/
│       ├── index.js        compiled ESM output
│       └── index.d.ts      TypeScript declarations
├── src/
│   └── index.ts            plugin source, all logic in a single file
├── tests/
│   └── index.test.ts       39 unit tests (Vitest)
├── docs/                   English documentation
├── fr/docs/                French documentation
├── tsconfig.json
└── package.json
```

---

## Acknowledgements

`vite-plugin-preload-assets` is built with:

- [TypeScript](https://www.typescriptlang.org/), typed language and compiler
- [Vite](https://vite.dev/), build tool and plugin API
- [Vitest](https://vitest.dev/), unit test framework
