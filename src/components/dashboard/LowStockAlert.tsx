'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Package, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LowStockAlertProps {
  outOfStock: number;
  lowStock: number;
}

export function LowStockAlert({ outOfStock, lowStock }: LowStockAlertProps) {
  const router = useRouter();

  if (outOfStock === 0 && lowStock === 0) {
    return null;
  }

  const alertSeverity = outOfStock > 0 ? 'high' : lowStock > 3 ? 'medium' : 'low';
  
  const alertStyles = {
    high: 'bg-red-50 border-red-200 text-red-800',
    medium: 'bg-amber-50 border-amber-200 text-amber-800',
    low: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const alertIcons = {
    high: <AlertTriangle className="w-5 h-5" />,
    medium: <AlertTriangle className="w-5 h-5" />,
    low: <Package className="w-5 h-5" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-2xl border ${alertStyles[alertSeverity]}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-white/50`}>
            {alertIcons[alertSeverity]}
          </div>
          
          <div>
            <h4 className="font-semibold font-outflex">
              {outOfStock > 0 ? 'Critical: Out of Stock Items' : 'Low Stock Alert'}
            </h4>
            <p className="text-sm opacity-90">
              {outOfStock > 0 && `${outOfStock} item${outOfStock > 1 ? 's' : ''} out of stock`}
              {outOfStock > 0 && lowStock > 0 && ' • '}
              {lowStock > 0 && `${lowStock} item${lowStock > 1 ? 's' : ''} running low`}
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push('/inventory')}
          className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-xl hover:bg-white/70 transition-colors font-medium text-sm"
        >
          View Inventory
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {outOfStock > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t border-current/20"
        >
          <p className="text-sm opacity-90">
            ⚠️ Out of stock items can lead to lost sales. Consider restocking immediately or removing unavailable items from your catalog.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
