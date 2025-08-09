import { test, expect, Page } from '@playwright/test'

test.describe('Frontend', () => {
  let page: Page

  test.beforeAll(async ({ browser }, testInfo) => {
    const context = await browser.newContext()
    page = await context.newPage()
  })

  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Monynha Tech/)

    const heading = page.locator('h1').first()

    await expect(heading).toHaveText('Monynha Tech')
  })

  test('can go on posts page', async ({ page }) => {
    await page.goto('http://localhost:3000/posts')

    await expect(page).toHaveTitle(/Monynha Tech Posts/)

    const heading = page.locator('h1').first()

    await expect(heading).toHaveText('Posts')
  })

  test('can go on search page', async ({ page }) => {
    await page.goto('http://localhost:3000/search')

    await expect(page).toHaveTitle(/Monynha Tech Search/)

    const heading = page.locator('h1').first()

    await expect(heading).toHaveText('Search')
  })
})
