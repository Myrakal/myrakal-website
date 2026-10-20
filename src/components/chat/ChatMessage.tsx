export type Message = { id: string; role: 'assistant' | 'user'; text: string; record?: string }

export function ChatMessage({ message }: { message: Message }) {
  const mine = message.role === 'user'
  return (
    <article
      aria-label={mine ? 'You' : 'Myrakal'}
      className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
    >
      <p
        className={`max-w-[85%] rounded-3xl px-5 py-3 text-base leading-7 break-words whitespace-pre-wrap sm:max-w-[75%] ${
          mine
            ? 'rounded-br-md bg-(image:--pearl-gradient) text-primary-foreground'
            : 'rounded-bl-md bg-card text-card-foreground'
        }`}
      >
        {message.text}
      </p>
    </article>
  )
}
