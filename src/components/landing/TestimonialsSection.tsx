'use client';

import { Quote, ArrowRight } from 'lucide-react';

const testimonials = [
  {
    quote: "StockWise is helping our store cut operational losses and reduce turnaround time, while increasing compliance, stock accuracy and effectiveness of our inventory management.",
    name: "Adaeze Okonkwo",
    role: "Owner, Adaeze Fashion Hub — Lagos",
    initials: "AO",
    color: "bg-orange-400",
  },
  {
    quote: "Before StockWise I used paper and Excel. Now I see everything — sales, stock, profit — on my phone. My staff can't steal from me anymore!",
    name: "Musa Aliyu",
    role: "CEO, Aliyu Stores — Kano",
    initials: "MA",
    color: "bg-blue-500",
  },
  {
    quote: "The POS is so fast even my aunt who doesn't like technology learned it in one day. And the Naira reports are exactly what my accountant needs.",
    name: "Funke Adeleke",
    role: "Manager, Funke's Supermart — Ibadan",
    initials: "FA",
    color: "bg-emerald-500",
  },
];

const stats = [
  { value: '2024', label: 'Founded' },
  { value: '500+', label: 'Active Stores' },
  { value: '1k+', label: 'Company Partners' },
  { value: '₦2B+', label: 'Sales Processed' },
];

export function TestimonialsSection() {
  return (
    <section className="py-32 bg-white font-sans overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Main Quote Card */}
        <div className="relative bg-brand-lightBg rounded-md p-10 md:p-24 text-center border border-slate-50 shadow-sm overflow-hidden">
          {/* Subtle Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-brand-lime/10 rounded-full blur-[100px] -ml-32 -mt-32" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-lime/10 rounded-full blur-[100px] -mr-32 -mb-32" />

          {/* Quote Icon Visualization */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-10 relative">
              <div className="absolute inset-0 bg-brand-lime/20 blur-xl rounded-full" />
              <div className="relative w-16 h-16 bg-white rounded-md shadow-sm border border-slate-100 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none" className="text-brand-lime">
                  <path d="M12 28L18 12H22L16 28H12ZM22 28L28 12H32L26 28H22Z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-brand-ultraDarkGreen leading-[1.2] tracking-tight max-w-4xl font-outfit text-balance mb-12">
              "StockWise has completely transformed how we manage our store. We've seen a <span className="text-brand-darkGreen underline decoration-brand-lime decoration-4 underline-offset-4">30% decrease</span> in operational expenses and 100% transparency in our daily sales."
            </h2>

            {/* Founder Profile */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-4 mb-2">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=150&h=150" 
                    alt="Adaeze Okonkwo" 
                    className="w-14 h-14 rounded-full border-[3px] border-white shadow-md object-cover" 
                  />
                  <div className="absolute -right-1 bottom-0 bg-brand-lime w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                    <div className="w-1.5 h-1.5 bg-brand-ultraDarkGreen rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="text-left">
                  <h4 className="text-brand-ultraDarkGreen font-black text-[16px] leading-tight font-outfit tracking-tight">Adaeze Okonkwo</h4>
                  <p className="text-brand-slateGray/50 text-[11px] font-black uppercase tracking-[0.15em] mt-0.5">Founder, Luxe Retail Lagos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Block - Updated for consistency */}
        <div className="mt-8 w-full bg-white rounded-md py-16 px-8 md:px-20 flex flex-col md:flex-row items-center justify-between gap-12 text-center border border-slate-50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
          <div className="flex-1 relative z-10">
            <h3 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black text-brand-ultraDarkGreen leading-none tracking-tighter font-outfit">2024</h3>
            <p className="text-brand-slateGray/40 text-[10px] font-black uppercase tracking-[0.25em] mt-4">StockWise Founded</p>
          </div>
          
          <div className="hidden md:block w-px h-16 bg-brand-ultraDarkGreen/10"></div>
          
          <div className="flex-1 relative z-10">
            <h3 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black text-brand-ultraDarkGreen leading-none tracking-tighter font-outfit">₦2.5B+</h3>
            <p className="text-brand-slateGray/40 text-[10px] font-black uppercase tracking-[0.25em] mt-4">Sales Processed</p>
          </div>
          
          <div className="hidden md:block w-px h-16 bg-brand-ultraDarkGreen/10"></div>
          
          <div className="flex-1 relative z-10">
            <h3 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black text-brand-ultraDarkGreen leading-none tracking-tighter font-outfit">500+</h3>
            <p className="text-brand-slateGray/40 text-[10px] font-black uppercase tracking-[0.25em] mt-4">SME Partners</p>
          </div>
        </div>
      </div>
    </section>
  );
}
