'use client'

export function TypingIndicator() {
  return (
    <div role="status" className="flex justify-start">
      <span className="sr-only">Myrakal is typing</span>
      <span aria-hidden="true" className="flex gap-1.5 rounded-3xl rounded-bl-md bg-card px-5 py-4">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{ animationDelay: `${i * 150}ms` }}
            className="size-2 rounded-full bg-card-foreground/50 motion-safe:animate-bounce"
          />
        ))}
      </span>
    </div>
  )
}
