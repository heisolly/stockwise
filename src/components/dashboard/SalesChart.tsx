'use client';

import { motion } from 'framer-motion';
import { Sale } from '@/types';
import { format, subDays, startOfDay } from 'date-fns';
import { CURRENCY } from '@/constants';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SalesChartProps {
  sales: Sale[];
}

export function SalesChart({ sales }: SalesChartProps) {
  // Generate last 7 days data
  const generateChartData = () => {
    const today = startOfDay(new Date());
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dayStart = startOfDay(date);
      const dayEnd = new Date(date.getTime() + 24 * 60 * 60 * 1000 - 1);

      const daySales = sales.filter(sale => {
        const saleDate = new Date(sale.timestamp);
        return saleDate >= dayStart && saleDate <= dayEnd;
      });

      data.push({
        date: format(date, 'EEE'),
        fullDate: format(date, 'MMM dd'),
        sales: daySales.reduce((sum, sale) => sum + sale.totalAmount, 0),
        count: daySales.length,
      });
    }

    return data;
  };

  const chartData = generateChartData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 font-outfit">
            Sales Overview
          </h3>
          <p className="text-sm text-slate-500">Last 7 days performance</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-slate-800 font-outfit">
            {CURRENCY}{chartData.reduce((sum, day) => sum + day.sales, 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500">Total sales</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `{CURRENCY}${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 4px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
            formatter={(value: number, name: string) => [
              `{CURRENCY}${value.toLocaleString()}`,
              name === 'sales' ? 'Sales' : 'Count'
            ]}
            labelFormatter={(label) => {
              return label;
            }}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
        <div className="text-center">
          <p className="text-2xl font-black text-primary-600 font-outfit">
            {chartData.reduce((sum, day) => sum + day.count, 0)}
          </p>
          <p className="text-xs text-slate-500">Total Transactions</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-emerald-600 font-outfit">
            {CURRENCY}{Math.round(chartData.reduce((sum, day) => sum + day.sales, 0) / chartData.reduce((sum, day) => sum + day.count, 0) || 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500">Average Sale</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-slate-600 font-outfit">
            {Math.max(...chartData.map(day => day.sales), 0) > 0 ? 
              `{CURRENCY}${Math.max(...chartData.map(day => day.sales)).toLocaleString()}` : 
              '{CURRENCY}0'
            }
          </p>
          <p className="text-xs text-slate-500">Best Day</p>
        </div>
      </div>
    </motion.div>
  );
}
