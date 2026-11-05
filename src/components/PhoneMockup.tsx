'use client'

import { Fragment, useEffect, useRef, useState, useSyncExternalStore } from 'react'

type Option = { name: string; price: string; link: string }
type Item = { from: 'you' | 'myrakal'; text?: string; option?: Option }

const OPTIONS: Option[] = [
  { name: 'Brightwell Dental Studio, Chicago', price: '$7,200', link: 'brightwelldental.com/veneers' },
  { name: 'Fernhollow Dentistry, Naperville', price: '$7,900', link: 'fernhollowdental.com/veneers' },
]

const ITEMS: Item[] = [
  { from: 'you', text: 'My dentist quoted me $12,000 for 8 porcelain veneers. Is that normal?' },
  { from: 'myrakal', text: "No, that doesn't sound right. Let me get back to you, I'll talk to the team." },
  {
    from: 'myrakal',
    text: "Definitely not right. We ran your stuff against our data system and found 2 options closer to you. There's one in Chicago, and another in Naperville. Here's the prices and links:",
  },
  ...OPTIONS.map((option): Item => ({ from: 'myrakal', option })),
  { from: 'you', text: 'Can you book the one closest to me?' },
]

const REDUCED = '(prefers-reduced-motion: reduce)'

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(REDUCED)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

const RECEIPTS = { sending: 'Sending…', delivered: 'Delivered', read: 'Read' }

const ENTER = 'motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300'
const SENT = 'self-end rounded-[1.375rem] rounded-br-md bg-imessage px-3.5 py-2 text-white'
const RECEIVED = 'self-start rounded-[1.375rem] rounded-bl-md bg-cream/15 px-3.5 py-2 text-cream'

function Body({ text, option }: Item) {
  if (!option) return text
  return (
    <>
      <span className="block font-semibold">{option.name}</span>
      <span className="block text-cream/85">8 porcelain veneers, {option.price}</span>
      <span className="block text-imessage underline">{option.link}</span>
    </>
  )
}

