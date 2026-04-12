import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Zap } from 'lucide-react';

export const metadata = {
  title: 'Solutions – StockWise',
  description: 'Tailored solutions for every type of retail and wholesale business in Nigeria.',
};

export default function SolutionsPage() {
  return (
    <main className="overflow-hidden min-h-screen flex flex-col">
      <LandingNavbar />
      <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white text-center px-4 flex-1 flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-md px-4 py-1.5 text-xs font-semibold text-blue-700 tracking-widest uppercase mb-6">
          <Zap size={11} className="fill-blue-600" /> Versatile Solutions
        </div>
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black text-gray-900 leading-tight tracking-tight max-w-3xl mx-auto mb-5">
          Solutions for <span className="text-blue-500">Every Business</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
          Whether you&apos;re a micro-retailer, a wholesaler, or managing a multi-branch supermarket, StockWise has the perfect tools to streamline your operations and drive growth.
        </p>
      </section>
      <LandingFooter />
    </main>
  );
}
