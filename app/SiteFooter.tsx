import { CookieSettingsButton } from "./CookiePreferences";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

const links = [
  ["Product", "/#product"],
  ["Security", "/security"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
  ["Contact", "/contact"],
] as const;

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-primary">
      <div><Link className="footer-mark" href="/" aria-label="Myrakal home"><BrandLogo /></Link><p className="footer-thesis">Healthcare work, resolved.</p></div>
      <nav className="footer-links" aria-label="Footer navigation">{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
      <p className="footer-place">Chicago · 2026</p>
    </div>
    <div className="footer-legal">
      <p><em>Practice-management systems remain the system of record.</em> Myrakal operates within practice-defined permissions and escalates decisions requiring human judgment.</p>
      <CookieSettingsButton />
    </div>
  </footer>;
}
