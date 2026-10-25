import type { Metadata } from 'next'

import { DESCRIPTION, SITE } from '@/lib/site'

import '../index.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: 'Myrakal',
  description: DESCRIPTION,
  icons: { icon: '/favicon.svg' },
  openGraph: { siteName: 'Myrakal', type: 'website', locale: 'en_US' },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;1,6..96,400&family=Lora:wght@500;600&family=Space+Grotesk:wght@300;400&family=Source+Sans+3:wght@400;500;600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
