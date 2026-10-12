// Usage: pnpm screenshot [path ...] [--full] [--out dir]
// Needs the dev server running (pnpm dev); screenshots land in .screenshots/
import { mkdirSync } from 'node:fs'
import { chromium } from '@playwright/test'

const args = process.argv.slice(2)
const full = args.includes('--full')
const outIdx = args.indexOf('--out')
const out = outIdx >= 0 ? args[outIdx + 1] : '.screenshots'
const paths = args.filter((a, i) => !a.startsWith('--') && (outIdx < 0 || i !== outIdx + 1))
const base = process.env.BASE_URL ?? 'http://localhost:5173'
const viewports = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } }

mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
for (const path of paths.length ? paths : ['/']) {
  for (const [name, viewport] of Object.entries(viewports)) {
    const page = await browser.newPage({ viewport })
    await page.goto(base + path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500) // let animations and WebGL settle
    const slug = path === '/' ? 'home' : path.replace(/\W+/g, '-').replace(/^-|-$/g, '')
    const file = `${out}/${slug}-${name}.png`
    await page.screenshot({ path: file, fullPage: full })
    console.log(file)
    await page.close()
  }
}
await browser.close()
