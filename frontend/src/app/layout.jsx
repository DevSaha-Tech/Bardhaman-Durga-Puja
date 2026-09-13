import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { LanguageProvider } from '@/context/LanguageContext';
import SiteTracker from '@/components/SiteTracker';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://puja.devsaha.tech'),
  title: "Bardhaman Durga Puja 2026 — Pandal Guide & Route Planner",
  description: "Find and plan the best Durga Puja pandal route in Bardhaman. Free, no login, works offline.",
  alternates: {
    canonical: 'https://puja.devsaha.tech',
  },
  openGraph: {
    title: "Durga Puja Route Optimizer",
    description: "Plan your perfect Durga Puja route efficiently. Find the best paths between pandals and avoid crowds.",
    url: "https://puja.devsaha.tech",
    siteName: "Durga Puja Optimizer",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <LanguageProvider>
          <SiteTracker />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
