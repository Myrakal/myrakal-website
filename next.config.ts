import type { NextConfig } from 'next'

const config: NextConfig = {
  async redirects() {
    return [
      { source: '/chats/:id', destination: '/dashboard/:id', permanent: false },
      { source: '/chat', has: [{ type: 'query', key: 'id', value: '(?<id>[0-9a-fA-F-]{36})' }], destination: '/dashboard/:id', permanent: false },
      { source: '/chat', destination: '/dashboard', permanent: false },
    ]
  },
}

export default config
