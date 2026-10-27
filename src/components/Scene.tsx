type Img = { src: string; width: number }

type SceneProps = {
  image: Img
  imageSmall: Img
  alt: string
  textSide: 'left' | 'right'
  numeral: string
  title: string
  children: React.ReactNode
}

export function Scene({ image, imageSmall, alt, textSide, numeral, title, children }: SceneProps) {
  return (
    <div className="grid border-t border-rule last:border-b lg:grid-cols-2">
      <img
        src={image.src}
        srcSet={`${imageSmall.src} ${imageSmall.width}w, ${image.src} ${image.width}w`}
        sizes="(min-width: 1024px) 50vw, 100vw"
        alt={alt}
        loading="lazy"
        className={`aspect-[4/3] w-full object-cover lg:aspect-auto lg:h-[520px]${textSide === 'left' ? ' lg:order-2' : ''}`}
      />
      <div className="flex flex-col justify-center gap-4 px-6 py-12 sm:px-12 lg:px-24">
        <p aria-hidden="true" className="font-caslon text-xs tracking-[0.32em] text-champagne">{numeral}</p>
        <h3 className="font-display text-[clamp(2rem,6vw,2.75rem)] leading-tight text-cream">{title}</h3>
        <p className="max-w-md font-caslon text-lg leading-relaxed text-mist">{children}</p>
      </div>
    </div>
  )
}
