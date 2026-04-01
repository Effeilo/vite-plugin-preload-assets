/**
 * vite-plugin-preload-assets
 *
 * This Vite plugin improves performance by automatically injecting
 * <link rel="preload"> and <link rel="preconnect"> tags into the HTML during the build.
 *
 * Its goal is to help the browser prioritize loading of critical assets such as:
 * - Fonts (from local files or Google Fonts)
 * - Images marked with `data-preload` (supports srcset and dark mode variants)
 * - Entry JS and CSS files essential for initial rendering
 *
 * Features:
 * - Scans the HTML for <img> tags with `data-preload` regardless of attribute order
 * - Supports srcset: preloads all candidate URLs declared in the attribute
 * - Supports dark mode image variants (e.g. logo.png → logo-dark.png)
 * - Supports manual font preload via config (crossorigin added automatically per spec)
 * - Adds preconnect hints for Google Fonts if enabled
 * - Detects critical JS/CSS output files by matching entry names (e.g., "main")
 * - Uses rel="modulepreload" for JS bundles (Vite outputs ESM by default)
 * - Deduplicates injected tags to avoid redundant hints
 * - Adds fetchpriority="high" on explicitly preloaded images
 *
 * Note: This plugin only runs during `vite build` (apply: 'build').
 * Preload tags are not injected in development mode.
 *
 * All tags are injected into the <head> using Vite's transformIndexHtml hook.
 */

import { Plugin, HtmlTagDescriptor } from 'vite'
import { relative } from 'path'

/**
 * Defines a font resource to preload.
 */
type FontPreload = {
  href: string      // URL of the font file (relative or absolute)
  type?: string     // MIME type of the font (default: 'font/woff2')
  as?: 'font' | 'style'
  crossorigin?: boolean
}

/**
 * Configuration options for the preloadAssetsPlugin.
 */
type PreloadAssetsOptions = {
  imagesToPreload?: string[]
  fontsToPreload?: FontPreload[]
  criticalJs?: string[] | ((filename: string) => string[])
  criticalCss?: string[] | ((filename: string) => string[])
  preloadGoogleFonts?: boolean
}

/**
 * Checks whether a given bundle file matches a critical entry name.
 *
 * Matching logic:
 * - Strip the path prefix (e.g. "assets/")
 * - Match if the filename starts with: "entryName-" or "entryName."
 *
 * Examples:
 * - entryName="main", fileName="assets/main-abc123.js" → true
 * - entryName="main", fileName="assets/main.css"       → true
 * - entryName="main", fileName="assets/maintenance.js" → false
 */
export function matchesEntry(fileName: string, entryName: string): boolean {
  const base = fileName.split('/').pop() || ''
  return base.startsWith(entryName + '-') || base.startsWith(entryName + '.')
}

/**
 * Converts an absolute HTML path to a project-relative one (e.g. '/blog/index.html').
 * Normalizes backslashes for Windows compatibility.
 */
export function getRelativeHtmlPath(filename: string): string {
  return '/' + relative(process.cwd(), filename).replace(/\\/g, '/')
}

/**
 * Vite plugin to automatically inject <link rel="preload"> and <link rel="preconnect">
 * for critical resources: JS (modulepreload), CSS, fonts, and images (with srcset and dark mode).
 */
