import { LandingNavbar }      from '@/components/landing/LandingNavbar';
import { FeaturesSection }     from '@/components/landing/FeaturesSection';
import { IntegrationsSection } from '@/components/landing/IntegrationsSection';
import { DashboardPreview }    from '@/components/landing/DashboardPreview';
import { LandingFooter }       from '@/components/landing/LandingFooter';
import { Zap } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Features – StockWise',
  description: 'Explore all the powerful features that make StockWise the #1 inventory management tool for Nigerian SMEs.',
};

export default function FeaturesPage() {
  return (
    <main className="overflow-hidden">
      <LandingNavbar />

      {/* Page Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white text-center px-4">
        <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-md px-4 py-1.5 text-xs font-semibold text-blue-700 tracking-widest uppercase mb-6">
          <Zap size={11} className="fill-blue-600" /> Everything You Need
        </div>
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black text-gray-900 leading-tight tracking-tight max-w-3xl mx-auto mb-5">
          Built for the realities of{' '}
          <span className="text-blue-500">Nigerian business</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
          From busy open markets to multi-branch supermarkets — StockWise adapts to how you run
          your business, not the other way around.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-md shadow-md transition-all"
        >
          Start Now
        </Link>
      </section>

      <FeaturesSection />
      <DashboardPreview />
      <IntegrationsSection />
      <LandingFooter />
    </main>
  );
}
