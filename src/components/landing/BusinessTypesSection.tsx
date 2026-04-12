'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Store, 
  ShoppingCart, 
  Smartphone, 
  Coffee, 
  Car, 
  HeartPulse,
  ChevronRight,
  CheckCircle,
  Star
} from 'lucide-react';

const businessTypes = [
  {
    id: 'retail',
    title: 'Retail Stores',
    icon: Store,
    color: 'from-blue-500 to-blue-600',
    description: 'Supermarkets, boutiques, and general retail shops',
    features: ['Inventory tracking', 'POS integration', 'Supplier management'],
    popular: true,
    testimonial: 'StockWise helped us reduce stockouts by 80%',
    businesses: '2,500+'
  },
  {
    id: 'electronics',
    title: 'Electronics & Gadgets',
    icon: Smartphone,
    color: 'from-purple-500 to-purple-600',
    description: 'Phone shops, computer stores, and electronics retailers',
    features: ['Serial number tracking', 'Warranty management', 'Repair tracking'],
    popular: false,
    testimonial: 'Perfect for managing high-value inventory',
    businesses: '1,200+'
  },
  {
    id: 'food',
    title: 'Food & Beverage',
    icon: Coffee,
    color: 'from-orange-500 to-orange-600',
    description: 'Restaurants, cafes, and food service businesses',
    features: ['Perishable tracking', 'Recipe costing', 'Menu management'],
    popular: true,
    testimonial: 'Never run out of ingredients again',
    businesses: '3,000+'
  },
  {
    id: 'pharmacy',
    title: 'Pharmacies',
    icon: HeartPulse,
    color: 'from-red-500 to-red-600',
    description: 'Pharmacies and medical supply stores',
    features: ['Expiry tracking', 'Prescription management', 'Regulatory compliance'],
    popular: false,
    testimonial: 'Essential for our business compliance',
    businesses: '800+'
  },
  {
    id: 'automotive',
    title: 'Auto Parts',
    icon: Car,
    color: 'from-green-500 to-green-600',
    description: 'Auto parts stores and garages',
    features: ['Parts cataloging', 'Vehicle compatibility', 'Service tracking'],
    popular: false,
    testimonial: 'Streamlined our entire inventory process',
    businesses: '600+'
  },
  {
    id: 'wholesale',
    title: 'Wholesale & Distribution',
    icon: ShoppingCart,
    color: 'from-indigo-500 to-indigo-600',
    description: 'Wholesale distributors and bulk suppliers',
    features: ['Bulk pricing', 'Order management', 'Multi-channel sales'],
    popular: true,
    testimonial: 'Scaled our business 3x with StockWise',
    businesses: '1,800+'
  }
];

