import glass from '@/assets/scene-glass.webp'
import glassSmall from '@/assets/scene-glass-960.webp'
import glasses from '@/assets/scene-glasses.webp'
import glassesSmall from '@/assets/scene-glasses-960.webp'
import pen from '@/assets/scene-pen.webp'
import penSmall from '@/assets/scene-pen-960.webp'
import watch from '@/assets/scene-watch.webp'
import watchSmall from '@/assets/scene-watch-960.webp'
import { Closing } from '@/components/Closing'
import { Scene } from '@/components/Scene'
import { ScrollScenes } from '@/components/ScrollScenes'

export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works">
      <ScrollScenes>
        <div className="flex min-h-[60svh] flex-col items-center justify-center bg-charcoal px-6 text-center">
          <p className="font-grotesk text-xs tracking-[0.3em] text-champagne uppercase">How it works</p>
          <h2 id="how-it-works" className="mx-auto mt-6 max-w-3xl font-display text-4xl leading-tight text-cream sm:text-6xl">
            Any care, at home or abroad, <i className="text-champagne">for less.</i>
          </h2>
        </div>
        <Scene
          image={pen.src}
          imageSmall={penSmall.src}
          alt="A claret fountain pen with a gold band and clip resting on a cream correspondence card"
          textSide="left"
          numeral="I"
          title="Tell us what you need"
        >
          Come with or without a diagnosis. Our AI gathers your history, labs, imaging, and insurance.
        </Scene>
        <Scene
          image={glasses.src}
          imageSmall={glassesSmall.src}
          alt="Gold-rimmed reading glasses resting on a closed claret leather folder"
          textSide="right"
          numeral="II"
          title="A licensed doctor reviews"
        >
          A licensed doctor reviews your case for a flat $150, credited toward your treatment.
        </Scene>
        <Scene
          image={watch.src}
          imageSmall={watchSmall.src}
          alt="A slim gold dress watch with a blank cream dial lying on its side"
          textSide="left"
          numeral="III"
          title="Everything, arranged"
        >
          Choose care at home, abroad, or both. We book the appointments, travel, and stay, and find your prescriptions
          for less.
        </Scene>
        <Scene
          image={glass.src}
          imageSmall={glassSmall.src}
          alt="A cut crystal glass of water with a slice of blood orange, casting warm light across the linen"
          textSide="right"
          numeral="IV"
          title="Recover beautifully"
        >
          Rest wherever you choose, with check-ins and aftercare along the way.
        </Scene>
        <Closing />
      </ScrollScenes>
    </section>
  )
}
