-- StockWise Full Supabase Setup Schema
-- Execute this entirely in your Supabase SQL Editor

-- 1. Enable pgcrypto for UUIDs if not enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Create Tables
-- ----------------------------------------------------

-- Table: business_profiles
CREATE TABLE IF NOT EXISTS public.business_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    address TEXT,
    business_type TEXT,
    currency TEXT DEFAULT 'NGN' NOT NULL,
    onboarded BOOLEAN DEFAULT false NOT NULL,
    plan TEXT DEFAULT 'FREE' NOT NULL,
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    pos_balance NUMERIC DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: users (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    business_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'EMPLOYEE' NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: products
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    cost_price NUMERIC NOT NULL,
    selling_price NUMERIC NOT NULL,
    quantity INTEGER DEFAULT 0 NOT NULL,
    low_stock_threshold INTEGER DEFAULT 5 NOT NULL,
    sku TEXT,
    barcode TEXT,
    image_url TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: sales
CREATE TABLE IF NOT EXISTS public.sales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC NOT NULL,
    total_amount NUMERIC NOT NULL,
    profit NUMERIC NOT NULL,
    payment_method TEXT DEFAULT 'cash' NOT NULL,
    customer_name TEXT,
    customer_phone TEXT,
    recorded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    notes TEXT
);

-- Table: activity_logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity_change INTEGER,
    reason TEXT,
    description TEXT NOT NULL,
    performed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata JSONB
);

-- Table: expenses
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    category TEXT NOT NULL,
    receipt_image_url TEXT,
    recorded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    notes TEXT
);

-- Table: business_insights
CREATE TABLE IF NOT EXISTS public.business_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE NOT NULL,
    summary TEXT NOT NULL,
    recommendations TEXT[] NOT NULL,
    risk_level TEXT DEFAULT 'Low' NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    period_start TIMESTAMP WITH TIME ZONE,
    period_end TIMESTAMP WITH TIME ZONE,
    data_points JSONB
);


-- 3. Enable Row Level Security (RLS)
-- ----------------------------------------------------
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_insights ENABLE ROW LEVEL SECURITY;


-- 4. Create RLS Policies
-- We enforce that users can only see and modify data related to their own business_id.

-- Function to get the current user's business_id
CREATE OR REPLACE FUNCTION get_user_business_id()
RETURNS UUID AS $$
  SELECT business_id FROM public.users WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;


-- Users Policy
CREATE POLICY "Users can view users in same business" ON public.users
  FOR SELECT USING (business_id = get_user_business_id());
  
CREATE POLICY "Users can update users in same business (Owner logic)" ON public.users
  FOR UPDATE USING (business_id = get_user_business_id());

CREATE POLICY "Users can insert users in same business" ON public.users
  FOR INSERT WITH CHECK (business_id = get_user_business_id() OR auth.uid() = id);

-- Profile Policy
CREATE POLICY "Users can view their business profile" ON public.business_profiles
  FOR SELECT USING (id = get_user_business_id());

CREATE POLICY "Owner can update business profile" ON public.business_profiles
  FOR UPDATE USING (id = get_user_business_id());

CREATE POLICY "Insert profile allowed on signup" ON public.business_profiles
  FOR INSERT WITH CHECK (true);


-- Products Policy
CREATE POLICY "Users view products for their business" ON public.products
  FOR SELECT USING (business_id = get_user_business_id());

CREATE POLICY "Users modify products for their business" ON public.products
  FOR ALL USING (business_id = get_user_business_id());


-- Sales Policy
CREATE POLICY "Users view sales for their business" ON public.sales
  FOR SELECT USING (business_id = get_user_business_id());

CREATE POLICY "Users modify sales for their business" ON public.sales
  FOR ALL USING (business_id = get_user_business_id());


-- Activity Logs Policy
CREATE POLICY "Users view activity logs for their business" ON public.activity_logs
  FOR SELECT USING (business_id = get_user_business_id());

CREATE POLICY "Users insert activity logs for their business" ON public.activity_logs
  FOR INSERT WITH CHECK (business_id = get_user_business_id());


-- Expenses Policy
CREATE POLICY "Users view expenses for their business" ON public.expenses
  FOR SELECT USING (business_id = get_user_business_id());

CREATE POLICY "Users modify expenses for their business" ON public.expenses
  FOR ALL USING (business_id = get_user_business_id());


-- Insights Policy
CREATE POLICY "Users view insights for their business" ON public.business_insights
  FOR SELECT USING (business_id = get_user_business_id());


-- 5. Realtime Setup
-- Enable supabase_realtime publication for key tables
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.expenses;

-- 6. Trigger for Updating `updated_at` column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_business_profiles_updated_at BEFORE UPDATE ON public.business_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
