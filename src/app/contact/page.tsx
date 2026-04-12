import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Mail, Phone, Zap } from 'lucide-react';

export const metadata = {
  title: 'Contact Us – StockWise',
  description: 'Get in touch with the StockWise team for support and sales inquiries.',
};

export default function ContactPage() {
  return (
    <main className="overflow-hidden min-h-screen flex flex-col">
      <LandingNavbar />
      <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white text-center px-4 flex-1 flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-md px-4 py-1.5 text-xs font-semibold text-blue-700 tracking-widest uppercase mb-6">
          <Zap size={11} className="fill-blue-600" /> Support & Sales
        </div>
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black text-gray-900 leading-tight tracking-tight max-w-3xl mx-auto mb-5">
          We&apos;re here to <span className="text-blue-500">Help You Grow</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
          Have questions or need assistance? Reach out to our dedicated support and sales teams. We&apos;re always ready to help you optimize your business.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto text-left">
          <div className="bg-white p-6 rounded-md border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-sm bg-blue-50 flex items-center justify-center shrink-0">
              <Mail size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Email Support</h3>
              <p className="text-sm text-gray-500 mb-3">Response within 24 hours</p>
              <a href="mailto:support@stockwise.ng" className="text-blue-600 font-bold">support@stockwise.ng</a>
            </div>
          </div>
          <div className="bg-white p-6 rounded-md border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-sm bg-green-50 flex items-center justify-center shrink-0">
              <Phone size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Phone Support</h3>
              <p className="text-sm text-gray-500 mb-3">Mon-Fri, 9am - 5pm</p>
              <a href="tel:+2348000000000" className="text-green-600 font-bold">+234-800-000-0000</a>
            </div>
          </div>
        </div>
      </section>
      <LandingFooter />
    </main>
  );
}
