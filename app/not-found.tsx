import { SiteHeader } from "./SiteHeader";
import Link from "next/link";
export default function NotFound(){return <main className="not-found"><SiteHeader /><p className="utility-label">404 / UNRESOLVED</p><h1>This page has no next action.</h1><Link className="button-light" href="/">Return home →</Link></main>}
