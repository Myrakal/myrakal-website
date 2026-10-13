import { useEffect, useRef } from 'react'
import { PearlRod } from '@/components/PearlRod'
import './Hero.css'

export function Hero() {
  const fabric = useRef<HTMLImageElement>(null)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => fabric.current?.style.setProperty('--fall', `${reduced.matches ? 0 : Math.min(window.scrollY * .12, 95)}px`))
    }
    window.addEventListener('scroll', update, { passive: true })
    reduced.addEventListener('change', update)
    update()
    return () => { window.removeEventListener('scroll', update); reduced.removeEventListener('change', update); cancelAnimationFrame(frame) }
  }, [])
  return (
    <section className="editorial-hero couture-hero" aria-labelledby="hero-title">
      <img className="hero-fabric" src="/images/velvet-scene.webp" alt="" fetchPriority="high" width="1536" height="1024" />
      <div className="couture-hero__composition">
        <PearlRod />
        <div className="couture-hero__copy">
          <p className="hero-folio">Myrakal / A new perspective on care</p>
          <h1 id="hero-title">Care, without<br /><em>borders.</em></h1>
          <p className="hero-description">High-quality healthcare treatment overseas, while staying on budget.</p>
          <a className="hero-invitation" href="#waitlist">Begin your journey <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <a className="hero-scroll" href="#editorial">Discover the Myrakal edit <span aria-hidden="true">↓</span></a>
      <img ref={fabric} className="hero-fabric-fall" src="/images/velvet-drape.webp" alt="" width="2172" height="724" />
    </section>
  )
}
