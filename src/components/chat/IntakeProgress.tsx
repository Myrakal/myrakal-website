export function IntakeProgress({ collected, total }: { collected: number; total: number }) {
  const percent = total > 0 ? Math.min(100, (collected / total) * 100) : 0
  return (
    <div className="px-2 pb-3">
      <div
        role="progressbar"
        aria-label="Intake progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={collected}
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div className="h-full rounded-full bg-primary motion-safe:transition-[width]" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-1.5 text-center text-xs text-muted-foreground">
        {collected} of {total} details collected
      </p>
    </div>
  )
}
