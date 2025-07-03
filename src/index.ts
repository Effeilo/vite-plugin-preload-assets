/**
 * vite-plugin-preload-assets
 *
 * This Vite plugin improves performance by automatically injecting
 * <link rel="preload"> and <link rel="preconnect"> tags into the HTML during the build.
 *
 * Its goal is to help the browser prioritize loading of critical assets such as:
 * - Fonts (from local files or Google Fonts)
 * - Images marked with `data-preload`
 * - Entry JS and CSS files essential for initial rendering
 *
 * Features:
 * - Scans the HTML for <img> tags with `data-preload` and adds preload links
 * - Supports manual font preload via config
 * - Adds preconnect hints for Google Fonts if enabled
 * - Detects critical JS/CSS output files by matching entry names (e.g., "main")
 *
 * All tags are injected into the <head> using Vite's transformIndexHtml hook.
 *
 * Usage:
 * Add the plugin in your vite.config.ts/js/mjs with appropriate options.
 */

import { Plugin } from 'vite'
import { relative } from 'path'

/**
 * Defines a font resource to preload.
 */

type FontPreload = {
  href: string // URL of the font file (relative or absolute)
  type?: string // MIME type of the font (default: 'font/woff2')
  as?: 'font' | 'style'
  crossorigin?: boolean // Whether to add the crossorigin attribute
}

/**
 * Configuration options for the autoPreloadPlugin.
 */

type PreloadAssetsOptions = {
  imagesToPreload?: string[]
  fontsToPreload?: FontPreload[] // List of fonts to preload
  criticalJs?: string[] | ((filename: string) => string[]) // Entry names of critical JS files (without hash)
  criticalCss?: string[] | ((filename: string) => string[]) // Entry names of critical CSS files (without hash)
  preloadGoogleFonts?: boolean // Injects <link rel="preconnect"> for Google Fonts domains
}

/**
 * Checks whether a given bundle file matches a critical entry name.
 *
 * This helps detect hashed output files like:
 * - entryName = "main"
 * - fileName = "assets/main-abc123.js" → ✅ match
 *
 * Matching logic:
 * - Strip the path prefix (e.g. "assets/")
 * - Match if the filename starts with: "entryName-" or "entryName."
 */

function matchesEntry(fileName: string, entryName: string) {
   // Extract the file name without any directory path (e.g., "main-abc123.css")
  const base = fileName.split('/').pop() || ''

   // Check if the base starts with "entryName-" or "entryName."
  return base.startsWith(entryName + '-') || base.startsWith(entryName + '.')
}

/**
 * Converts an absolute HTML path to a project-relative one (e.g. '/blog/index.html')
 */

function getRelativeHtmlPath(filename: string): string {
  return '/' + relative(process.cwd(), filename).replace(/\\/g, '/')
}

/**
 * Vite plugin to automatically inject <link rel="preload"> and <link rel="preconnect">
 * for critical resources: JS, CSS, fonts, and images (including dark mode variants).
 */

export default function preloadAssetsPlugin(options: PreloadAssetsOptions = {}): Plugin {
  return {

    /**
     * Runs during the HTML transformation phase in Vite's build process.
     * Injects preload/preconnect tags into the <head> of index.html.
     */

    name: 'vite-plugin-preload-assets',
    apply: 'build',

    transformIndexHtml(html, ctx) {
      const tags: any[] = []
      let match: RegExpExecArray | null

      // 1a. Preload images with data-preload, and optionally dark variant (if has-dark class is present)
      const imgRegex = /<img[^>]*src="([^"]+)"[^>]*data-preload[^>]*>/g
      while ((match = imgRegex.exec(html)) !== null) {
        const src = match[1]

        // Preload the base image
        tags.push({
          tag: 'link',
          injectTo: 'head-prepend',
          attrs: {
            rel: 'preload',
            href: src,
            as: 'image'
          }
        })

        // If image has class "has-dark", preload the dark version as well
        const hasDarkClass = /class="[^"]*\bhas-dark\b[^"]*"/.test(match[0])

        if (hasDarkClass) {
          // e.g. logo.png → logo-dark.png
          const darkSrc = src.replace(/(\.[\w]+)$/, '-dark$1')

          tags.push({
            tag: 'link',
            injectTo: 'head-prepend',
            attrs: {
              rel: 'preload',
              href: darkSrc,
              as: 'image'
            }
          })
        }
      }

      // 1b. Images declared manually in config (imagesToPreload)
      if (options.imagesToPreload?.length) {
        for (const imageUrl of options.imagesToPreload) {
          tags.push({
            tag: 'link',
            injectTo: 'head-prepend',
            attrs: {
              rel: 'preload',
              href: imageUrl,
              as: 'image'
            }
          })
        }
      }  

      // 2. Inject <link rel="preconnect"> for Google Fonts if enabled
      if (options.preloadGoogleFonts) {
        tags.push(
          {
            tag: 'link',
            injectTo: 'head-prepend',
            attrs: {
              rel: 'preconnect',
              href: 'https://fonts.googleapis.com',
              crossorigin: ''
            }
          },
          {
            tag: 'link',
            injectTo: 'head-prepend',
            attrs: {
              rel: 'preconnect',
              href: 'https://fonts.gstatic.com',
              crossorigin: ''
            }
          }
        )
      }

      // 3. Preload fonts manually defined in config  
      if (options.fontsToPreload) {
        for (const font of options.fontsToPreload) {
          const as = font.as || 'font'

          tags.push({
            tag: 'link',
            injectTo: 'head-prepend',
            attrs: {
              rel: 'preload',
              href: font.href,
              as,
              ...(as === 'font' ? { type: font.type || 'font/woff2' } : {}),
              ...(font.crossorigin ? { crossorigin: '' } : {})
            }
          })
        }
      }

      // Normalize current page path
      const currentPath = getRelativeHtmlPath(ctx.filename)

      // 4. Preload critical CSS files from bundle based on entry name match
      if (ctx && ctx.bundle) {
        const cssEntries =
          typeof options.criticalCss === 'function'
            ? options.criticalCss(currentPath)
            : Array.isArray(options.criticalCss)
              ? options.criticalCss
              : options.criticalCss?.[currentPath] || []

        for (const entryName of cssEntries) {
          for (const [fileName] of Object.entries(ctx.bundle)) {
            if (fileName.endsWith('.css') && matchesEntry(fileName, entryName)) {
              tags.push({
                tag: 'link',
                injectTo: 'head-prepend',
                attrs: {
                  rel: 'preload',
                  href: '/' + fileName,
                  as: 'style',
                  crossorigin: ''
                }
              })
            }
          }
        }
      }

      // 5. Preload critical JS files from bundle based on entry name match
      if (ctx && ctx.bundle) {
        const jsEntries =
          typeof options.criticalJs === 'function'
            ? options.criticalJs(currentPath)
            : Array.isArray(options.criticalJs)
              ? options.criticalJs
              : options.criticalJs?.[currentPath] || []

        for (const entryName of jsEntries) {
          for (const [fileName] of Object.entries(ctx.bundle)) {
            if (fileName.endsWith('.js') && matchesEntry(fileName, entryName)) {
              tags.push({
                tag: 'link',
                injectTo: 'head-prepend',
                attrs: {
                  rel: 'preload',
                  href: '/' + fileName,
                  as: 'script',
                  crossorigin: ''
                }
              })
            }
          }
        }
      }

      // Return final HTML and list of tags to inject into <head>
      return { html, tags }
    }
  }
}
