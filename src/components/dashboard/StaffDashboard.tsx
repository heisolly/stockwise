'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchProducts } from '@/store/slices/inventorySlice';
import { fetchSales } from '@/store/slices/salesSlice';
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  DollarSign,
  ShoppingCart,
  RefreshCw,
  Search,
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
  LineChart,
  Line
} from 'recharts';
import { CURRENCY } from '@/constants';

interface StaffMetrics {
  todaySales: number;
  weekSales: number;
  lowStockItems: number;
  totalProducts: number;
  recentSales: any[];
}

export function StaffDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector((state: RootState) => state.inventory);
  const { sales } = useSelector((state: RootState) => state.sales);
  const { businessProfile, user } = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate staff-specific metrics
  const calculateMetrics = (): StaffMetrics => {
    const today = new Date();
    const todaySales = sales.filter(sale => 
      new Date(sale.timestamp).toDateString() === today.toDateString()
    ).reduce((sum, sale) => sum + sale.totalAmount, 0);
    
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekSales = sales.filter(sale => 
      new Date(sale.timestamp) >= weekAgo
    ).reduce((sum, sale) => sum + sale.totalAmount, 0);

    const lowStockItems = products.filter(p => p.quantity <= p.lowStockThreshold && p.quantity > 0).length;

    return {
      todaySales,
      weekSales,
      lowStockItems,
      totalProducts: products.length,
      recentSales: sales.slice(0, 10),
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

  // Prepare chart data
  const salesChartData = sales.slice(-7).map((sale, index) => ({
    day: new Date(sale.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
    sales: sale.totalAmount,
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Staff Member'}
          </h1>
          <p className="text-gray-600 mt-1">
            Here's your sales and inventory overview for today
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-200">
              Today
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Today's Sales</p>
          <p className="text-2xl font-bold text-gray-900">
            {businessProfile?.currency || CURRENCY}{metrics.todaySales.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
              Week
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Week Sales</p>
          <p className="text-2xl font-bold text-gray-900">
            {businessProfile?.currency || CURRENCY}{metrics.weekSales.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            {metrics.lowStockItems > 0 && (
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-lg border border-red-200">
                Alert
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Low Stock Items</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.lowStockItems}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Total Products</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.totalProducts}</p>
        </motion.div>
      </div>

      {/* Low Stock Alert */}
      {metrics.lowStockItems > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8"
        >
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Low Stock Alert</h3>
              <p className="text-sm text-yellow-700">
                {metrics.lowStockItems} items need to be restocked soon. Please inform the manager.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [
                  `${(businessProfile?.currency || CURRENCY)}${value.toLocaleString()}`,
                  'Sales'
                ]}
              />
              <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <ShoppingCart className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">New Sale</p>
              <p className="text-xs text-gray-500">Record a sale</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Package className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Check Stock</p>
              <p className="text-xs text-gray-500">View inventory</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Search className="w-6 h-6 text-purple-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Find Product</p>
              <p className="text-xs text-gray-500">Search items</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Calendar className="w-6 h-6 text-orange-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Sales History</p>
              <p className="text-xs text-gray-500">View records</p>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Recent Sales Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white border border-gray-200 rounded-lg"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Sales</h3>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search sales..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics.recentSales
                .filter(sale => 
                  sale.productName.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-gray-900">{sale.productName}</div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">{sale.quantity}</td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-semibold text-gray-900">
                      {businessProfile?.currency || CURRENCY}{sale.totalAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">
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
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No sales recorded yet</p>
              <p className="text-gray-400 text-sm">Start by recording your first sale</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
