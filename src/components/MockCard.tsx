import type { ReactNode } from 'react'

export function MockCard({
  label,
  ghost = false,
  children,
}: {
  label: string
  ghost?: boolean
  children: ReactNode
}) {
  return (
    <div className="w-full max-w-lg rounded-3xl border border-border bg-background p-6 shadow-xl sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          {label}
        </span>
        <span className="text-xs text-muted-foreground">
          {ghost ? 'Coming soon' : ''}
        </span>
      </div>
      {children}
    </div>
  )
}
