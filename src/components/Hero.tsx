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
  baseColor: [0.93, 0.9, 0.85] as [number, number, number],
  markerColor: [0.345, 0.082, 0.122] as [number, number, number],
  glowColor: [0.929, 0.902, 0.855] as [number, number, number],
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
    <section className="relative flex h-screen flex-col items-center justify-center gap-8 bg-background px-6 text-center">
      <div className="relative aspect-square w-full max-w-64 rounded-full border border-primary sm:max-w-96">
        <Globe config={GLOBE_CONFIG} />
      </div>
      <h1 className="max-w-3xl text-4xl font-medium text-foreground sm:text-5xl md:text-6xl">
        International care at the <span className="underline">cheapest</span> price.
      </h1>
      <div className="mt-4 w-full max-w-2xl">
        <WaitlistForm />
      </div>
      <ArrowDown
        className="absolute bottom-8 size-6 text-muted-foreground"
        aria-hidden="true"
      />
    </section>
  )
}
