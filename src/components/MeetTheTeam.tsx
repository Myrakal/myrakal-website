export function MeetTheTeam() {
  return (
    <section aria-labelledby="meet-the-team" className="bg-ink px-6 py-24 sm:px-12 lg:py-32">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-14 text-center">
        <div className="flex flex-col items-center gap-6">
          <p className="font-caslon text-xs tracking-[0.32em] text-champagne uppercase">The people behind it</p>
          <h2 id="meet-the-team" className="font-display text-4xl leading-tight text-cream sm:text-6xl">
            Meet the <i className="text-champagne">team.</i>
          </h2>
        </div>
        <div className="aspect-video w-full border border-rule bg-black">
          <video controls playsInline preload="metadata" aria-label="Meet the Myrakal team" className="size-full object-contain" />
        </div>
      </div>
    </section>
  )
}
