export enum UserRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE'
}

export enum InviteStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INVITED = 'INVITED'
}

export enum PlanType {
  FREE = 'FREE',
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM'
}

export interface BusinessProfile {
  id: string;
  name: string;
  ownerName: string;
  email?: string;
  phone?: string;
  address?: string;
  business_type?: string;
  currency: string;
  onboarded: boolean;
  plan: PlanType;
  trialEndsAt?: string;
  posBalance: number;
  createdAt: string;
  updatedAt: string;
  subdomain?: string;
  inviteCode?: string;
  settings?: Record<string, any>;
}

export interface User {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  inviteStatus: InviteStatus;
  invitedBy?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffMember {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  inviteStatus: InviteStatus;
  invitedBy?: string;
  addedAt: string;
  lastLogin?: string;
}

export interface OrganizationInvite {
  id: string;
  businessId: string;
  email: string;
  role: UserRole;
  invitedBy?: string;
  token: string;
  expiresAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
  acceptedAt?: string;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  lowStockThreshold: number;
  sku?: string;
  barcode?: string;
  imageUrl?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  businessId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  profit: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'pos';
  customerName?: string;
  customerPhone?: string;
  recordedBy: string;
  timestamp: string;
  notes?: string;
}

export enum ActivityType {
  STOCK_IN = 'STOCK_IN',
  STOCK_OUT = 'STOCK_OUT',
  STOCK_ADJUST = 'STOCK_ADJUST',
  SALE = 'SALE',
  PRODUCT_CREATED = 'PRODUCT_CREATED',
  PRODUCT_UPDATED = 'PRODUCT_UPDATED',
  PRODUCT_DELETED = 'PRODUCT_DELETED',
  PRICE_CHANGE = 'PRICE_CHANGE',
  USER_ADDED = 'USER_ADDED',
  USER_REMOVED = 'USER_REMOVED',
  USER_INVITED = 'USER_INVITED',
  EXPENSE = 'EXPENSE'
}

export interface ActivityLog {
  id: string;
  businessId: string;
  type: ActivityType;
  productId?: string;
  quantityChange?: number;
  reason?: string;
  description: string;
  performedBy: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Expense {
  id: string;
  businessId: string;
  description: string;
  amount: number;
  category: string;
  receiptImageUrl?: string;
  recordedBy: string;
  timestamp: string;
  notes?: string;
}

export interface BusinessInsight {
  id: string;
  businessId: string;
  summary: string;
  recommendations: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
  generatedAt: string;
  periodStart?: string;
  periodEnd?: string;
  dataPoints?: Record<string, any>;
}

export interface DashboardMetrics {
  totalSales: number;
  totalProfit: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  todaySales: number;
  weekSales: number;
  monthSales: number;
  topSellingProducts: Product[];
  recentSales: Sale[];
  recentExpenses: Expense[];
  stockValue: number;
}

export interface AppState {
  user: User | null;
  businessProfile: BusinessProfile | null;
  products: Product[];
  sales: Sale[];
  expenses: Expense[];
  activityLogs: ActivityLog[];
  businessInsights: BusinessInsight[];
  staff: StaffMember[];
  isLoading: boolean;
  error: string | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  businessProfile: BusinessProfile | null;
}

export type NavigationTab = 
  | 'dashboard'
  | 'inventory'
  | 'sales'
  | 'reports'
  | 'staff'
  | 'settings'
  | 'ai-insights'
  | 'subscription'
  | 'profile';

export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}
