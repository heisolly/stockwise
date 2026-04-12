import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BusinessInsight } from '@/types';
import { supabase } from '@/lib/supabase';

interface ReportsState {
  insights: BusinessInsight[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  insights: [],
  isLoading: false,
  error: null,
};

export const fetchBusinessInsights = createAsyncThunk(
  'reports/fetchInsights',
  async (businessId: string) => {
    const { data, error } = await (supabase as any)
      .from('business_insights')
      .select('*')
      .eq('business_id', businessId)
      .order('generated_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    
    // Transform database data to match BusinessInsight type
    return (data as any[]).map((item: any) => ({
      id: item.id,
      businessId: item.business_id,
      summary: item.summary,
      recommendations: item.recommendations || [],
      riskLevel: item.risk_level,
      generatedAt: item.generated_at,
      periodStart: item.period_start,
      periodEnd: item.period_end,
      dataPoints: item.data_points || {},
    }));
  }
);

export const generateBusinessInsight = createAsyncThunk(
  'reports/generateInsight',
  async ({ businessId, summary, recommendations, riskLevel }: {
    businessId: string;
    summary: string;
    recommendations: string[];
    riskLevel: 'Low' | 'Medium' | 'High';
  }) => {
    const { data, error } = await (supabase as any)
      .from('business_insights')
      .insert({
        business_id: businessId,
        summary,
        recommendations,
        risk_level: riskLevel,
        generated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as BusinessInsight;
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessInsights.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBusinessInsights.fulfilled, (state, action) => {
        state.isLoading = false;
        state.insights = action.payload;
      })
      .addCase(fetchBusinessInsights.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch insights';
      })
      .addCase(generateBusinessInsight.fulfilled, (state, action) => {
        state.insights.unshift(action.payload);
      });
  },
});

export default reportsSlice.reducer;
