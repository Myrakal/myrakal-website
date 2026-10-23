'use client'

import { useId, type ComponentProps } from 'react'

export function AuthField({ label, ...props }: { label: string } & ComponentProps<'input'>) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        required
        {...props}
        className="h-11 w-full rounded-xl border border-border bg-card px-4 text-base outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
      />
    </div>
  )
}
