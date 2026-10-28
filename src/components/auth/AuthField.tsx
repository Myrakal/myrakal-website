'use client'

import { useId, type ComponentProps } from 'react'

export const authPanelClass =
  'mt-8 flex w-full max-w-md flex-col gap-5 border border-rule bg-velvet-deep/40 p-6 shadow-2xl shadow-black/40 sm:p-8'
export const authLabelClass = 'font-caslon text-xs tracking-[0.26em] text-champagne uppercase'
export const authInputClass =
  'h-11 w-full border border-rule bg-ink/60 px-4 font-caslon text-base text-cream outline-none transition-colors placeholder:text-mist focus-visible:border-champagne focus-visible:ring-1 focus-visible:ring-champagne'
export const authButtonClass =
  'h-12 w-full border border-champagne/85 bg-ink/35 px-8 font-caslon text-xs tracking-[0.28em] text-champagne uppercase transition-colors hover:bg-champagne hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne disabled:pointer-events-none disabled:opacity-50'
export const authLinkClass =
  'font-caslon text-xs tracking-[0.26em] text-mist uppercase underline-offset-4 transition-colors hover:text-champagne hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne'

export function AuthField({ label, ...props }: { label: string } & ComponentProps<'input'>) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={authLabelClass}>
        {label}
      </label>
      <input
        id={id}
        required
        {...props}
        className={authInputClass}
      />
    </div>
  )
}
