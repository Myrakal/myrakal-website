import braid from '@/assets/liquid-braid.webp'
import braidSmall from '@/assets/liquid-braid-960.webp'
import ribbons from '@/assets/liquid-ribbons.webp'
import ribbonsSmall from '@/assets/liquid-ribbons-960.webp'
import ripple from '@/assets/liquid-ripple.webp'
import rippleSmall from '@/assets/liquid-ripple-960.webp'
import sphere from '@/assets/liquid-sphere.webp'
import sphereSmall from '@/assets/liquid-sphere-960.webp'
import { Scene } from '@/components/Scene'

export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works" className="bg-ink">
      <div className="flex flex-col items-center gap-6 px-6 pt-32 pb-24 text-center sm:px-12 lg:pt-40 lg:pb-28">
        <p className="font-caslon text-xs tracking-[0.32em] text-champagne uppercase">How it works</p>
        <h2 id="how-it-works" className="max-w-4xl font-display text-4xl leading-tight text-cream sm:text-6xl lg:text-7xl">
          Any care, at home or abroad, <i className="text-champagne">for less.</i>
        </h2>
      </div>
      <Scene
        image={braid}
        imageSmall={braidSmall}
        alt="Two ribbons of claret and gold liquid braiding together against the dark"
        textSide="right"
        numeral="I"
        title="Tell us what you need"
      >
        Come with or without a diagnosis. Our AI gathers your history, labs, imaging, and insurance.
      </Scene>
      <Scene
        image={sphere}
        imageSmall={sphereSmall}
        alt="A sphere of translucent claret liquid suspended above a still surface, lit with gold"
        textSide="left"
        numeral="II"
        title="Get a doctor’s review"
      >
        A licensed doctor reviews your case for a flat $50, credited toward your treatment.
      </Scene>
      <Scene
        image={ribbons}
        imageSmall={ribbonsSmall}
        alt="Four ribbons of translucent claret liquid flowing together in a gentle wave, edged with gold"
        textSide="right"
        numeral="III"
        title="Choose your care"
      >
        Choose care at home, abroad, or both. We book the appointments, travel, and stay, and find your prescriptions
        for less.
      </Scene>
      <Scene
        image={ripple}
        imageSmall={rippleSmall}
        alt="A still claret surface with a single ripple spreading outward, lit with gold"
        textSide="left"
        numeral="IV"
        title="Recover beautifully"
      >
        Rest wherever you choose, with check-ins and aftercare along the way.
      </Scene>
    </section>
  )
}
