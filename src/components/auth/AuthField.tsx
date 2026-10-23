'use client'

import { useId, type ComponentProps } from 'react'

export const authPanelClass =
  'mt-8 flex max-w-md flex-col gap-4 rounded-3xl border border-champagne/25 bg-velvet-deep/50 p-6 shadow-2xl shadow-black/30 sm:p-8'
export const authLabelClass = 'font-grotesk text-[11px] tracking-[0.2em] text-champagne uppercase'
export const authInputClass =
  'h-11 w-full rounded-xl border border-border bg-card px-4 text-base text-card-foreground outline-none focus-visible:ring-2 focus-visible:ring-champagne'

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
