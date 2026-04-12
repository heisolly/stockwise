import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Zap, Package, Bell, BarChart3 } from 'lucide-react';

export const metadata = {
  title: 'Inventory Management – StockWise',
  description: 'Powerful stock tracking and management tools for Nigerian retailers.',
};

export default function InventoryManagementPage() {
  const features = [
    {
      title: 'Real-time Stock Tracking',
      description: 'Know exactly what you have in stock at any given time across all your branches.',
      icon: Package,
    },
    {
      title: 'Low Stock Alerts',
      description: 'Get notified before you run out of stock, ensuring you never miss a sale.',
      icon: Bell,
    },
    {
      title: 'Insightful Analytics',
      description: 'Understand which products are your best sellers and which are taking up space.',
      icon: BarChart3,
    },
  ];

  return (
    <main className="overflow-hidden min-h-screen flex flex-col">
      <LandingNavbar />
      <section className="pt-32 pb-20 bg-gradient-to-b from-emerald-50 to-white text-center px-4 flex-1 flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 rounded-md px-4 py-1.5 text-xs font-semibold text-emerald-700 tracking-widest uppercase mb-6">
          <Zap size={11} className="fill-emerald-600" /> Core Feature
        </div>
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black text-gray-900 leading-tight tracking-tight max-w-3xl mx-auto mb-5">
          Inventory Management <span className="text-emerald-500">Made Simple</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
          From simple stock counting to advanced multi-branch inventory tracking — StockWise provides the power and flexibility you need to run your business efficiently.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white p-6 rounded-md border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-sm bg-emerald-50 flex items-center justify-center mb-4">
                <feature.icon size={24} className="text-emerald-600" />
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
