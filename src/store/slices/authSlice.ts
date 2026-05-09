import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, BusinessProfile, UserRole, InviteStatus, OrganizationInvite } from '@/types';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  businessProfile: BusinessProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // For registration flow
  pendingBusiness: BusinessProfile | null;
  pendingInviteCode: string | null;
}

const initialState: AuthState = {
  user: null,
  businessProfile: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  pendingBusiness: null,
  pendingInviteCode: null,
};

// ============================================================================
// AUTHENTICATION THUNKS
// ============================================================================

/**
 * Register as OWNER - Creates a new organization
 */
export const registerOwner = createAsyncThunk(
  'auth/registerOwner',
  async ({
    email,
    password,
    businessName,
    ownerName,
    businessType,
    phone,
  }: {
    email: string;
    password: string;
    businessName: string;
    ownerName: string;
    businessType?: string;
    phone?: string;
  }) => {
    // 1. Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          business_name: businessName,
          owner_name: ownerName,
          role: UserRole.OWNER,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Registration failed: No user data returned');

    // 2. Create business profile using RPC (returns just business_id)
    const { data: businessId, error: businessError } = await supabase.rpc(
      'create_organization_with_owner',
      {
        p_business_name: businessName,
        p_owner_name: ownerName,
        p_email: email,
        p_business_type: businessType || 'Retail',
        p_currency: 'NGN',
      }
    );

    if (businessError) {
      console.error('Business creation error:', businessError);
      throw new Error(businessError.message || 'Failed to create business');
    }

    if (!businessId) {
      throw new Error('Failed to create business: No business ID returned');
    }

    // Fetch the full business profile to get invite_code and subdomain
    const { data: businessData, error: fetchError } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('id', businessId as string)
      .single();

    if (fetchError) {
      console.error('Business fetch error:', fetchError);
    }

    const inviteCode = businessData?.invite_code;
    const subdomain = businessData?.subdomain;

    // 3. Create user record in public.users
    const { error: userError } = await supabase.from('users').insert({
      id: authData.user.id,
      business_id: businessId,
      name: ownerName,
      email: email,
      phone: phone || null,
      role: UserRole.OWNER,
      is_active: true,
      invite_status: InviteStatus.ACTIVE,
      password_hash: null, // Using Supabase Auth, no local hash needed
    } as any);

    if (userError) {
      console.error('User record creation error:', userError);
      throw new Error('Failed to create user record');
    }

    return {
      user: {
        id: authData.user.id,
        businessId: businessId,
        name: ownerName,
        email: email,
        phone: phone,
        role: UserRole.OWNER,
        isActive: true,
        inviteStatus: InviteStatus.ACTIVE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as User,
      business: {
        id: businessId,
        name: businessName,
        ownerName: ownerName,
        email: email,
        phone: phone,
        business_type: businessType,
        currency: 'NGN',
        onboarded: false,
        plan: 'FREE' as any,
        posBalance: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subdomain: subdomain,
        inviteCode: inviteCode,
      } as BusinessProfile,
    };
  }
);

/**
 * Register as EMPLOYEE - Joins existing organization via invite code
 */
export const registerEmployee = createAsyncThunk(
  'auth/registerEmployee',
  async ({
    email,
    password,
    name,
    inviteCode,
  }: {
    email: string;
    password: string;
    name: string;
    inviteCode: string;
  }) => {
    // 1. Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          name: name,
          role: UserRole.EMPLOYEE,
          invite_code: inviteCode,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Registration failed: No user data returned');

    // 2. Join organization using RPC
    const { data: joinResult, error: joinError } = await supabase.rpc(
      'join_organization_by_code',
      {
        p_invite_code: inviteCode.toUpperCase(),
        p_user_id: authData.user.id,
        p_email: email,
        p_name: name,
      }
    );

    if (joinError) {
      console.error('Join organization error:', joinError);
      throw new Error(joinError.message || 'Failed to join organization. Invalid invite code.');
    }

    const businessId = joinResult?.[0]?.business_id;
    const businessName = joinResult?.[0]?.business_name;
    const role = joinResult?.[0]?.role;

    if (!businessId) {
      throw new Error('Failed to join organization. Please check your invite code.');
    }

    return {
      user: {
        id: authData.user.id,
        businessId: businessId,
        name: name,
        email: email,
        role: (role as UserRole) || UserRole.EMPLOYEE,
        isActive: true,
        inviteStatus: InviteStatus.ACTIVE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as User,
      business: {
        id: businessId,
        name: businessName,
        currency: 'NGN',
        onboarded: true,
        plan: 'FREE' as any,
        posBalance: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as BusinessProfile,
    };
  }
);

/**
 * Login user
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Login failed');

    // Fetch user record from public.users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) {
      console.error('User fetch error:', userError);
      throw new Error('User account not found. Please complete registration.');
    }

    // Fetch business profile
    const { data: businessData, error: businessError } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('id', userData.business_id)
      .single();

    if (businessError) {
      console.error('Business fetch error:', businessError);
    }

    // Update last login
    await supabase.from('users').update({ last_login: new Date().toISOString() }).eq('id', data.user.id);

    return {
      user: {
        id: data.user.id,
        businessId: userData.business_id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role as UserRole,
        isActive: userData.is_active,
        inviteStatus: userData.invite_status as InviteStatus,
        invitedBy: userData.invited_by,
        lastLogin: new Date().toISOString(),
        createdAt: userData.created_at,
        updatedAt: userData.updated_at,
      } as User,
      business: businessData
        ? ({
            id: businessData.id,
            name: businessData.name,
            ownerName: businessData.owner_name,
            email: businessData.email,
            phone: businessData.phone,
            address: businessData.address,
            business_type: businessData.business_type,
            currency: businessData.currency,
            onboarded: businessData.onboarded,
            plan: businessData.plan,
            trialEndsAt: businessData.trial_ends_at,
            posBalance: businessData.pos_balance,
            subdomain: businessData.subdomain,
            inviteCode: businessData.invite_code,
            settings: businessData.settings,
            createdAt: businessData.created_at,
            updatedAt: businessData.updated_at,
          } as BusinessProfile)
        : null,
    };
  }
);

/**
 * Logout user
 */
export const logoutUser = createAsyncThunk('auth/logout', async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
});

/**
 * Fetch current user and their business
 */
export const fetchCurrentUser = createAsyncThunk('auth/fetchUser', async () => {
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser) {
    throw new Error('Not authenticated');
  }

  // Fetch user record
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (userError || !userData) {
    console.error('User fetch error:', userError);
    // Return partial user if no public user record yet
    return {
      user: {
        id: authUser.id,
        businessId: '',
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || '',
        email: authUser.email || '',
        role: UserRole.OWNER,
        isActive: true,
        inviteStatus: InviteStatus.PENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as User,
      business: null,
    };
  }

  // Fetch business profile
  const { data: businessData } = await supabase
    .from('business_profiles')
    .select('*')
    .eq('id', userData.business_id)
    .single();

  return {
    user: {
      id: authUser.id,
      businessId: userData.business_id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role as UserRole,
      isActive: userData.is_active,
      inviteStatus: userData.invite_status as InviteStatus,
      invitedBy: userData.invited_by,
      lastLogin: userData.last_login,
      createdAt: userData.created_at,
      updatedAt: userData.updated_at,
    } as User,
    business: businessData
      ? ({
          id: businessData.id,
          name: businessData.name,
          ownerName: businessData.owner_name,
          email: businessData.email,
          phone: businessData.phone,
          address: businessData.address,
          business_type: businessData.business_type,
          currency: businessData.currency,
          onboarded: businessData.onboarded,
          plan: businessData.plan,
          trialEndsAt: businessData.trial_ends_at,
          posBalance: businessData.pos_balance,
          subdomain: businessData.subdomain,
          inviteCode: businessData.invite_code,
          settings: businessData.settings,
          createdAt: businessData.created_at,
          updatedAt: businessData.updated_at,
        } as BusinessProfile)
      : null,
  };
});

/**
 * Invite employee to organization
 */
export const inviteEmployee = createAsyncThunk(
  'auth/inviteEmployee',
  async (
    { email, role }: { email: string; role: UserRole },
    { getState }
  ) => {
    const state = getState() as { auth: AuthState };
    const businessId = state.auth.businessProfile?.id;

    if (!businessId) {
      throw new Error('No business selected');
    }

    const { data, error } = await supabase.rpc('invite_employee', {
      p_business_id: businessId,
      p_email: email,
      p_role: role,
    });

    if (error) throw error;

    return { email, role, inviteId: data?.[0]?.invite_id, token: data?.[0]?.token };
  }
);

/**
 * Join organization by invite code
 */
export const joinOrganization = createAsyncThunk(
  'auth/joinOrganization',
  async ({ inviteCode, name }: { inviteCode: string; name: string }) => {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      throw new Error('Not authenticated');
    }

    const { data: joinResult, error: joinError } = await supabase.rpc(
      'join_organization_by_code',
      {
        p_invite_code: inviteCode.toUpperCase(),
        p_user_id: authUser.id,
        p_email: authUser.email || '',
        p_name: name,
      }
    );

    if (joinError) {
      throw new Error(joinError.message || 'Failed to join organization');
    }

    const businessId = joinResult?.[0]?.business_id;
    const businessName = joinResult?.[0]?.business_name;
    const role = joinResult?.[0]?.role;

    // Update user metadata
    await supabase.auth.updateUser({
      data: {
        business_id: businessId,
        role: role,
      },
    });

    return {
      businessId,
      businessName,
      role,
    };
  }
);

/**
 * Update business profile
 */
export const updateBusinessProfile = createAsyncThunk(
  'auth/updateBusiness',
  async (updates: Partial<BusinessProfile>, { getState }) => {
    const state = getState() as { auth: AuthState };
    const businessId = state.auth.businessProfile?.id;

    if (!businessId) {
      throw new Error('No business selected');
    }

    const { data, error } = await supabase
      .from('business_profiles')
      .update({
        name: updates.name,
        owner_name: updates.ownerName,
        email: updates.email,
        phone: updates.phone,
        address: updates.address,
        business_type: updates.business_type,
        currency: updates.currency,
        onboarded: updates.onboarded,
        settings: updates.settings,
        updated_at: new Date().toISOString(),
      })
      .eq('id', businessId)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      ownerName: data.owner_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      business_type: data.business_type,
      currency: data.currency,
      onboarded: data.onboarded,
      plan: data.plan,
      trialEndsAt: data.trial_ends_at,
      posBalance: data.pos_balance,
      subdomain: data.subdomain,
      inviteCode: data.invite_code,
      settings: data.settings,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as BusinessProfile;
  }
);

// ============================================================================
// SLICE
// ============================================================================

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
    setPendingInviteCode: (state, action: PayloadAction<string | null>) => {
      state.pendingInviteCode = action.payload;
    },
    clearPendingData: (state) => {
      state.pendingBusiness = null;
      state.pendingInviteCode = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register Owner
      .addCase(registerOwner.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerOwner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.businessProfile = action.payload.business;
      })
      .addCase(registerOwner.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      })
      // Register Employee
      .addCase(registerEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.businessProfile = action.payload.business;
      })
      .addCase(registerEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to join organization';
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.businessProfile = action.payload.business;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.businessProfile = null;
        state.isAuthenticated = false;
        state.error = null;
        state.pendingBusiness = null;
        state.pendingInviteCode = null;
      })
      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.businessProfile = action.payload.business;
        state.isAuthenticated = !!action.payload.user;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.businessProfile = null;
        state.error = action.error.message || 'Failed to fetch user';
      })
      // Invite employee
      .addCase(inviteEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(inviteEmployee.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(inviteEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to invite employee';
      })
      // Update business profile
      .addCase(updateBusinessProfile.fulfilled, (state, action) => {
        state.businessProfile = action.payload;
      });
  },
});

export const {
  clearError,
  setBusinessProfile,
  updateUser,
  setPendingInviteCode,
  clearPendingData,
} = authSlice.actions;

export default authSlice.reducer;
