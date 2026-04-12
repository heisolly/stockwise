'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchProducts, addProduct, updateProduct, updateStock } from '@/store/slices/inventorySlice';
import { Product } from '@/types';
import { NIGERIAN_BUSINESS_CATEGORIES, CURRENCY } from '@/constants';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
  Filter,
  Download,
  Upload,
} from 'lucide-react';

interface ProductFormData {
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  lowStockThreshold: number;
  sku?: string;
  description?: string;
  isActive: boolean;
}

export function InventoryManager() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, isLoading, searchQuery, selectedCategory } = useSelector((state: RootState) => state.inventory);
  const { businessProfile } = useSelector((state: RootState) => state.auth);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockUpdateModal, setStockUpdateModal] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      isActive: true,
    },
  });

  useEffect(() => {
    if (businessProfile?.id) {
      dispatch(fetchProducts(businessProfile.id));
    }
  }, [dispatch, businessProfile?.id]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategoryFilter || product.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const onSubmit = async (data: ProductFormData) => {
    if (!businessProfile?.id) return;

    try {
      if (editingProduct) {
        await dispatch(updateProduct({ 
          id: editingProduct.id, 
          updates: data 
        })).unwrap();
        toast.success('Product updated successfully!');
      } else {
        await dispatch(addProduct(data)).unwrap();
        toast.success('Product added successfully!');
      }
      
      reset();
      setShowAddForm(false);
      setEditingProduct(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
    }
  };

  const handleStockUpdate = async (productId: string, quantity: number, type: 'ADD' | 'REMOVE' | 'ADJUST', reason?: string) => {
    try {
      await dispatch(updateStock({ productId, quantity, type, reason })).unwrap();
      toast.success(`Stock ${type.toLowerCase()}ed successfully!`);
      setStockUpdateModal(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update stock');
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.quantity === 0) {
      return { label: 'Out of Stock', color: 'status-error' };
    }
    if (product.quantity <= product.lowStockThreshold) {
      return { label: 'Low Stock', color: 'status-warning' };
    }
    return { label: 'In Stock', color: 'status-success' };
  };

  const calculateProfit = (product: Product) => {
    return product.sellingPrice - product.costPrice;
  };

  const calculateProfitMargin = (product: Product) => {
    return ((calculateProfit(product) / product.sellingPrice) * 100).toFixed(1);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Category', 'Quantity', 'Cost Price', 'Selling Price', 'SKU'];
    const csvContent = [
      headers.join(','),
      ...filteredProducts.map(p => [
        p.name,
        p.category,
        p.quantity,
        p.costPrice,
        p.sellingPrice,
        p.sku || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `stockwise_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900 font-primary">Inventory Management</h1>
          <p className="text-neutral-500 mt-1 font-secondary">
            Manage your products and track stock levels
          </p>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-primary-600" />
            <span className="widget-value">
              {products.length}
            </span>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-warning" />
            <span className="widget-value">
              {products.filter(p => p.quantity <= p.lowStockThreshold && p.quantity > 0).length}
            </span>
          </div>
          <p className="widget-title">Low Stock Items</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-5 h-5 text-error" />
            <span className="widget-value">
              {products.filter(p => p.quantity === 0).length}
            </span>
          </div>
          <p className="widget-title">Out of Stock</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-success" />
            <span className="widget-value">
              {CURRENCY}{products.reduce((sum, p) => sum + (p.quantity * p.sellingPrice), 0).toLocaleString()}
            </span>
          </div>
          <p className="widget-title">Total Stock Value</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-neutral-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full input-field"
          />
        </div>

        <select
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          className="input-field min-w-[200px]"
        >
          <option value="">All Categories</option>
          {NIGERIAN_BUSINESS_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <button onClick={exportToCSV} className="btn-ghost">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Products Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-300">
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 font-primary">Product</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 font-primary">Category</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 font-primary">Stock</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 font-primary">Cost Price</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 font-primary">Selling Price</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 font-primary">Profit</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 font-primary">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 font-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const status = getStockStatus(product);
                const profit = calculateProfit(product);
                const profitMargin = calculateProfitMargin(product);
                
                return (
                  <tr key={product.id} className="border-b border-neutral-300 hover:bg-neutral-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-neutral-500" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900 font-secondary">{product.name}</p>
                          {product.sku && (
                            <p className="text-xs text-neutral-500 font-secondary">SKU: {product.sku}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-500 font-secondary">{product.category}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900 font-primary">{product.quantity}</span>
                        <span className="text-xs text-neutral-500 font-secondary">/ {product.lowStockThreshold}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-500 font-secondary">
                      {CURRENCY}{product.costPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-500 font-secondary">
                      {CURRENCY}{product.sellingPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <p className={`font-semibold ${profit > 0 ? 'text-success' : 'text-error'} font-primary`}>
                          {CURRENCY}{profit.toLocaleString()}
                        </p>
                        <p className="text-xs text-neutral-500 font-secondary">{profitMargin}% margin</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={status.color}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setStockUpdateModal(product)}
                          className="text-primary-700 hover:text-primary-500 text-sm font-medium font-secondary"
                        >
                          Update Stock
                        </button>
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowAddForm(true);
                          }}
                          className="text-neutral-500 hover:text-primary-700"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-neutral-500 mx-auto mb-4" />
              <p className="text-neutral-500 font-medium font-primary">No products found</p>
              <p className="text-sm text-neutral-400 font-secondary">Add your first product to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {(showAddForm || editingProduct) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowAddForm(false);
              setEditingProduct(null);
              reset();
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-brand-ultraDarkGreen mb-6">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-slateGray mb-2">
                      Product Name *
                    </label>
                    <input
                      {...register('name', { required: 'Product name is required' })}
                      type="text"
                      className="input-field"
                      placeholder="Enter product name"
                      defaultValue={editingProduct?.name}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-slateGray mb-2">
                      Category *
                    </label>
                    <select
                      {...register('category', { required: 'Category is required' })}
                      className="input-field"
                      defaultValue={editingProduct?.category}
                    >
                      <option value="">Select category</option>
                      {NIGERIAN_BUSINESS_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-slateGray mb-2">
                      Cost Price *
                    </label>
                    <input
                      {...register('costPrice', { 
                        required: 'Cost price is required',
                        min: { value: 0, message: 'Cost price must be positive' }
                      })}
                      type="number"
                      step="0.01"
                      className="input-field"
                      placeholder="0.00"
                      defaultValue={editingProduct?.costPrice}
                    />
                    {errors.costPrice && (
                      <p className="text-red-500 text-sm mt-1">{errors.costPrice.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-slateGray mb-2">
                      Selling Price *
                    </label>
                    <input
                      {...register('sellingPrice', { 
                        required: 'Selling price is required',
                        min: { value: 0, message: 'Selling price must be positive' }
                      })}
                      type="number"
                      step="0.01"
                      className="input-field"
                      placeholder="0.00"
                      defaultValue={editingProduct?.sellingPrice}
                    />
                    {errors.sellingPrice && (
                      <p className="text-red-500 text-sm mt-1">{errors.sellingPrice.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-slateGray mb-2">
                      Quantity *
                    </label>
                    <input
                      {...register('quantity', { 
                        required: 'Quantity is required',
                        min: { value: 0, message: 'Quantity must be positive' }
                      })}
                      type="number"
                      className="input-field"
                      placeholder="0"
                      defaultValue={editingProduct?.quantity}
                    />
                    {errors.quantity && (
                      <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-slateGray mb-2">
                      Low Stock Threshold *
                    </label>
                    <input
                      {...register('lowStockThreshold', { 
                        required: 'Low stock threshold is required',
                        min: { value: 0, message: 'Threshold must be positive' }
                      })}
                      type="number"
                      className="input-field"
                      placeholder="5"
                      defaultValue={editingProduct?.lowStockThreshold}
                    />
                    {errors.lowStockThreshold && (
                      <p className="text-red-500 text-sm mt-1">{errors.lowStockThreshold.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-slateGray mb-2">
                    SKU (Optional)
                  </label>
                  <input
                    {...register('sku')}
                    type="text"
                    className="input-field"
                    placeholder="AUTO-001"
                    defaultValue={editingProduct?.sku}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-slateGray mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="input-field"
                    placeholder="Product description..."
                    defaultValue={editingProduct?.description}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingProduct(null);
                      reset();
                    }}
                    className="btn-ghost flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stock Update Modal */}
      <AnimatePresence>
        {stockUpdateModal && (
          <StockUpdateModal
            product={stockUpdateModal}
            onClose={() => setStockUpdateModal(null)}
            onUpdate={handleStockUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Stock Update Modal Component
interface StockUpdateModalProps {
  product: Product;
  onClose: () => void;
  onUpdate: (productId: string, quantity: number, type: 'ADD' | 'REMOVE' | 'ADJUST', reason?: string) => void;
}

function StockUpdateModal({ product, onClose, onUpdate }: StockUpdateModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState<'ADD' | 'REMOVE' | 'ADJUST'>('ADD');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(product.id, quantity, type, reason);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-brand-ultraDarkGreen mb-4">
          Update Stock: {product.name}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-slateGray mb-2">
              Update Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['ADD', 'REMOVE', 'ADJUST'] as const).map((updateType) => (
                <label
                  key={updateType}
                  className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    type === updateType
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="updateType"
                    value={updateType}
                    checked={type === updateType}
                    onChange={(e) => setType(e.target.value as any)}
                    className="sr-only"
                  />
                  <span className="font-medium text-sm">
                    {updateType === 'ADD' ? 'Add Stock' : updateType === 'REMOVE' ? 'Remove Stock' : 'Set Stock'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-slateGray mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="input-field"
              placeholder="Enter quantity"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-slateGray mb-2">
              Reason (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="input-field"
              placeholder="Why are you updating stock?"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-xl">
            <p className="text-sm text-slate-600">
              <strong>Current Stock:</strong> {product.quantity} units<br />
              <strong>After Update:</strong> {type === 'ADD' ? product.quantity + quantity : type === 'REMOVE' ? Math.max(0, product.quantity - quantity) : quantity} units
            </p>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Update Stock
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
