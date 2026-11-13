import type { Metadata } from 'next'

export const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.myrakal.com'

export const DESCRIPTION =
  "Myrakal finds and books dental and cosmetic care insurance won't cover, with verified options and clear prices. We never take money from clinics."

export function pageMetadata(path: string): Pick<Metadata, 'alternates' | 'openGraph'> {
  return {
    alternates: { canonical: path },
    openGraph: { url: path, siteName: 'Myrakal', type: 'website', locale: 'en_US' },
  }
}
