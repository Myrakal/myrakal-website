'use client'

import dynamic from 'next/dynamic'

import type { RawGraph } from '@/lib/internal/types'
import './internal.css'

const Status = ({ error }: { error?: string }) => (
  <div className="internal-root">
    <div className={error ? 'status error' : 'status'}>{error ? `Could not load data: ${error}` : 'Loading…'}</div>
  </div>
)

const CareNetwork = dynamic(() => import('./CareNetwork'), { ssr: false, loading: () => <Status /> })

export default function InternalTool({ raw, error }: { raw?: RawGraph; error?: string }) {
  if (error || !raw) return <Status error={error ?? 'no data'} />
  return <CareNetwork raw={raw} />
}
