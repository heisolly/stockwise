'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { motion } from 'framer-motion';
import { 
  Plus, 
  ShoppingCart, 
  Package, 
  Receipt, 
  TrendingUp,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export function QuickActions() {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const actions = [
    {
      id: 'add-sale',
      label: 'Record Sale',
      icon: <ShoppingCart className="w-5 h-5" />,
      color: 'bg-primary-100 text-primary-600 hover:bg-primary-200',
      description: 'Quick sale entry',
      onClick: () => {
        toast.success('Sales POS opening soon!');
        setIsLoading('add-sale');
        setTimeout(() => setIsLoading(null), 1000);
      },
    },
    {
      id: 'add-product',
      label: 'Add Product',
      icon: <Package className="w-5 h-5" />,
      color: 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200',
      description: 'New inventory item',
      onClick: () => {
        toast.success('Product form opening soon!');
        setIsLoading('add-product');
        setTimeout(() => setIsLoading(null), 1000);
      },
    },
    {
      id: 'add-expense',
      label: 'Add Expense',
      icon: <Receipt className="w-5 h-5" />,
      color: 'bg-naira-100 text-naira-600 hover:bg-naira-200',
      description: 'Track expenses',
      onClick: () => {
        toast.success('Expense form opening soon!');
        setIsLoading('add-expense');
        setTimeout(() => setIsLoading(null), 1000);
      },
    },
    {
      id: 'ai-insights',
      label: 'AI Insights',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200',
      description: 'Get AI analysis',
      onClick: () => {
        toast.success('AI Insights coming soon!');
        setIsLoading('ai-insights');
        setTimeout(() => setIsLoading(null), 1000);
      },
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card lg:col-span-1"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800 font-outfit">
          Quick Actions
        </h3>
        <Zap className="w-5 h-5 text-primary-600" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <motion.button
            key={action.id}
            onClick={action.onClick}
            disabled={isLoading === action.id}
            className={`p-4 rounded-2xl text-left transition-all duration-200 ${action.color} disabled:opacity-50`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-2">
              {action.icon}
              {isLoading === action.id && (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              )}
            </div>
            <div className="font-semibold text-sm font-outfit">{action.label}</div>
            <div className="text-xs opacity-75 mt-1">{action.description}</div>
          </motion.button>
        ))}
      </div>

      {/* Alert Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-800 text-sm font-outfit">Pro Tip</h4>
            <p className="text-amber-700 text-xs mt-1">
              Regular inventory updates help maintain accurate stock levels and prevent stockouts.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
