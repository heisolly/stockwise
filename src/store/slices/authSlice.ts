import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, BusinessProfile, UserRole } from '@/types';
import { signIn, signUp, signOut, getUserAndBusiness, supabase } from '@/lib/supabase';
import { transformDatabaseBusinessProfile, transformDatabaseUser } from '@/lib/dataTransform';

interface AuthState {
  user: User | null;
  businessProfile: BusinessProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  businessProfile: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await signIn(email, password);
    if (error) throw error;
    return data.user;
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ 
    email, 
    password, 
    businessName, 
    ownerName 
  }: { 
    email: string; 
    password: string; 
    businessName: string; 
    ownerName: string; 
  }) => {
    const { data, error } = await signUp(email, password, {
      business_name: businessName,
      owner_name: ownerName,
    });
    if (error) throw error;
    if (!data?.user) throw new Error('Registration failed: No user data returned');
    return data.user;
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  const { error } = await signOut();
  if (error) throw error;
});

export const fetchCurrentUser = createAsyncThunk('auth/fetchUser', async () => {
  const { user, business, error } = await getUserAndBusiness();
  if (error) throw error;
  return { user, business };
});

export const fetchBusinessProfile = createAsyncThunk(
  'auth/fetchBusinessProfile',
  async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get user's business profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('business_id')
      .eq('id', user.id)
      .single();

    if (userError || !(userData as any)?.business_id) {
      throw new Error('Business not found');
    }

    // Get business profile
    const { data: businessData, error: businessError } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('id', (userData as any).business_id)
      .single();

    if (businessError) throw businessError;

    // Type assertion for business data
    const business = businessData as any;

    return {
      id: business.id,
      name: business.name,
      ownerName: business.owner_name,
      address: business.address || undefined,
      business_type: business.business_type,
      currency: business.currency,
      onboarded: business.onboarded,
      plan: business.plan,
      trialEndsAt: business.trial_ends_at,
      posBalance: business.pos_balance,
      createdAt: business.created_at,
      updatedAt: business.updated_at,
      subdomain: business.subdomain,
      email: business.email,
      settings: business.settings || {},
    };
  }
);

export const onboardBusiness = createAsyncThunk(
  'auth/onboard',
  async (profile: Omit<BusinessProfile, 'id' | 'createdAt' | 'updatedAt' | 'onboarded' | 'posBalance'>) => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) throw new Error('Not authenticated');

    // 1. Create Business Profile
    const { data: businessData, error: businessError } = await (supabase as any)
      .from('business_profiles')
      .insert({
        name: profile.name,
        owner_name: profile.ownerName,
        address: profile.address,
        business_type: profile.business_type,
        currency: profile.currency,
        plan: String(profile.plan), // Ensure plan is sent as string
        onboarded: true,
        pos_balance: 0,
      })
      .select()
      .single();

    if (businessError) throw businessError;

    // 2. Create Public User Record (as Owner) with insert and conflict handling
    let userData = null;
    let userError = null;
    
    try {
      const { data: existingUser, error: checkError } = await (supabase as any)
        .from('users')
        .select('id, business_id, name, email, role, is_active')
        .eq('id', authUser.id)
        .maybeSingle();
        
      if (checkError) {
        console.error('Error checking existing user:', checkError);
      } else if (existingUser) {
        // User exists, update their business_id if needed
        const { data: updatedUser, error: updateError } = await (supabase as any)
          .from('users')
          .update({
            business_id: businessData.id,
            name: profile.ownerName,
            email: authUser.email,
            role: UserRole.OWNER,
            is_active: true,
          })
          .eq('id', authUser.id)
          .select()
          .single();
          
        if (updateError) {
          console.error('Error updating user:', updateError);
          userError = updateError;
        } else {
          userData = updatedUser;
        }
      } else {
        // User doesn't exist, create new one
        const { data: newUser, error: insertError } = await (supabase as any)
          .from('users')
          .insert({
            id: authUser.id,
            business_id: businessData.id,
            name: profile.ownerName,
            email: authUser.email,
            password_hash: 'managed_by_auth',
            role: UserRole.OWNER,
            is_active: true,
          })
          .select()
          .single();
          
        if (insertError) {
          console.error('Error inserting user:', insertError);
          // Don't throw error for duplicate key violations, just continue
          if (insertError.code === '23505') {
            console.log('User already exists, fetching existing user data');
            // Fetch existing user data instead of throwing error
            const { data: existingUserData, error: fetchError } = await (supabase as any)
              .from('users')
              .select('id, business_id, name, email, role, is_active, last_login, created_at, updated_at')
              .eq('id', authUser.id)
              .single();
            
            if (fetchError) {
              console.error('Error fetching existing user:', fetchError);
            } else {
              userData = existingUserData;
            }
          } else {
            throw insertError;
          }
        } else {
          userData = newUser;
        }
      }
    } catch (error) {
      console.error('User operation error:', error);
      userError = error;
    }

    return { 
      user: userData ? {
        id: userData.id,
        businessId: userData.business_id,
        name: userData.name,
        email: userData.email,
        passwordHash: userData.password_hash,
        role: userData.role as any,
        isActive: userData.is_active,
        lastLogin: userData.last_login,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at,
      } : null,
      business: businessData ? {
        id: businessData.id,
        name: businessData.name,
        ownerName: businessData.owner_name,
        address: businessData.address || undefined,
        business_type: businessData.business_type,
        currency: businessData.currency,
        onboarded: businessData.onboarded,
        plan: businessData.plan,
        trialEndsAt: businessData.trial_ends_at,
        posBalance: businessData.pos_balance,
        createdAt: businessData.created_at,
        updatedAt: businessData.updated_at,
      } : null
    };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setBusinessProfile: (state, action: PayloadAction<BusinessProfile>) => {
      state.businessProfile = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload as any;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload as any;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.businessProfile = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.user) {
          state.user = action.payload.user;
          state.businessProfile = action.payload.business;
          state.isAuthenticated = true;
        }
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.businessProfile = null;
      })
      // Onboard
      .addCase(onboardBusiness.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(onboardBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.businessProfile = action.payload.business;
      })
      .addCase(onboardBusiness.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Onboarding failed';
      })
      // Fetch business profile
      .addCase(fetchBusinessProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinessProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.businessProfile = action.payload;
      })
      .addCase(fetchBusinessProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch business profile';
      });
  },
});

export const { clearError, setBusinessProfile, updateUser } = authSlice.actions;
export default authSlice.reducer;
