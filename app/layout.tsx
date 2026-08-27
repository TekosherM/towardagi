import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk, Instrument_Serif } from "next/font/google";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Spotlight } from "@/components/fx/spotlight";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://towardagi.com"),
  title: {
    default: "Toward AGI — Dispatches from the road to AGI",
    template: "%s — Toward AGI",
  },
  description:
    "News, trends, education, and deep dives on AI — plus a live radar that tracks every new model within hours of release.",
  keywords: ["AI", "AGI", "machine learning", "model releases", "AI news", "deep dives"],
  openGraph: {
    title: "Toward AGI",
    description:
      "Dispatches from the road to AGI — news, deep dives, and a live model radar.",
    type: "website",
    siteName: "Toward AGI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toward AGI",
    description: "Dispatches from the road to AGI.",
  },
  alternates: {
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export const viewport: Viewport = {
  themeColor: "#06070a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable} ${instrument.variable}`}
    >
      <body className="noise">
        <Spotlight />
        <Nav />
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
