import { expect, test } from '@playwright/test'

for (const viewport of [
  { width: 1440, height: 700 },
  { width: 390, height: 600 },
]) {
  test(`hero ring is not covered by the navbar at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/')
    const nav = await page.locator('header').first().boundingBox()
    const ring = await page.locator('section > div.rounded-full').first().boundingBox()
    expect(nav).not.toBeNull()
    expect(ring).not.toBeNull()
    expect(ring!.y).toBeGreaterThanOrEqual(nav!.y + nav!.height)
  })
}
