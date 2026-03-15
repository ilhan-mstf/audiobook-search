import { test, expect } from '@playwright/test'

test.describe('Search user journey', () => {
  test('can type a query and submit via button', async ({ page }) => {
    await page.goto('/')

    // Fill the search input
    const input = page.locator('input[placeholder*="Search"]')
    await input.fill('Sherlock Holmes')
    await expect(input).toHaveValue('Sherlock Holmes')

    // Click search button
    await page.locator('button:has-text("Search")').click()

    // Should transition to results view with sticky header
    await expect(page.locator('header.sticky')).toBeVisible()
    // URL should update with query param
    await expect(page).toHaveURL(/\?q=Sherlock\+Holmes/)
    // Title should update
    await expect(page).toHaveTitle(/"Sherlock Holmes"/)
  })

  test('can search via Enter key', async ({ page }) => {
    await page.goto('/')
    const input = page.locator('input[placeholder*="Search"]')
    await input.fill('Dune')
    await input.press('Enter')

    await expect(page.locator('header.sticky')).toBeVisible()
    await expect(page).toHaveURL(/\?q=Dune/)
  })

  test('can click an example chip to search', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Pride and Prejudice' }).click()

    await expect(page.locator('header.sticky')).toBeVisible()
    await expect(page).toHaveURL(/\?q=Pride\+and\+Prejudice/)
  })

  test('shows search counter while loading', async ({ page }) => {
    await page.goto('/')
    const input = page.locator('input[placeholder*="Search"]')
    await input.fill('Sapiens')
    await input.press('Enter')

    // Should see loading indicator
    await expect(page.getByText(/Searching|sources searched/)).toBeVisible({ timeout: 10000 })
  })

  test('search button is disabled when input is empty', async ({ page }) => {
    await page.goto('/')
    const btn = page.locator('button:has-text("Search")').first()
    await expect(btn).toBeDisabled()
  })

  test('deep link with ?q= auto-searches', async ({ page }) => {
    await page.goto('/?q=The+Hobbit')

    // Should immediately be in results view
    await expect(page.locator('header.sticky')).toBeVisible()
    await expect(page).toHaveTitle(/"The Hobbit"/)
  })

  test('clearing input returns to landing', async ({ page }) => {
    await page.goto('/')
    const input = page.locator('input[placeholder*="Search"]')
    await input.fill('Dune')
    await input.press('Enter')

    // Wait for results view
    await expect(page.locator('header.sticky')).toBeVisible()

    // Clear the input in sticky header
    const headerInput = page.locator('header input')
    await headerInput.fill('')

    // Should return to landing
    await expect(page.locator('h1')).toContainText('Find any audiobook')
  })
})
