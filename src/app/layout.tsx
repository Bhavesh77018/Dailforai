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
  title: "DialforAI — AI Agent Platform",
  description: "Autonomous AI agents for recruitment, sales outreach, and prospect discovery. Powered by GPT-4o.",
  metadataBase: new URL('https://www.dialforai.com'),
  openGraph: {
    title: "DialforAI — AI Agent Platform",
    description: "Autonomous AI agents for recruitment, sales outreach, and prospect discovery.",
    url: "https://www.dialforai.com",
    siteName: "DialforAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DialforAI — AI Agent Platform",
    description: "Autonomous AI agents for recruitment, sales outreach, and prospect discovery.",
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
