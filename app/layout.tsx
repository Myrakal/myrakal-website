import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CookiePreferences } from "./CookiePreferences";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://myrakal-website.eshaanksood.chatgpt.site"),
  title: "Myrakal — Healthcare work, resolved.",
  description: "Myrakal reconstructs unfinished care, remembers what stands in the way, and keeps working the case until there is an outcome.",
  alternates: { canonical: "/" },
  applicationName: "Myrakal",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Myrakal — Healthcare work, resolved.",
    description: "A memory and execution layer for unfinished healthcare work.",
    type: "website",
    url: "/",
    siteName: "Myrakal",
    images: [{ url: "/og-v2.png", width: 1731, height: 909, alt: "Myrakal — Healthcare work, resolved." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Myrakal — Healthcare work, resolved.",
    description: "A memory and execution layer for unfinished healthcare work.",
    images: ["/og-v2.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geist.variable} ${mono.variable}`}><a className="skip-link" href="#main-content">Skip to content</a><div id="main-content">{children}</div><CookiePreferences /></body></html>;
}
