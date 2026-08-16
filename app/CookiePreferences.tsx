"use client";

import { useEffect, useState } from "react";

export function CookiePreferences() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener("myrakal:cookie-settings", show);
    return () => window.removeEventListener("myrakal:cookie-settings", show);
  }, []);
  if (!open) return null;
  return <div className="consent-backdrop" role="presentation" onMouseDown={() => setOpen(false)}>
    <section className="consent-panel" role="dialog" aria-modal="true" aria-labelledby="privacy-controls" onMouseDown={(event) => event.stopPropagation()}>
      <p className="utility-label">PRIVACY CONTROLS</p><h2 id="privacy-controls">A quiet site by default.</h2>
      <p>This website currently uses only technology required to deliver the site and remember essential preferences. No optional analytics or marketing trackers are enabled.</p>
      <div className="consent-row"><span><b>NECESSARY</b><small>Site delivery and security</small></span><strong>ALWAYS ON</strong></div>
      <button className="button-light" type="button" onClick={() => setOpen(false)}>Done</button>
    </section>
  </div>;
}

export function CookieSettingsButton() {
  return <button className="footer-button" type="button" onClick={() => window.dispatchEvent(new Event("myrakal:cookie-settings"))}>Cookie settings</button>;
}
