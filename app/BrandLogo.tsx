type BrandLogoProps = { className?: string; compact?: boolean };

export function BrandLogo({ className = "", compact = false }: BrandLogoProps) {
  return <span className={`brand-logo ${compact ? "brand-logo--compact" : ""} ${className}`.trim()}>
    <svg className="brand-logo__monogram" viewBox="0 0 72 64" aria-hidden="true">
      <defs><clipPath id="myrakal-mk-clip"><path d="M5 57V7h13l18 31L54 7h13v50H55V24L40 50h-8L17 24v33H5Z"/><path d="M37 34 57 7h14L49 35l23 22H56L37 38Z"/></clipPath></defs>
      <g clipPath="url(#myrakal-mk-clip)">
        <rect width="72" height="64" fill="currentColor"/>
        <g className="brand-logo__contours" fill="none" strokeWidth="1.35">
          <path d="M-5 9c13-7 23 8 37 2S52 1 79 8"/><path d="M-6 17c12-5 22 7 36 2s25-10 50-2"/><path d="M-5 25c15-7 25 8 39 1s25-8 46 0"/><path d="M-4 34c14-6 25 7 39 1s26-9 46 0"/><path d="M-6 43c14-5 25 7 39 1s25-9 48 1"/><path d="M-5 52c15-6 25 7 40 1s25-8 45 0"/>
        </g>
      </g>
    </svg>
    {!compact && <span className="brand-logo__wordmark">MYRAKAL</span>}
  </span>;
}
