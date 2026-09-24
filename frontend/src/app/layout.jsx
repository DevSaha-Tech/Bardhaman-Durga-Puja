import { Noto_Serif_Bengali, Noto_Sans_Bengali, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { LanguageProvider } from '@/context/LanguageContext';
import SiteTracker from '@/components/SiteTracker';
import FeedbackMount from '@/components/FeedbackMount';

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["bengali"],
  weight: ["600", "700"],
  variable: "--font-bengali-serif",
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600"],
  variable: "--font-bengali-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL('https://cholopujo.devsaha.tech'),
  
  title: {
    default: 'Cholo Pujo, Bardhaman Durga Puja 2026 Route Planner',
    template: '%s | Cholo Pujo',
  },
  
  description: 'Plan your Durga Puja pandal hopping in Bardhaman and Katwa. Free route planner with Bengali voice navigation. Start from where you are, end at the same place.',
  
  keywords: [
    'Durga Puja Bardhaman',
    'Bardhaman pandal hopping',
    'Katwa Durga Puja',
    'puja route planner',
    'pandal map Bardhaman',
    'Bengali navigation',
    'Cholo Pujo',
  ],
  
  authors: [{ name: 'DevSaha Tech', url: 'https://devsaha.tech' }],
  creator: 'DevSaha Tech',
  publisher: 'DevSaha Tech',
  
  applicationName: 'Cholo Pujo',
  
  alternates: {
    canonical: 'https://cholopujo.devsaha.tech',
    languages: {
      'bn-IN': 'https://cholopujo.devsaha.tech',
      'en-IN': 'https://cholopujo.devsaha.tech',
    },
  },
  
  openGraph: {
    type: 'website',
    locale: 'bn_IN',
    alternateLocale: ['en_IN'],
    url: 'https://cholopujo.devsaha.tech',
    siteName: 'Cholo Pujo',
    title: 'Cholo Pujo, Bardhaman Durga Puja 2026 Route Planner',
    description: 'Plan your Durga Puja pandal hopping in Bardhaman and Katwa. Free, no login.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Cholo Pujo, Bardhaman Durga Puja Route Planner',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Cholo Pujo, Bardhaman Durga Puja 2026 Route Planner',
    description: 'Plan your Durga Puja pandal hopping in Bardhaman and Katwa. Free.',
    images: ['/logo.png'],
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
  
  verification: {
    // If you have a Google verification code from Search Console
    // (URL prefix property), add it here:
    // google: 'your-verification-code',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Cholo Pujo",
  "url": "https://cholopujo.devsaha.tech",
  "description": "Route planner for Durga Puja pandal hopping in Bardhaman and Katwa",
  "applicationCategory": "NavigationApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR"
  }
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      suppressHydrationWarning
      className={`${notoSerifBengali.variable} ${notoSansBengali.variable} ${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          id="json-ld"
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#FAF6EE] text-[#1F1B16]">
        <LanguageProvider>
          <SiteTracker />
          {children}
          <FeedbackMount />
        </LanguageProvider>
      </body>
    </html>
  );
}
