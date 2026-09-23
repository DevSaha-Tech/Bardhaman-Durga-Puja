import Navbar from '@/components/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeatureCards from '@/components/landing/FeatureCards';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import WhyCholoPujo from '@/components/landing/WhyCholoPujo';
import CitiesCovered from '@/components/landing/CitiesCovered';
import LocalBusinesses from '@/components/landing/LocalBusinesses';
import SupportProject from '@/components/landing/SupportProject';
import EmergencyNumbers from '@/components/landing/EmergencyNumbers';
import LandingFooter from '@/components/landing/LandingFooter';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF6EE] text-[#1F1B16] font-sans antialiased">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Landing Sections (Strict Order 1-8) */}
      <div className="pt-16 md:pt-20">
        <HeroSection />
        <FeatureCards />
        <HowItWorksSection />
        <WhyCholoPujo />
        <CitiesCovered />
        <LocalBusinesses />
        <SupportProject />
        <EmergencyNumbers />
      </div>

      {/* Footer */}
      <LandingFooter />
    </main>
  );
}
