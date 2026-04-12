import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { DashboardPreview } from '@/components/landing/DashboardPreview';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { IntegrationsSection } from '@/components/landing/IntegrationsSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-brand-lightBg">
      <LandingNavbar />
      <HeroSection />
      <DashboardPreview />
      <FeaturesSection />
      <IntegrationsSection />
      <TestimonialsSection />
      <PricingSection />
      <LandingFooter />
    </main>
  );
}
