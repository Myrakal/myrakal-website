'use client'

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { Children, useRef, useSyncExternalStore, type ReactNode } from 'react'

const SHORT = '(max-height: 560px)'

const subscribeShort = (notify: () => void) => {
  const query = window.matchMedia(SHORT)
  query.addEventListener('change', notify)
  return () => query.removeEventListener('change', notify)
}

type SlideProps = { index: number; count: number; progress: MotionValue<number>; onReveal: () => void; children: ReactNode }

function Slide({ index, count, progress, onReveal, children }: SlideProps) {
  const x = useTransform(progress, [(index - 1) / (count - 1), index / (count - 1)], ['100%', '0%'])
  return (
    <motion.div
      style={index === 0 ? undefined : { x }}
      onFocusCapture={onReveal}
      className="absolute inset-0 [&>section]:h-full [&>section]:min-h-0 [&>div]:h-full"
    >
      {children}
    </motion.div>
  )
}

function Pinned({ slides }: { slides: ReactNode[] }) {
  const track = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })

  const reveal = (index: number) => () => {
    const box = track.current
    if (!box) return
    const top = box.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + (index / (slides.length - 1)) * (box.offsetHeight - window.innerHeight) })
  }

  return (
    <div ref={track} style={{ height: `${slides.length * 100}svh` }} className="relative">
      <div className="sticky top-0 h-svh overflow-clip bg-charcoal">
        {slides.map((slide, i) => (
          <Slide key={i} index={i} count={slides.length} progress={scrollYProgress} onReveal={reveal(i)}>
            {slide}
          </Slide>
        ))}
      </div>
    </div>
  )
}

export function ScrollScenes({ children }: { children: ReactNode }) {
  const slides = Children.toArray(children)
  const reduced = useReducedMotion()
  const short = useSyncExternalStore(subscribeShort, () => window.matchMedia(SHORT).matches, () => false)
  return reduced || short || slides.length < 2 ? <div>{slides}</div> : <Pinned slides={slides} />
}
