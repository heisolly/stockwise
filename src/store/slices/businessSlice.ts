import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BusinessProfile } from '@/types';
import { supabase } from '@/lib/supabase';

interface BusinessState {
  profile: BusinessProfile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BusinessState = {
  profile: null,
  isLoading: false,
  error: null,
};

export const fetchBusinessProfile = createAsyncThunk(
  'business/fetchProfile',
  async (userId: string) => {
    const { data, error } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data as unknown as BusinessProfile;
  }
);

export const updateBusinessProfile = createAsyncThunk(
  'business/updateProfile',
  async (updates: Partial<BusinessProfile>) => {
    const { data, error } = await (supabase as any)
      .from('business_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', updates.id ?? '')
      .select()
      .single();
    
    if (error) throw error;
    return data as unknown as BusinessProfile;
  }
);

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBusinessProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchBusinessProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch business profile';
      })
      .addCase(updateBusinessProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export default businessSlice.reducer;
