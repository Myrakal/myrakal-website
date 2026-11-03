export function TextUsButton({ className = '' }: { className?: string }) {
  return (
    <button
      type="button"
      className={`cursor-pointer border border-champagne/85 bg-ink/35 px-10 py-3.5 font-caslon text-xs tracking-[0.28em] text-champagne uppercase backdrop-blur-sm transition-colors hover:bg-champagne hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne sm:text-[13px] ${className}`}
    >
      Text us!
    </button>
  )
}
