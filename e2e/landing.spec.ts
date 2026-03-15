import { test, expect } from '@playwright/test'

test.describe('Landing page', () => {
  test('shows hero with heading and search input', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Find any audiobook')
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible()
    await expect(page.locator('button:has-text("Search")')).toBeVisible()
  })

  test('shows platform list', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('LibriVox', { exact: true })).toBeVisible()
    await expect(page.getByText('Audible', { exact: true })).toBeVisible()
    await expect(page.getByText('Spotify', { exact: true })).toBeVisible()
  })

  test('shows example chips', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Sherlock Holmes')).toBeVisible()
    await expect(page.getByText('Dune')).toBeVisible()
  })

  test('has correct page title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Audiobook Search/)
  })

  test('has blog link', async ({ page }) => {
    await page.goto('/')
    const blogLink = page.getByRole('link', { name: /blog/i })
    await expect(blogLink).toBeVisible()
  })
})