export function PhoneMockup() {
  const animate = useSyncExternalStore(
    subscribe,
    () => !window.matchMedia(REDUCED).matches,
    () => true,
  )
  const [played, setPlayed] = useState(0)
  const [isTyping, setTyping] = useState(false)
  const [sentStatus, setReceipt] = useState<keyof typeof RECEIPTS | null>(null)
  const count = animate ? played : ITEMS.length
  const typing = animate ? isTyping : true
  const receipt = animate ? sentStatus : 'read'
  const lastSent = ITEMS.slice(0, count).map((item) => item.from).lastIndexOf('you')
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!animate) return
    const timers = new Set<ReturnType<typeof setTimeout>>()
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const timer = setTimeout(() => {
          timers.delete(timer)
          resolve()
        }, ms)
        timers.add(timer)
      })
    const play = async () => {
      await wait(900)
      for (let i = 0; i < ITEMS.length; i++) {
        const { from, text, option } = ITEMS[i]
        if (option) await wait(450)
        else if (from === 'you') {
          for (let n = 1; n <= text!.length; n++) {
            setDraft(text!.slice(0, n))
            await wait(45)
          }
          await wait(350)
          setDraft('')
        } else {
          setTyping(true)
          await wait(i === 1 ? 1600 : 1900)
          setTyping(false)
        }
        setPlayed(i + 1)
        if (from === 'you') {
          setReceipt('sending')
          await wait(500)
          setReceipt('delivered')
          await wait(700)
          setReceipt('read')
        }
        await wait(500)
      }
      setTyping(true)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        void play()
      },
      { threshold: 0.5 },
    )
    observer.observe(inputRef.current!)
    return () => {
      observer.disconnect()
      setPlayed(0)
      setReceipt(null)
      setDraft('')
      setTyping(false)
      timers.forEach(clearTimeout)
    }
  }, [animate])

  return (
    <figure
      aria-label="iPhone showing a text conversation with Myrakal"
      className="relative m-0 mx-auto h-[calc(876px*var(--s))] w-[calc(417px*var(--s))] shrink-0 [--s:0.8] sm:[--s:0.84]"
    >
      <div className="absolute top-0 left-0 h-[876px] w-[417px] origin-top-left scale-[var(--s)] rounded-[68px] border-[3px] border-mist/40 bg-black p-[9px] shadow-[0_30px_80px_-20px_var(--ink)]">
        <div aria-hidden="true" className="absolute top-[118px] -left-[6px] h-8 w-[3px] rounded-l bg-mist/40" />
        <div aria-hidden="true" className="absolute top-[178px] -left-[6px] h-[60px] w-[3px] rounded-l bg-mist/40" />
        <div aria-hidden="true" className="absolute top-[250px] -left-[6px] h-[60px] w-[3px] rounded-l bg-mist/40" />
        <div aria-hidden="true" className="absolute top-[210px] -right-[6px] h-[96px] w-[3px] rounded-r bg-mist/40" />
        <div className="relative flex size-full flex-col overflow-hidden rounded-[55px] bg-ink text-cream">
          <div aria-hidden="true" className="absolute top-[11px] left-1/2 z-10 h-[37px] w-[126px] -translate-x-1/2 rounded-full bg-black" />
          <div data-status-bar aria-hidden="true" className="flex items-center justify-between px-9 pt-[19px] font-sans text-[15px] leading-[18px] font-medium">
            <span>Halcyon</span>
            <span className="flex items-center gap-[6px]">
              <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
                <rect x="0" y="8" width="3" height="4" rx="0.8" />
                <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
                <rect x="10" y="3" width="3" height="9" rx="0.8" />
                <rect x="15" y="0" width="3" height="12" rx="0.8" />
              </svg>
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M1.5 4.2a10 10 0 0 1 14 0" />
                <path d="M4 6.9a6.4 6.4 0 0 1 9 0" />
                <path d="M6.4 9.4a3 3 0 0 1 4.2 0" />
                <circle cx="8.5" cy="11" r="0.6" fill="currentColor" />
              </svg>
              <svg width="27" height="13" viewBox="0 0 27 13" fill="currentColor">
                <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" strokeOpacity="0.4" />
                <rect x="2" y="2" width="15" height="9" rx="2" />
                <path d="M25 4.5v4c.8-.3 1.5-1.1 1.5-2s-.7-1.7-1.5-2Z" opacity="0.4" />
              </svg>
            </span>
          </div>
          <div className="mt-6 border-b border-cream/10 pb-3 text-center">
            <div aria-hidden="true" className="mx-auto mb-1 flex size-[50px] items-center justify-center rounded-full bg-velvet-light font-display text-xl italic">
              M
            </div>
            <p className="font-sans text-xs text-cream/85">Myrakal</p>
          </div>
          <ol className="sr-only">
            {ITEMS.map(({ from, text, option }) => (
              <li key={text ?? option!.name}>
                {from === 'you' ? 'You: ' : 'Myrakal: '}
                <Body text={text} option={option} from={from} />
              </li>
            ))}
          </ol>
          <ol data-chat aria-hidden="true" className="flex min-h-0 flex-1 flex-col justify-end gap-2 overflow-hidden px-3 pb-3 font-sans text-base leading-snug">
            {ITEMS.slice(0, count).map(({ from, text, option }, i) => (
              <Fragment key={text ?? option!.name}>
                <li
                  data-testid={option ? 'option' : undefined}
                  className={`${from === 'you' ? SENT : RECEIVED} ${!text || text.length > 90 ? 'max-w-[88%]' : 'max-w-[80%]'} ${ENTER}`}
                >
                  <Body text={text} option={option} from={from} />
                </li>
                {i === lastSent && receipt && (
                  <li data-testid="receipt" className="-mt-1.5 self-end pr-2 text-xs font-semibold text-cream/50">
                    {RECEIPTS[receipt]}
                  </li>
                )}
              </Fragment>
            ))}
            {typing && (
            <li data-testid="typing" className={`flex items-center gap-1 self-start rounded-[1.375rem] rounded-bl-md bg-cream/15 px-4 py-3.5 ${ENTER}`}>
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
            )}
          </ol>
          <div ref={inputRef} aria-hidden="true" className="mx-3 mb-2 flex items-center gap-2">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cream/15 text-xl leading-none">+</span>
            <span className="relative flex min-h-9 flex-1 items-end gap-2 rounded-[18px] border border-cream/20 py-1.5 pr-1.5 pl-4 font-sans text-base">
              <span data-testid="draft" className="flex-1 py-px break-words text-cream">
                {draft}
              </span>
              {draft ? (
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-imessage text-sm leading-none font-bold text-white">↑</span>
              ) : (
                <span className="absolute text-cream/50">iMessage</span>
              )}
            </span>
          </div>
          <div aria-hidden="true" className="mx-auto mb-2 h-[5px] w-[134px] rounded-full bg-cream/80" />
        </div>
      </div>
    </figure>
  )
}
