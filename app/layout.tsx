import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Myrakal — Healthcare work, resolved.",
  description: "Myrakal is the resolution layer for healthcare operations—finding unfinished work and keeping it moving until it is resolved.",
  openGraph: {
    title: "Myrakal — Healthcare work, resolved.",
    description: "The resolution layer for healthcare operations.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Myrakal — Healthcare work, resolved.",
    description: "The resolution layer for healthcare operations.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geist.variable} ${mono.variable}`}>{children}</body></html>;
}
