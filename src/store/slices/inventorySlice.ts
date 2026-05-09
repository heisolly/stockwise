import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ActivityLog, ActivityType } from '@/types';
import { supabase } from '@/lib/supabase';

interface InventoryState {
  products: Product[];
  activityLogs: ActivityLog[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  lowStockProducts: Product[];
}

const initialState: InventoryState = {
  products: [],
  activityLogs: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedCategory: '',
  lowStockProducts: [],
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'inventory/fetchProducts',
  async (businessId: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform database data to match Product type
    return (data as any[]).map((item: any) => ({
      id: item.id,
      businessId: item.business_id,
      name: item.name,
      description: item.description,
      category: item.category,
      sku: item.sku,
      barcode: item.barcode,
      quantity: item.quantity,
      costPrice: item.cost_price,
      sellingPrice: item.selling_price,
      lowStockThreshold: item.low_stock_threshold,
      imageUrl: item.image_url,
      isActive: item.is_active,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));
  }
);

export const addProduct = createAsyncThunk(
  'inventory/addProduct',
  async (
    { product, businessId }: { product: Omit<Product, 'id' | 'businessId' | 'createdAt' | 'updatedAt'>; businessId: string },
    { getState }
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await (supabase as any)
      .from('products')
      .insert({
        name: product.name,
        description: product.description,
        category: product.category,
        sku: product.sku,
        barcode: product.barcode,
        cost_price: product.costPrice,
        selling_price: product.sellingPrice,
        quantity: product.quantity,
        low_stock_threshold: product.lowStockThreshold,
        image_url: product.imageUrl,
        is_active: product.isActive,
        business_id: businessId,
        created_by: user.id,
      })
      .select()
      .single();
    
    if (error) throw error;

    return {
      id: data.id,
      businessId: data.business_id,
      name: data.name,
      description: data.description,
      category: data.category,
      sku: data.sku,
      barcode: data.barcode,
      costPrice: data.cost_price,
      sellingPrice: data.selling_price,
      quantity: data.quantity,
      lowStockThreshold: data.low_stock_threshold,
      imageUrl: data.image_url,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as Product;
  }
);

export const updateProduct = createAsyncThunk(
  'inventory/updateProduct',
  async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
    const { data, error } = await (supabase as any)
      .from('products')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Product;
  }
);

export const updateStock = createAsyncThunk(
  'inventory/updateStock',
  async ({ 
    productId, 
    quantity, 
    type, 
    reason,
    businessId,
  }: { 
    productId: string; 
    quantity: number; 
    type: 'ADD' | 'REMOVE' | 'ADJUST'; 
    reason?: string;
    businessId: string;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get current product
    const { data: product } = await (supabase as any)
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (!product) throw new Error('Product not found');

    let newQuantity = product.quantity;
    if (type === 'ADD') newQuantity += quantity;
    else if (type === 'REMOVE') newQuantity -= quantity;
    else newQuantity = quantity;

    const { data, error } = await (supabase as any)
      .from('products')
      .update({
        quantity: Math.max(0, newQuantity),
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      businessId: data.business_id,
      name: data.name,
      description: data.description,
      category: data.category,
      sku: data.sku,
      barcode: data.barcode,
      costPrice: data.cost_price,
      sellingPrice: data.selling_price,
      quantity: data.quantity,
      lowStockThreshold: data.low_stock_threshold,
      imageUrl: data.image_url,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as Product;
  }
);

export const fetchActivityLogs = createAsyncThunk(
  'inventory/fetchActivityLogs',
  async (businessId: string) => {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('business_id', businessId)
      .order('timestamp', { ascending: false })
      .limit(100);
    
    if (error) throw error;
    
    // Transform database data to match ActivityLog type
    return (data as any[]).map((item: any) => ({
      id: item.id,
      businessId: item.business_id,
      performedBy: item.performed_by,
      productId: item.product_id,
      type: item.type,
      description: item.description,
      quantityChange: item.quantity_change,
      reason: item.reason,
      timestamp: item.timestamp,
      metadata: item.metadata || {},
    }));
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
        state.lowStockProducts = action.payload.filter(
          product => product.quantity <= product.lowStockThreshold
        );
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      // Add product
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      // Update stock
      .addCase(updateStock.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        // Update low stock products
        state.lowStockProducts = state.products.filter(
          product => product.quantity <= product.lowStockThreshold
        );
      })
      // Fetch activity logs
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.activityLogs = action.payload;
      });
  },
});

export const { setSearchQuery, setSelectedCategory, clearError } = inventorySlice.actions;
export default inventorySlice.reducer;
