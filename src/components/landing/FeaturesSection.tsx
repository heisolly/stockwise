'use client';

import { Zap, Activity, CheckCircle, Bell } from 'lucide-react';
import Link from 'next/link';

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* Header */}
        <div className="text-center mb-20 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-100 rounded-full px-4 py-1.5 text-[10px] font-bold text-brand-darkGreen tracking-[0.2em] uppercase mb-8 shadow-sm">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 border-[1.5px] border-brand-darkGreen rounded-[2px] opacity-40" />
              <div className="w-1.5 h-1.5 border-[1.5px] border-brand-darkGreen rounded-[2px]" />
            </div>
            FEATURES
          </div>
          <h2 className="text-[clamp(2.5rem,5.5vw,4.25rem)] font-bold text-brand-ultraDarkGreen leading-[1.05] tracking-tight max-w-4xl mx-auto mb-8 font-outfit text-balance">
            Powerful tools to grow your business in Nigeria
          </h2>
          <p className="text-brand-slateGray/50 text-[16px] font-medium max-w-xl mx-auto leading-relaxed">
            Maximize your store's productivity and security with our affordable, user-friendly inventory and POS management system.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          
          {/* Card 1: Inventory Management (Full Width) */}
          <div className="md:col-span-2 bg-brand-lightBg rounded-md p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 overflow-hidden border border-slate-50 shadow-sm">
            <div className="md:w-[45%] flex flex-col items-start text-left z-10">
              <h3 className="text-3xl font-bold text-brand-ultraDarkGreen mb-5 font-outfit">Smart Inventory</h3>
              <p className="text-[15px] text-brand-slateGray/80 font-medium leading-relaxed mb-10 max-w-sm">
                Track every item in your store with ease. Get low stock alerts, manage categories, 
                and see exactly what's moving and what's not.
              </p>
              <Link 
                href="/inventory" 
                className="px-8 py-3.5 text-sm font-bold text-white bg-brand-ultraDarkGreen rounded-md hover:bg-brand-darkGreen transition-all shadow-[0_10px_30px_-10px_rgba(7,49,39,0.4)]"
              >
                Start Tracking
              </Link>
            </div>

            <div className="md:w-[55%] w-full relative">
              {/* Dashboard UI Mockup */}
              <div className="bg-white rounded-sm shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-slate-100 p-8 w-full transform md:translate-x-4">
                <div className="flex items-center justify-between mb-10">
                  <div className="text-sm font-bold text-brand-ultraDarkGreen flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity">
                    Acme Inc. <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-400"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <img 
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" 
                        src={`https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&q=80&w=100&h=100`} 
                        alt="User"
                      />
                    ))}
                  </div>
                </div>
                <div className="w-full h-px bg-slate-100 mb-8" />
                {/* Visual Chart */}
                <div className="flex items-end justify-between h-44 gap-2.5">
                  {[40, 65, 35, 85, 110, 45, 75, 55, 35].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className={`w-full rounded-sm transition-all duration-1000 ${h === 110 ? 'bg-brand-ultraDarkGreen shadow-[0_10px_20px_-5px_rgba(7,49,39,0.3)]' : 'bg-slate-100 hover:bg-slate-200'}`} 
                        style={{ height: `${h}px` }}
                      ></div>
                    </div>
                  ))}
                </div>
                {/* Legend labels */}
                <div className="flex justify-between mt-4">
                  <span className="text-[10px] font-bold text-slate-300">0</span>
                  <span className="text-[10px] font-bold text-slate-300">2K</span>
                  <span className="text-[10px] font-bold text-slate-300">6K</span>
                  <span className="text-[10px] font-bold text-slate-300">10K</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: AI-Powered Insights */}
          <div className="bg-brand-lightBg rounded-md p-8 md:p-10 overflow-hidden flex flex-col border border-slate-50 shadow-sm min-h-[520px]">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-brand-ultraDarkGreen mb-4 font-outfit">AI Insights</h3>
              <p className="text-[14px] text-brand-slateGray/70 font-medium leading-relaxed max-w-[280px] mx-auto">
                Get smart recommendations powered by Google Gemini to optimize your sales and growth.
              </p>
            </div>
            {/* Notification UI Mockup */}
            <div className="bg-white rounded-sm shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] border border-slate-100 p-6 mt-auto">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                <span className="text-[13px] font-bold text-brand-ultraDarkGreen">AI Recommendation</span>
                <span className="text-[10px] font-bold text-brand-lime bg-brand-ultraDarkGreen px-2 py-0.5 rounded-md uppercase tracking-wider">New</span>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-md bg-brand-lime/20 flex items-center justify-center shrink-0">
                  <Activity size={18} className="text-brand-darkGreen" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-brand-ultraDarkGreen mb-1">Restock Alert: Gala</p>
                  <p className="text-[12px] text-brand-slateGray/60 leading-relaxed font-medium">
                    Based on your sales trends, you should restock Gala within 2 days to avoid missing sales.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: POS Sales */}
          <div className="bg-brand-ultraDarkGreen rounded-md p-8 md:p-10 overflow-hidden flex flex-col shadow-xl min-h-[520px]">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-white mb-4 font-outfit">Fast POS</h3>
              <p className="text-[14px] text-white/60 font-medium leading-relaxed max-w-[280px] mx-auto">
                Record sales in seconds, handle multiple payment methods, and keep your customers happy.
              </p>
            </div>
            {/* POS UI Mockup */}
            <div className="bg-brand-darkGreen/50 rounded-sm border border-white/10 p-6 mt-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-lime rounded-full" />
                  <span className="text-[12px] font-bold text-white uppercase tracking-widest">Active Sale</span>
                </div>
                <span className="text-[14px] font-black text-brand-lime">₦12,400.00</span>
              </div>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-[12px] text-white/70 font-medium">Item {i === 1 ? 'Milo 500g' : 'Peak Milk'}</span>
                    <span className="text-[12px] text-white font-bold">x1</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
