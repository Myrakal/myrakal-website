import { DESCRIPTION, SITE } from '@/lib/site'

const context = 'https://schema.org'

export const ORGANIZATION = {
  '@context': context,
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: 'Myrakal',
  url: SITE,
  logo: `${SITE}/logo.png`,
  slogan: 'Healthcare that costs less',
  description: DESCRIPTION,
  address: { '@type': 'PostalAddress', addressLocality: 'Chicago', addressRegion: 'IL', addressCountry: 'US' },
}

export const WEBSITE = {
  '@context': context,
  '@type': 'WebSite',
  name: 'Myrakal',
  url: SITE,
  publisher: { '@id': `${SITE}/#organization` },
}
