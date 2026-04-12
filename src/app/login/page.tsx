'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { loginUser, fetchBusinessProfile } from '@/store/slices/authSlice';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router   = useRouter();
  const { isAuthenticated, user, businessProfile } = useSelector((s: RootState) => s.auth);
  const [isLoading, setIsLoading]   = useState(false);
  const [showPass,  setShowPass]    = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && businessProfile) {
      // Redirect staff to their workspace subdomain
      if (user.role === UserRole.EMPLOYEE) {
        const subdomain = businessProfile.subdomain || businessProfile.name.toLowerCase().replace(/\s+/g, '-');
        window.location.href = `https://${subdomain}.stockwise.com/dashboard`;
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, businessProfile, router]);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await dispatch(loginUser(data)).unwrap();
      toast.success('Welcome back to StockWise!');
      
      // The useEffect will handle the redirect once isAuthenticated is updated
      // No need to fetch business profile separately as it's handled in the auth flow
    } catch (err: any) {
      console.error('Login error:', err);
      toast.error(err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-lightBg flex font-sans overflow-hidden relative">
      
      {/* ── Background Grid ── */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `linear-gradient(#00483810 1px, transparent 1px), linear-gradient(90deg, #00483810 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 90%)',
        }}
      />

      {/* ── Left panel (Brand/Info) — hidden on mobile ── */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-center px-16 xl:px-24 relative z-10 border-r border-slate-100 bg-white/30 backdrop-blur-sm">
        <div className="max-w-md">
          <Link href="/" className="flex items-center gap-2.5 mb-16">
            <div className="w-10 h-10 rounded-md bg-brand-ultraDarkGreen flex items-center justify-center shadow-lg shadow-brand-darkGreen/20">
               <div className="w-5 h-5 bg-brand-lime rounded-sm transform rotate-45 flex items-center justify-center">
                  <div className="w-2 h-2 bg-brand-ultraDarkGreen rounded-full" />
               </div>
            </div>
            <span className="text-2xl font-black text-brand-ultraDarkGreen tracking-tighter font-outfit">
              StockWise
            </span>
          </Link>

          <h1 className="text-5xl font-black text-brand-ultraDarkGreen mb-8 leading-[1.1] font-outfit tracking-tight">
            The heartbeat of your <span className="text-brand-darkGreen relative inline-block">business<span className="absolute bottom-1 left-0 w-full h-3 bg-brand-lime/60 -z-10 rounded-sm"></span></span>.
          </h1>
          
          <p className="text-brand-slateGray/70 text-lg font-medium leading-relaxed mb-12">
            Log in to access your inventory, manage sales, and get AI-powered insights for your store.
          </p>

          <div className="space-y-6">
            {[
              { title: 'Smart Inventory', desc: 'Track every item across all branches.' },
              { title: 'Fast POS', desc: 'Record sales in seconds with ease.' },
              { title: 'AI Insights', desc: 'Growth recommendations by Google Gemini.' },
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="mt-1">
                  <CheckCircle2 size={20} className="text-brand-darkGreen" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-ultraDarkGreen font-outfit">{feature.title}</h3>
                  <p className="text-sm text-brand-slateGray/50 font-medium">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel (Form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-md">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-10">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-sm bg-brand-ultraDarkGreen flex items-center justify-center">
                 <div className="w-4 h-4 bg-brand-lime rounded-sm transform rotate-45 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-brand-ultraDarkGreen rounded-full" />
                 </div>
              </div>
              <span className="text-xl font-black text-brand-ultraDarkGreen tracking-tighter font-outfit">StockWise</span>
            </Link>
          </div>

          <div className="bg-white rounded-md border border-slate-100 shadow-[0_20px_50px_-12px_rgba(7,49,39,0.08)] p-10 md:p-12">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-black text-brand-ultraDarkGreen font-outfit tracking-tight">Login</h2>
              <p className="text-brand-slateGray/50 text-sm font-medium mt-2">Manage your Nigerian SME with StockWise.</p>
            </div>

            <form onSubmit={handleSubmit(onLogin)} className="space-y-6">
              <div>
                <label className="block text-[13px] font-bold text-brand-ultraDarkGreen/70 uppercase tracking-widest mb-2 px-1">Email Address</label>
                <input
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                  type="email"
                  placeholder="name@business.com"
                  className="w-full px-6 py-4 rounded-md border border-slate-100 bg-slate-50/50 focus:border-brand-lime focus:ring-2 focus:ring-brand-lime/10 outline-none transition-all text-sm font-medium placeholder:text-slate-300"
                />
                {errors.email && <p className="text-red-500 text-xs mt-2 px-1">{errors.email.message}</p>}
              </div>

              <div className="relative">
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="block text-[13px] font-bold text-brand-ultraDarkGreen/70 uppercase tracking-widest">Password</label>
                  <Link href="/forgot-password" className="text-[11px] font-bold text-brand-darkGreen hover:underline uppercase tracking-widest">Forgot?</Link>
                </div>
                <div className="relative">
                  <input
                    {...register('password', { required: 'Password is required' })}
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full px-6 py-4 rounded-md border border-slate-100 bg-slate-50/50 focus:border-brand-lime focus:ring-2 focus:ring-brand-lime/10 outline-none transition-all text-sm font-medium placeholder:text-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-brand-darkGreen transition-colors"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-2 px-1">{errors.password.message}</p>}
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full py-4.5 bg-brand-ultraDarkGreen hover:bg-brand-darkGreen text-white font-bold rounded-md shadow-[0_15px_30px_-8px_rgba(7,49,39,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group h-[58px]"
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

              <p className="text-center text-sm font-medium text-brand-slateGray/60 pt-4">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-brand-darkGreen font-bold hover:underline">Get started</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
