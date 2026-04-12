import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Singleton pattern to prevent multiple instances
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseInstance;
})();

// Auth helper functions
export const signUp = async (email: string, password: string, metadata: any) => {
  // Validate required fields
  if (!email || !password) {
    return { data: null, error: { message: 'Email and password are required' } };
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { data: null, error: { message: 'Please enter a valid email address' } };
  }

  // Password validation
  if (password.length < 6) {
    return { data: null, error: { message: 'Password must be at least 6 characters long' } };
  }

  if (password.length > 72) {
    return { data: null, error: { message: 'Password must be less than 72 characters long' } };
  }

  // Clean metadata to remove any problematic fields
  const cleanMetadata = {
    business_name: metadata.business_name?.trim() || '',
    owner_name: metadata.owner_name?.trim() || '',
  };

  const { data, error } = await supabase.auth.signUp({
    email: email.toLowerCase().trim(),
    password,
    options: {
      data: cleanMetadata,
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const getUserAndBusiness = async () => {
  try {
    // First check if we have a valid session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.log('No valid session found');
      return { user: null, business: null, error: sessionError || new Error('No session') };
    }

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser) {
      console.log('Failed to get user from session');
      return { user: null, business: null, error: authError || new Error('No user in session') };
    }

    // Fetch public user record to get business_id
    const { data: userData, error: userError } = await supabase
      .from('users' as any)
      .select('business_id, name, email, role, is_active, last_login, created_at, updated_at')
      .eq('id', authUser.id)
      .maybeSingle();

    if (userError) {
      console.error('User fetch error:', userError);
      // If user record doesn't exist, they might be a new registrant needing onboarding
      return { user: { id: authUser.id, email: authUser.email } as any, business: null, error: null };
    }

    if (!userData) {
      return { user: { id: authUser.id, email: authUser.email } as any, business: null, error: null };
    }

    // Fetch business profile
    const { data: businessData, error: businessError } = await supabase
      .from('business_profiles' as any)
      .select('*')
      .eq('id', (userData as any).business_id)
      .maybeSingle();

    if (businessError) {
      console.error('Business fetch error:', businessError);
    }

    // Transform data to match TypeScript types
    const transformedUser = userData ? {
      id: authUser.id,
      businessId: (userData as any).business_id,
      name: (userData as any).name || authUser.user_metadata?.name || authUser.email?.split('@')[0],
      email: (userData as any).email || authUser.email,
      passwordHash: 'managed_by_auth',
      role: (userData as any).role || 'OWNER',
      isActive: (userData as any).is_active !== false,
      lastLogin: (userData as any).last_login,
      createdAt: (userData as any).created_at || new Date().toISOString(),
      updatedAt: (userData as any).updated_at || new Date().toISOString(),
    } : {
      id: authUser.id,
      businessId: null,
      name: authUser.user_metadata?.name || authUser.email?.split('@')[0],
      email: authUser.email,
      passwordHash: 'managed_by_auth',
      role: 'OWNER',
      isActive: true,
      lastLogin: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const transformedBusiness = businessData ? {
      id: (businessData as any).id,
      name: (businessData as any).name,
      ownerName: (businessData as any).owner_name,
      address: (businessData as any).address || undefined,
      business_type: (businessData as any).business_type,
      currency: (businessData as any).currency,
      onboarded: (businessData as any).onboarded,
      plan: (businessData as any).plan,
      trialEndsAt: (businessData as any).trial_ends_at,
      posBalance: (businessData as any).pos_balance,
      createdAt: (businessData as any).created_at,
      updatedAt: (businessData as any).updated_at,
    } : null;

    return { 
      user: transformedUser, 
      business: transformedBusiness, 
      error: businessError 
    };
  } catch (error) {
    console.error('getUserAndBusiness error:', error);
    return { user: null, business: null, error };
  }
};

export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};
