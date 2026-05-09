'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { loginUser } from '@/store/slices/authSlice';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, ArrowRight, Building2, Users, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isAuthenticated, user, businessProfile } = useSelector((s: RootState) => s.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && businessProfile) {
      router.push('/app');
    }
  }, [isAuthenticated, user, businessProfile, router]);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await dispatch(loginUser(data)).unwrap();
      toast.success('Welcome back to StockWise!');
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] flex">
      {/* Left Panel - Brand & Info */}
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
            <Link href="/" className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-[#4ade80] rounded-md transform rotate-45 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-[#004838] rounded-full" />
                </div>
              </div>
              <span className="text-3xl font-bold text-white">StockWise</span>
            </Link>

            <h1 className="text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
              Manage your business{' '}
              <span className="text-[#4ade80]">smarter</span>
            </h1>
            
            <p className="text-white/70 text-xl mb-12 max-w-md">
              The all-in-one inventory and sales platform for Nigerian SMEs.
            </p>

            {/* Stats */}
            <div className="flex gap-8 mb-12">
              {[
                { value: '10K+', label: 'Businesses' },
                { value: '50K+', label: 'Users' },
                { value: '₦2B+', label: 'Sales Tracked' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/50 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: Building2, text: 'Multi-location inventory management' },
                { icon: Users, text: 'Team collaboration with role-based access' },
                { icon: Sparkles, text: 'AI-powered business insights' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-white/80">
                  <feature.icon className="w-5 h-5 text-[#4ade80]" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4ade80]/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#004838] rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 bg-[#4ade80] rounded-sm transform rotate-45 flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#004838] rounded-full" />
                </div>
              </div>
              <span className="text-2xl font-bold text-[#004838]">StockWise</span>
            </Link>
          </div>

          {/* Sign In Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
              <p className="text-gray-500">Sign in to manage your business</p>
            </div>

            <form onSubmit={handleSubmit(onLogin)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  {...register('email', { 
                    required: 'Email is required', 
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } 
                  })}
                  type="email"
                  placeholder="you@business.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004838] focus:ring-2 focus:ring-[#004838]/10 outline-none transition-all"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-[#004838] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    {...register('password', { required: 'Password is required' })}
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004838] focus:ring-2 focus:ring-[#004838]/10 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full py-3.5 bg-[#004838] hover:bg-[#003d30] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-gray-500">New to StockWise?</span>
              </div>
            </div>

            {/* New User Options */}
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/signup/owner"
                className="flex flex-col items-center p-4 border-2 border-gray-100 rounded-xl hover:border-[#004838] hover:bg-[#004838]/5 transition-all group"
              >
                <div className="w-10 h-10 bg-[#004838]/10 rounded-lg flex items-center justify-center mb-2 group-hover:bg-[#004838]/20">
                  <Building2 className="w-5 h-5 text-[#004838]" />
                </div>
                <span className="font-semibold text-gray-900 text-sm">Create Org</span>
                <span className="text-xs text-gray-500">I&apos;m a business owner</span>
              </Link>

              <Link
                href="/signup/employee"
                className="flex flex-col items-center p-4 border-2 border-gray-100 rounded-xl hover:border-[#004838] hover:bg-[#004838]/5 transition-all group"
              >
                <div className="w-10 h-10 bg-[#004838]/10 rounded-lg flex items-center justify-center mb-2 group-hover:bg-[#004838]/20">
                  <Users className="w-5 h-5 text-[#004838]" />
                </div>
                <span className="font-semibold text-gray-900 text-sm">Join Org</span>
                <span className="text-xs text-gray-500">I have an invite code</span>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-8">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-[#004838] hover:underline">Terms</Link>
            {' & '}
            <Link href="/privacy" className="text-[#004838] hover:underline">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
