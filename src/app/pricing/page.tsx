import { LandingNavbar }  from '@/components/landing/LandingNavbar';
import { PricingSection }  from '@/components/landing/PricingSection';
import { LandingFooter }   from '@/components/landing/LandingFooter';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { Zap } from 'lucide-react';

export const metadata = {
  title: 'Pricing – StockWise',
  description: 'Simple, transparent Naira pricing for every stage of your business. Start free, upgrade as you grow.',
};

export default function PricingPage() {
  return (
    <main className="overflow-hidden">
      <LandingNavbar />

      {/* Page hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[#F0F4FF] to-white text-center px-4">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-md px-4 py-1.5 text-xs font-semibold text-blue-600 tracking-widest uppercase mb-6">
          <Zap size={11} className="fill-blue-500" /> Transparent Pricing
        </div>
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black text-gray-900 leading-tight tracking-tight max-w-3xl mx-auto mb-4">
          Simple pricing.{' '}
          <span className="text-blue-500">No surprises.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
          All prices in Nigerian Naira. No hidden foreign exchange markups. Cancel any time.
        </p>
      </section>

      <PricingSection />
      <TestimonialsSection />
      <LandingFooter />
    </main>
  );
}
