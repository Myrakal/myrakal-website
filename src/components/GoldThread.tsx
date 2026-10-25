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

export function GoldThreadMain({ className = '', children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const [path, setPath] = useState('')
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
      if (points.length < 2) return setPath('')
      const clearance = Math.min(...stops.map((el, i) => (el.parentElement?.getBoundingClientRect().left ?? 0) - origin.left - points[i][0]))
      const sway = Math.max(0, Math.min(40, points[0][0] * 0.6, clearance))
      setPath(
        points.slice(1).reduce((d, [x, y], i) => {
          const [px, py] = points[i]
          const bend = i % 2 ? -sway : sway
          const third = Math.round((y - py) / 3)
          return `${d} C${px + bend} ${py + third} ${x + bend} ${y - third} ${x} ${y}`
        }, `M${points[0][0]} ${points[0][1]}`),
      )
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
        <path d={path} fill="none" strokeWidth="1" className="stroke-champagne/70" />
      </motion.svg>
    </main>
  )
}
