'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchProducts } from '@/store/slices/inventorySlice';
import { fetchSales, fetchExpenses } from '@/store/slices/salesSlice';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  AlertTriangle, 
  DollarSign,
  ShoppingCart,
  Users,
  Activity,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Eye,
  Download,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { CURRENCY } from '@/constants';
import { DashboardMetrics } from '@/types';
import { MetricCard }     from './MetricCard';
import { LowStockAlert }  from './LowStockAlert';
import { SalesChart }     from './SalesChart';
import { QuickActions }   from './QuickActions';
import { RecentActivity } from './RecentActivity';

const CHART_COLORS = ['#16A34A', '#84CC16', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, activityLogs } = useSelector((state: RootState) => state.inventory);
  const { sales, expenses } = useSelector((state: RootState) => state.sales);
  const { businessProfile } = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate dashboard metrics
  const calculateMetrics = (): DashboardMetrics => {
    const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
    const lowStockProducts = products.filter(p => p.quantity <= p.lowStockThreshold && p.quantity > 0);
    const outOfStockProducts = products.filter(p => p.quantity === 0);
    
    const today = new Date();
    const todaySales = sales.filter(sale => 
      new Date(sale.timestamp).toDateString() === today.toDateString()
    ).reduce((sum, sale) => sum + sale.totalAmount, 0);
    
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekSales = sales.filter(sale => 
      new Date(sale.timestamp) >= weekAgo
    ).reduce((sum, sale) => sum + sale.totalAmount, 0);
    
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const monthSales = sales.filter(sale => 
      new Date(sale.timestamp) >= monthAgo
    ).reduce((sum, sale) => sum + sale.totalAmount, 0);

    const stockValue = products.reduce((sum, product) => sum + (product.quantity * product.costPrice), 0);

    return {
      totalSales,
      totalProfit,
      lowStockProducts: lowStockProducts.length,
      outOfStockProducts: outOfStockProducts.length,
      todaySales,
      weekSales,
      monthSales,
      topSellingProducts: products.slice(0, 5),
      recentSales: sales.slice(0, 5),
      recentExpenses: expenses.slice(0, 5),
      stockValue,
    };
  };

  const metrics = calculateMetrics();

  const refreshData = async () => {
    if (!businessProfile?.id) return;
    
    setIsRefreshing(true);
    try {
      await Promise.all([
        dispatch(fetchProducts(businessProfile.id)),
        dispatch(fetchSales(businessProfile.id)),
        dispatch(fetchExpenses(businessProfile.id)),
      ]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, [dispatch, businessProfile?.id]);

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900 font-primary">
            Welcome back, {businessProfile?.ownerName || 'User'}
          </h1>
          <p className="text-neutral-500 mt-1 font-secondary">
            Here's what's happening with your business today
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="btn btn-ghost"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Sales"
          value={metrics.totalSales}
          currency={businessProfile?.currency || CURRENCY}
          icon={<DollarSign className="w-5 h-5" />}
          trend={metrics.todaySales > 0 ? 'up' : 'neutral'}
          trendValue={metrics.todaySales}
          color="primary"
        />
        
        <MetricCard
          title="Total Profit"
          value={metrics.totalProfit}
          currency={businessProfile?.currency || CURRENCY}
          icon={<TrendingUp className="w-5 h-5" />}
          trend="up"
          color="secondary"
        />
        
        <MetricCard
          title="Low Stock Items"
          value={metrics.lowStockProducts}
          icon={<AlertTriangle className="w-5 h-5" />}
          trend={metrics.lowStockProducts > 0 ? 'down' : 'neutral'}
          color="warning"
        />
        
        <MetricCard
          title="Stock Value"
          value={metrics.stockValue}
          currency={businessProfile?.currency || CURRENCY}
          icon={<Package className="w-5 h-5" />}
          trend="neutral"
          color="primary"
        />
      </div>

      {/* Alerts */}
      {metrics.outOfStockProducts > 0 && (
        <LowStockAlert
          outOfStock={metrics.outOfStockProducts}
          lowStock={metrics.lowStockProducts}
        />
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SalesChart sales={sales} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-neutral-900 mb-4 font-primary">
            Sales by Payment Method
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(
                  sales.reduce((acc, sale) => {
                    acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.totalAmount;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([name, value]) => ({ name, value }))}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {Object.entries(
                  sales.reduce((acc, sale) => {
                    acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.totalAmount;
                    return acc;
                  }, {} as Record<string, number>)
                ).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                  `${(businessProfile?.currency || CURRENCY)}${value.toLocaleString()}`,
                  'Amount'
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <QuickActions />
        <RecentActivity 
          activities={activityLogs.slice(0, 10)} 
          sales={metrics.recentSales}
        />
      </div>

      {/* Recent Sales Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <div className="p-6 border-b border-neutral-300">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-neutral-900 font-primary">
              Recent Sales
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search sales..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10 pr-4 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white">
              <tr>
                <th className="text-left py-3 px-6 text-xs font-medium text-neutral-700 uppercase tracking-wider font-primary">Product</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-neutral-700 uppercase tracking-wider font-primary">Qty</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-neutral-700 uppercase tracking-wider font-primary">Amount</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-neutral-700 uppercase tracking-wider font-primary">Payment</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-neutral-700 uppercase tracking-wider font-primary">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-300">
              {metrics.recentSales
                .filter(sale => 
                  sale.productName.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((sale) => (
                <tr key={sale.id} className="hover:bg-neutral-100">
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-neutral-900 font-secondary">{sale.productName}</div>
                  </td>
                  <td className="py-4 px-6 text-sm text-neutral-500 font-secondary">{sale.quantity}</td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-semibold text-neutral-900 font-primary">
                      {businessProfile?.currency || CURRENCY}{sale.totalAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-lime/20 text-primary-700">
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-neutral-500 font-secondary">
                    {new Date(sale.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {metrics.recentSales.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
              <p className="text-neutral-500 text-lg font-medium font-primary">No sales recorded yet</p>
              <p className="text-neutral-400 text-sm font-secondary">Start by recording your first sale</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
