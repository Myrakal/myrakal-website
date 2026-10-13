import { expect, test } from '@playwright/test'

test.use({ launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] } })

for (const viewport of [
  { width: 1440, height: 700 },
  { width: 390, height: 600 },
]) {
  test(`sculpture clears the navbar and fabric fits at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/', { waitUntil: 'networkidle' })
    const nav = await page.locator('header').first().boundingBox()
    const ring = await page.locator('.rod-stage').boundingBox()
    expect(nav).not.toBeNull()
    expect(ring).not.toBeNull()
    expect(ring!.y).toBeGreaterThanOrEqual(nav!.y + nav!.height)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width)
    await expect(page.getByRole('button', { name: 'Pause rotation' })).toBeEnabled()
    await page.getByRole('button', { name: 'Pause rotation' }).click()
    await expect(page.getByRole('button', { name: 'Rotate sculpture' })).toHaveAttribute('aria-pressed', 'false')
    if (viewport.width === 390) {
      await page.getByRole('link', { name: /Discover the Myrakal edit/ }).click()
      await page.locator('#editorial').screenshot({ path: '.screenshots/velvet/editorial-mobile.png', style: 'header { visibility: hidden; }' })
    }
  })
}

test('reduced motion reveals copy immediately and enables only intentional rotation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/', { waitUntil: 'networkidle' })
  const rotate = page.getByRole('button', { name: 'Rotate sculpture' })
  await expect(rotate).toBeEnabled()
  await expect(rotate).toHaveAttribute('aria-pressed', 'false')
  await expect(page.locator('#hero-title')).toHaveCSS('opacity', '1')
  await expect(page.locator('#hero-title')).toHaveCSS('animation-name', 'none')
  const canvas = page.locator('.rod-stage canvas')
  const initial = await canvas.screenshot()
  await page.locator('.rod-stage').press('ArrowRight')
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))))
  const turned = await canvas.screenshot()
  expect(turned.equals(initial)).toBe(false)
  const stage = await page.locator('.rod-stage').boundingBox()
  await page.mouse.move(stage!.x + stage!.width / 2, stage!.y + stage!.height / 2)
  await page.mouse.down()
  await page.mouse.move(stage!.x + stage!.width / 2 + 90, stage!.y + stage!.height / 2, { steps: 8 })
  await page.mouse.up()
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))))
  expect((await canvas.screenshot()).equals(turned)).toBe(false)
  await rotate.click()
  await expect(page.getByRole('button', { name: 'Pause rotation' })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('link', { name: /Discover the Myrakal edit/ }).click()
  await expect(page).toHaveURL(/#editorial$/)
  await expect(page.getByRole('heading', { name: 'CARE', exact: true })).toBeInViewport()
})

test('magazine covers lead into the existing care journey', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/#editorial', { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('.care-cover img')).toHaveCount(2)
  const fabric = await page.locator('.hero-fabric-fall').boundingBox()
  const editorial = await page.locator('#editorial').boundingBox()
  expect(fabric!.y + fabric!.height).toBeGreaterThan(editorial!.y)
  await page.locator('#editorial').screenshot({ path: '.screenshots/velvet/editorial-desktop.png', style: 'header { visibility: hidden; }' })
  await page.getByRole('link', { name: /Explore the journey/ }).click()
  await expect(page).toHaveURL(/#how-it-works$/)
  await expect(page.getByRole('heading', { name: 'We make it simple.' })).toBeInViewport()
})
