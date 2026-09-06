import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { LanguageProvider } from '@/context/LanguageContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Durga Puja & Festival Route Optimizer",
  description: "Optimize your pandal hopping route using our advanced 2-Opt TSP engine.",
  openGraph: {
    title: "Durga Puja Route Optimizer",
    description: "Plan your perfect Durga Puja route efficiently. Find the best paths between pandals and avoid crowds.",
    url: "https://durgapuja.optimizer.com",
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
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
