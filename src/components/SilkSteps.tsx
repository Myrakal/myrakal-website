'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import silk from '@/assets/care-silk.webp'
import silkSmall from '@/assets/care-silk-400.webp'

const BENDS = [16, 36, 58, 80]

type Step = { title: string; body: string }

export function SilkSteps({ steps }: { steps: [Step, Step, Step, Step] }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.6'] })
  const clipPath = useTransform(scrollYProgress, [0, 1], ['inset(0 0 85% 0)', 'inset(0 0 0% 0)'])

  return (
    <div ref={ref} className="relative mx-auto mt-12 max-w-5xl">
      <motion.img
        src={silk.src}
        srcSet={`${silkSmall.src} 396w, ${silk.src} 793w`}
        sizes="(min-width: 1024px) 26rem, 100vw"
        width={silk.width}
        height={silk.height}
        alt=""
        loading="lazy"
        style={{ clipPath }}
        className="absolute inset-0 h-full w-full object-cover opacity-40 motion-reduce:[clip-path:none]! lg:static lg:mx-auto lg:h-auto lg:w-[26rem] lg:opacity-100"
      />
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
