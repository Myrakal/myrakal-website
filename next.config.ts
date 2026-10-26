import type { NextConfig } from 'next'

const config: NextConfig = {
  async redirects() {
    return [
      { source: '/chats/:id', destination: '/dashboard/:id', permanent: false },
      { source: '/chat', has: [{ type: 'query', key: 'id', value: '(?<id>.+)' }], destination: '/dashboard/:id', permanent: false },
      { source: '/chat', destination: '/dashboard', permanent: false },
    ]
  },
}

export default config
