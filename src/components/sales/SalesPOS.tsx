'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchProducts } from '@/store/slices/inventorySlice';
import { fetchSales, recordSale } from '@/store/slices/salesSlice';
import { Product, Sale } from '@/types';
import { PAYMENT_METHODS, CURRENCY } from '@/constants';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  DollarSign,
  Smartphone,
  Building,
  Receipt,
  Search,
  Package,
  Calculator,
} from 'lucide-react';

interface CartItem {
  product: Product;
  quantity: number;
}

interface SaleFormData {
  customerName?: string;
  customerPhone?: string;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'pos';
  notes?: string;
}

export function SalesPOS() {
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector((state: RootState) => state.inventory);
  const { sales } = useSelector((state: RootState) => state.sales);
  const { businessProfile, user } = useSelector((state: RootState) => state.auth);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SaleFormData>({
    defaultValues: {
      paymentMethod: 'cash',
    },
  });

  useEffect(() => {
    if (businessProfile?.id) {
      dispatch(fetchProducts(businessProfile.id));
      dispatch(fetchSales(businessProfile.id));
    }
  }, [dispatch, businessProfile?.id]);

  const filteredProducts = products.filter(product => 
    product.quantity > 0 && (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    ) && (!selectedCategory || product.category === selectedCategory)
  );

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.quantity) {
          return prevCart.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          toast.error(`Only ${product.quantity} units available in stock`);
          return prevCart;
        }
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const item = cart.find(item => item.product.id === productId);
    if (!item) return;

    if (quantity > item.product.quantity) {
      toast.error(`Only ${item.product.quantity} units available in stock`);
      return;
    }

    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.product.sellingPrice * item.quantity), 0);
  };

  const calculateProfit = () => {
    return cart.reduce((total, item) => {
      const itemProfit = (item.product.sellingPrice - item.product.costPrice) * item.quantity;
      return total + itemProfit;
    }, 0);
  };

  const onSubmitSale = async (data: SaleFormData) => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    try {
      // Create sale record for each item in cart
      for (const item of cart) {
        const saleData = {
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.sellingPrice,
          totalAmount: item.product.sellingPrice * item.quantity,
          profit: (item.product.sellingPrice - item.product.costPrice) * item.quantity,
          paymentMethod: data.paymentMethod,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          notes: data.notes,
          recordedBy: user?.name || 'Unknown',
        };

        await dispatch(recordSale(saleData)).unwrap();
      }

      toast.success('Sale completed successfully!');
      clearCart();
      setShowCheckout(false);
      reset();
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete sale');
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <DollarSign className="w-4 h-4" />;
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'transfer':
        return <Building className="w-4 h-4" />;
      case 'pos':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 font-outfit">Sales POS</h1>
          <p className="text-slate-600 font-varela mt-1">
            Record sales and manage transactions
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-slate-500">Today's Sales</p>
            <p className="text-xl font-black text-slate-800 font-outfit">
              {CURRENCY}{sales
                .filter(sale => new Date(sale.timestamp).toDateString() === new Date().toDateString())
                .reduce((sum, sale) => sum + sale.totalAmount, 0)
                .toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full input-field"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field min-w-[200px]"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
            {filteredProducts.map((product) => {
              const cartItem = cart.find(item => item.product.id === product.id);
              const isInStock = product.quantity > 0;
              
              return (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: 1.02 }}
                  className={`card p-4 cursor-pointer transition-all ${
                    !isInStock ? 'opacity-50' : ''
                  } ${cartItem ? 'ring-2 ring-primary-500' : ''}`}
                  onClick={() => isInStock && addToCart(product)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-slate-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 truncate">{product.name}</h3>
                      <p className="text-sm text-slate-500">{product.category}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <p className="text-lg font-black text-primary-600 font-outfit">
                            {CURRENCY}{product.sellingPrice.toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-500">
                            Stock: {product.quantity} units
                          </p>
                        </div>
                        
                        {cartItem && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(product.id, cartItem.quantity - 1);
                              }}
                              className="w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(product.id, cartItem.quantity + 1);
                              }}
                              className="w-6 h-6 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {filteredProducts.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No products available</p>
                <p className="text-sm text-slate-400">Add products to your inventory first</p>
              </div>
            )}
          </div>
        </div>

        {/* Cart Section */}
        <div className="space-y-4">
          <div className="card sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 font-outfit">Cart</h2>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Cart is empty</p>
                <p className="text-sm text-slate-400">Add products to start selling</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-slate-400" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">{item.product.name}</p>
                        <p className="text-sm text-slate-500">
                          {CURRENCY}{item.product.sellingPrice.toLocaleString()} × {item.quantity}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-slate-800">
                          {CURRENCY}{(item.product.sellingPrice * item.quantity).toLocaleString()}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="border-t border-slate-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-medium">{CURRENCY}{calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Profit</span>
                    <span className="font-medium text-emerald-600">{CURRENCY}{calculateProfit().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">{CURRENCY}{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowCheckout(true)}
                  className="btn-primary w-full mt-4"
                >
                  <Receipt className="w-4 h-4" />
                  Checkout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCheckout(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6 font-outfit">Checkout</h2>

              <form onSubmit={handleSubmit(onSubmitSale)} className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-slate-800 mb-2">Order Summary</h3>
                  <div className="space-y-1 text-sm">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex justify-between">
                        <span>{item.product.name} × {item.quantity}</span>
                        <span>{CURRENCY}{(item.product.sellingPrice * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-200 pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-primary-600">{CURRENCY}{calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Customer Name (Optional)
                    </label>
                    <input
                      {...register('customerName')}
                      type="text"
                      className="input-field"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Customer Phone (Optional)
                    </label>
                    <input
                      {...register('customerPhone')}
                      type="tel"
                      className="input-field"
                      placeholder="+234..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Payment Method *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_METHODS.map((method) => (
                      <label
                        key={method.value}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          watch('paymentMethod') === method.value
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          {...register('paymentMethod', { required: 'Payment method is required' })}
                          type="radio"
                          value={method.value}
                          className="sr-only"
                        />
                        {getPaymentIcon(method.value)}
                        <span className="text-sm font-medium">{method.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.paymentMethod && (
                    <p className="text-red-500 text-sm mt-1">{errors.paymentMethod.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={2}
                    className="input-field"
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="btn-ghost flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Complete Sale
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
