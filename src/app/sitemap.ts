import type { MetadataRoute } from 'next'

import { SITE } from '@/lib/site'
import { GUIDES } from '@/lib/guides'
import { TREATMENTS } from '@/lib/treatments'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, changeFrequency: 'monthly', priority: 1 },
    ...Object.values(TREATMENTS).map(({ slug }) => ({ url: `${SITE}/${slug}`, changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...Object.values(GUIDES).map(({ slug, updated }) => ({ url: `${SITE}/guides/${slug}`, lastModified: updated, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ]
}
