import { describe, it, expect } from 'vitest'
import preloadAssetsPlugin, { matchesEntry, getRelativeHtmlPath } from '../src/index'
import type { Plugin } from 'vite'
import { join } from 'path'

// ─── Helpers ─────────────────────────────────────────────────────────────────

type TransformResult = { html: string; tags: any[] }

function invokeTransform(
  plugin: Plugin,
  html: string,
  filename = join(process.cwd(), 'index.html'),
  bundle: Record<string, any> = {}
): TransformResult {
  const hook = plugin.transformIndexHtml as (html: string, ctx: any) => TransformResult
  return hook(html, { filename, bundle })
}

function tagsOf(result: TransformResult) {
  return result.tags
}

// ─── matchesEntry ─────────────────────────────────────────────────────────────

describe('matchesEntry', () => {
  it('matches hashed filename with dash separator', () => {
    expect(matchesEntry('assets/main-abc123.js', 'main')).toBe(true)
  })

  it('matches filename with dot separator (no hash)', () => {
    expect(matchesEntry('assets/main.css', 'main')).toBe(true)
  })

  it('does not match partial entry name', () => {
    expect(matchesEntry('assets/maintenance.js', 'main')).toBe(false)
  })

  it('ignores directory prefix', () => {
    expect(matchesEntry('deep/nested/app-xyz.js', 'app')).toBe(true)
  })

  it('does not match unrelated file', () => {
    expect(matchesEntry('assets/vendor-abc.js', 'main')).toBe(false)
  })
})

// ─── getRelativeHtmlPath ──────────────────────────────────────────────────────

describe('getRelativeHtmlPath', () => {
  it('returns a path starting with /', () => {
    const result = getRelativeHtmlPath(join(process.cwd(), 'index.html'))
    expect(result).toBe('/index.html')
  })

  it('handles nested paths', () => {
    const result = getRelativeHtmlPath(join(process.cwd(), 'src', 'pages', 'blog', 'index.html'))
    expect(result).toBe('/src/pages/blog/index.html')
  })

  it('uses forward slashes on all platforms', () => {
    const result = getRelativeHtmlPath(join(process.cwd(), 'src', 'pages', 'index.html'))
    expect(result).not.toContain('\\')
  })
})

// ─── Image preloading, data-preload ─────────────────────────────────────────

describe('image preloading via data-preload', () => {
  const plugin = preloadAssetsPlugin()

  it('preloads an image with data-preload', () => {
    const html = '<img src="/img/logo.png" data-preload alt="Logo">'
    const tags = tagsOf(invokeTransform(plugin, html))
    expect(tags).toContainEqual(expect.objectContaining({
      attrs: expect.objectContaining({ rel: 'preload', href: '/img/logo.png', as: 'image' })
    }))
  })

  it('works when data-preload comes before src', () => {
    const html = '<img data-preload src="/img/hero.jpg" alt="Hero">'
    const tags = tagsOf(invokeTransform(plugin, html))
    expect(tags).toContainEqual(expect.objectContaining({
      attrs: expect.objectContaining({ href: '/img/hero.jpg' })
    }))
  })

  it('adds fetchpriority="high" on preloaded images', () => {
    const html = '<img src="/img/logo.png" data-preload>'
    const tags = tagsOf(invokeTransform(plugin, html))
    expect(tags[0].attrs.fetchpriority).toBe('high')
  })

  it('preloads dark variant when has-dark class is present', () => {
    const html = '<img src="/img/logo.png" class="has-dark" data-preload>'
    const tags = tagsOf(invokeTransform(plugin, html))
    const hrefs = tags.map((t: any) => t.attrs.href)
    expect(hrefs).toContain('/img/logo.png')
    expect(hrefs).toContain('/img/logo-dark.png')
  })

  it('does not preload dark variant without has-dark class', () => {
    const html = '<img src="/img/logo.png" class="logo" data-preload>'
    const tags = tagsOf(invokeTransform(plugin, html))
    const hrefs = tags.map((t: any) => t.attrs.href)
    expect(hrefs).not.toContain('/img/logo-dark.png')
  })

  it('deduplicates identical images', () => {
    const html = `
      <img src="/img/logo.png" data-preload>
      <img src="/img/logo.png" data-preload>
    `
    const tags = tagsOf(invokeTransform(plugin, html))
    const logoTags = tags.filter((t: any) => t.attrs.href === '/img/logo.png')
    expect(logoTags).toHaveLength(1)
  })

  it('preloads nothing when no data-preload attribute', () => {
    const html = '<img src="/img/logo.png" alt="Logo">'
    const tags = tagsOf(invokeTransform(plugin, html))
    expect(tags).toHaveLength(0)
  })
})

// ─── srcset support ───────────────────────────────────────────────────────────

