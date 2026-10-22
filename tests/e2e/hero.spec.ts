import { expect, test } from '@playwright/test'

for (const viewport of [
  { width: 1440, height: 700 },
  { width: 390, height: 600 },
]) {
  test(`hero headline is not covered by the navbar at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/', { waitUntil: 'networkidle' })
    const nav = await page.locator('header').first().boundingBox()
    const ring = await page.locator('h1').first().boundingBox()
    expect(nav).not.toBeNull()
    expect(ring).not.toBeNull()
    expect(ring!.y).toBeGreaterThanOrEqual(nav!.y + nav!.height)
  })
}

for (const viewport of [
  { width: 844, height: 390 },
  { width: 1366, height: 600 },
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`hero wordmark never covers the headline at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/', { waitUntil: 'networkidle' })
    const wordmark = await page.locator('section img[src*="myrakal-wordmark"]').first().boundingBox()
    const heading = await page.locator('h1').first().boundingBox()
    expect(wordmark).not.toBeNull()
    expect(heading).not.toBeNull()
    expect(wordmark!.y + wordmark!.height).toBeLessThanOrEqual(heading!.y)
  })
}

for (const viewport of [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
]) test(`scene text sits below its photograph at ${viewport.width}x${viewport.height}`, async ({ page }) => {
  await page.setViewportSize(viewport)
  await page.goto('/', { waitUntil: 'networkidle' })
  const heading = page.getByRole('heading', { name: 'Everything, arranged' })
  await heading.scrollIntoViewIfNeeded()
  const photo = await page.getByRole('img', { name: /watch/i }).boundingBox()
  const title = await heading.boundingBox()
  expect(photo!.y + photo!.height).toBeLessThanOrEqual(title!.y)
})
