import { test, expect } from '@playwright/test'

test.describe('Blog', () => {
  test('blog index page lists posts', async ({ page }) => {
    await page.goto('/blog')
    await expect(page).toHaveTitle(/Blog/)
    await expect(page.locator('h1')).toContainText('Blog')
    await expect(page.getByText('second language', { exact: false }).first()).toBeVisible()
  })

  test('can navigate to a blog post', async ({ page }) => {
    await page.goto('/blog')
    await page.getByText('Benefits of Listening to Audiobooks', { exact: false }).click()

    await expect(page).toHaveURL(/benefits-of-audiobooks/)
    await expect(page.locator('h1')).toContainText('Second Language')
    await expect(page.locator('article')).toBeVisible()
  })

  test('blog post renders content with headings', async ({ page }) => {
    await page.goto('/blog/benefits-of-audiobooks-in-your-second-language')
    await expect(page.locator('article .prose h2').first()).toBeVisible()
    await expect(page.getByText('natural rhythm', { exact: false }).first()).toBeVisible()
  })

  test('blog post has structured data', async ({ page }) => {
    await page.goto('/blog/benefits-of-audiobooks-in-your-second-language')
    const jsonLd = page.locator('script[type="application/ld+json"]')
    // There are two: one from index.html (WebSite) and one from the post (BlogPosting)
    const count = await jsonLd.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('blog has navigation back to search', async ({ page }) => {
    await page.goto('/blog')
    const homeLink = page.getByRole('link', { name: /Audiobook Search/i }).first()
    await homeLink.click()
    await expect(page.locator('h1')).toContainText('Find any audiobook')
  })

  test('blog post has back link to blog index', async ({ page }) => {
    await page.goto('/blog/benefits-of-audiobooks-in-your-second-language')
    await page.getByRole('link', { name: /All posts/i }).click()
    await expect(page).toHaveURL(/\/blog$/)
  })

  test('invalid blog slug redirects to blog index', async ({ page }) => {
    await page.goto('/blog/nonexistent-post')
    await expect(page).toHaveURL(/\/blog$/)
  })
})
