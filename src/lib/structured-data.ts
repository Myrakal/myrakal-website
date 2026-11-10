import { CONTACT_EMAIL } from '@/lib/contact'
import { DESCRIPTION, SITE } from '@/lib/site'

const context = 'https://schema.org'

export const ORGANIZATION = {
  '@context': context,
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: 'Myrakal',
  url: SITE,
  logo: `${SITE}/logo.png`,
  slogan: 'Healthcare, as it should be.',
  description: DESCRIPTION,
  address: { '@type': 'PostalAddress', addressLocality: 'Chicago', addressRegion: 'IL', addressCountry: 'US' },
  founder: [
    { '@type': 'Person', name: 'Eshaan Sood', jobTitle: 'Co-founder, product and business' },
    { '@type': 'Person', name: 'Anirudh Kuppili', jobTitle: 'Co-founder, engineering' },
  ],
  email: CONTACT_EMAIL,
  contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: CONTACT_EMAIL, availableLanguage: 'English' },
}

export const WEBSITE = {
  '@context': context,
  '@type': 'WebSite',
  name: 'Myrakal',
  url: SITE,
  publisher: { '@id': `${SITE}/#organization` },
}
