'use client';

import Link from 'next/link';
import { Mail, Phone, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

const footerLinks = {
  Solution: [
    { label: 'Why StockWise?', href: '/about' },
    { label: 'Features',      href: '/features' },
    { label: 'Inventory',     href: '/features/inventory' },
    { label: 'Sales & POS',   href: '/features/pos' },
    { label: 'Security',      href: '#' },
  ],
  Customers: [
    { label: 'Retailers',     href: '#' },
    { label: 'Wholesalers',   href: '#' },
    { label: 'Supermarkets',  href: '#' },
    { label: 'Pharmacy',      href: '#' },
    { label: 'Enterprise',    href: '#' },
  ],
  Resources: [
    { label: 'Pricing',       href: '/pricing' },
    { label: 'Contact',       href: '/contact' },
    { label: "What's New",    href: '/whats-new' },
    { label: 'Integrations',  href: '/integrations' },
  ],
};

const socials = [
  { Icon: Twitter,   href: '#', label: 'Twitter'   },
  { Icon: Linkedin,  href: '#', label: 'LinkedIn'  },
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Youtube,   href: '#', label: 'Youtube'   },
];

export function LandingFooter() {
  const flattenedLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Product', href: '/product' },
    { label: 'Contact', href: '/contact' },
    { label: 'Solutions', href: '/solutions' },
    { label: "What's New", href: '/whats-new' },
    { label: 'Integrations', href: '/integrations' },
    { label: 'Careers', href: '/careers' },
    { label: 'Price', href: '/pricing' },
  ];

  return (
    <footer className="font-sans pb-12">
      {/* CTA Banner Area - Refined for sharp/wide look */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 mb-8">
        <div className="bg-brand-ultraDarkGreen text-white rounded-md relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
               style={{
                 backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
                 backgroundSize: '24px 24px',
               }}
          />
          
          <div className="relative z-10 px-8 md:px-16 py-16 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-3/5">
              <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] font-black text-white leading-[1.1] tracking-tighter text-left font-outfit">
                Discover the full scale of{' '}
                <span className="text-brand-lime">StockWise</span> capabilities
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <Link
                href="/demo"
                className="px-10 py-4 text-[13px] font-black text-brand-ultraDarkGreen bg-white rounded-md hover:bg-slate-50 transition-all shadow-xl shadow-black/10 hover:-translate-y-0.5 uppercase tracking-widest"
              >
                Get a Demo
              </Link>
              <Link
                href="/register"
                className="px-10 py-4 text-[13px] font-black text-brand-ultraDarkGreen bg-brand-lime hover:opacity-90 rounded-md transition-all shadow-xl shadow-brand-lime/10 hover:-translate-y-0.5 uppercase tracking-widest"
              >
                Start Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer - Matching the Reference Image */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="bg-brand-lightBg rounded-md border border-slate-50 p-12 md:p-20 relative overflow-hidden">
          {/* Subtle Dot Pattern from Reference */}
          <div className="absolute inset-0 opacity-[0.1]"
               style={{
                 backgroundImage: `radial-gradient(circle, #073127 1px, transparent 1px)`,
                 backgroundSize: '20px 20px',
               }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-24">
            {/* Left Column: Logo and Large Headline */}
            <div className="lg:w-1/2">
              <Link href="/" className="flex items-center gap-3 mb-10 group">
                <div className="w-8 h-8 rounded-md bg-brand-ultraDarkGreen flex items-center justify-center shadow-lg shadow-brand-darkGreen/20">
                   <div className="w-4 h-4 bg-brand-lime rounded-sm transform rotate-45 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-brand-ultraDarkGreen rounded-full" />
                   </div>
                </div>
                <span className="text-2xl font-black text-brand-ultraDarkGreen tracking-tighter font-outfit">StockWise</span>
              </Link>

              <h3 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-brand-ultraDarkGreen leading-[1.05] tracking-tighter font-outfit max-w-lg">
                Stay organized and boost your productivity
              </h3>
            </div>

            {/* Right Column: Two-Column Link Grid with Arrows */}
            <div className="lg:w-1/3 grid grid-cols-2 gap-x-8 gap-y-6">
              {flattenedLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group flex items-center gap-2 text-[15px] font-bold text-brand-ultraDarkGreen/60 hover:text-brand-ultraDarkGreen transition-all duration-200"
                >
                  <span className="text-brand-ultraDarkGreen/30 group-hover:text-brand-lime transition-colors">→</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="relative z-10 mt-20 pt-8 border-t border-brand-ultraDarkGreen/5 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-ultraDarkGreen/30">
                © {new Date().getFullYear()} StockWise Tech
              </p>
              <div className="hidden sm:flex items-center gap-6">
                <Link href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-ultraDarkGreen/30 hover:text-brand-darkGreen">Privacy</Link>
                <Link href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-ultraDarkGreen/30 hover:text-brand-darkGreen">Terms</Link>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-brand-ultraDarkGreen/20 hover:text-brand-lime transition-all duration-300 hover:scale-110"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
