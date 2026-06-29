import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import Script from "next/script";
import IntroLoader from "@/components/IntroLoader";
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
    "furniture store Mumbai",
    "luxury furniture Mumbai",
    "designer furniture Mumbai",
    "furniture store Pune",
    "luxury furniture Pune",
    "best furniture company Mumbai",
    "premium sofa Mumbai",
    "designer furniture Hyderabad",
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

const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["FurnitureStore", "Store", "LocalBusiness"],
      "@id": "https://innovationfurniture.in/#business",
      "name": "Innovation Designer Furniture",
      "alternateName": ["IDF", "Innovation Furniture", "Innovation Designer Furniture Mumbai"],
      "url": "https://innovationfurniture.in",
      "logo": "https://innovationfurniture.in/logo3.svg",
      "image": "https://innovationfurniture.in/og-image.jpg",
      "description": "Premium designer furniture store in Mumbai. Luxury sofas, dining tables, beds and accent chairs — inspired by the world's finest makers at prices that make sense for Indian homes.",
      "telephone": "+919892410488",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Office No. 406, 4th Floor, Aaradhya Primus Building, Western Express Highway, near Thakur Mall, Ketkipada, Dahisar East",
        "addressLocality": "Mumbai",
        "addressRegion": "Maharashtra",
        "postalCode": "400068",
        "addressCountry": "IN",
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "19.2432",
        "longitude": "72.8649",
      },
      "hasMap": "https://maps.google.com/?q=Innovation+Designer+Furniture+Dahisar+East+Mumbai",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+919892410488",
        "contactType": "sales",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi", "Marathi"],
      },
      "areaServed": [
        { "@type": "City", "name": "Mumbai" },
        { "@type": "City", "name": "Navi Mumbai" },
        { "@type": "City", "name": "Thane" },
        { "@type": "City", "name": "Pune" },
        { "@type": "City", "name": "Hyderabad" },
        { "@type": "State", "name": "Maharashtra" },
        { "@type": "Country", "name": "India" },
      ],
      "priceRange": "₹₹–₹₹₹",
      "currenciesAccepted": "INR",
      "paymentAccepted": "Cash, Credit Card, Debit Card, UPI, Bank Transfer",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
          "opens": "10:00",
          "closes": "19:00",
        },
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Designer Furniture Collection",
        "itemListElement": [
          { "@type": "OfferCatalog", "name": "Sofas & Sectionals" },
          { "@type": "OfferCatalog", "name": "Dining Tables & Chairs" },
          { "@type": "OfferCatalog", "name": "Beds & Bedroom Furniture" },
          { "@type": "OfferCatalog", "name": "Accent Chairs" },
          { "@type": "OfferCatalog", "name": "Wardrobes & Storage" },
        ],
      },
      "sameAs": [],
    },
    {
      "@type": "WebSite",
      "@id": "https://innovationfurniture.in/#website",
      "url": "https://innovationfurniture.in",
      "name": "Innovation Designer Furniture",
      "description": "Premium designer furniture for Indian homes",
      "publisher": { "@id": "https://innovationfurniture.in/#business" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://innovationfurniture.in/products/{search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
        />
        <IntroLoader />
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
