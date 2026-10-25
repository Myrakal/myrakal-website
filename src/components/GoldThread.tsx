'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'

export function ThreadStop({ marked = false, ...rest }: { marked?: boolean }) {
  return (
    <span
      {...rest}
      data-thread-stop=""
      aria-hidden="true"
      className={`absolute top-3 -left-3 size-2 -translate-x-1/2 lg:-left-6 xl:-left-16 ${marked ? 'rotate-45 bg-champagne' : ''}`}
    />
  )
}

const STRANDS = [
  { pull: [1, 1], opacity: 0.85, width: 1.2 },
  { pull: [0.55, 1.25], opacity: 0.6, width: 0.8 },
  { pull: [1.25, 0.45], opacity: 0.5, width: 0.8 },
  { pull: [0.3, 0.8], opacity: 0.4, width: 0.6 },
  { pull: [0.85, 0.2], opacity: 0.35, width: 0.6 },
]

export function GoldThreadMain({ className = '', children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const [paths, setPaths] = useState<string[]>([])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.65', 'end 0.65'] })
  const clipPath = useTransform(scrollYProgress, (p) => `inset(0 0 ${(1 - p) * 100}% 0)`)

  useEffect(() => {
    const box = ref.current
    if (!box) return
    const measure = () => {
      const origin = box.getBoundingClientRect()
      const stops = [...box.querySelectorAll('[data-thread-stop]')]
      const points = stops.map((el) => {
        const r = el.getBoundingClientRect()
        return [Math.round(r.left + r.width / 2 - origin.left), Math.round(r.top + r.height / 2 - origin.top)]
      })
      if (points.length < 2) return setPaths([])
      const clearance = Math.min(...stops.map((el, i) => (el.parentElement?.getBoundingClientRect().left ?? 0) - origin.left - points[i][0]))
      const sway = Math.max(0, Math.min(56, points[0][0] * 0.6, clearance - 4)) / 1.25
      const next = STRANDS.map(({ pull: [a, b] }) =>
        points.slice(1).reduce((d, [x, y], i) => {
          const [px, py] = points[i]
          const bend = i % 2 ? -sway : sway
          const third = Math.round((y - py) / 3)
          return `${d} C${Math.round(px + bend * a)} ${py + third} ${Math.round(x + bend * b)} ${y - third} ${x} ${y}`
        }, `M${points[0][0]} ${points[0][1]}`),
      )
      setPaths((prev) => (prev.join() === next.join() ? prev : next))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(box)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <main ref={ref} className={`relative ${className}`}>
      {children}
      <motion.svg
        aria-hidden="true"
        style={{ clipPath }}
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible motion-reduce:[clip-path:none]!"
      >
        {paths.map((d, i) => (
          <path key={`glow-${i}`} data-glow="" d={d} fill="none" strokeWidth="6" strokeOpacity="0.06" className="stroke-champagne" />
        ))}
        {paths.map((d, i) => (
          <path key={i} data-strand="" d={d} fill="none" strokeWidth={STRANDS[i].width} strokeOpacity={STRANDS[i].opacity} className="stroke-champagne" />
        ))}
      </motion.svg>
    </main>
  )
}
