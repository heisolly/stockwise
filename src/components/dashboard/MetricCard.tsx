'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { CURRENCY } from '@/constants';

interface MetricCardProps {
  title: string;
  value: number;
  currency?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  color: 'primary' | 'secondary' | 'warning';
}

export function MetricCard({ 
  title, 
  value, 
  currency = CURRENCY, 
  icon, 
  trend = 'neutral', 
  trendValue,
  color 
}: MetricCardProps) {
  const colorClasses = {
    primary: 'bg-accent-lime/20 text-primary-700 border-accent-lime/30',
    secondary: 'bg-accent-lime/20 text-primary-700 border-accent-lime/30',
    warning: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className="metric-card"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          {icon}
        </div>
        {trendValue !== undefined && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-semibold ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{trendValue > 0 ? '+' : ''}{trendValue}</span>
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm font-medium text-neutral-500 mb-1 font-secondary">{title}</p>
        <p className="text-2xl font-semibold text-neutral-900 font-primary">
          {currency}{value.toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
}
