import type { MetadataRoute } from 'next'

import { SITE } from '@/lib/site'

const PAGES: [string, MetadataRoute.Sitemap[number]['changeFrequency'], number][] = [
  ['', 'monthly', 1],
  ['/care', 'monthly', 0.9],
  ['/contact', 'yearly', 0.5],
  ['/privacy', 'yearly', 0.3],
  ['/terms', 'yearly', 0.3],
  ['/accessibility', 'yearly', 0.3],
]

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(([path, changeFrequency, priority]) => ({ url: `${SITE}${path}`, changeFrequency, priority }))
}
