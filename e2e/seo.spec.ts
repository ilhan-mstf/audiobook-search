import { test, expect } from '@playwright/test'

test.describe('SEO', () => {
  test('homepage has essential meta tags', async ({ page }) => {
    await page.goto('/')

    // Title
    await expect(page).toHaveTitle(/Audiobook Search/)

    // Meta description
    const description = page.locator('meta[name="description"]')
    await expect(description).toHaveAttribute('content', /audiobook/i)

    // Canonical
    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveAttribute('href', /audiobook-search/)

    // Open Graph
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Audiobook Search/)
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.+/)
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website')

    // Twitter Card
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image')
  })

  test('homepage has JSON-LD structured data with SearchAction', async ({ page }) => {
    await page.goto('/')
    const jsonLd = page.locator('script[type="application/ld+json"]')
    const text = await jsonLd.first().textContent()
    const data = JSON.parse(text!)
    expect(data['@type']).toBe('WebSite')
    expect(data.potentialAction['@type']).toBe('SearchAction')
  })

  test('favicon is present', async ({ page }) => {
    await page.goto('/')
    const favicon = page.locator('link[rel="icon"]')
    await expect(favicon).toHaveAttribute('href', /favicon/)
  })

  test('robots meta allows indexing', async ({ page }) => {
    await page.goto('/')
    const robots = page.locator('meta[name="robots"]')
    await expect(robots).toHaveAttribute('content', /index/)
    await expect(robots).toHaveAttribute('content', /follow/)
  })

  test('robots.txt is accessible', async ({ request }) => {
    const response = await request.get('/robots.txt')
    expect(response.status()).toBe(200)
    const text = await response.text()
    expect(text).toContain('Sitemap')
    expect(text).toContain('Allow: /')
  })

  test('sitemap.xml is accessible and valid', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    expect(response.status()).toBe(200)
    const text = await response.text()
    expect(text).toContain('urlset')
    expect(text).toContain('audiobook-search.pages.dev')
    expect(text).toContain('/blog')
  })
})
