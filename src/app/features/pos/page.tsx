import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Zap, ShoppingCart, CreditCard, Clock } from 'lucide-react';

export const metadata = {
  title: 'Sales & POS – StockWise',
  description: 'Fast, secure POS and real-time sales reporting for your business.',
};

export default function SalesPOSPage() {
  const features = [
    {
      title: 'Fast Checkout',
      description: 'Check out customers in seconds with an intuitive and responsive POS interface.',
      icon: Clock,
    },
    {
      title: 'Multiple Payment Methods',
      description: 'Support cash, card, and bank transfers, with integrated Naira calculations.',
      icon: CreditCard,
    },
    {
      title: 'Real-time Sales Tracking',
      description: 'Monitor your sales in real-time from anywhere, at any time.',
      icon: ShoppingCart,
    },
  ];

  return (
    <main className="overflow-hidden min-h-screen flex flex-col">
      <LandingNavbar />
      <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white text-center px-4 flex-1 flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-md px-4 py-1.5 text-xs font-semibold text-blue-700 tracking-widest uppercase mb-6">
          <Zap size={11} className="fill-blue-600" /> Core Feature
        </div>
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black text-gray-900 leading-tight tracking-tight max-w-3xl mx-auto mb-5">
          Sales & POS <span className="text-blue-500">at Your Fingertips</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
          Keep your customers happy with a fast, secure, and intuitive POS system that works perfectly in the busy Nigerian market.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white p-6 rounded-md border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-sm bg-blue-50 flex items-center justify-center mb-4">
                <feature.icon size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      <LandingFooter />
    </main>
  );
}
