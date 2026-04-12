'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchSales, fetchExpenses } from '@/store/slices/salesSlice';
import { fetchProducts } from '@/store/slices/inventorySlice';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShoppingCart,
  Receipt,
  Download,
  Calendar,
  Filter,
} from 'lucide-react';
import { CHART_COLORS, CURRENCY } from '@/constants';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

export function ReportsView() {
  const dispatch = useDispatch<AppDispatch>();
  const { sales, expenses } = useSelector((state: RootState) => state.sales);
  const { products } = useSelector((state: RootState) => state.inventory);
  const { businessProfile } = useSelector((state: RootState) => state.auth);
  
  const [dateRange, setDateRange] = useState('7days');
  const [reportType, setReportType] = useState('overview');

  useEffect(() => {
    if (businessProfile?.id) {
      dispatch(fetchSales(businessProfile.id));
      dispatch(fetchExpenses(businessProfile.id));
      dispatch(fetchProducts(businessProfile.id));
    }
  }, [dispatch, businessProfile?.id]);

  const getFilteredData = () => {
    const now = new Date();
    let startDate: Date;

    switch (dateRange) {
      case '7days':
        startDate = subDays(now, 7);
        break;
      case '30days':
        startDate = subDays(now, 30);
        break;
      case '90days':
        startDate = subDays(now, 90);
        break;
      case 'thisMonth':
        startDate = startOfMonth(now);
        break;
      default:
        startDate = subDays(now, 7);
    }

    return {
      sales: sales.filter(sale => new Date(sale.timestamp) >= startDate),
      expenses: expenses.filter(expense => new Date(expense.timestamp) >= startDate),
    };
  };

  const { sales: filteredSales, expenses: filteredExpenses } = getFilteredData();

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = totalSales - totalExpenses;
  const totalTransactions = filteredSales.length;

  // Sales by category data
  const salesByCategory = products.reduce((acc, product) => {
    const productSales = filteredSales.filter(sale => sale.productId === product.id);
    const totalAmount = productSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    if (totalAmount > 0) {
      acc[product.category] = (acc[product.category] || 0) + totalAmount;
    }
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(salesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  // Daily sales data
  const dailySalesData = (() => {
    const data = [];
    const days = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 7;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const daySales = filteredSales.filter(sale => {
        const saleDate = new Date(sale.timestamp);
        return saleDate >= dayStart && saleDate <= dayEnd;
      });
      
      data.push({
        date: format(date, 'MMM dd'),
        sales: daySales.reduce((sum, sale) => sum + sale.totalAmount, 0),
        transactions: daySales.length,
      });
    }
    
    return data;
  })();

  // Top products
  const topProducts = products
    .map(product => {
      const productSales = filteredSales.filter(sale => sale.productId === product.id);
      const totalAmount = productSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
      const totalQuantity = productSales.reduce((sum, sale) => sum + sale.quantity, 0);
      return {
        ...product,
        totalAmount,
        totalQuantity,
        salesCount: productSales.length,
      };
    })
    .filter(product => product.totalAmount > 0)
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 font-outfit">Reports & Analytics</h1>
          <p className="text-slate-600 font-varela mt-1">
            Track your business performance and insights
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="thisMonth">This Month</option>
          </select>
          
          <button className="btn-ghost">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="metric-card"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-primary-600" />
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-sm font-medium text-slate-600">Total Sales</p>
          <p className="text-2xl font-black text-slate-800 font-outfit">
            {CURRENCY}{totalSales.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="metric-card"
        >
          <div className="flex items-center justify-between mb-2">
            <Receipt className="w-5 h-5 text-red-600" />
            <TrendingDown className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-sm font-medium text-slate-600">Total Expenses</p>
          <p className="text-2xl font-black text-slate-800 font-outfit">
            {CURRENCY}{totalExpenses.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="metric-card"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span className={`text-sm font-semibold ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {netProfit >= 0 ? '+' : ''}{((netProfit / totalSales) * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-sm font-medium text-slate-600">Net Profit</p>
          <p className={`text-2xl font-black font-outfit ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {CURRENCY}{netProfit.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="metric-card"
        >
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-5 h-5 text-secondary-600" />
            <span className="text-sm font-semibold text-secondary-600">
              {totalTransactions > 0 ? `${CURRENCY}${Math.round(totalSales / totalTransactions).toLocaleString()}` : `${CURRENCY}0`}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-600">Transactions</p>
          <p className="text-2xl font-black text-slate-800 font-outfit">
            {totalTransactions}
          </p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-4 font-outfit">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailySalesData}>
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
                tickFormatter={(value) => `${CURRENCY}${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number) => [`${CURRENCY}${value.toLocaleString()}`, 'Sales']}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Sales by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-4 font-outfit">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryChartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${CURRENCY}${value.toLocaleString()}`, 'Sales']}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <h3 className="text-lg font-bold text-slate-800 mb-4 font-outfit">Top Selling Products</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Product</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Category</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Units Sold</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Revenue</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Transactions</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{product.name}</p>
                        {product.sku && (
                          <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{product.category}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{product.totalQuantity}</td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-800">{CURRENCY}{product.totalAmount.toLocaleString()}</p>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{product.salesCount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {topProducts.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No sales data available</p>
              <p className="text-sm text-slate-400">Start making sales to see reports</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
