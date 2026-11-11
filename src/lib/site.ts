import type { Metadata } from 'next'

export const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.myrakal.com'

export const DESCRIPTION =
  "Myrakal finds, prices and books the expensive care insurance won't cover, from dental implants to cosmetic surgery, in the U.S. or abroad. Send us your quote and we come back with verified options and all-in prices up front. We never take money from clinics."

export function pageMetadata(path: string): Pick<Metadata, 'alternates' | 'openGraph'> {
  return {
    alternates: { canonical: path },
    openGraph: { url: path, siteName: 'Myrakal', type: 'website', locale: 'en_US' },
  }
}
