'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(min-width: 640px) and (prefers-reduced-motion: no-preference)'

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

export function HeroVideo({ poster }: { poster: string }) {
  const motionAllowed = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  )
  if (!motionAllowed) return null
  return (
    <video
      src="/hero-liquid.mp4"
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      aria-hidden="true"
      className="absolute inset-0 -z-20 size-full object-cover"
    />
  )
}
