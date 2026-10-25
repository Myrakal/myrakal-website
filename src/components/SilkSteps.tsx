'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, useSyncExternalStore } from 'react'
import silk from '@/assets/care-silk.webp'
import silkSmall from '@/assets/care-silk-400.webp'

const BENDS = [16, 36, 58, 80]
const REDUCE = '(prefers-reduced-motion: reduce)'

const subscribeReduce = (notify: () => void) => {
  const query = window.matchMedia(REDUCE)
  query.addEventListener('change', notify)
  return () => query.removeEventListener('change', notify)
}

export function SilkSteps({ steps }: { steps: { title: string; body: string }[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useSyncExternalStore(subscribeReduce, () => window.matchMedia(REDUCE).matches, () => false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.6'] })
  const clipPath = useTransform(scrollYProgress, [0, 1], ['inset(0 0 85% 0)', 'inset(0 0 0% 0)'])
  const image = {
    src: silk.src,
    srcSet: `${silkSmall.src} 396w, ${silk.src} 793w`,
    sizes: '(min-width: 1024px) 26rem, 100vw',
    alt: '',
    loading: 'lazy' as const,
    className:
      'absolute inset-0 h-full w-full object-cover opacity-40 lg:static lg:mx-auto lg:h-auto lg:w-[26rem] lg:opacity-100',
  }

  return (
    <div ref={ref} className="relative mx-auto max-w-5xl">
      {reduced ? <img {...image} /> : <motion.img {...image} style={{ clipPath }} />}
      <ol className="relative space-y-24 py-16 lg:absolute lg:inset-0 lg:space-y-0 lg:py-0">
        {steps.map(({ title, body }, i) => (
          <li
            key={title}
            style={{ top: `${BENDS[i]}%` }}
            className={`max-w-sm lg:absolute lg:w-[30%] lg:-translate-y-1/2 ${i % 2 ? 'lg:right-0' : 'lg:left-0 lg:text-right'}`}
          >
            <p aria-hidden="true" className="font-grotesk text-xs tracking-[0.3em] text-champagne">
              {String(i + 1).padStart(2, '0')}
            </p>
            <h3 className="mt-3 font-display text-3xl font-normal">{title}</h3>
            <p className="mt-3 font-light text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
