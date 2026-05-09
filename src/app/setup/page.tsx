'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { updateBusinessProfile, fetchCurrentUser } from '@/store/slices/authSlice';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, MapPin, DollarSign, Users, ArrowRight, CheckCircle, Sparkles, Package, Truck } from 'lucide-react';
import { CURRENCY } from '@/constants';

interface SetupFormData {
  address: string;
  phone: string;
  currency: string;
}

const currencies = [
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
];

const features = [
  { icon: Package, title: 'Track Inventory', desc: 'Monitor stock levels across all locations' },
  { icon: Truck, title: 'Manage Sales', desc: 'Fast POS system for quick transactions' },
  { icon: Users, title: 'Team Collaboration', desc: 'Invite staff with role-based access' },
  { icon: Sparkles, title: 'AI Insights', desc: 'Get smart business recommendations' },
];

export default function SetupPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, businessProfile, isLoading } = useSelector((s: RootState) => s.auth);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetupFormData>({
    defaultValues: {
      currency: 'NGN',
    },
  });

  useEffect(() => {
    if (!user || !businessProfile) {
      router.push('/login');
    } else if (businessProfile.onboarded) {
      router.replace('/dashboard');
    }
  }, [user, businessProfile, router]);

  const toggleFeature = (featureTitle: string) => {
    setSelectedFeatures(prev =>
      prev.includes(featureTitle)
        ? prev.filter(f => f !== featureTitle)
        : [...prev, featureTitle]
    );
  };

  const onSubmitStep1 = () => {
    setStep(2);
  };

  const onSubmitFinal = async (data: SetupFormData) => {
    if (!businessProfile?.id) return;

    setIsSubmitting(true);
    try {
      await dispatch(updateBusinessProfile({
        id: businessProfile.id,
        address: data.address,
        phone: data.phone,
        currency: data.currency,
        onboarded: true,
      })).unwrap();

      toast.success('Setup complete! Welcome to StockWise');
      router.replace('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Setup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currencySymbol = currencies.find(c => c.code === CURRENCY)?.symbol || '₦';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] flex">
      {/* Left Panel - Welcome */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#004838] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-[#4ade80] rounded-md transform rotate-45 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-[#004838] rounded-full" />
                </div>
              </div>
              <span className="text-3xl font-bold text-white">StockWise</span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              Let's set up your{' '}
              <span className="text-[#4ade80]">workspace</span>
            </h1>

            <p className="text-white/70 text-lg mb-12">
              Complete your business profile in just a few steps.
            </p>

            {/* Progress */}
            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-[#4ade80] text-[#004838]' : 'bg-white/10 text-white/50'}`}>
                  {step > 1 ? <CheckCircle className="w-5 h-5" /> : <span className="font-bold">1</span>}
                </div>
                <div>
                  <h3 className={`font-semibold ${step >= 1 ? 'text-white' : 'text-white/50'}`}>Business Details</h3>
                  <p className="text-sm text-white/50">Basic information</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-[#4ade80] text-[#004838]' : 'bg-white/10 text-white/50'}`}>
                  {step > 2 ? <CheckCircle className="w-5 h-5" /> : <span className="font-bold">2</span>}
                </div>
                <div>
                  <h3 className={`font-semibold ${step >= 2 ? 'text-white' : 'text-white/50'}`}>Features</h3>
                  <p className="text-sm text-white/50">Customize your experience</p>
                </div>
              </div>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <feature.icon className="w-6 h-6 text-[#4ade80] mb-2" />
                  <h4 className="font-semibold text-white text-sm">{feature.title}</h4>
                  <p className="text-white/50 text-xs mt-1">{feature.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4ade80]/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
      </div>

      {/* Right Panel - Setup Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#004838] rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 bg-[#4ade80] rounded-sm transform rotate-45 flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#004838] rounded-full" />
                </div>
              </div>
              <span className="text-2xl font-bold text-[#004838]">StockWise</span>
            </div>
          </div>

          {/* Setup Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {step === 1 ? 'Business Details' : 'Almost Done!'}
              </h2>
              <p className="text-gray-500">
                {step === 1 ? 'Tell us about your business' : 'Select what you want to use'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        {...register('address', { required: 'Address is required' })}
                        type="text"
                        placeholder="123 Business Street, Lagos"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#004838] focus:outline-none transition-colors"
                      />
                    </div>
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        {...register('phone', { required: 'Phone is required' })}
                        type="tel"
                        placeholder="+234 800 000 0000"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#004838] focus:outline-none transition-colors"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        {...register('currency')}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#004838] focus:outline-none transition-colors bg-white appearance-none cursor-pointer"
                      >
                        {currencies.map((curr) => (
                          <option key={curr.code} value={curr.code}>
                            {curr.symbol} {curr.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit(onSubmitStep1)}
                    className="w-full py-3.5 bg-[#004838] hover:bg-[#003d30] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 group"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <p className="text-sm text-gray-500 mb-4">
                    Select the features you want to use (optional)
                  </p>

                  <div className="space-y-3">
                    {features.map((feature) => {
                      const Icon = feature.icon;
                      const isSelected = selectedFeatures.includes(feature.title);
                      return (
                        <button
                          key={feature.title}
                          type="button"
                          onClick={() => toggleFeature(feature.title)}
                          className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                            isSelected
                              ? 'border-[#004838] bg-[#004838]/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-[#004838] text-white' : 'bg-gray-100 text-gray-400'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 text-left">
                            <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                            <p className="text-sm text-gray-500">{feature.desc}</p>
                          </div>
                          {isSelected && (
                            <CheckCircle className="w-5 h-5 text-[#004838]" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit(onSubmitFinal)}
                      disabled={isSubmitting}
                      className="flex-1 py-3.5 bg-[#004838] hover:bg-[#003d30] text-white font-semibold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Complete Setup
                          <CheckCircle className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Business Info Card */}
          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#004838]/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#004838]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{businessProfile?.name}</h3>
                <p className="text-sm text-gray-500">{businessProfile?.business_type}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
