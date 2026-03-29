import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

// ─── Fonts ─────────────────────────────────────────────────────────────────────

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    template: "%s | Innovation Designer Furniture",
    default:  "Innovation Designer Furniture — Luxury Living, Accessible Price",
  },
  description:
    "Premium designer furniture inspired by the world's finest makers. Crafted for Indian homes — luxury aesthetics at prices that make sense.",
  keywords: [
    "luxury furniture India",
    "designer sofas",
    "premium home furniture",
    "affordable luxury furniture",
    "replica designer furniture",
    "modern furniture India",
    "Innovation Designer Furniture",
  ],
  openGraph: {
    type:        "website",
    siteName:    "Innovation Designer Furniture",
    locale:      "en_IN",
    title:       "Innovation Designer Furniture",
    description: "Luxury Living Without the Luxury Price",
  },
  robots: {
    index:  true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width:        "device-width",
  initialScale: 1,
  themeColor:   "#1A1410",
};

// ─── Root Layout ───────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="page-wrapper antialiased">
        {children}
      </body>
    </html>
  );
}
