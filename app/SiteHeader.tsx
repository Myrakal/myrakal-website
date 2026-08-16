"use client";

import { useState } from "react";
import Link from "next/link";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <Link className="brand" href="/" aria-label="Myrakal home">MYRAKAL</Link>
    <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}>{open ? "CLOSE" : "MENU"}</button>
    <nav id="site-nav" className={open ? "nav-open" : ""} aria-label="Primary navigation">
      <Link href="/#product" onClick={() => setOpen(false)}>Product</Link>
      <Link href="/#work" onClick={() => setOpen(false)}>How it works</Link>
      <Link href="/#company" onClick={() => setOpen(false)}>Company</Link>
      <Link className="nav-cta" href="/request-access">Request access</Link>
    </nav>
  </header>;
}
