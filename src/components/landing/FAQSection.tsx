'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, Search, HelpCircle, Star } from 'lucide-react';

const faqs = [
  {
    category: 'Getting Started',
    icon: MessageCircle,
    questions: [
      {
        q: 'How long does it take to set up StockWise?',
        a: 'You can set up StockWise in under 5 minutes! Simply create an account, add your business details, import your products, and you\'re ready to start selling. We also offer guided onboarding for new users.',
        popular: true
      },
      {
        q: 'Do I need any technical skills to use StockWise?',
        a: 'Not at all! StockWise is designed for business owners, not tech experts. Our intuitive interface makes it easy to manage inventory, record sales, and view reports with minimal training.',
        popular: false
      },
      {
        q: 'Can I import my existing products and data?',
        a: 'Yes! You can easily import your existing product list using our CSV import feature. We also provide templates to help you format your data correctly.',
        popular: true
      }
    ]
  },
  {
    category: 'Pricing & Plans',
    icon: Star,
    questions: [
      {
        q: 'Is there a free trial available?',
        a: 'Yes! We offer a 14-day free trial with full access to all features. No credit card required to start your trial.',
        popular: true
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major payment methods including bank transfers, debit/credit cards, and mobile money solutions popular in Nigeria.',
        popular: false
      },
      {
        q: 'Can I change my plan later?',
        a: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we\'ll prorate any differences.',
        popular: false
      },
      {
        q: 'Are there any hidden fees?',
        a: 'No hidden fees! The price you see is what you pay. All features included in your plan are available without additional charges.',
        popular: true
      }
    ]
  },
  {
    category: 'Features & Support',
    icon: HelpCircle,
    questions: [
      {
        q: 'Does StockWise work offline?',
        a: 'StockWise primarily requires an internet connection for real-time data sync. However, some features like sales recording can work offline and sync when you\'re back online.',
        popular: false
      },
      {
        q: 'How secure is my business data?',
        a: 'Your data is extremely secure! We use bank-level encryption, regular backups, and comply with data protection regulations. Only you and your authorized staff can access your business information.',
        popular: true
      },
      {
        q: 'What kind of support do you offer?',
        a: 'We offer 24/7 customer support via phone, email, and live chat. Premium plans also include dedicated account managers and priority support.',
        popular: true
      },
      {
        q: 'Can multiple staff members use StockWise?',
        a: 'Yes! You can add multiple staff members with different permission levels. Track who made what changes and when with our activity logs.',
        popular: false
      }
    ]
  }
];

export function FAQSection() {
  const [activeCategory, setActiveCategory] = useState('Getting Started');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const toggleQuestion = (question: string) => {
    setExpandedQuestion(expandedQuestion === question ? null : question);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-brand-lightBg border border-slate-100 rounded-full px-4 py-1.5 text-[10px] font-bold text-brand-darkGreen tracking-[0.2em] uppercase mb-8 shadow-sm"
          >
            <div className="w-2 h-2 bg-brand-lime rounded-full"></div>
            FREQUENTLY ASKED QUESTIONS
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[clamp(2rem,4vw,3.5rem)] font-bold text-brand-ultraDarkGreen leading-[1.1] mb-6 font-outfit"
          >
            Got questions? We've got answers
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-brand-slateGray/70 max-w-2xl mx-auto"
          >
            Find answers to common questions about StockWise. Can't find what you're looking for? Our support team is here to help.
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-slateGray/40" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-brand-lightBg border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-ultraDarkGreen focus:border-transparent transition-all duration-300"
            />
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {faqs.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.category}
                onClick={() => setActiveCategory(category.category)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category.category
                    ? 'bg-brand-ultraDarkGreen text-white shadow-lg'
                    : 'bg-brand-lightBg text-brand-slateGray/70 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.category}
              </button>
            );
          })}
        </motion.div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {filteredFAQs.map((category) => (
              activeCategory === category.category && (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {category.questions.map((faq, index) => {
                    const isExpanded = expandedQuestion === faq.q;
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300"
                      >
                        <button
                          onClick={() => toggleQuestion(faq.q)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-brand-lightBg/50 transition-colors duration-200"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {faq.popular && (
                              <div className="bg-brand-lime text-brand-darkGreen text-xs font-bold px-2 py-1 rounded-full">
                                POPULAR
                              </div>
                            )}
                            <span className="font-medium text-brand-ultraDarkGreen">
                              {faq.q}
                            </span>
                          </div>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-brand-slateGray/40"
                          >
                            <ChevronDown className="w-5 h-5" />
                          </motion.div>
                        </button>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-4 pt-0">
                                <div className="border-t border-slate-100 pt-4">
                                  <p className="text-brand-slateGray/70 leading-relaxed">
                                    {faq.a}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-br from-brand-lightBg to-white rounded-3xl p-12 border border-slate-100">
            <h3 className="text-2xl font-bold text-brand-ultraDarkGreen mb-4">
              Still have questions?
            </h3>
            <p className="text-brand-slateGray/70 mb-8 max-w-2xl mx-auto">
              Our support team is here to help you succeed. Get in touch with us and we'll be happy to assist you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-4 bg-brand-ultraDarkGreen text-white font-bold rounded-2xl hover:bg-brand-darkGreen transition-colors duration-300 shadow-lg hover:shadow-xl">
                Contact Support
              </button>
              <button className="px-8 py-4 bg-white text-brand-ultraDarkGreen font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-colors duration-300">
                View Help Center
              </button>
            </div>
            
            {/* Contact Info */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-brand-slateGray/60">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>support@stockwise.ng</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📱</span>
                <span>+234-800-000-0000</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💬</span>
                <span>Live chat available 24/7</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
