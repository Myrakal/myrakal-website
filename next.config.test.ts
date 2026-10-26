import config from './next.config'

describe('next config redirects', () => {
  it('sends the old chat routes to the workspace', async () => {
    const redirects = await config.redirects?.()
    expect(redirects).toEqual([
      { source: '/chats/:id', destination: '/dashboard/:id', permanent: false },
      { source: '/chat', has: [{ type: 'query', key: 'id', value: '(?<id>[0-9a-fA-F-]{36})' }], destination: '/dashboard/:id', permanent: false },
      { source: '/chat', destination: '/dashboard', permanent: false },
    ])
  })
})
