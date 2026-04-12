'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';

const navLinks = [
  {
    label: 'Solutions',
    href: '/solutions',
    children: [
      { label: 'Inventory Management', href: '/features/inventory' },
      { label: 'Sales & POS', href: '/features/pos' },
    ],
  },
  {
    label: 'Product',
    href: '/product',
  },
  {
    label: 'Pricing',
    href: '/pricing',
  },
];

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="absolute top-0 left-0 right-0 w-full z-50 pt-4 pb-2">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-md bg-brand-ultraDarkGreen flex items-center justify-center shadow-lg shadow-brand-darkGreen/20">
               <div className="w-4 h-4 bg-brand-lime rounded-sm transform rotate-45 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-brand-ultraDarkGreen rounded-full" />
               </div>
            </div>
            <span className="text-[20px] font-black text-brand-ultraDarkGreen tracking-tighter font-outfit">
              StockWise
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative group">
                  <button
                    className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-brand-ultraDarkGreen/70 hover:text-brand-ultraDarkGreen rounded-md transition-all duration-200"
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className="transition-transform duration-200 group-hover:rotate-180"
                    />
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-xl border border-slate-50 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100 z-50">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm font-bold text-brand-ultraDarkGreen/60 hover:text-brand-darkGreen hover:bg-brand-lime/10 transition-colors duration-150"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href!}
                  className="px-4 py-2 text-sm font-bold text-brand-ultraDarkGreen/70 hover:text-brand-ultraDarkGreen rounded-md transition-all duration-200"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 text-sm font-bold text-brand-ultraDarkGreen hover:bg-slate-50 rounded-md transition-all duration-200"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 text-sm font-bold text-white bg-brand-ultraDarkGreen hover:bg-brand-darkGreen rounded-md transition-all duration-200 shadow-md shadow-brand-darkGreen/10"
            >
              Start Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-1 animate-slide-down">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {link.label}
                  </p>
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md mx-2 transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href!}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md mx-2 transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="pt-3 px-2 flex flex-col gap-2 border-t border-gray-100 mt-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full py-2.5 text-center text-sm font-medium text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
              >
                Start Now
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