export default function preloadAssetsPlugin(options: PreloadAssetsOptions = {}): Plugin {
  return {
    name: 'vite-plugin-preload-assets',
    apply: 'build',

    transformIndexHtml(html, ctx) {
      const tags: HtmlTagDescriptor[] = []

      // Deduplication: skip tags with the same rel + href combination
      const seen = new Set<string>()

      function addTag(tag: HtmlTagDescriptor): void {
        const key = `${tag.attrs?.rel}::${tag.attrs?.href}`
        if (seen.has(key)) return
        seen.add(key)
        tags.push(tag)
      }

      // ─── 1a. Images with data-preload ────────────────────────────────────────
      //
      // Regex matches <img> tags containing the data-preload attribute,
      // regardless of attribute order (src can come before or after data-preload).
      const imgRegex = /<img\b[^>]*\bdata-preload\b[^>]*>/gi
      let match: RegExpExecArray | null

      while ((match = imgRegex.exec(html)) !== null) {
        const imgTag = match[0]

        // Extract the src attribute value
        const srcMatch = /\bsrc="([^"]+)"/.exec(imgTag)
        if (!srcMatch) continue
        const src = srcMatch[1]

        // fetchpriority="high" reinforces the preload priority signal
        addTag({
          tag: 'link',
          injectTo: 'head-prepend',
          attrs: { rel: 'preload', href: src, as: 'image', fetchpriority: 'high' }
        })

        // srcset support: preload all candidate URLs
        const srcsetMatch = /\bsrcset="([^"]+)"/.exec(imgTag)
        if (srcsetMatch) {
          const urls = srcsetMatch[1]
            .split(',')
            .map(entry => entry.trim().split(/\s+/)[0])
            .filter(Boolean)
          for (const url of urls) {
            addTag({
              tag: 'link',
              injectTo: 'head-prepend',
              attrs: { rel: 'preload', href: url, as: 'image' }
            })
          }
        }

        // Dark mode variant (browserux-theme-switcher convention)
        // e.g. logo.png → logo-dark.png
        const hasDarkClass = /\bclass="[^"]*\bhas-dark\b[^"]*"/.test(imgTag)
        if (hasDarkClass) {
          const darkSrc = src.replace(/(\.[\w]+)$/, '-dark$1')
          addTag({
            tag: 'link',
            injectTo: 'head-prepend',
            attrs: { rel: 'preload', href: darkSrc, as: 'image' }
          })
        }
      }

      // ─── 1b. Images declared manually in config ───────────────────────────────
      if (options.imagesToPreload?.length) {
        for (const imageUrl of options.imagesToPreload) {
          addTag({
            tag: 'link',
            injectTo: 'head-prepend',
            attrs: { rel: 'preload', href: imageUrl, as: 'image', fetchpriority: 'high' }
          })
        }
      }

      // ─── 2. Google Fonts preconnect ───────────────────────────────────────────
      if (options.preloadGoogleFonts) {
        addTag({
          tag: 'link',
          injectTo: 'head-prepend',
          attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: '' }
        })
        addTag({
          tag: 'link',
          injectTo: 'head-prepend',
          attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
        })
      }

      // ─── 3. Font preloads ─────────────────────────────────────────────────────
      //
      // Per the HTML spec, font preloads ALWAYS require the crossorigin attribute
      // to work correctly, even for same-origin fonts. Omitting it causes the
      // browser to silently ignore the preload hint.
      if (options.fontsToPreload) {
        for (const font of options.fontsToPreload) {
          const as = font.as || 'font'
          const needsCrossOrigin = as === 'font' || !!font.crossorigin

          addTag({
            tag: 'link',
            injectTo: 'head-prepend',
            attrs: {
              rel: 'preload',
              href: font.href,
              as,
              // type attribute is only valid (and useful) when as="font"
              ...(as === 'font' ? { type: font.type || 'font/woff2' } : {}),
              ...(needsCrossOrigin ? { crossorigin: '' } : {})
            }
          })
        }
      }

      const currentPath = getRelativeHtmlPath(ctx.filename)

      // ─── 4. Critical CSS ──────────────────────────────────────────────────────
      if (ctx.bundle) {
        const cssEntries =
          typeof options.criticalCss === 'function'
            ? options.criticalCss(currentPath)
            : options.criticalCss ?? []

        for (const entryName of cssEntries) {
          for (const [fileName] of Object.entries(ctx.bundle)) {
            if (fileName.endsWith('.css') && matchesEntry(fileName, entryName)) {
              addTag({
                tag: 'link',
                injectTo: 'head-prepend',
                attrs: { rel: 'preload', href: '/' + fileName, as: 'style' }
              })
            }
          }
        }
      }

      // ─── 5. Critical JS ───────────────────────────────────────────────────────
      //
      // Vite outputs ES modules by default. rel="modulepreload" is semantically
      // correct for ESM: it both preloads and parses the module, and always
      // operates in CORS mode (crossorigin required).
      if (ctx.bundle) {
        const jsEntries =
          typeof options.criticalJs === 'function'
            ? options.criticalJs(currentPath)
            : options.criticalJs ?? []

        for (const entryName of jsEntries) {
          for (const [fileName] of Object.entries(ctx.bundle)) {
            if (fileName.endsWith('.js') && matchesEntry(fileName, entryName)) {
              addTag({
                tag: 'link',
                injectTo: 'head-prepend',
                attrs: { rel: 'modulepreload', href: '/' + fileName, crossorigin: '' }
              })
            }
          }
        }
      }

      return { html, tags }
    }
  }
}
