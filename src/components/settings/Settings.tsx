'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setBusinessProfile } from '@/store/slices/authSlice';
import { BusinessProfile } from '@/types';
import { NIGERIAN_BUSINESS_CATEGORIES } from '@/constants';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Building,
  User,
  Globe,
  CreditCard,
  Shield,
  Bell,
  Database,
  Download,
  Upload,
  Save,
} from 'lucide-react';

interface SettingsFormData {
  name: string;
  ownerName: string;
  address: string;
  business_type: string;
  currency: string;
}

export function Settings() {
  const dispatch = useDispatch<AppDispatch>();
  const { businessProfile } = useSelector((state: RootState) => state.auth);
  
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SettingsFormData>({
    defaultValues: {
      name: businessProfile?.name || '',
      ownerName: businessProfile?.ownerName || '',
      address: businessProfile?.address || '',
      business_type: businessProfile?.business_type || '',
      currency: businessProfile?.currency || '₦',
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    if (!businessProfile) return;

    setIsSaving(true);
    try {
      const updatedProfile: BusinessProfile = {
        ...businessProfile,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      dispatch(setBusinessProfile(updatedProfile));
      toast.success('Settings saved successfully!');
    } catch (error: any) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <Building className="w-4 h-4" /> },
    { id: 'account', label: 'Account', icon: <User className="w-4 h-4" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'data', label: 'Data Management', icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 font-outfit">Settings</h1>
          <p className="text-slate-600 font-varela mt-1">
            Manage your business settings and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                <span className="font-outfit">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'general' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <h2 className="text-xl font-bold text-slate-800 mb-6 font-outfit">General Settings</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      {...register('name', { required: 'Business name is required' })}
                      type="text"
                      className="input-field"
                      placeholder="My Business Ltd"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Owner Name *
                    </label>
                    <input
                      {...register('ownerName', { required: 'Owner name is required' })}
                      type="text"
                      className="input-field"
                      placeholder="John Doe"
                    />
                    {errors.ownerName && (
                      <p className="text-red-500 text-sm mt-1">{errors.ownerName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business Address
                  </label>
                  <input
                    {...register('address')}
                    type="text"
                    className="input-field"
                    placeholder="123 Lagos Street, Ikeja, Lagos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business Type
                  </label>
                  <select
                    {...register('business_type')}
                    className="input-field"
                  >
                    <option value="">Select business type</option>
                    {NIGERIAN_BUSINESS_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Default Currency
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['₦', '$', '€'].map((currency) => (
                      <label
                        key={currency}
                        className={`flex items-center justify-center p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                          watch('currency') === currency
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        <input
                          {...register('currency')}
                          type="radio"
                          value={currency}
                          className="sr-only"
                        />
                        <span className="font-semibold">{currency}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="submit" disabled={isSaving} className="btn-primary flex-1 disabled:opacity-50">
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'account' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <h2 className="text-xl font-bold text-slate-800 mb-6 font-outfit">Account Settings</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <h3 className="font-semibold text-slate-800 mb-2">Account Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Email:</strong> {businessProfile?.ownerName.toLowerCase().replace(' ', '.')}@business.com</p>
                    <p><strong>Member Since:</strong> {businessProfile?.createdAt ? new Date(businessProfile.createdAt).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Plan:</strong> {businessProfile?.plan || 'Free'}</p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl">
                  <h3 className="font-semibold text-amber-800 mb-2">Password Security</h3>
                  <p className="text-sm text-amber-700 mb-3">Last changed: Never</p>
                  <button className="btn-outline">Change Password</button>
                </div>

                <div className="p-4 bg-red-50 rounded-2xl">
                  <h3 className="font-semibold text-red-800 mb-2">Danger Zone</h3>
                  <p className="text-sm text-red-700 mb-3">Permanently delete your account and all data</p>
                  <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'billing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <h2 className="text-xl font-bold text-slate-800 mb-6 font-outfit">Billing & Subscription</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-gradient-primary rounded-2xl text-white">
                  <h3 className="font-bold text-lg mb-2">Current Plan: {businessProfile?.plan || 'Free'}</h3>
                  <p className="text-sm opacity-90 mb-4">Manage your subscription and billing</p>
                  <button className="bg-white text-primary-600 px-4 py-2 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                    Upgrade Plan
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800">Billing History</h3>
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No billing history</p>
                    <p className="text-sm text-slate-400">Your billing transactions will appear here</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <h2 className="text-xl font-bold text-slate-800 mb-6 font-outfit">Security Settings</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <h3 className="font-semibold text-slate-800">Two-Factor Authentication</h3>
                    <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
                  </div>
                  <button className="btn-outline">Enable</button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <h3 className="font-semibold text-slate-800">Login Alerts</h3>
                    <p className="text-sm text-slate-600">Get notified when someone logs into your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <h2 className="text-xl font-bold text-slate-800 mb-6 font-outfit">Notification Preferences</h2>
              
              <div className="space-y-4">
                {[
                  { title: 'Low Stock Alerts', description: 'Get notified when products are running low' },
                  { title: 'Sales Reports', description: 'Daily/weekly sales summaries' },
                  { title: 'Expense Reminders', description: 'Reminders to track expenses' },
                  { title: 'System Updates', description: 'Important system announcements' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div>
                      <h3 className="font-semibold text-slate-800">{item.title}</h3>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={index < 2} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'data' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <h2 className="text-xl font-bold text-slate-800 mb-6 font-outfit">Data Management</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-2xl text-center">
                    <Download className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-emerald-800 mb-1">Export Data</h3>
                    <p className="text-sm text-emerald-700 mb-3">Download all your business data</p>
                    <button className="btn-outline w-full">Export</button>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-2xl text-center">
                    <Upload className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-blue-800 mb-1">Import Data</h3>
                    <p className="text-sm text-blue-700 mb-3">Import products from CSV</p>
                    <button className="btn-outline w-full">Import</button>
                  </div>
                </div>

                <div className="p-4 bg-red-50 rounded-2xl">
                  <h3 className="font-semibold text-red-800 mb-2">Clear Data</h3>
                  <p className="text-sm text-red-700 mb-3">Permanently delete all sales, products, and business data</p>
                  <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                    Clear All Data
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
