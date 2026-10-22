type SceneProps = {
  image: string
  imageSmall: string
  alt: string
  textSide: 'left' | 'right'
  numeral: string
  title: string
  children: React.ReactNode
}

export function Scene({ image, imageSmall, alt, textSide, numeral, title, children }: SceneProps) {
  const left = textSide === 'left'
  return (
    <section className="relative isolate flex flex-col overflow-hidden bg-charcoal lg:min-h-[90svh] lg:flex-row lg:items-center">
      <img
        src={image}
        srcSet={`${imageSmall} 960w, ${image} 1672w`}
        sizes="100vw"
        alt={alt}
        loading="lazy"
        className={`aspect-[4/3] w-full object-cover sm:aspect-video lg:absolute lg:inset-0 lg:-z-20 lg:aspect-auto lg:size-full ${left ? 'object-[75%_50%]' : 'object-[25%_50%]'}`}
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 hidden from-charcoal/85 via-charcoal/60 via-35% to-transparent to-60% lg:block ${left ? 'bg-linear-to-r' : 'bg-linear-to-l'}`}
      />
      <div className={`mx-auto flex w-full max-w-7xl px-6 pt-10 pb-16 sm:px-12 lg:py-16 ${left ? 'justify-start' : 'justify-end'}`}>
        <div className="max-w-md">
          <p aria-hidden="true" className="font-grotesk text-xs tracking-[0.3em] text-champagne uppercase">{numeral}</p>
          <h3 className="mt-4 font-display text-4xl leading-tight text-cream sm:text-5xl">{title}</h3>
          <p className="mt-5 font-grotesk text-base leading-relaxed text-cream/85">{children}</p>
        </div>
      </div>
    </section>
  )
}
