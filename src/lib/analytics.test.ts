import posthog from 'posthog-js'
import { vi } from 'vitest'

vi.mock('posthog-js', () => ({
  default: { init: vi.fn(), capture: vi.fn() },
}))

const load = () => {
  vi.resetModules()
  return import('@/lib/analytics')
}

describe('analytics', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  it('inits posthog with the configured key', async () => {
    vi.stubEnv('VITE_POSTHOG_KEY', 'phc_test')
    const { initAnalytics } = await load()
    initAnalytics()
    expect(posthog.init).toHaveBeenCalledWith(
      'phc_test',
      expect.objectContaining({ capture_pageview: true, autocapture: false }),
    )
  })

  it('falls back to the default host when the host var is empty', async () => {
    vi.stubEnv('VITE_POSTHOG_KEY', 'phc_test')
    vi.stubEnv('VITE_POSTHOG_HOST', '')
    const { initAnalytics } = await load()
    initAnalytics()
    expect(posthog.init).toHaveBeenCalledWith(
      'phc_test',
      expect.objectContaining({ api_host: 'https://us.i.posthog.com' }),
    )
  })

  it('does nothing without a key', async () => {
    vi.stubEnv('VITE_POSTHOG_KEY', '')
    const { initAnalytics } = await load()
    initAnalytics()
    expect(posthog.init).not.toHaveBeenCalled()
  })
})
