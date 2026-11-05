const MESSAGES = [
  { from: 'you', text: 'My MRI quote is $2,400. Is that normal?' },
  { from: 'myrakal', text: 'Not even close. Same scan, 6 miles away: $380, cash price.' },
  { from: 'you', text: 'Wait, really? Can you book it?' },
  { from: 'myrakal', text: 'Done. Thursday at 9:15am. Free to use, always.' },
]

export function PhoneMockup() {
  return (
    <figure
      aria-label="iPhone showing a text conversation with Myrakal"
      className="relative mx-auto h-[640px] w-[316px] shrink-0 rounded-[3.25rem] border border-mist/30 bg-ink p-[11px] shadow-[0_30px_80px_-20px_var(--ink)] sm:h-[680px] sm:w-[336px]"
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
        <ol className="flex flex-1 flex-col justify-end gap-2 px-3.5 pb-4 font-sans text-[15px] leading-snug">
          {MESSAGES.map(({ from, text }, i) => (
            <li
              key={i}
              className={
                from === 'you'
                  ? 'max-w-[78%] self-end rounded-[1.25rem] rounded-br-md bg-imessage px-3.5 py-2 text-white'
                  : 'max-w-[78%] self-start rounded-[1.25rem] rounded-bl-md bg-cream/15 px-3.5 py-2 text-cream'
              }
            >
              <span className="sr-only">{from === 'you' ? 'You: ' : 'Myrakal: '}</span>
              {text}
            </li>
          ))}
        </ol>
        <div aria-hidden="true" className="mx-3.5 mb-3 flex items-center rounded-full border border-cream/20 px-4 py-2 text-[14px] text-cream/50">
          iMessage
        </div>
        <div aria-hidden="true" className="mx-auto mb-2 h-1 w-[110px] rounded-full bg-cream/80" />
      </div>
    </figure>
  )
}
