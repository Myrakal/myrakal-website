'use client'

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { Children, useRef, useState, type ReactNode } from 'react'

type SlideProps = { index: number; count: number; progress: MotionValue<number>; held: boolean; children: ReactNode }

function Slide({ index, count, progress, held, children }: SlideProps) {
  const x = useTransform(progress, [(index - 1) / (count - 1), index / (count - 1)], ['100%', '0%'])
  return (
    <motion.div
      style={index === 0 ? undefined : { x }}
      inert={held}
      className="absolute inset-0 [&>section]:h-full [&>section]:min-h-0 [&>div]:h-full"
    >
      {children}
    </motion.div>
  )
}

function Pinned({ slides }: { slides: ReactNode[] }) {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.round(v * (slides.length - 1))))

  return (
    <div ref={track} style={{ height: `${slides.length * 100}svh` }} className="relative">
      <div className="sticky top-0 h-svh overflow-clip bg-charcoal">
        {slides.map((slide, i) => (
          <Slide key={i} index={i} count={slides.length} progress={scrollYProgress} held={i > active}>
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
  return reduced ? <div>{slides}</div> : <Pinned slides={slides} />
}
