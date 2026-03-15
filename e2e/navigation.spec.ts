import { test, expect } from '@playwright/test'

test.describe('Navigation & 404', () => {
  test('404 page shows for unknown routes', async ({ page }) => {
    await page.goto('/some-random-page')
    await expect(page.locator('h1')).toContainText('404')
    await expect(page.getByText("doesn't exist")).toBeVisible()
  })

  test('404 page has link back to search', async ({ page }) => {
    await page.goto('/unknown')
    await page.getByRole('link', { name: /search/i }).click()
    await expect(page.locator('h1')).toContainText('Find any audiobook')
  })

  test('can navigate from landing → blog → post → back', async ({ page }) => {
    // Landing
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Find any audiobook')

    // Go to blog
    await page.getByRole('link', { name: /blog/i }).click()
    await expect(page).toHaveURL(/\/blog$/)

    // Go to post
    await page.getByText('Benefits of Listening', { exact: false }).click()
    await expect(page).toHaveURL(/benefits-of-audiobooks/)

    // Back to blog
    await page.getByRole('link', { name: /All posts/i }).click()
    await expect(page).toHaveURL(/\/blog$/)

    // Back to home
    await page.getByRole('link', { name: /Audiobook Search/i }).first().click()
    await expect(page).toHaveURL(/\/$/)
  })
})
