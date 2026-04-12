'use client';

import Link from 'next/link';
import { Check, Zap } from 'lucide-react';

export function PricingSection() {
  const plans = [
    {
      name: 'Starter',
      price: '####',
      period: '/mo',
      desc: 'Perfect for solo traders and micro businesses just getting started.',
      color: 'bg-white border-slate-100',
      isDark: false,
      cta: 'Start Now',
      features: [
        '1 store location',
        'Up to 100 products',
        'Basic sales POS',
        'Daily stock reports',
        '1 staff account',
        'Email support',
      ],
    },
    {
      name: 'Growth',
      price: '####',
      period: '/mo',
      desc: 'For growing SMEs that need powerful tools and team management.',
      color: 'bg-brand-ultraDarkGreen text-white border-brand-ultraDarkGreen',
      isDark: true,
      badge: 'Most Popular',
      cta: 'Choose Growth',
      features: [
        '3 store locations',
        'Unlimited products',
        'Full POS + receipts',
        'AI-powered analytics',
        '5 staff accounts',
        'Low stock alerts',
        'Export to PDF/Excel',
        'Priority support',
      ],
    },
    {
      name: 'Enterprise',
      price: '####',
      period: '/mo',
      desc: 'For established businesses with multiple branches and advanced needs.',
      color: 'bg-white border-slate-100',
      isDark: false,
      cta: 'Contact Sales',
      features: [
        'Unlimited store locations',
        'Unlimited products',
        'Everything in Growth',
        'Custom integrations',
        'Unlimited staff accounts',
        'Dedicated account manager',
        'Custom reports',
        'SLA guarantee',
      ],
    },
  ];

  return (
    <section id="pricing" className="py-32 bg-white font-sans overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* Header */}
        <div className="text-center mb-20 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-100 rounded-full px-4 py-1.5 text-[10px] font-bold text-brand-darkGreen tracking-[0.2em] uppercase mb-8 shadow-sm">
            <Zap size={11} className="fill-brand-lime text-brand-lime" /> PRICING
          </div>
          <h2 className="text-[clamp(2.5rem,5.5vw,4rem)] font-black text-brand-ultraDarkGreen leading-[1.05] tracking-tighter font-outfit max-w-4xl mx-auto mb-8 text-balance">
            Simple, transparent pricing <br className="hidden md:block" /> for every stage of your business
          </h2>
          <p className="text-brand-slateGray/50 text-[16px] font-medium max-w-xl mx-auto leading-relaxed">
            Choose the plan that fits your current needs and scale as you grow. No hidden fees, ever.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            return (
              <div
                key={plan.name}
                className={`relative rounded-md border p-8 md:p-10 flex flex-col ${plan.color} transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${plan.isDark ? 'shadow-2xl shadow-brand-darkGreen/20 scale-105 z-10' : 'shadow-sm'}`}
              >
                {/* badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-lime text-brand-ultraDarkGreen text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-md shadow-lg">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-10">
                  <h3 className={`text-[13px] font-black uppercase tracking-[0.2em] mb-6 ${plan.isDark ? 'text-brand-lime' : 'text-brand-ultraDarkGreen/40'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className={`text-[3.5rem] font-black leading-none tracking-tighter font-outfit ${plan.isDark ? 'text-white' : 'text-brand-ultraDarkGreen'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-[15px] font-bold ${plan.isDark ? 'text-white/40' : 'text-brand-ultraDarkGreen/30'}`}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`text-[15px] font-medium leading-relaxed ${plan.isDark ? 'text-white/60' : 'text-brand-slateGray/70'}`}>
                    {plan.desc}
                  </p>
                </div>

                <Link
                  href="/register"
                  className={`w-full py-4 text-center text-[12px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 mb-10 ${
                    plan.isDark 
                    ? 'bg-brand-lime text-brand-ultraDarkGreen hover:bg-white' 
                    : 'bg-brand-ultraDarkGreen text-white hover:bg-brand-darkGreen'
                  }`}
                >
                  {plan.cta}
                </Link>

                <div className={`text-[11px] font-black uppercase tracking-[0.2em] mb-6 ${plan.isDark ? 'text-white/30' : 'text-brand-ultraDarkGreen/20'}`}>
                  What's included:
                </div>

                <ul className="space-y-4 mb-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.isDark ? 'bg-brand-lime/10 text-brand-lime' : 'bg-brand-ultraDarkGreen/5 text-brand-ultraDarkGreen'}`}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className={`text-[14px] font-bold ${plan.isDark ? 'text-white/80' : 'text-brand-ultraDarkGreen/70'}`}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* bottom note */}
        <div className="mt-20 flex flex-col items-center gap-4 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-ultraDarkGreen/30 max-w-lg">
            All plans include 256-bit encryption, automatic backups, and FIRS-compliant receipts.
          </p>
          <Link href="/contact" className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-darkGreen hover:text-brand-lime transition-colors border-b border-brand-darkGreen/10 pb-1">
            Need a custom solution? Talk to us
          </Link>
        </div>
      </div>
    </section>
  );
}
