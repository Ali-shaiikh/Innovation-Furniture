import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import Script from "next/script";
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

const BASE_URL = "https://innovationfurniture.in";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
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
    url:         BASE_URL,
    title:       "Innovation Designer Furniture — Luxury Living, Accessible Price",
    description: "Premium designer furniture crafted for Indian homes. Luxury aesthetics at prices that make sense.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Innovation Designer Furniture" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Innovation Designer Furniture",
    description: "Luxury Living Without the Luxury Price",
    images:      ["/og-image.jpg"],
  },
  robots: {
    index:  true,
    follow: true,
  },
  icons: {
    icon:     [{ url: "/logo3.svg", type: "image/svg+xml" }],
    shortcut: "/logo3.svg",
    apple:    "/logo3.svg",
  },
};

export const viewport: Viewport = {
  width:        "device-width",
  initialScale: 1,
  themeColor:   "#1A1410",
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

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

        {/* Google Analytics — only loads when NEXT_PUBLIC_GA_ID is set */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
