// Data transformation utilities for mapping between camelCase (TypeScript) and snake_case (database)

export interface DatabaseBusinessProfile {
  id: string;
  name: string;
  owner_name: string;
  address: string | null;
  business_type: string | null;
  currency: string;
  onboarded: boolean;
  plan: string;
  trial_ends_at: string | null;
  pos_balance: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseUser {
  id: string;
  business_id: string;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export function transformDatabaseBusinessProfile(dbProfile: DatabaseBusinessProfile) {
  return {
    id: dbProfile.id,
    name: dbProfile.name,
    ownerName: dbProfile.owner_name,
    address: dbProfile.address || undefined,
    business_type: dbProfile.business_type,
    currency: dbProfile.currency,
    onboarded: dbProfile.onboarded,
    plan: dbProfile.plan,
    trialEndsAt: dbProfile.trial_ends_at,
    posBalance: dbProfile.pos_balance,
    createdAt: dbProfile.created_at,
    updatedAt: dbProfile.updated_at,
  };
}

export function transformDatabaseUser(dbUser: DatabaseUser) {
  return {
    id: dbUser.id,
    businessId: dbUser.business_id,
    name: dbUser.name,
    email: dbUser.email,
    passwordHash: dbUser.password_hash,
    role: dbUser.role as any, // Handle UserRole enum compatibility
    isActive: dbUser.is_active,
    lastLogin: dbUser.last_login,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.updated_at,
  };
}
