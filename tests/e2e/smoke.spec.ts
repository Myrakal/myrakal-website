import { expect, test } from '@playwright/test'

for (const path of ['/', '/clinics', '/contact', '/privacy', '/terms', '/accessibility']) {
  test(`${path} loads without console errors`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto(path)
    await expect(page.locator('body')).not.toBeEmpty()
    expect(errors).toEqual([])
  })
}
