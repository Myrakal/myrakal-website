"use client";
/* eslint-disable @next/next/no-html-link-for-pages */

import { useState } from "react";
import { BrandLogo } from "./BrandLogo";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <a className="brand" href="/" aria-label="Myrakal home"><BrandLogo /></a>
    <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}>{open ? "CLOSE" : "MENU"}</button>
    <nav id="site-nav" className={open ? "nav-open" : ""} aria-label="Primary navigation">
      <a href="/#product" onClick={() => setOpen(false)}>Product</a>
      <a href="/#decision" onClick={() => setOpen(false)}>Method</a>
      <a className="nav-cta" href="/request-access">Request access</a>
    </nav>
  </header>;
}
