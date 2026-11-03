import { defineConfig } from '@playwright/test'

const port = Number(process.env.E2E_PORT ?? 3000)
const supabasePort = Number(process.env.E2E_SUPABASE_PORT ?? 54321)
const baseURL = `http://localhost:${port}`

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL },
  webServer: [
    {
      command: 'node tests/e2e/support/mock-supabase.mjs',
      env: { MOCK_SUPABASE_PORT: String(supabasePort) },
      url: `http://127.0.0.1:${supabasePort}/health`,
      reuseExistingServer: false,
    },
    {
      command: `pnpm dev --port ${port}`,
      env: {
        NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${supabasePort}`,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'e2e-anon-key',
      },
      url: baseURL,
      reuseExistingServer: false,
    },
  ],
})
