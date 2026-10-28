export type Message = { id: string; role: 'assistant' | 'user'; text: string; link?: { href: string; label: string } }

export function ChatMessage({ message }: { message: Message }) {
  const mine = message.role === 'user'
  return (
    <article
      aria-label={mine ? 'You' : 'Myrakal'}
      className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
    >
      <p
        className={`max-w-[85%] px-5 py-3 text-base leading-7 break-words whitespace-pre-wrap sm:max-w-[75%] ${
          mine
            ? 'border border-champagne/85 bg-velvet text-cream'
            : 'border border-rule border-l-2 border-l-champagne bg-velvet-deep/40 text-cream'
        }`}
      >
        {message.text}
        {message.link && (
          <a
            href={message.link.href}
            className="mt-3 block font-caslon text-xs tracking-[0.26em] text-champagne uppercase underline underline-offset-4"
          >
            {message.link.label}
          </a>
        )}
      </p>
    </article>
  )
}
