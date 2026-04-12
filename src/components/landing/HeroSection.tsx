'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';

/* ── floating persona images ── */
const avatars = [
  { 
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150', 
    pos: 'top-24 left-8 lg:top-32 lg:left-[10%]', 
    arrowClass: 'bottom-[-4px] right-[-4px] rotate-[225deg]'
  },
  { 
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150', 
    pos: 'top-20 right-8 lg:top-28 lg:right-[12%]', 
    arrowClass: 'bottom-[-4px] left-[-4px] rotate-[135deg]'
  },
  { 
    img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=150&h=150', 
    pos: 'bottom-40 left-12 lg:bottom-48 lg:left-[15%]', 
    arrowClass: 'top-[-4px] right-[-4px] rotate-[315deg]'
  },
  { 
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150', 
    pos: 'bottom-32 right-12 lg:bottom-40 lg:right-[14%]', 
    arrowClass: 'top-[-4px] left-[-4px] rotate-[45deg]'
  },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-brand-lightBg font-sans">

      {/* ── Grid background overlay ── */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `linear-gradient(#00483810 1px, transparent 1px), linear-gradient(90deg, #00483810 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
        }}
      />

      {/* ── floating personas ── */}
      {avatars.map((a, i) => (
        <div
          key={i}
          className={`absolute ${a.pos} z-20 hidden lg:block animate-fade-in`}
        >
          <div className="relative group">
            {/* avatar image with pointer-like shadow */}
            <div className="w-14 h-14 rounded-full overflow-hidden border-[3px] border-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-gray-100 transition-transform duration-500 group-hover:scale-110">
              <img src={a.img} alt="User" className="w-full h-full object-cover" />
            </div>
            {/* arrow indicator - clean triangular pointer */}
            <div className={`absolute ${a.arrowClass} w-4 h-4 text-brand-ultraDarkGreen drop-shadow-sm`}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M24 22h-24l12-20z" />
              </svg>
            </div>
          </div>
        </div>
      ))}

      {/* ── CENTER content ── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center px-4 pt-32 pb-16">

        {/* badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-slate-100 rounded-full px-4 py-1.5 text-[10px] font-bold text-brand-darkGreen tracking-[0.15em] uppercase mb-8 shadow-sm">
          <div className="w-4 h-4 bg-brand-lime rounded-full flex items-center justify-center">
            <Zap size={10} className="text-brand-darkGreen fill-brand-darkGreen" />
          </div>
          CREATE FOR FAST
        </div>

        {/* headline */}
        <h1 className="max-w-4xl text-[clamp(2.5rem,6vw,4.25rem)] font-bold leading-[1.1] tracking-tight text-brand-ultraDarkGreen mb-6 font-outfit">
          Smart inventory{' '}
          <span className="relative inline-block px-2">
            <span className="relative z-10">management</span>
            {/* organic highlight underline */}
            <span className="absolute bottom-[0.15em] left-0 w-full h-[0.35em] bg-brand-lime/80 -rotate-1 rounded-full z-0" />
          </span>
          <br className="hidden md:block" /> for Nigerian SMEs
        </h1>

        {/* sub-text */}
        <p className="max-w-2xl text-[17px] text-brand-slateGray/80 font-medium leading-relaxed mb-10">
          StockWise transforms how business owners track stock, record sales, and 
          make strategic decisions with AI-powered insights and traditional POS.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-10 py-4 text-[15px] font-bold text-white bg-brand-ultraDarkGreen hover:bg-brand-darkGreen rounded-md shadow-[0_20px_40px_-12px_rgba(7,49,39,0.3)] transition-all duration-300 hover:-translate-y-0.5"
          >
            Start Now
          </Link>
          <Link
            href="/demo"
            className="w-full sm:w-auto px-10 py-4 text-[15px] font-bold text-brand-ultraDarkGreen bg-white hover:bg-slate-50 border border-slate-100 rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5"
          >
            Get a Demo
          </Link>
        </div>
      </div>

      {/* ── bottom logos ── */}
      <div className="relative z-10 w-full pb-12 pt-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-4">
          <div className="text-[13px] font-bold text-brand-ultraDarkGreen/60 text-center md:text-left leading-tight shrink-0 md:w-48 uppercase tracking-wider">
            More than 100+<br className="hidden md:block" /> companies partner
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-8 sm:gap-12 md:gap-16 w-full opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            {/* Clean Logo Reproductions */}
            <div className="flex items-center gap-2 text-brand-ultraDarkGreen font-bold text-xl">
               <div className="w-5 h-5 rounded-full bg-brand-ultraDarkGreen"></div> HubSpot
            </div>
            <div className="flex items-center gap-2 text-brand-ultraDarkGreen font-bold text-xl">
               <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-2.5 h-2.5 bg-brand-ultraDarkGreen"></div>
                  <div className="w-2.5 h-2.5 bg-brand-ultraDarkGreen"></div>
                  <div className="w-2.5 h-2.5 bg-brand-ultraDarkGreen"></div>
                  <div className="w-2.5 h-2.5 bg-brand-ultraDarkGreen"></div>
               </div> Dropbox
            </div>
            <div className="flex items-center gap-2 text-brand-ultraDarkGreen font-bold text-xl">
               <div className="w-5 h-5 border-[3px] border-brand-ultraDarkGreen rounded-sm"></div> Square
            </div>
            <div className="flex items-center gap-2 text-brand-ultraDarkGreen font-bold text-xl font-mono tracking-tighter">
               <div className="flex items-end gap-0.5 h-5">
                  <div className="w-1.5 h-full bg-brand-ultraDarkGreen"></div>
                  <div className="w-1.5 h-[70%] bg-brand-ultraDarkGreen"></div>
                  <div className="w-1.5 h-[40%] bg-brand-ultraDarkGreen"></div>
               </div> INTERCOM
            </div>
            <div className="flex items-center gap-1.5 text-brand-ultraDarkGreen font-bold text-xl">
               <div className="w-6 h-6 rounded-full bg-brand-ultraDarkGreen text-white text-[10px] flex items-center justify-center font-black">G</div> grammarly
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

