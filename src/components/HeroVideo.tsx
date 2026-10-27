'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'

const QUERY = '(min-width: 640px) and (prefers-reduced-motion: no-preference)'

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

export function HeroVideo({ poster }: { poster: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const motionAllowed = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  )

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {})
      else video.pause()
    })
    observer.observe(video)
    return () => observer.disconnect()
  }, [motionAllowed])

  if (!motionAllowed) return null
  return (
    <video
      ref={ref}
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
