const OPTIONS = [
  { name: 'Brightwell Imaging, Chicago', price: '$380', link: 'brightwellimaging.com/mri' },
  { name: 'Fernhollow Diagnostics, Naperville', price: '$425', link: 'fernhollowdx.com/mri' },
]

export function PhoneMockup() {
  return (
    <figure
      aria-label="iPhone showing a text conversation with Myrakal"
      className="relative mx-auto h-[760px] w-[316px] shrink-0 rounded-[3.25rem] border border-mist/30 bg-ink p-[11px] shadow-[0_30px_80px_-20px_var(--ink)] sm:h-[780px] sm:w-[336px]"
    >
      <div className="relative flex size-full flex-col overflow-hidden rounded-[2.5rem] bg-ink text-cream">
        <div aria-hidden="true" className="absolute top-2.5 left-1/2 z-10 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black" />
        <div aria-hidden="true" className="flex items-center justify-between px-7 pt-3.5 font-sans text-[13px] font-semibold">
          <span>9:41</span>
          <span className="text-[11px]">5G</span>
        </div>
        <div className="mt-6 border-b border-cream/10 pb-2.5 text-center">
          <div aria-hidden="true" className="mx-auto mb-1 flex size-9 items-center justify-center rounded-full bg-velvet-light font-display text-base italic">
            M
          </div>
          <p className="font-sans text-[11px] text-cream/85">Myrakal</p>
        </div>
        <ol className="flex min-h-0 flex-1 flex-col justify-end gap-2 overflow-hidden px-3.5 pb-3 font-sans text-[14px] leading-snug">
          <li className="max-w-[80%] self-end rounded-[1.25rem] rounded-br-md bg-imessage px-3.5 py-2 text-white">
            <span className="sr-only">You: </span>
            My MRI quote is $2,400. Is that normal?
          </li>
          <li className="max-w-[80%] self-start rounded-[1.25rem] rounded-bl-md bg-cream/15 px-3.5 py-2 text-cream">
            <span className="sr-only">Myrakal: </span>
            No, that doesn&apos;t sound right. Let me get back to you, I&apos;ll talk to the team.
          </li>
          <li className="max-w-[88%] self-start rounded-[1.25rem] rounded-bl-md bg-cream/15 px-3.5 py-2 text-cream">
            <span className="sr-only">Myrakal: </span>
            Definitely not right. We ran your stuff against our data system and found 2 options closer to you. There&apos;s one in Chicago, and another in Naperville. Here&apos;s the prices and links:
          </li>
          {OPTIONS.map(({ name, price, link }) => (
            <li key={name} data-testid="option" className="max-w-[88%] self-start rounded-[1.25rem] bg-cream/15 px-3.5 py-2 text-cream">
              <span className="sr-only">Myrakal: </span>
              <span className="block font-semibold">{name}</span>
              <span className="block text-cream/85">MRI, {price}</span>
              <span className="block text-imessage underline">{link}</span>
            </li>
          ))}
          <li className="max-w-[80%] self-end rounded-[1.25rem] rounded-br-md bg-imessage px-3.5 py-2 text-white">
            <span className="sr-only">You: </span>
            Can you book the one closest to me?
          </li>
          <li data-testid="typing" className="flex items-center gap-1 self-start rounded-[1.25rem] rounded-bl-md bg-cream/15 px-4 py-3.5">
            <span className="sr-only">Myrakal is typing</span>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                data-dot
                aria-hidden="true"
                style={{ animationDelay: `${i * 150}ms` }}
                className="size-2 rounded-full bg-cream/60 motion-safe:animate-bounce"
              />
            ))}
          </li>
        </ol>
        <div aria-hidden="true" className="mx-3.5 mb-3 flex items-center rounded-full border border-cream/20 px-4 py-2 text-[14px] text-cream/50">
          iMessage
        </div>
        <div aria-hidden="true" className="mx-auto mb-2 h-1 w-[110px] rounded-full bg-cream/80" />
      </div>
    </figure>
  )
}
