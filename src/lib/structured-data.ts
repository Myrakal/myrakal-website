import type { FaqItem } from '@/components/FAQ'
import { DESCRIPTION, SITE } from '@/lib/site'

const context = 'https://schema.org'

export const ORGANIZATION = {
  '@context': context,
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: 'Myrakal',
  url: SITE,
  logo: `${SITE}/logo.png`,
  slogan: 'Healthcare, as it should be',
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

export const faqPage = (items: FaqItem[]) => ({
  '@context': context,
  '@type': 'FAQPage',
  mainEntity: items.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
})
