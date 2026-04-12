'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  ArrowRight,
  CheckCircle,
  Play,
  Pause
} from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Sign Up & Onboard',
    description: 'Create your account in minutes and set up your business profile with our simple onboarding process.',
    icon: UserPlus,
    color: 'bg-blue-500',
    features: ['Free account setup', 'Business profile creation', 'Staff invitation'],
    duration: '2 minutes'
  },
  {
    id: 2,
    title: 'Add Your Products',
    description: 'Import or manually add your products, set prices, and configure stock alerts for your inventory.',
    icon: Package,
    color: 'bg-green-500',
    features: ['Bulk import support', 'Category management', 'Low stock alerts'],
    duration: '5 minutes'
  },
  {
    id: 3,
    title: 'Start Selling',
    description: 'Use our fast POS to record sales, manage customers, and accept multiple payment methods.',
    icon: ShoppingCart,
    color: 'bg-purple-500',
    features: ['Quick sales recording', 'Multiple payment methods', 'Customer tracking'],
    duration: 'Instant'
  },
  {
    id: 4,
    title: 'Grow with Insights',
    description: 'Get AI-powered recommendations and detailed reports to make smarter business decisions.',
    icon: TrendingUp,
    color: 'bg-yellow-500',
    features: ['AI recommendations', 'Sales analytics', 'Growth insights'],
    duration: 'Ongoing'
  }
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStepClick = (stepId: number) => {
    setActiveStep(stepId);
  };

  const handlePlayDemo = () => {
    setIsPlaying(!isPlaying);
    // Auto-advance through steps
    if (!isPlaying) {
      const interval = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= steps.length) {
            setIsPlaying(false);
            clearInterval(interval);
            return 1;
          }
          return prev + 1;
        });
      }, 2000);
    }
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
            <div className="w-2 h-2 bg-brand-lime rounded-full animate-pulse"></div>
            HOW IT WORKS
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[clamp(2rem,4vw,3.5rem)] font-bold text-brand-ultraDarkGreen leading-[1.1] mb-6 font-outfit"
          >
            Get started in minutes, not days
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-brand-slateGray/70 max-w-2xl mx-auto"
          >
            Our simple 4-step process gets you up and running quickly, so you can focus on growing your business
          </motion.p>
        </div>

        {/* Interactive Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Left: Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;
              const isCompleted = activeStep > step.id;
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative cursor-pointer transition-all duration-300 ${
                    isActive ? 'scale-[1.02]' : ''
                  }`}
                  onClick={() => handleStepClick(step.id)}
                >
                  <div className={`flex items-start gap-4 p-6 rounded-2xl border-2 transition-all duration-300 ${
                    isActive 
                      ? 'bg-brand-lightBg border-brand-ultraDarkGreen shadow-lg' 
                      : 'bg-white border-slate-100 hover:border-slate-300'
                  }`}>
                    {/* Step Number */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 ${
                      isActive ? step.color : 'bg-slate-200 text-slate-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        step.id
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-brand-ultraDarkGreen' : 'text-slate-400'}`} />
                        <h3 className={`text-lg font-bold ${isActive ? 'text-brand-ultraDarkGreen' : 'text-slate-700'}`}>
                          {step.title}
                        </h3>
                        <span className="text-xs text-brand-slateGray/50 bg-slate-100 px-2 py-1 rounded-full">
                          {step.duration}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed ${isActive ? 'text-brand-slateGray/80' : 'text-brand-slateGray/60'}`}>
                        {step.description}
                      </p>
                      
                      {/* Features */}
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 space-y-2"
                        >
                          {step.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-brand-slateGray/70">
                              <div className="w-1.5 h-1.5 bg-brand-lime rounded-full"></div>
                              {feature}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Arrow */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-brand-ultraDarkGreen"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-6 bg-slate-200" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Right: Visual Preview */}
          <div className="relative">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-brand-lightBg to-white rounded-3xl p-8 shadow-xl border border-slate-100"
            >
              {/* Demo Content based on active step */}
              <div className="aspect-video bg-white rounded-2xl shadow-inner flex items-center justify-center">
                <div className="text-center">
                  {(() => {
                    const ActiveIcon = steps[activeStep - 1].icon;
                    return (
                      <div className={`w-20 h-20 ${steps[activeStep - 1].color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        <ActiveIcon className="w-10 h-10 text-white" />
                      </div>
                    );
                  })()}
                  <h3 className="text-xl font-bold text-brand-ultraDarkGreen mb-2">
                    {steps[activeStep - 1].title}
                  </h3>
                  <p className="text-sm text-brand-slateGray/60 max-w-xs mx-auto">
                    {steps[activeStep - 1].description}
                  </p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-brand-slateGray/70">Step {activeStep} of {steps.length}</span>
                  <span className="text-xs font-bold text-brand-ultraDarkGreen">{Math.round((activeStep / steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brand-lime to-brand-ultraDarkGreen rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(activeStep / steps.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Play Button */}
            <button
              onClick={handlePlayDemo}
              className="absolute -bottom-4 -right-4 w-12 h-12 bg-brand-ultraDarkGreen text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-brand-ultraDarkGreen to-brand-darkGreen text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
            <span className="font-bold">Start your free trial today</span>
            <ArrowRight className="w-5 h-5" />
          </div>
          <p className="text-sm text-brand-slateGray/50 mt-3">No credit card required • Setup in 5 minutes</p>
        </motion.div>
      </div>
    </section>
  );
}
