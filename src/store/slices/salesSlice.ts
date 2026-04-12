import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Sale, Expense } from '@/types';
import { supabase } from '@/lib/supabase';

interface SalesState {
  sales: Sale[];
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SalesState = {
  sales: [],
  expenses: [],
  isLoading: false,
  error: null,
};

export const fetchSales = createAsyncThunk(
  'sales/fetchSales',
  async (businessId: string) => {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .eq('business_id', businessId)
      .order('timestamp', { ascending: false })
      .limit(100);
    
    if (error) throw error;
    
    // Transform database data to match Sale type
    return (data as any[]).map((item: any) => ({
      id: item.id,
      businessId: item.business_id,
      productId: item.product_id,
      productName: item.product_name,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      totalAmount: item.total_amount,
      profit: item.profit,
      customerName: item.customer_name,
      customerPhone: item.customer_phone,
      paymentMethod: item.payment_method,
      recordedBy: item.recorded_by,
      notes: item.notes,
      timestamp: item.timestamp,
    }));
  }
);

export const recordSale = createAsyncThunk(
  'sales/recordSale',
  async (sale: Omit<Sale, 'id' | 'businessId' | 'timestamp'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await (supabase as any)
      .from('sales')
      .insert({
        ...sale,
        business_id: user.user_metadata.business_id,
        recorded_by: user.id,
      })
      .select()
      .single();
    
    if (error) throw error;

    // Update product quantity
    await (supabase as any).rpc('update_product_stock', {
      product_id: sale.productId,
      quantity_change: -sale.quantity,
    });

    return data as Sale;
  }
);

export const fetchExpenses = createAsyncThunk(
  'sales/fetchExpenses',
  async (businessId: string) => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('business_id', businessId)
      .order('timestamp', { ascending: false })
      .limit(100);
    
    if (error) throw error;
    
    // Transform database data to match Expense type
    return (data as any[]).map((item: any) => ({
      id: item.id,
      businessId: item.business_id,
      category: item.category,
      description: item.description,
      amount: item.amount,
      recordedBy: item.recorded_by,
      notes: item.notes,
      receiptImageUrl: item.receipt_image_url,
      timestamp: item.timestamp,
    }));
  }
);

export const recordExpense = createAsyncThunk(
  'sales/recordExpense',
  async (expense: Omit<Expense, 'id' | 'businessId' | 'timestamp'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await (supabase as any)
      .from('expenses')
      .insert({
        ...expense,
        business_id: user.user_metadata.business_id,
        recorded_by: user.id,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as Expense;
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sales = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch sales';
      })
      .addCase(recordSale.fulfilled, (state, action) => {
        state.sales.unshift(action.payload);
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.expenses = action.payload;
      })
      .addCase(recordExpense.fulfilled, (state, action) => {
        state.expenses.unshift(action.payload);
      });
  },
});

export default salesSlice.reducer;
