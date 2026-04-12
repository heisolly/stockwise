import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Zap } from 'lucide-react';

export const metadata = {
  title: 'Product – StockWise',
  description: 'Explore the powerful features and capabilities of StockWise.',
};

export default function ProductPage() {
  return (
    <main className="overflow-hidden min-h-screen flex flex-col">
      <LandingNavbar />
      <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white text-center px-4 flex-1 flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-md px-4 py-1.5 text-xs font-semibold text-blue-700 tracking-widest uppercase mb-6">
          <Zap size={11} className="fill-blue-600" /> The Core Platform
        </div>
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black text-gray-900 leading-tight tracking-tight max-w-3xl mx-auto mb-5">
          A Single Solution to <span className="text-blue-500">Manage Everything</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
          From stock tracking and real-time sales reporting to AI-powered growth insights — StockWise is the all-in-one command center for your business.
        </p>
      </section>
      <LandingFooter />
    </main>
  );
}
