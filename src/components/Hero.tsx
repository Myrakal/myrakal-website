import { ArrowDown } from 'lucide-react'

import { Globe } from '@/components/ui/globe'
import { WaitlistForm } from '@/components/WaitlistForm'

const GLOBE_CONFIG = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [0.965, 0.933, 0.894] as [number, number, number],
  markerColor: [0.302, 0.059, 0.102] as [number, number, number],
  glowColor: [0.965, 0.933, 0.894] as [number, number, number],
  markers: [
    { location: [14.5995, 120.9842] as [number, number], size: 0.03 },
    { location: [19.076, 72.8777] as [number, number], size: 0.1 },
    { location: [23.8103, 90.4125] as [number, number], size: 0.05 },
    { location: [30.0444, 31.2357] as [number, number], size: 0.07 },
    { location: [39.9042, 116.4074] as [number, number], size: 0.08 },
    { location: [-23.5505, -46.6333] as [number, number], size: 0.1 },
    { location: [19.4326, -99.1332] as [number, number], size: 0.1 },
    { location: [40.7128, -74.006] as [number, number], size: 0.1 },
    { location: [34.6937, 135.5022] as [number, number], size: 0.05 },
    { location: [41.0082, 28.9784] as [number, number], size: 0.06 },
  ],
}

export function Hero() {
  return (
    <section className="editorial-hero relative grid min-h-screen grid-cols-12 items-center gap-8 overflow-hidden bg-background px-6 pt-24 pb-20 sm:px-12 sm:pt-28 lg:pt-32">
      <div className="relative z-10 col-span-12 flex flex-col gap-6 sm:col-span-5">
        <div className="flex flex-col gap-4">
          <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            International care / Issue 01
          </span>
          <h1 className="font-heading text-4xl font-medium leading-tight text-foreground sm:text-5xl md:text-6xl">
            Get high-quality healthcare treatment overseas while staying on budget
          </h1>
        </div>
        <div className="w-full">
          <WaitlistForm />
        </div>
      </div>
      <div className="relative z-10 col-span-12 flex items-center justify-center sm:col-span-7 sm:justify-end">
        <div className="relative aspect-square w-full max-w-2xl border border-gold">
          <Globe config={GLOBE_CONFIG} />
        </div>
      </div>
      <ArrowDown
        className="absolute bottom-8 left-1/2 z-10 size-6 -translate-x-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </section>
  )
}
