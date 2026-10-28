jest.mock('posthog-js', () => ({
  __esModule: true,
  default: { init: jest.fn(), capture: jest.fn() },
}))

const load = async () => {
  jest.resetModules()
  const { default: posthog } = await import('posthog-js')
  await import('@/instrumentation-client')
  return { posthog }
}

const originalEnv = { ...process.env }

describe('analytics', () => {
  afterEach(() => {
    process.env = { ...originalEnv }
    jest.clearAllMocks()
  })

  it('inits posthog with the configured key', async () => {
    process.env['NEXT_PUBLIC_POSTHOG_KEY'] = 'phc_test'
    const { posthog } = await load()
    expect(posthog.init).toHaveBeenCalledWith(
      'phc_test',
      expect.objectContaining({ capture_pageview: true, autocapture: false }),
    )
  })

  it('falls back to the default host when the host var is empty', async () => {
    process.env['NEXT_PUBLIC_POSTHOG_KEY'] = 'phc_test'
    process.env['NEXT_PUBLIC_POSTHOG_HOST'] = ''
    const { posthog } = await load()
    expect(posthog.init).toHaveBeenCalledWith(
      'phc_test',
      expect.objectContaining({ api_host: 'https://us.i.posthog.com' }),
    )
  })

  it('injects its scripts into the head so they stay out of the hydrated body', async () => {
    process.env['NEXT_PUBLIC_POSTHOG_KEY'] = 'phc_test'
    const { posthog } = await load()
    expect(posthog.init).toHaveBeenCalledWith(
      'phc_test',
      expect.objectContaining({ external_scripts_inject_target: 'head' }),
    )
  })

  it('does nothing without a key', async () => {
    process.env['NEXT_PUBLIC_POSTHOG_KEY'] = ''
    const { posthog } = await load()
    expect(posthog.init).not.toHaveBeenCalled()
  })
})
