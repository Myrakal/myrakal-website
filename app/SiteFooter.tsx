import { CookieSettingsButton } from "./CookiePreferences";

const groups = [
  ["Product", [["How it works", "/#work"], ["Request access", "/request-access"]]],
  ["Company", [["About", "/about"], ["Contact", "/contact"]]],
  ["Trust", [["Security", "/security"], ["Privacy", "/privacy"], ["Terms", "/terms"], ["Accessibility", "/accessibility"]]],
] as const;

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-mark">MYRAKAL</div>
    <p className="footer-thesis">The optimization and execution layer for healthcare operations.</p>
    <div className="footer-links">{groups.map(([title, links]) => <div key={title}><h2>{title}</h2>{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</div>)}<div><h2>Connect</h2><a href="mailto:hello@myrakal.com">hello@myrakal.com</a><CookieSettingsButton /></div></div>
    <div className="footer-legal"><span>© 2026 Myrakal. All rights reserved.</span><span>Healthcare work, resolved.</span></div>
  </footer>;
}
