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
        className="h-1.5 w-full overflow-hidden bg-rule"
      >
        <div className="h-full bg-champagne motion-safe:transition-[width]" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-center font-caslon text-xs tracking-[0.26em] text-mist uppercase">
        {collected} of {total} details collected
      </p>
    </div>
  )
}
