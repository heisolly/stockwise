'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { registerOwner } from '@/store/slices/authSlice';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, User, Mail, Lock, Phone, ArrowRight, CheckCircle2, Package } from 'lucide-react';

interface OwnerSignupFormData {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  businessType: string;
}

const businessTypes = [
  'Retail',
  'Wholesale',
  'Restaurant',
  'Pharmacy',
  'Electronics',
  'Fashion',
  'Supermarket',
  'Other',
];

export default function OwnerSignupPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isAuthenticated, isLoading, businessProfile } = useSelector((s: RootState) => s.auth);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OwnerSignupFormData>({
    defaultValues: {
      businessType: 'Retail',
    },
  });

  const password = watch('password');

  useEffect(() => {
    if (isAuthenticated && businessProfile) {
      router.push('/app');
    }
  }, [isAuthenticated, businessProfile, router]);

  const onSubmit = async (data: OwnerSignupFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const result = await dispatch(
        registerOwner({
          email: data.email,
          password: data.password,
          businessName: data.businessName,
          ownerName: data.ownerName,
          phone: data.phone,
          businessType: data.businessType,
        })
      ).unwrap();

      if (result.business?.inviteCode) {
        toast.success(
          `Organization created! Your invite code is: ${result.business.inviteCode}`
        );
      }
      
      router.push('/app');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] flex">
      {/* Left Panel - Value Prop */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#004838] items-center justify-center p-12">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-2xl font-bold">StockWise</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-6">
            Start Your Business Journey
          </h1>
          <p className="text-white/80 text-lg mb-8">
            Create your organization and invite your team to manage inventory together.
          </p>

          <div className="space-y-4">
            {[
              'Create your organization workspace',
              'Get a unique invite code for employees',
              'Manage inventory across all locations',
              'Real-time collaboration with your team',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#4ade80]" />
                <span className="text-white/90">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 p-4 bg-white/10 rounded-xl">
            <p className="text-white/80 text-sm">
              &quot;StockWise transformed how we manage inventory across our 3 store locations. 
              My team can now collaborate seamlessly.&quot;
            </p>
            <p className="text-white text-sm font-medium mt-2">
              — Chinedu O., Retail Store Owner
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create Organization</h2>
              <p className="text-gray-500 mt-1">
                Set up your business workspace
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Step 1: Business Info */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        {...register('businessName', {
                          required: 'Business name is required',
                          minLength: { value: 2, message: 'Must be at least 2 characters' },
                        })}
                        type="text"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[#004838] focus:outline-none transition-colors"
                        placeholder="Your Business Name"
                      />
                    </div>
                    {errors.businessName && (
                      <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        {...register('ownerName', {
                          required: 'Your name is required',
                          minLength: { value: 2, message: 'Must be at least 2 characters' },
                        })}
                        type="text"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[#004838] focus:outline-none transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.ownerName && (
                      <p className="text-red-500 text-sm mt-1">{errors.ownerName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Type
                    </label>
                    <select
                      {...register('businessType')}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#004838] focus:outline-none transition-colors bg-white"
                    >
                      {businessTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full bg-[#004838] text-white py-3 rounded-xl font-medium hover:bg-[#003d30] transition-colors flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {/* Step 2: Account Info */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Invalid email address',
                          },
                        })}
                        type="email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[#004838] focus:outline-none transition-colors"
                        placeholder="you@business.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        {...register('phone')}
                        type="tel"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[#004838] focus:outline-none transition-colors"
                        placeholder="+234 800 000 0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        {...register('password', {
                          required: 'Password is required',
                          minLength: { value: 8, message: 'Must be at least 8 characters' },
                        })}
                        type="password"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[#004838] focus:outline-none transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password *
                    </label>
                    <input
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (val) => val === password || 'Passwords do not match',
                      })}
                      type="password"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#004838] focus:outline-none transition-colors"
                      placeholder="••••••••"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-[#004838] text-white py-3 rounded-xl font-medium hover:bg-[#003d30] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Creating...' : 'Create Organization'}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-[#004838] font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-center text-sm text-gray-500">
                Are you an employee?{' '}
                <Link href="/signup/employee" className="text-[#004838] font-medium hover:underline">
                  Join with invite code
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
