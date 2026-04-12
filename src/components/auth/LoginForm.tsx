'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { loginUser, registerUser } from '@/store/slices/authSlice';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Eye, EyeOff, Mail, Lock, Building, User, ArrowRight } from 'lucide-react';
import { CURRENCY } from '@/constants';

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData extends LoginFormData {
  businessName: string;
  ownerName: string;
}

export function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>();

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm<RegisterFormData>();

  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await dispatch(loginUser(data)).unwrap();
      toast.success('Welcome back to StockWise!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await dispatch(registerUser({
        email: data.email,
        password: data.password,
        businessName: data.businessName,
        ownerName: data.ownerName,
      })).unwrap();
      toast.success('Welcome to StockWise! Let\'s set up your business.');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-strong mx-auto mb-4">
              S
            </div>
            <h1 className="text-3xl font-black text-slate-800 font-outfit">StockWise</h1>
            <p className="text-slate-600 font-varela mt-2">
              {isLogin ? 'Welcome back!' : 'Start your journey'}
            </p>
          </div>

          {/* Form */}
          {isLogin ? (
            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  {...registerLogin('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className="input-field"
                  placeholder="your@email.com"
                />
                {loginErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{loginErrors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  {...registerLogin('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                />
                {loginErrors.password && (
                  <p className="text-red-500 text-sm mt-1">{loginErrors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business Name
                  </label>
                  <input
                    {...registerRegister('businessName', { 
                      required: 'Business name is required',
                      minLength: {
                        value: 2,
                        message: 'Business name must be at least 2 characters'
                      }
                    })}
                    type="text"
                    className="input-field"
                    placeholder="My Shop"
                  />
                  {registerErrors.businessName && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.businessName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Name
                  </label>
                  <input
                    {...registerRegister('ownerName', { 
                      required: 'Your name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                    type="text"
                    className="input-field"
                    placeholder="John Doe"
                  />
                  {registerErrors.ownerName && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.ownerName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  {...registerRegister('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className="input-field"
                  placeholder="your@email.com"
                />
                {registerErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{registerErrors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  {...registerRegister('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                />
                {registerErrors.password && (
                  <p className="text-red-500 text-sm mt-1">{registerErrors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-primary-600 hover:text-primary-700 font-semibold"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="text-center">
              <p className="text-xs text-slate-500 font-medium mb-3">Trusted by Nigerian SMEs</p>
              <div className="flex justify-center items-center gap-2 text-xs text-slate-400">
                <span>📦 Inventory</span>
                <span>•</span>
                <span>💰 Sales POS</span>
                <span>•</span>
                <span>📊 Analytics</span>
                <span>•</span>
                <span>{CURRENCY} Nigerian Currency</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
