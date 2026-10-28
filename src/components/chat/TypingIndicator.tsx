'use client'

export function TypingIndicator() {
  return (
    <div role="status" className="flex justify-start">
      <span className="sr-only">Myrakal is typing</span>
      <span aria-hidden="true" className="flex gap-1.5 border border-rule border-l-2 border-l-champagne bg-velvet-deep/40 px-5 py-4">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{ animationDelay: `${i * 150}ms` }}
            className="size-2 rounded-full bg-champagne/70 motion-safe:animate-bounce"
          />
        ))}
      </span>
    </div>
  )
}
