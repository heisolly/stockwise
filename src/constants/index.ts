export const CURRENCY = '₦';
export const CURRENCY_CODE = 'NGN';

export const NIGERIAN_BUSINESS_CATEGORIES = [
  'Groceries & Foodstuffs',
  'Electronics & Gadgets',
  'Clothing & Fashion',
  'Beauty & Personal Care',
  'Home & Office Supplies',
  'Pharmacy & Health',
  'Books & Stationery',
  'Toys & Baby Products',
  'Automotive Parts',
  'Building Materials',
  'Restaurant & Food Service',
  'Supermarket & General Store',
  'Fashion Boutique',
  'Electronics Store',
  'Pharmacy',
  'Others'
];

export const EXPENSE_CATEGORIES = [
  'Rent',
  'Utilities',
  'Salaries',
  'Marketing',
  'Transportation',
  'Office Supplies',
  'Inventory Purchase',
  'Maintenance',
  'Insurance',
  'Taxes',
  'Bank Charges',
  'Training',
  'Entertainment',
  'Others'
];

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash', icon: '💵' },
  { value: 'card', label: 'Card', icon: '💳' },
  { value: 'transfer', label: 'Bank Transfer', icon: '🏦' },
  { value: 'pos', label: 'POS', icon: '📱' }
];

export const PLAN_DETAILS = {
  STARTER: {
    name: 'Starter',
    price: 4900,
    duration: 'month',
    features: [
      '1 store location',
      'Up to 100 products',
      'Basic sales POS',
      'Daily stock reports',
      '1 staff account',
      'Email support',
    ],
    limits: { products: 100, staff: 1, reports: 'daily' }
  },
  GROWTH: {
    name: 'Growth',
    price: 9900,
    duration: 'month',
    features: [
      '3 store locations',
      'Unlimited products',
      'Full POS + receipts',
      'AI-powered analytics',
      '5 staff accounts',
      'Low stock alerts',
      'Export to PDF/Excel',
      'Priority support',
    ],
    limits: { products: Infinity, staff: 5, reports: 'weekly' }
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 24900,
    duration: 'month',
    features: [
      'Unlimited store locations',
      'Unlimited products',
      'Everything in Growth',
      'Custom integrations',
      'Unlimited staff accounts',
      'Dedicated account manager',
      'Custom reports',
      'SLA guarantee',
    ],
    limits: { products: Infinity, staff: Infinity, reports: 'custom' }
  }
};

export const APP_CONFIG = {
  NAME: 'StockWise',
  TAGLINE: 'The heartbeat of your Business Inventory',
  PRIMARY_COLOR: 'emerald',
  SECONDARY_COLOR: 'blue',
  ACCENT_COLOR: 'naira',
  SUPPORT_EMAIL: 'support@stockwise.ng',
  SUPPORT_PHONE: '+234-800-000-0000',
  VERSION: '1.0.0'
};

export const DASHBOARD_REFRESH_INTERVAL = 30000; // 30 seconds
export const ACTIVITY_LOGS_LIMIT = 100;

export const VALIDATION_RULES = {
  businessName: { minLength: 2, maxLength: 100 },
  productName: { minLength: 2, maxLength: 100 },
  userName: { minLength: 2, maxLength: 50 },
  email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  phone: { pattern: /^[+]?[\d\s\-\(\)]+$/ },
  password: { minLength: 8 },
  price: { min: 0, max: 99999999.99 },
  quantity: { min: 0, max: 999999 }
};

export const DATE_FORMATS = {
  display: 'MMM dd, yyyy',
  short: 'MMM dd',
  long: 'MMMM dd, yyyy HH:mm',
  api: 'yyyy-MM-dd HH:mm:ss'
};

export const CHART_COLORS = [
  '#10b981', // emerald-500
  '#3b82f6', // blue-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
];

export const MOBILE_BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};
