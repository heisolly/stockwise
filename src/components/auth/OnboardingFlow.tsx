'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { setBusinessProfile, onboardBusiness, fetchCurrentUser } from '@/store/slices/authSlice';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  NIGERIAN_BUSINESS_CATEGORIES, 
  PLAN_DETAILS 
} from '@/constants';
import { BusinessProfile as BusinessProfileType, PlanType } from '@/types';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, ArrowRight, Building2, Users } from 'lucide-react';
import Link from 'next/link';

interface OnboardingData {
  // Business Details
  businessName: string;
  ownerName: string;
  address: string;
  business_type: string;
  currency: string;
  email: string;
  phone: string;
  
  // Staff Setup
  staffMembers: Array<{
    name: string;
    email: string;
    role: string;
    phone?: string;
  }>;
}

export function OnboardingFlow() {
  const dispatch = useDispatch<AppDispatch>();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OnboardingData>({
    defaultValues: {
      currency: '₦',
      staffMembers: [],
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: OnboardingData) => {
    setIsLoading(true);
    try {
      // Check if user is still authenticated before proceeding
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Session expired. Please log in again.');
      }

      // First, complete business onboarding
      const businessProfile = await dispatch(onboardBusiness({
        name: data.businessName,
        ownerName: data.ownerName,
        address: data.address,
        business_type: data.business_type,
        currency: data.currency,
        plan: PlanType.FREE, // Default to free plan since pricing is removed from onboarding
      })).unwrap();

      // Use the already imported supabase client for direct database operations

      // Save staff members to Supabase with improved duplicate handling
      if (data.staffMembers && data.staffMembers.length > 0) {
        for (const staff of data.staffMembers) {
          if (staff.name && staff.email) {
            try {
              // Check if user already exists using Supabase client
              const { data: existingUser, error: checkError } = await supabase
                .from('users')
                .select('id, email, business_id')
                .eq('email', staff.email)
                .maybeSingle();

              if (checkError && checkError.code !== 'PGRST116') {
                console.error('Error checking existing user:', checkError);
                continue;
              }

              // If user exists, skip adding them
              if (existingUser) {
                console.log(`User ${staff.email} already exists in system. Skipping.`);
                toast.info(`Staff member ${staff.email} already exists and was skipped.`);
                continue;
              }

              // Insert new staff member using Supabase client with proper upsert
              const { error: staffError, data: newStaff } = await supabase
                .from('users')
                .upsert({
                  business_id: businessProfile.id,
                  name: staff.name,
                  email: staff.email,
                  role: staff.role || 'employee',
                  password_hash: 'temp_password_hash', // Will be updated when staff sets their password
                  is_active: true,
                }, {
                  onConflict: 'email',
                  ignoreDuplicates: true,
                })
                .select()
                .maybeSingle();

              if (staffError) {
                console.error('Error saving staff:', staffError);
                if (staffError.code === '23505' || staffError.message.includes('duplicate key')) {
                  toast.info(`Staff member ${staff.email} already exists and was skipped.`);
                } else {
                  toast.error(`Error saving staff ${staff.email}: ${staffError.message}`);
                }
              } else {
                console.log(`Successfully added new staff member: ${staff.email}`);
              }
            } catch (error) {
              console.error('Error processing staff member:', staff.email, error);
              toast.error(`Error processing staff member ${staff.email}`);
            }
          }
        }
      }

      toast.success('Setup complete! Welcome to your dashboard.');
      
      // Refresh user data after successful onboarding
      await dispatch(fetchCurrentUser()).unwrap();
      
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast.error(error.message || 'Failed to complete setup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const steps = [
    { title: 'Business Info', icon: Building2, description: 'Tell us about your business' },
    { title: 'Staff Management', icon: Users, description: 'Add team members' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-lime/10 flex font-sans overflow-hidden">
      
      {/* ── Centered Onboarding Panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 relative overflow-y-auto min-h-screen">
        <div className="w-full max-w-lg">
          
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">SW</span>
            </div>
            <span className="text-2xl font-bold text-primary-600">StockWise</span>
          </div>
          
          {/* Step Indicators */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-2">
              {steps.map((s, i) => {
                const isActive = step === i + 1;
                const isCompleted = step > i + 1;
                return (
                  <div key={i} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive ? 'bg-primary-600 text-white ring-4 ring-primary-100' : 
                      isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {isCompleted ? <CheckCircle2 size={20} /> : <span className="text-sm font-medium">{i + 1}</span>}
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`w-12 h-0.5 transition-all duration-300 ${
                        step > i + 1 ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-gray-600 text-sm mb-2">
              <span>Step {step} of {steps.length}</span>
              <span>{Math.round((step / steps.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-primary-600 rounded-full h-2"
                initial={{ width: 0 }}
                animate={{ width: `${(step / steps.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
            >
              {step === 1 && (
                <form onSubmit={handleSubmit(nextStep)} className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building2 className="w-8 h-8 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Information</h2>
                    <p className="text-gray-600">Tell us about your business to personalize your experience</p>
                  </div>

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Business Name</label>
                        <input
                          {...register('businessName', { required: 'Business name is required' })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                          placeholder="e.g. Tech Store Nigeria"
                        />
                        {errors.businessName && (
                          <p className="text-sm text-red-600">{errors.businessName.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Your Name</label>
                        <input
                          {...register('ownerName', { required: 'Your name is required' })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                          placeholder="John Doe"
                        />
                        {errors.ownerName && (
                          <p className="text-sm text-red-600">{errors.ownerName.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Business Email</label>
                        <input
                          {...register('email', { 
                            required: 'Business email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
                            }
                          })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                          placeholder="business@example.com"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Business Phone</label>
                        <input
                          {...register('phone', { 
                            required: 'Business phone is required',
                            pattern: {
                              value: /^[+]?[\d\s\-\(\)]+$/,
                              message: 'Invalid phone number'
                            }
                          })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                          placeholder="+234 800 000 0000"
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-600">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Business Category</label>
                      <select
                        {...register('business_type', { required: 'Please select a business category' })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                      >
                        <option value="">Select your business type</option>
                        {NIGERIAN_BUSINESS_CATEGORIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      {errors.business_type && (
                        <p className="text-sm text-red-600">{errors.business_type.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Business Address</label>
                      <input
                        {...register('address', { required: 'Business address is required' })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        placeholder="123 Main Street, Lagos, Nigeria"
                      />
                      {errors.address && (
                        <p className="text-sm text-red-600">{errors.address.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={prevStep} 
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
                    >
                      Back
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      Continue
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Staff Management</h2>
                    <p className="text-gray-600">Add team members to help manage your business</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Team Members</h3>
                      <button
                        type="button"
                        onClick={() => {
                          const currentStaff = watchedValues.staffMembers || [];
                          setValue('staffMembers', [...currentStaff, {
                            name: '',
                            email: '',
                            role: 'employee',
                            phone: ''
                          }]);
                        }}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                      >
                        Add Staff Member
                      </button>
                    </div>

                    {(watchedValues.staffMembers || []).map((staff, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">Staff Member {index + 1}</h4>
                          {(watchedValues.staffMembers || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const currentStaff = watchedValues.staffMembers || [];
                                setValue('staffMembers', currentStaff.filter((_, i) => i !== index));
                              }}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-700">Full Name</label>
                            <input
                              {...register(`staffMembers.${index}.name`, { required: 'Name is required' })}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-200 outline-none transition-all text-sm"
                              placeholder="John Doe"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-700">Email</label>
                            <input
                              type="email"
                              {...register(`staffMembers.${index}.email`, { 
                                required: 'Email is required',
                                pattern: {
                                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: 'Invalid email address'
                                }
                              })}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-200 outline-none transition-all text-sm"
                              placeholder="staff@example.com"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-700">Role</label>
                            <select
                              {...register(`staffMembers.${index}.role`, { required: 'Role is required' })}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-200 outline-none transition-all text-sm"
                            >
                              <option value="employee">Employee</option>
                              <option value="manager">Manager</option>
                              <option value="cashier">Cashier</option>
                            </select>
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-700">Phone (Optional)</label>
                            <input
                              {...register(`staffMembers.${index}.phone`)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-200 outline-none transition-all text-sm"
                              placeholder="+234 800 000 0000"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {(watchedValues.staffMembers || []).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No staff members added yet. Click "Add Staff Member" to get started.</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={prevStep} 
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-primary-600/25"
                    >
                      {isLoading ? 'Setting up your account...' : 'Complete Setup'}
                      {!isLoading && <ArrowRight size={18} />}
                    </button>
                  </div>
                </form>
              )}

                          </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
