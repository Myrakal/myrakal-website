import { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function UtilityPage({ label, title, intro, children }: { label: string; title: string; intro?: string; children: ReactNode }) {
  return <main className="utility-page"><SiteHeader /><header className="utility-hero"><p className="utility-label">{label}</p><h1>{title}</h1>{intro && <p>{intro}</p>}</header><div className="utility-content">{children}</div><SiteFooter /></main>;
}
