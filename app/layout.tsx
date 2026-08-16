import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CookiePreferences } from "./CookiePreferences";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://myrakal-website.eshaanksood.chatgpt.site"),
  title: "Myrakal — Healthcare operations, optimized.",
  description: "Myrakal understands the operational state of a healthcare practice, decides what should happen next, and drives work toward resolution.",
  alternates: { canonical: "/" },
  applicationName: "Myrakal",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Myrakal — Healthcare operations, optimized.",
    description: "The optimization and execution layer for healthcare operations.",
    type: "website",
    url: "/",
    siteName: "Myrakal",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Myrakal — Healthcare operations, optimized." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Myrakal — Healthcare operations, optimized.",
    description: "The optimization and execution layer for healthcare operations.",
    images: ["/twitter-image.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geist.variable} ${mono.variable}`}><a className="skip-link" href="#main-content">Skip to content</a><div id="main-content">{children}</div><CookiePreferences /></body></html>;
}