export function BusinessTypesSection() {
  const [selectedType, setSelectedType] = useState('retail');
  const [hoveredType, setHoveredType] = useState<string | null>(null);

  const selectedBusiness = businessTypes.find(b => b.id === selectedType) || businessTypes[0];
  const Icon = selectedBusiness.icon;

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white border border-slate-100 rounded-full px-4 py-1.5 text-[10px] font-bold text-brand-darkGreen tracking-[0.2em] uppercase mb-8 shadow-sm"
          >
            <div className="w-2 h-2 bg-brand-lime rounded-full"></div>
            INDUSTRY SOLUTIONS
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[clamp(2rem,4vw,3.5rem)] font-bold text-brand-ultraDarkGreen leading-[1.1] mb-6 font-outfit"
          >
            Built for every Nigerian business
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-brand-slateGray/70 max-w-2xl mx-auto"
          >
            Whether you're a small shop or a growing enterprise, StockWise adapts to your unique business needs
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Business Types Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {businessTypes.map((business, index) => {
              const BusinessIcon = business.icon;
              const isSelected = selectedType === business.id;
              const isHovered = hoveredType === business.id;
              
              return (
                <motion.div
                  key={business.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  onMouseEnter={() => setHoveredType(business.id)}
                  onMouseLeave={() => setHoveredType(null)}
                  onClick={() => setSelectedType(business.id)}
                  className={`relative cursor-pointer transition-all duration-300 ${
                    isSelected ? 'scale-105' : ''
                  }`}
                >
                  <div className={`bg-white rounded-2xl p-6 border-2 transition-all duration-300 ${
                    isSelected 
                      ? 'border-brand-ultraDarkGreen shadow-lg' 
                      : 'border-slate-100 hover:border-slate-300 hover:shadow-md'
                  }`}>
                    {/* Popular Badge */}
                    {business.popular && (
                      <div className="absolute -top-2 -right-2 bg-brand-lime text-brand-darkGreen text-xs font-bold px-2 py-1 rounded-full">
                        POPULAR
                      </div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 bg-gradient-to-br ${business.color} rounded-xl flex items-center justify-center text-white shadow-lg transition-transform duration-300 ${
                        isHovered ? 'scale-110 rotate-3' : ''
                      }`}>
                        <BusinessIcon className="w-6 h-6" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h3 className={`font-bold mb-1 transition-colors ${
                          isSelected ? 'text-brand-ultraDarkGreen' : 'text-slate-700'
                        }`}>
                          {business.title}
                        </h3>
                        <p className="text-sm text-brand-slateGray/60 leading-relaxed mb-3">
                          {business.description}
                        </p>
                        
                        {/* Businesses Count */}
                        <div className="flex items-center gap-2 text-xs text-brand-slateGray/50">
                          <div className="flex -space-x-1">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="w-5 h-5 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[8px] font-bold text-slate-500"
                              >
                                {i}
                              </div>
                            ))}
                          </div>
                          <span>{business.businesses} businesses</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover Arrow */}
                    <motion.div
                      className="absolute bottom-4 right-4 text-brand-ultraDarkGreen opacity-0"
                      animate={{ 
                        opacity: isHovered || isSelected ? 1 : 0,
                        x: isHovered || isSelected ? 0 : -5
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Detailed View */}
          <motion.div
            key={selectedType}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-white to-brand-lightBg rounded-3xl p-8 shadow-xl border border-slate-100">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-16 h-16 bg-gradient-to-br ${selectedBusiness.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-brand-ultraDarkGreen mb-1">
                    {selectedBusiness.title}
                  </h3>
                  <p className="text-sm text-brand-slateGray/60">
                    {selectedBusiness.description}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-brand-slateGray/70 uppercase tracking-wider mb-4">
                  Key Features
                </h4>
                <div className="space-y-3">
                  {selectedBusiness.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-brand-lime flex-shrink-0" />
                      <span className="text-sm text-brand-slateGray/70">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-brand-slateGray/70 italic mb-4">
                  "{selectedBusiness.testimonial}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-lime to-brand-darkGreen flex items-center justify-center text-white font-bold text-sm">
                    JD
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-ultraDarkGreen">John Doe</p>
                    <p className="text-xs text-brand-slateGray/50">Business Owner, Lagos</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 bg-gradient-to-r from-brand-ultraDarkGreen to-brand-darkGreen text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started for {selectedBusiness.title}
              </motion.button>
            </div>

            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-4 -right-4 bg-brand-lime text-brand-darkGreen px-4 py-2 rounded-full text-sm font-bold shadow-lg"
            >
              {selectedBusiness.businesses} users
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-8 bg-white rounded-full px-8 py-4 shadow-lg border border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-lime rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-brand-darkGreen" />
              </div>
              <span className="text-sm font-bold text-brand-ultraDarkGreen">10,000+ Businesses</span>
            </div>
            <div className="w-px h-6 bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-lime rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-brand-darkGreen" />
              </div>
              <span className="text-sm font-bold text-brand-ultraDarkGreen">4.9/5 Rating</span>
            </div>
            <div className="w-px h-6 bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-lime rounded-full flex items-center justify-center">
                <Store className="w-4 h-4 text-brand-darkGreen" />
              </div>
              <span className="text-sm font-bold text-brand-ultraDarkGreen">6 Industries</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
