'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchBusinessInsights, generateBusinessInsight } from '@/store/slices/reportsSlice';
import { BusinessInsight } from '@/types';
import { motion } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  RefreshCw,
  Zap,
  Target,
  BarChart3,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export function AIInsights() {
  const dispatch = useDispatch<AppDispatch>();
  const { insights, isLoading } = useSelector((state: RootState) => state.reports);
  const { businessProfile } = useSelector((state: RootState) => state.auth);
  const { products } = useSelector((state: RootState) => state.inventory);
  const { sales } = useSelector((state: RootState) => state.sales);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (businessProfile?.id) {
      dispatch(fetchBusinessInsights(businessProfile.id));
    }
  }, [dispatch, businessProfile?.id]);

  const generateNewInsight = async () => {
    if (!businessProfile?.id) return;

    setIsGenerating(true);
    try {
      const topProducts = products.slice(0, 5);
      const payload = {
        totalSales: sales.reduce((sum, sale) => sum + sale.totalAmount, 0),
        totalProfit: sales.reduce((sum, sale) => sum + sale.profit, 0),
        lowStockCount: products.filter(p => p.quantity <= p.lowStockThreshold && p.quantity > 0).length,
        outOfStockCount: products.filter(p => p.quantity === 0).length,
        topProducts: topProducts.map(p => ({ name: p.name }))
      };

      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI insights from Gemini API.');
      }

      const generatedData = await response.json();

      await dispatch(generateBusinessInsight({
        businessId: businessProfile.id,
        summary: generatedData.summary,
        recommendations: generatedData.recommendations || [],
        riskLevel: generatedData.riskLevel || 'Low',
      })).unwrap();

      toast.success('New AI insight generated!');
    } catch (error: any) {
      toast.error('Failed to generate insight');
    } finally {
      setIsGenerating(false);
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'Low':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'Medium':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'High':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <BarChart3 className="w-5 h-5 text-slate-600" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'Medium':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'High':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-800';
    }
  };

  const latestInsight = insights[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 font-outfit">AI Business Insights</h1>
          <p className="text-slate-600 font-varela mt-1">
            Get intelligent analysis and recommendations for your business
          </p>
        </div>
        
        <button
          onClick={generateNewInsight}
          disabled={isGenerating}
          className="btn-primary disabled:opacity-50"
        >
          <Brain className="w-4 h-4" />
          {isGenerating ? 'Analyzing...' : 'Generate Insight'}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="metric-card"
        >
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-primary-600" />
            <span className="text-xs font-semibold text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
              AI POWERED
            </span>
          </div>
          <p className="text-sm font-medium text-slate-600">Business Health</p>
          <p className="text-2xl font-black text-emerald-600 font-outfit">Good</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="metric-card"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-600">+15%</span>
          </div>
          <p className="text-sm font-medium text-slate-600">Growth Rate</p>
          <p className="text-2xl font-black text-slate-800 font-outfit">Positive</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="metric-card"
        >
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-naira-600" />
            <span className="text-xs font-semibold text-naira-600">5</span>
          </div>
          <p className="text-sm font-medium text-slate-600">Action Items</p>
          <p className="text-2xl font-black text-slate-800 font-outfit">Priority</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="metric-card"
        >
          <div className="flex items-center justify-between mb-2">
            <Lightbulb className="w-5 h-5 text-secondary-600" />
            <span className="text-xs font-semibold text-secondary-600">NEW</span>
          </div>
          <p className="text-sm font-medium text-slate-600">Insights</p>
          <p className="text-2xl font-black text-slate-800 font-outfit">{insights.length}</p>
        </motion.div>
      </div>

      {/* Latest Insight */}
      {latestInsight ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center text-white">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 font-outfit">Latest Analysis</h2>
                <p className="text-sm text-slate-500">
                  Generated {new Date(latestInsight.generatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(latestInsight.riskLevel)}`}>
              {getRiskIcon(latestInsight.riskLevel)}
              {latestInsight.riskLevel} Risk
            </div>
          </div>

          <div className="space-y-6">
            {/* Summary */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-3 font-outfit">Executive Summary</h3>
              <p className="text-slate-600 leading-relaxed font-varela">
                {latestInsight.summary}
              </p>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-3 font-outfit">Key Recommendations</h3>
              <div className="space-y-3">
                {latestInsight.recommendations.map((recommendation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl"
                  >
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-slate-700 font-medium">{recommendation}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center py-12"
        >
          <Brain className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2 font-outfit">No AI Insights Yet</h3>
          <p className="text-slate-600 mb-6">Generate your first business insight to get started</p>
          <button
            onClick={generateNewInsight}
            disabled={isGenerating}
            className="btn-primary"
          >
            <Brain className="w-4 h-4" />
            Generate First Insight
          </button>
        </motion.div>
      )}

      {/* Previous Insights */}
      {insights.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-6 font-outfit">Previous Insights</h2>
          
          <div className="space-y-4">
            {insights.slice(1).map((insight, index) => (
              <div key={insight.id} className="p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getRiskIcon(insight.riskLevel)}
                    <span className="text-sm font-medium text-slate-700">
                      {new Date(insight.generatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getRiskColor(insight.riskLevel)}`}>
                    {insight.riskLevel}
                  </span>
                </div>
                
                <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                  {insight.summary}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {insight.recommendations.length} recommendations
                  </span>
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* AI Features Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card bg-gradient-to-r from-primary-50 to-secondary-50"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-soft">
            <Brain className="w-8 h-8 text-primary-600" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800 font-outfit">AI-Powered Business Intelligence</h3>
            <p className="text-slate-600 text-sm mt-1">
              Our AI analyzes your sales data, inventory patterns, and business trends to provide actionable insights that help you make smarter decisions.
            </p>
          </div>
          
          <div className="hidden md:block">
            <RefreshCw className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
