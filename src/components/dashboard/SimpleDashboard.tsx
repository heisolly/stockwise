'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  AlertTriangle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  BarChart3,
  Users,
  Activity,
  Zap,
} from 'lucide-react';

export function SimpleDashboard() {
  const { user, businessProfile } = useSelector((state: RootState) => state.auth);
  const { products } = useSelector((state: RootState) => state.inventory);
  const { sales, expenses } = useSelector((state: RootState) => state.sales);

  const currency = businessProfile?.currency === 'USD' ? '$' : businessProfile?.currency === 'GBP' ? '£' : businessProfile?.currency === 'EUR' ? '€' : '₦';

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const lowStockCount = products.filter(p => p.quantity <= p.lowStockThreshold).length;
  const outOfStockCount = products.filter(p => p.quantity === 0).length;
  const activeProducts = products.filter(p => p.isActive).length;

  const today = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(s => s.timestamp?.startsWith(today));
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.totalAmount, 0);

  const recentSales = sales.slice(0, 5);
  const recentExpenses = expenses.slice(0, 3);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `${currency}${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${currency}${(amount / 1000).toFixed(1)}K`;
    return `${currency}${amount.toLocaleString()}`;
  };

  const metrics = [
    {
      label: "Today's Revenue",
      value: formatAmount(todayRevenue),
      raw: todayRevenue,
      icon: DollarSign,
      trend: todaySales.length > 0 ? `+${todaySales.length} sales today` : 'No sales yet',
      trendUp: todaySales.length > 0,
      accent: 'emerald',
    },
    {
      label: 'Total Revenue',
      value: formatAmount(totalRevenue),
      raw: totalRevenue,
      icon: TrendingUp,
      trend: `${sales.length} transactions`,
      trendUp: true,
      accent: 'blue',
    },
    {
      label: 'Net Profit',
      value: formatAmount(totalProfit),
      raw: totalProfit,
      icon: BarChart3,
      trend: totalRevenue > 0 ? `${((totalProfit / totalRevenue) * 100).toFixed(1)}% margin` : 'No data',
      trendUp: totalProfit > 0,
      accent: 'violet',
    },
    {
      label: 'Expenses',
      value: formatAmount(totalExpenses),
      raw: totalExpenses,
      icon: ArrowDownRight,
      trend: `${expenses.length} recorded`,
      trendUp: false,
      accent: 'orange',
    },
  ];

  const accentMap: Record<string, { bg: string; text: string; badgeBg: string; badgeText: string; border: string }> = {
    emerald: { bg: 'bg-emerald-500/8', text: 'text-emerald-600', badgeBg: 'bg-emerald-50', badgeText: 'text-emerald-700', border: 'border-emerald-500/20' },
    blue: { bg: 'bg-blue-500/8', text: 'text-blue-600', badgeBg: 'bg-blue-50', badgeText: 'text-blue-700', border: 'border-blue-500/20' },
    violet: { bg: 'bg-violet-500/8', text: 'text-violet-600', badgeBg: 'bg-violet-50', badgeText: 'text-violet-700', border: 'border-violet-500/20' },
    orange: { bg: 'bg-orange-500/8', text: 'text-orange-600', badgeBg: 'bg-orange-50', badgeText: 'text-orange-700', border: 'border-orange-500/20' },
  };

  const stockMetrics = [
    { label: 'Active Products', value: activeProducts, icon: Package, color: 'text-primary-500', bg: 'bg-primary-500/8' },
    { label: 'Low Stock', value: lowStockCount, icon: AlertTriangle, color: lowStockCount > 0 ? 'text-amber-600' : 'text-emerald-600', bg: lowStockCount > 0 ? 'bg-amber-50' : 'bg-emerald-50' },
    { label: 'Out of Stock', value: outOfStockCount, icon: Package, color: outOfStockCount > 0 ? 'text-red-500' : 'text-emerald-600', bg: outOfStockCount > 0 ? 'bg-red-50' : 'bg-emerald-50' },
    { label: 'Total Sales', value: sales.length, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className="space-y-7">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"
      >
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-primary font-semibold text-neutral-900 leading-[1.2] tracking-tight">
            {greeting()}, <span className="text-primary-500">{user?.name?.split(' ')[0] || 'there'}</span>
          </h1>
          <p className="text-[14px] text-neutral-400 font-secondary mt-1.5">
            Here&apos;s what&apos;s happening with <span className="text-neutral-700 font-medium">{businessProfile?.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-neutral-400 font-secondary bg-white px-3 py-1.5 rounded-lg border border-neutral-200/60">
          <Clock className="w-3.5 h-3.5" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </motion.div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric, i) => {
          const a = accentMap[metric.accent];
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06, ease: 'easeOut' }}
              className="bg-white rounded-2xl border border-neutral-200/60 p-5 hover:shadow-soft transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${a.bg} flex items-center justify-center border ${a.border}`}>
                  <metric.icon className={`w-[18px] h-[18px] ${a.text}`} strokeWidth={2} />
                </div>
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${a.badgeBg} ${a.badgeText}`}>
                  {metric.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {metric.trend}
                </span>
              </div>
              <p className="text-[26px] font-primary font-bold text-neutral-900 leading-none tracking-tight">{metric.value}</p>
              <p className="text-[12px] text-neutral-400 font-secondary mt-2">{metric.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Stock Metrics */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stockMetrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25 + i * 0.05 }}
            className="bg-white rounded-2xl border border-neutral-200/60 p-4 flex items-center gap-3.5"
          >
            <div className={`w-10 h-10 rounded-xl ${metric.bg} flex items-center justify-center shrink-0`}>
              <metric.icon className={`w-[18px] h-[18px] ${metric.color}`} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-[22px] font-primary font-bold text-neutral-900 leading-none tracking-tight">{metric.value}</p>
              <p className="text-[11px] text-neutral-400 font-secondary mt-1 truncate">{metric.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Recent Sales */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.4 }}
          className="xl:col-span-3 bg-white rounded-2xl border border-neutral-200/60 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-neutral-100/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary-500/8 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-primary-500" strokeWidth={2.5} />
              </div>
              <h3 className="font-primary font-semibold text-[15px] text-neutral-900">Recent Sales</h3>
            </div>
            <span className="text-[11px] font-medium text-neutral-400 font-secondary bg-neutral-50 px-2.5 py-1 rounded-full">{sales.length} total</span>
          </div>

          {recentSales.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="w-14 h-14 bg-neutral-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-neutral-100">
                <ShoppingCart className="w-6 h-6 text-neutral-300" strokeWidth={1.5} />
              </div>
              <p className="text-[14px] text-neutral-500 font-secondary font-medium">No sales recorded yet</p>
              <p className="text-[12px] text-neutral-400 font-secondary mt-1">Make your first sale to see transactions here</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-50/80">
              {recentSales.map((sale) => (
                <div key={sale.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-neutral-50/40 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/8 flex items-center justify-center shrink-0 border border-emerald-500/10">
                      <ShoppingCart className="w-[15px] h-[15px] text-emerald-600" strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-neutral-900 truncate font-primary">{sale.productName}</p>
                      <p className="text-[11px] text-neutral-400 font-secondary">
                        {sale.customerName || 'Walk-in'} · {sale.quantity} unit{sale.quantity !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-[13px] font-bold text-neutral-900 font-primary">{currency}{sale.totalAmount.toLocaleString()}</p>
                    <p className="text-[11px] text-emerald-600 font-medium">+{currency}{sale.profit.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.5 }}
          className="xl:col-span-2 space-y-5"
        >
          {/* Business Health */}
          <div className="bg-white rounded-2xl border border-neutral-200/60 p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/8 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
              </div>
              <h3 className="font-primary font-semibold text-[15px] text-neutral-900">Business Health</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[11px] mb-2">
                  <span className="text-neutral-400 font-secondary font-medium">Profit Margin</span>
                  <span className="font-semibold text-neutral-700 font-primary">{totalRevenue > 0 ? `${((totalProfit / totalRevenue) * 100).toFixed(1)}%` : '0%'}</span>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: totalRevenue > 0 ? `${Math.min((totalProfit / totalRevenue) * 100, 100)}%` : '0%' }}
                    transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-2">
                  <span className="text-neutral-400 font-secondary font-medium">Stock Health</span>
                  <span className="font-semibold text-neutral-700 font-primary">{activeProducts > 0 ? `${((activeProducts - outOfStockCount) / activeProducts * 100).toFixed(0)}%` : '0%'}</span>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: activeProducts > 0 ? `${((activeProducts - outOfStockCount) / activeProducts) * 100}%` : '0%' }}
                    transition={{ duration: 1, delay: 0.7, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="bg-white rounded-2xl border border-neutral-200/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100/80 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-500/8 flex items-center justify-center">
                <ArrowDownRight className="w-3.5 h-3.5 text-orange-500" strokeWidth={2.5} />
              </div>
              <h3 className="font-primary font-semibold text-[15px] text-neutral-900">Recent Expenses</h3>
            </div>
            {recentExpenses.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-[12px] text-neutral-400 font-secondary">No expenses recorded</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-50/80">
                {recentExpenses.map((expense) => (
                  <div key={expense.id} className="px-5 py-3 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-neutral-900 truncate font-primary">{expense.description}</p>
                      <p className="text-[11px] text-neutral-400 font-secondary">{expense.category}</p>
                    </div>
                    <span className="text-[13px] font-bold text-orange-600 shrink-0 ml-3 font-primary">-{currency}{expense.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-[#004838] to-[#002d22] rounded-2xl p-5 text-white shadow-lg shadow-primary-500/10">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-[#86efac]" strokeWidth={2.5} />
              <h3 className="font-primary font-semibold text-[15px]">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Package, label: 'Add Product' },
                { icon: ShoppingCart, label: 'New Sale' },
                { icon: Users, label: 'Add Staff' },
                { icon: BarChart3, label: 'Reports' },
              ].map((action) => (
                <button key={action.label} className="bg-white/[0.06] hover:bg-white/[0.12] active:bg-white/[0.18] rounded-xl p-3.5 text-center transition-all duration-200 border border-white/[0.06] hover:border-white/[0.12]">
                  <action.icon className="w-[18px] h-[18px] mx-auto mb-2 text-[#86efac]" strokeWidth={2} />
                  <span className="text-[11px] font-medium font-secondary text-white/80">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
