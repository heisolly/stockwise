'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingCart, Award } from 'lucide-react';

interface Stat {
  label: string;
  value: string;
  suffix?: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const stats: Stat[] = [
  {
    label: 'Businesses Managed',
    value: '1000',
    suffix: '+',
    description: 'Growing daily across Nigeria',
    icon: Users,
    color: 'text-blue-600'
  },
  {
    label: 'Transactions Processed',
    value: '5',
    suffix: 'M+',
    description: 'Secure and reliable processing',
    icon: ShoppingCart,
    color: 'text-green-600'
  },
  {
    label: 'Average Revenue Increase',
    value: '35',
    suffix: '%',
    description: 'Businesses see growth within 3 months',
    icon: TrendingUp,
    color: 'text-purple-600'
  },
  {
    label: 'Customer Satisfaction',
    value: '98',
    suffix: '%',
    description: 'Based on 500+ reviews',
    icon: Award,
    color: 'text-yellow-600'
  }
];

function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const targetValue = parseInt(value);

  useEffect(() => {
    const duration = 2000;
    const increment = targetValue / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [targetValue]);

  return (
    <span className="text-4xl md:text-5xl font-bold text-brand-ultraDarkGreen">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-brand-lightBg to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white border border-slate-100 rounded-full px-4 py-1.5 text-[10px] font-bold text-brand-darkGreen tracking-[0.2em] uppercase mb-8 shadow-sm"
          >
            <div className="w-2 h-2 bg-brand-lime rounded-full"></div>
            BY THE NUMBERS
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[clamp(2rem,4vw,3.5rem)] font-bold text-brand-ultraDarkGreen leading-[1.1] mb-6 font-outfit"
          >
            Trusted by Nigerian businesses
            <br className="hidden md:block" /> across every sector
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-brand-slateGray/70 max-w-2xl mx-auto"
          >
            Join thousands of entrepreneurs who are already growing their businesses with StockWise
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-lightBg to-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  
                  {/* Counter */}
                  <div className="mb-3">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  
                  {/* Label */}
                  <h3 className="text-lg font-bold text-brand-ultraDarkGreen mb-2">
                    {stat.label}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-brand-slateGray/60 leading-relaxed">
                    {stat.description}
                  </p>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-lime/5 to-brand-darkGreen/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 bg-brand-ultraDarkGreen text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-xs font-bold"
                >
                  {i}
                </div>
              ))}
            </div>
            <span className="font-bold">Join 1000+ businesses growing with StockWise</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
