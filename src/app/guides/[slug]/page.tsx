import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { GuidePage } from '@/components/GuidePage'
import { GUIDES } from '@/lib/guides'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

const find = (slug: string) => GUIDES[slug as keyof typeof GUIDES]

export async function generateStaticParams() {
  return Object.keys(GUIDES).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = find((await params).slug)
  if (!guide) return {}
  return { title: guide.title, description: guide.description, alternates: { canonical: `/guides/${guide.slug}` } }
}

export default async function GuideRoute({ params }: Props) {
  const guide = find((await params).slug)
  if (!guide) notFound()
  return <GuidePage guide={guide} />
}
