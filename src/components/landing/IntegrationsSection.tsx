'use client';

import { Users, ArrowRight } from 'lucide-react';

export function IntegrationsSection() {
  const integrations = [
    { name: 'WhatsApp', icon: 'W', color: 'bg-[#25D366]', pos: 'top-0 left-0 scale-90 opacity-60' },
    { name: 'Shopify', icon: 'S', color: 'bg-[#96bf48]', pos: 'top-12 left-24' },
    { name: 'Excel', icon: 'X', color: 'bg-[#217346]', pos: 'top-4 left-52 scale-110' },
    { name: 'QuickBooks', icon: 'Q', color: 'bg-[#2ca01c]', pos: 'top-32 left-8 scale-105' },
    { name: 'Stripe', icon: 'S', color: 'bg-[#635bff]', pos: 'top-40 left-36' },
    { name: 'Paystack', icon: 'P', color: 'bg-[#09a5db]', pos: 'top-32 left-64 scale-95' },
    { name: 'Google', icon: 'G', color: 'bg-[#4285F4]', pos: 'top-60 left-16 opacity-70' },
    { name: 'Mailchimp', icon: 'M', color: 'bg-[#FFE01B]', pos: 'top-64 left-48 scale-110' },
    { name: 'Slack', icon: 'S', color: 'bg-[#4A154B]', pos: 'top-56 left-72 opacity-50' },
  ];

  return (
    <section className="py-32 bg-white font-sans overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="relative bg-brand-ultraDarkGreen rounded-md p-10 md:p-24 overflow-hidden border border-white/5 shadow-2xl">
          {/* Subtle background glow effects */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-lime/10 rounded-full blur-[120px] -mr-40 -mt-40 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-lime/5 rounded-full blur-[100px] -ml-20 -mb-20" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Left Column: Content */}
            <div className="flex flex-col items-start text-left lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-black text-brand-lime tracking-[0.2em] uppercase mb-10 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-lime shadow-[0_0_8px_rgba(209,250,111,0.6)]" />
                ECOSYSTEM
              </div>
              
              <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-white leading-[1.05] tracking-tighter font-outfit mb-8">
                Don't replace.<br />
                <span className="text-brand-lime">Integrate.</span>
              </h2>
              
              <p className="text-white/50 text-lg font-medium leading-relaxed max-w-md mb-12">
                StockWise works with the tools you already use. Seamlessly sync your inventory with POS, accounting, and logistics platforms in one click.
              </p>
              
              <button className="group flex items-center gap-3 px-10 py-5 bg-brand-lime text-brand-ultraDarkGreen font-black text-[13px] tracking-[0.15em] uppercase rounded-md transition-all hover:bg-white hover:-translate-y-1 shadow-[0_20px_40px_-10px_rgba(209,250,111,0.3)]">
                Explore all tools
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Right Column: Integration Cloud Visualization */}
            <div className="lg:w-1/2 w-full relative h-[450px] md:h-[550px] perspective-[2000px]">
              <div className="relative w-full h-full transform rotate-[-5deg] scale-95 md:scale-100 origin-center">
                {integrations.map((item, i) => (
                  <div 
                    key={i}
                    className={`absolute ${item.pos} group cursor-pointer transition-all duration-700 hover:z-50`}
                  >
                    <div className="relative p-0.5 bg-white/5 rounded-md border border-white/10 backdrop-blur-xl group-hover:border-brand-lime/40 transition-all group-hover:scale-110 group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_-12px_rgba(209,250,111,0.2)]">
                      <div className={`w-14 h-14 md:w-20 md:h-20 ${item.color} rounded-sm flex items-center justify-center text-white text-xl md:text-3xl font-black shadow-inner`}>
                        {item.icon}
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 px-3 py-1 bg-white/10 border border-white/10 rounded-md text-[10px] font-black text-white/40 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all group-hover:translate-y-2">
                        {item.name}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Visual Connection Lines (Faint grid pattern) */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.05]"
                  style={{
                    backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
                    backgroundSize: '100px 100px',
                    maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