describe('srcset support', () => {
  const plugin = preloadAssetsPlugin()

  it('preloads all srcset candidates', () => {
    const html = '<img src="/img/hero.jpg" srcset="/img/hero-400.jpg 400w, /img/hero-800.jpg 800w" data-preload>'
    const tags = tagsOf(invokeTransform(plugin, html))
    const hrefs = tags.map((t: any) => t.attrs.href)
    expect(hrefs).toContain('/img/hero-400.jpg')
    expect(hrefs).toContain('/img/hero-800.jpg')
  })

  it('handles srcset with pixel density descriptors', () => {
    const html = '<img src="/img/logo.png" srcset="/img/logo@2x.png 2x" data-preload>'
    const tags = tagsOf(invokeTransform(plugin, html))
    const hrefs = tags.map((t: any) => t.attrs.href)
    expect(hrefs).toContain('/img/logo@2x.png')
  })

  it('deduplicates srcset URL also in src', () => {
    const html = '<img src="/img/hero.jpg" srcset="/img/hero.jpg 1x, /img/hero@2x.jpg 2x" data-preload>'
    const tags = tagsOf(invokeTransform(plugin, html))
    const heroTags = tags.filter((t: any) => t.attrs.href === '/img/hero.jpg')
    expect(heroTags).toHaveLength(1)
  })
})

// ─── imagesToPreload ──────────────────────────────────────────────────────────

describe('imagesToPreload option', () => {
  it('preloads manually listed images', () => {
    const plugin = preloadAssetsPlugin({ imagesToPreload: ['/img/bg.jpg', '/img/banner.png'] })
    const tags = tagsOf(invokeTransform(plugin, ''))
    const hrefs = tags.map((t: any) => t.attrs.href)
    expect(hrefs).toContain('/img/bg.jpg')
    expect(hrefs).toContain('/img/banner.png')
  })

  it('adds fetchpriority="high" on manual images', () => {
    const plugin = preloadAssetsPlugin({ imagesToPreload: ['/img/bg.jpg'] })
    const tags = tagsOf(invokeTransform(plugin, ''))
    expect(tags[0].attrs.fetchpriority).toBe('high')
  })

  it('deduplicates with data-preload images', () => {
    const plugin = preloadAssetsPlugin({ imagesToPreload: ['/img/logo.png'] })
    const html = '<img src="/img/logo.png" data-preload>'
    const tags = tagsOf(invokeTransform(plugin, html))
    const logoTags = tags.filter((t: any) => t.attrs.href === '/img/logo.png')
    expect(logoTags).toHaveLength(1)
  })
})

// ─── Google Fonts preconnect ──────────────────────────────────────────────────

describe('preloadGoogleFonts option', () => {
  it('injects preconnect tags for Google Fonts', () => {
    const plugin = preloadAssetsPlugin({ preloadGoogleFonts: true })
    const tags = tagsOf(invokeTransform(plugin, ''))
    const hrefs = tags.map((t: any) => t.attrs.href)
    expect(hrefs).toContain('https://fonts.googleapis.com')
    expect(hrefs).toContain('https://fonts.gstatic.com')
  })

  it('all preconnect tags use rel="preconnect"', () => {
    const plugin = preloadAssetsPlugin({ preloadGoogleFonts: true })
    const tags = tagsOf(invokeTransform(plugin, ''))
    for (const tag of tags) {
      expect(tag.attrs.rel).toBe('preconnect')
    }
  })

  it('does not inject preconnect when disabled', () => {
    const plugin = preloadAssetsPlugin({ preloadGoogleFonts: false })
    const tags = tagsOf(invokeTransform(plugin, ''))
    expect(tags).toHaveLength(0)
  })
})

// ─── Font preloads ────────────────────────────────────────────────────────────

describe('fontsToPreload option', () => {
  it('preloads a local font', () => {
    const plugin = preloadAssetsPlugin({
      fontsToPreload: [{ href: '/fonts/Inter.woff2' }]
    })
    const tags = tagsOf(invokeTransform(plugin, ''))
    expect(tags).toContainEqual(expect.objectContaining({
      attrs: expect.objectContaining({
        rel: 'preload',
        href: '/fonts/Inter.woff2',
        as: 'font',
        type: 'font/woff2'
      })
    }))
  })

  it('adds crossorigin automatically for font preloads (spec requirement)', () => {
    const plugin = preloadAssetsPlugin({
      fontsToPreload: [{ href: '/fonts/Inter.woff2' }]  // no crossorigin specified
    })
    const tags = tagsOf(invokeTransform(plugin, ''))
    expect(tags[0].attrs.crossorigin).toBe('')
  })

  it('uses custom type when provided', () => {
    const plugin = preloadAssetsPlugin({
      fontsToPreload: [{ href: '/fonts/Mono.woff', type: 'font/woff' }]
    })
    const tags = tagsOf(invokeTransform(plugin, ''))
    expect(tags[0].attrs.type).toBe('font/woff')
  })

  it('supports as="style" for Google Fonts CSS, omits type attribute', () => {
    const plugin = preloadAssetsPlugin({
      fontsToPreload: [{
        href: 'https://fonts.googleapis.com/css2?family=Inter&display=swap',
        as: 'style',
        crossorigin: true
      }]
    })
    const tags = tagsOf(invokeTransform(plugin, ''))
    expect(tags[0].attrs.as).toBe('style')
    expect(tags[0].attrs.type).toBeUndefined()
    expect(tags[0].attrs.crossorigin).toBe('')
  })
})

