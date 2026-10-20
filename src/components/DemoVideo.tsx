import { Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function DemoVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  const [reduced] = useState(prefersReducedMotion)
  const [playing, setPlaying] = useState(!reduced)

  useEffect(() => {
    if (reduced) return
    Promise.resolve(ref.current?.play()).catch(() => setPlaying(false))
  }, [reduced])

  const toggle = () => {
    const video = ref.current
    if (!video) return
    if (video.paused) video.play().catch(() => setPlaying(false))
    else video.pause()
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <video
        ref={ref}
        src="/demo.mp4"
        aria-label="Myrakal live demo"
        autoPlay={!reduced}
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setPlaying(false)}
        className="size-full object-cover"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pause demo video' : 'Play demo video'}
        className="absolute right-3 bottom-3 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
      </button>
    </div>
  )
}
