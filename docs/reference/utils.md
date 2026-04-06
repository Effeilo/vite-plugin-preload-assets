# Utilities

`vite-plugin-preload-assets` exports two utility functions used internally by the plugin. They are available for external use if needed.

---

## `matchesEntry()`

**File:** `src/index.ts`

Checks whether a bundle output filename matches a given entry name.

### Signature

```ts
function matchesEntry(fileName: string, entryName: string): boolean
```

### Matching rules

- The path prefix (e.g. `assets/`) is stripped.
- The basename must start with `entryName-` or `entryName.`

### Examples

```js
import { matchesEntry } from 'vite-plugin-preload-assets';

matchesEntry('assets/main-abc123.js', 'main')   // → true
matchesEntry('assets/main.css', 'main')          // → true
matchesEntry('assets/maintenance.js', 'main')    // → false
matchesEntry('assets/blog-xyz.js', 'blog')       // → true
```

---

## `getRelativeHtmlPath()`

**File:** `src/index.ts`

Converts the absolute path of an HTML file to a project-relative path string, normalized for Windows (backslashes replaced with forward slashes).

### Signature

```ts
function getRelativeHtmlPath(filename: string): string
```

### Examples

```js
import { getRelativeHtmlPath } from 'vite-plugin-preload-assets';

// On a project at /home/user/myapp:
getRelativeHtmlPath('/home/user/myapp/dist/index.html')      // → '/dist/index.html'
getRelativeHtmlPath('/home/user/myapp/dist/blog/index.html') // → '/dist/blog/index.html'
```

This is the value passed to the function form of `criticalJs` and `criticalCss`.
