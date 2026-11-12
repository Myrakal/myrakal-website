import type { MetadataRoute } from 'next'

import { SITE } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User'],
        allow: '/',
        disallow: '/internal',
      },
      { userAgent: ['GPTBot', 'ClaudeBot', 'Google-Extended'], disallow: '/' },
      { userAgent: '*', allow: '/', disallow: '/internal' },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  }
}
