import type { Metadata, Viewport } from "next";
import "./globals.css";
import ThemeProviderClient from '@/components/ThemeProviderClient';
import AnimatedFavicon from '@/components/AnimatedFavicon';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "DialforAI | Autonomous AI Agent Platform for Business",
    template: "%s | DialforAI"
  },
  description: "DialforAI is an enterprise-grade Autonomous Agent OS. Deploy AI workers to instantly scale your recruitment, discover prospects, and automate sales outreach powered by GPT-4o.",
  keywords: [
    "AI agents", "autonomous agents", "AI recruiting", "sales automation", 
    "outbound AI", "AI employees", "DialforAI", "GPT-4o agents", 
    "business automation", "lead generation AI"
  ],
  authors: [{ name: "DialforAI Team" }],
  creator: "DialforAI",
  publisher: "DialforAI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.dialforai.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "DialforAI | Autonomous AI Agent Platform",
    description: "Deploy autonomous AI workers to instantly scale your recruitment, discover prospects, and automate sales outreach.",
    url: "https://www.dialforai.com",
    siteName: "DialforAI",
    images: [
      {
        url: 'https://www.dialforai.com/og-image.jpg', // Placeholder, but good practice
        width: 1200,
        height: 630,
        alt: 'DialforAI Dashboard',
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DialforAI | Autonomous AI Agent Platform",
    description: "Deploy autonomous AI workers to instantly scale your recruitment, discover prospects, and automate sales outreach.",
    creator: "@dialforai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        
        {/* SEO Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "DialforAI",
              "operatingSystem": "WebOS",
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "DialforAI is an enterprise-grade Autonomous Agent OS. Deploy AI workers to instantly scale your recruitment, discover prospects, and automate sales outreach powered by GPT-4o.",
              "publisher": {
                "@type": "Organization",
                "name": "DialforAI",
                "url": "https://www.dialforai.com"
              }
            })
          }}
        />
      </head>
      <body>
        <ThemeProviderClient>
          <AnimatedFavicon />
          {children}
        </ThemeProviderClient>
      </body>
    </html>
  );
}
