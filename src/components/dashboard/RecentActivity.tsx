'use client';

import { motion } from 'framer-motion';
import { ActivityLog, Sale, ActivityType } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { CURRENCY } from '@/constants';
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Users, 
  Receipt,
  AlertCircle,
  Activity
} from 'lucide-react';

interface RecentActivityProps {
  activities: ActivityLog[];
  sales: Sale[];
}

export function RecentActivity({ activities, sales }: RecentActivityProps) {
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case ActivityType.SALE:
        return <ShoppingCart className="w-4 h-4" />;
      case ActivityType.STOCK_IN:
        return <Package className="w-4 h-4" />;
      case ActivityType.STOCK_OUT:
        return <TrendingUp className="w-4 h-4" />;
      case ActivityType.USER_ADDED:
        return <Users className="w-4 h-4" />;
      case ActivityType.EXPENSE:
        return <Receipt className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case ActivityType.SALE:
        return 'bg-emerald-100 text-emerald-600';
      case ActivityType.STOCK_IN:
        return 'bg-blue-100 text-blue-600';
      case ActivityType.STOCK_OUT:
        return 'bg-amber-100 text-amber-600';
      case ActivityType.USER_ADDED:
        return 'bg-purple-100 text-purple-600';
      case ActivityType.EXPENSE:
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const recentActivities = activities.slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="card lg:col-span-2"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800 font-outfit">
          Recent Activity
        </h3>
        <Activity className="w-5 h-5 text-slate-400" />
      </div>

      <div className="space-y-3">
        {recentActivities.length > 0 ? (
          recentActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 font-outfit">
                  {activity.description}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  by {activity.performedBy} • {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No recent activity</p>
            <p className="text-sm text-slate-400">Your activity will appear here</p>
          </div>
        )}
      </div>

      {/* Recent Sales Summary */}
      {sales.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 pt-6 border-t border-slate-200"
        >
          <h4 className="font-semibold text-slate-800 text-sm mb-3 font-outfit">Latest Sales</h4>
          <div className="space-y-2">
            {sales.slice(0, 3).map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{sale.productName}</p>
                    <p className="text-xs text-slate-500">{sale.quantity} units</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800">{CURRENCY}{sale.totalAmount.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">{sale.paymentMethod}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
