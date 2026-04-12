import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Zap } from 'lucide-react';

export const metadata = {
  title: 'Careers – StockWise',
  description: 'Join the mission to empower Nigerian SMEs with smart technology.',
};

export default function CareersPage() {
  return (
    <main className="overflow-hidden min-h-screen flex flex-col">
      <LandingNavbar />
      <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white text-center px-4 flex-1 flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-md px-4 py-1.5 text-xs font-semibold text-blue-700 tracking-widest uppercase mb-6">
          <Zap size={11} className="fill-blue-600" /> Join Our Team
        </div>
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black text-gray-900 leading-tight tracking-tight max-w-3xl mx-auto mb-5">
          Work with Purpose <span className="text-blue-500">at StockWise</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
          We&apos;re looking for talented, passionate individuals to help us build the future of inventory management in Nigeria. Join our mission and make a real difference for small and medium-sized businesses.
        </p>
      </section>
      <LandingFooter />
    </main>
  );
}
