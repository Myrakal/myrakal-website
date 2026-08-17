type BrandLogoProps = { className?: string; compact?: boolean };

export function BrandLogo({ className = "", compact = false }: BrandLogoProps) {
  return <span className={`brand-logo ${compact ? "brand-logo--compact" : ""} ${className}`.trim()}>
    {/* The approved monogram is used directly so its hairlines and overlap stay intact. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="brand-logo__monogram" src="/myrakal-monogram.png" alt="" />
    {!compact && <span className="brand-logo__wordmark">MYRAKAL</span>}
  </span>;
}