// ─── criticalCss ─────────────────────────────────────────────────────────────

describe('criticalCss option', () => {
  const bundle = {
    'assets/main-abc123.css': { type: 'asset' },
    'assets/vendor-xyz789.css': { type: 'asset' },
    'assets/main-abc123.js': { type: 'chunk' }
  }

  it('preloads matching CSS from bundle (array syntax)', () => {
    const plugin = preloadAssetsPlugin({ criticalCss: ['main'] })
    const tags = tagsOf(invokeTransform(plugin, '', undefined, bundle))
    expect(tags).toContainEqual(expect.objectContaining({
      attrs: expect.objectContaining({
        rel: 'preload',
        href: '/assets/main-abc123.css',
        as: 'style'
      })
    }))
  })

  it('does not preload non-matching CSS', () => {
    const plugin = preloadAssetsPlugin({ criticalCss: ['main'] })
    const tags = tagsOf(invokeTransform(plugin, '', undefined, bundle))
    const hrefs = tags.map((t: any) => t.attrs.href)
    expect(hrefs).not.toContain('/assets/vendor-xyz789.css')
  })

  it('does not inject crossorigin on same-origin CSS', () => {
    const plugin = preloadAssetsPlugin({ criticalCss: ['main'] })
    const tags = tagsOf(invokeTransform(plugin, '', undefined, bundle))
    const cssTag = tags.find((t: any) => t.attrs.href?.endsWith('.css'))
    expect(cssTag?.attrs.crossorigin).toBeUndefined()
  })

  it('supports function syntax for per-page targeting', () => {
    const plugin = preloadAssetsPlugin({
      criticalCss: (path) => path.includes('index') ? ['main'] : []
    })
    const tags = tagsOf(invokeTransform(plugin, '', undefined, bundle))
    const hrefs = tags.map((t: any) => t.attrs.href)
    expect(hrefs).toContain('/assets/main-abc123.css')
  })

  it('returns empty for non-matching page in function syntax', () => {
    const plugin = preloadAssetsPlugin({
      criticalCss: (path) => path.includes('blog') ? ['main'] : []
    })
    const tags = tagsOf(invokeTransform(plugin, '', undefined, bundle))
    expect(tags).toHaveLength(0)
  })
})

// ─── criticalJs ──────────────────────────────────────────────────────────────

describe('criticalJs option', () => {
  const bundle = {
    'assets/main-abc123.js': { type: 'chunk' },
    'assets/vendor-xyz789.js': { type: 'chunk' },
    'assets/main-abc123.css': { type: 'asset' }
  }

  it('uses rel="modulepreload" for JS (Vite ESM output)', () => {
    const plugin = preloadAssetsPlugin({ criticalJs: ['main'] })
    const tags = tagsOf(invokeTransform(plugin, '', undefined, bundle))
    expect(tags).toContainEqual(expect.objectContaining({
      attrs: expect.objectContaining({
        rel: 'modulepreload',
        href: '/assets/main-abc123.js',
        crossorigin: ''
      })
    }))
  })

  it('does not match non-entry JS files', () => {
    const plugin = preloadAssetsPlugin({ criticalJs: ['main'] })
    const tags = tagsOf(invokeTransform(plugin, '', undefined, bundle))
    const hrefs = tags.map((t: any) => t.attrs.href)
    expect(hrefs).not.toContain('/assets/vendor-xyz789.js')
  })

  it('does not match CSS files when looking for JS', () => {
    const plugin = preloadAssetsPlugin({ criticalJs: ['main'] })
    const tags = tagsOf(invokeTransform(plugin, '', undefined, bundle))
    const hrefs = tags.map((t: any) => t.attrs.href)
    expect(hrefs).not.toContain('/assets/main-abc123.css')
  })

  it('supports function syntax for per-page targeting', () => {
    const plugin = preloadAssetsPlugin({
      criticalJs: (path) => path.includes('index') ? ['main'] : []
    })
    const tags = tagsOf(invokeTransform(plugin, '', undefined, bundle))
    const hrefs = tags.map((t: any) => t.attrs.href)
    expect(hrefs).toContain('/assets/main-abc123.js')
  })
})

// ─── Tag injection position ───────────────────────────────────────────────────

describe('tag injection', () => {
  it('all tags are injected at head-prepend', () => {
    const plugin = preloadAssetsPlugin({
      imagesToPreload: ['/img/logo.png'],
      preloadGoogleFonts: true
    })
    const tags = tagsOf(invokeTransform(plugin, ''))
    for (const tag of tags) {
      expect(tag.injectTo).toBe('head-prepend')
    }
  })

  it('returns original html unchanged', () => {
    const plugin = preloadAssetsPlugin({ imagesToPreload: ['/img/logo.png'] })
    const html = '<html><head></head><body></body></html>'
    const result = invokeTransform(plugin, html)
    expect(result.html).toBe(html)
  })
})
