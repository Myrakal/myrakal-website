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
          The right prescription, <i className="text-champagne">at the best price.</i>
        </h2>
      </div>
      <Scene
        image={braid}
        imageSmall={braidSmall}
        alt="Two ribbons of claret and gold liquid braiding together against the dark"
        textSide="right"
        numeral="I"
        title="Tell us"
      >
        Share the prescription you need or take.
      </Scene>
      <Scene
        image={sphere}
        imageSmall={sphereSmall}
        alt="A sphere of translucent claret liquid suspended above a still surface, lit with gold"
        textSide="left"
        numeral="II"
        title="We compare"
      >
        We search pharmacies to find the best price.
      </Scene>
      <Scene
        image={ribbons}
        imageSmall={ribbonsSmall}
        alt="Four ribbons of translucent claret liquid flowing together in a gentle wave, edged with gold"
        textSide="right"
        numeral="III"
        title="We coordinate"
      >
        We handle the paperwork and the delivery.
      </Scene>
      <Scene
        image={ripple}
        imageSmall={rippleSmall}
        alt="A still claret surface with a single ripple spreading outward, lit with gold"
        textSide="left"
        numeral="IV"
        title="A doctor reviews"
      >
        A licensed doctor reviews every prescription.
      </Scene>
    </section>
  )
}
