-- ============================================================================
-- STOCKWISE COMPLETE DATABASE SCHEMA
-- Run this entire file in your Supabase SQL Editor
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm; -- For text search

-- ============================================================================
-- 1. BUSINESS PROFILES (Organizations)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.business_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    business_type TEXT,
    currency TEXT DEFAULT 'NGN' NOT NULL,
    
    -- Organization/Subdomain fields
    subdomain TEXT UNIQUE,
    invite_code TEXT UNIQUE,
    
    -- Settings
    onboarded BOOLEAN DEFAULT false NOT NULL,
    plan TEXT DEFAULT 'FREE' NOT NULL,
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    pos_balance NUMERIC DEFAULT 0 NOT NULL,
    settings JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_business_profiles_subdomain ON public.business_profiles(subdomain);
CREATE INDEX IF NOT EXISTS idx_business_profiles_invite_code ON public.business_profiles(invite_code);

-- ============================================================================
-- 2. USERS (extends auth.users)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    business_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    password_hash TEXT NOT NULL DEFAULT 'managed_by_auth',
    
    -- Role-based access: OWNER, MANAGER, EMPLOYEE
    role TEXT DEFAULT 'EMPLOYEE' NOT NULL,
    
    -- Invite status for employees joining via invite
    invite_status TEXT DEFAULT 'ACTIVE' NOT NULL, -- ACTIVE, PENDING, INVITED
    invited_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    is_active BOOLEAN DEFAULT true NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_business_id ON public.users(business_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- ============================================================================
-- 3. ORGANIZATION INVITES (For inviting employees)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.organization_invites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'EMPLOYEE' NOT NULL,
    invited_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    -- Token for invitation link
    token TEXT UNIQUE NOT NULL,
    
    -- Expiration
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Status
    status TEXT DEFAULT 'PENDING' NOT NULL, -- PENDING, ACCEPTED, EXPIRED, REVOKED
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE,
    
    -- Unique constraint to prevent duplicate pending invites
    CONSTRAINT unique_pending_invite UNIQUE (business_id, email, status)
);

CREATE INDEX IF NOT EXISTS idx_organization_invites_token ON public.organization_invites(token);
CREATE INDEX IF NOT EXISTS idx_organization_invites_business_id ON public.organization_invites(business_id);
CREATE INDEX IF NOT EXISTS idx_organization_invites_email ON public.organization_invites(email);

-- ============================================================================
-- 4. PRODUCTS (Inventory)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Product details
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    sku TEXT,
    barcode TEXT,
    
    -- Pricing
    cost_price NUMERIC NOT NULL,
    selling_price NUMERIC NOT NULL,
    
    -- Stock
    quantity INTEGER DEFAULT 0 NOT NULL,
    low_stock_threshold INTEGER DEFAULT 5 NOT NULL,
    
    -- Media
    image_url TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    
    -- Tracking
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_business_id ON public.products(business_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);

-- ============================================================================
-- 5. SALES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.sales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Product info (denormalized for historical records)
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    
    -- Sale details
    quantity INTEGER NOT NULL,
    unit_price NUMERIC NOT NULL,
    total_amount NUMERIC NOT NULL,
    profit NUMERIC NOT NULL,
    
    -- Payment
    payment_method TEXT DEFAULT 'cash' NOT NULL,
    
    -- Customer
    customer_name TEXT,
    customer_phone TEXT,
    
    -- Staff who recorded
    recorded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    -- Notes
    notes TEXT,
    
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sales_business_id ON public.sales(business_id);
CREATE INDEX IF NOT EXISTS idx_sales_timestamp ON public.sales(timestamp);
CREATE INDEX IF NOT EXISTS idx_sales_product_id ON public.sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_recorded_by ON public.sales(recorded_by);

-- ============================================================================
-- 6. ACTIVITY LOGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE NOT NULL,
    
    type TEXT NOT NULL, -- STOCK_IN, STOCK_OUT, SALE, PRODUCT_ADDED, PRODUCT_UPDATED, etc.
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    
    quantity_change INTEGER,
    reason TEXT,
    description TEXT NOT NULL,
    
    performed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_business_id ON public.activity_logs(business_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON public.activity_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON public.activity_logs(type);

-- ============================================================================
-- 7. EXPENSES
-- ============================================================================

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

CREATE INDEX IF NOT EXISTS idx_expenses_business_id ON public.expenses(business_id);
CREATE INDEX IF NOT EXISTS idx_expenses_timestamp ON public.expenses(timestamp);

-- ============================================================================
-- 8. CATEGORIES (Custom categories per business)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#004838',
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_categories_business_id ON public.categories(business_id);

-- ============================================================================
-- 9. BUSINESS INSIGHTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.business_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE NOT NULL,
    summary TEXT NOT NULL,
    recommendations TEXT[] NOT NULL,
    risk_level TEXT DEFAULT 'Low' NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    period_start TIMESTAMP WITH TIME ZONE,
    period_end TIMESTAMP WITH TIME ZONE,
    data_points JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_business_insights_business_id ON public.business_insights(business_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) SETUP
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_insights ENABLE ROW LEVEL SECURITY;

-- Helper function: Get current user's business_id
CREATE OR REPLACE FUNCTION get_user_business_id()
RETURNS UUID AS $$
  SELECT business_id FROM public.users WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function: Check if current user is owner
CREATE OR REPLACE FUNCTION is_owner()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'OWNER'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function: Check if current user is owner or manager
CREATE OR REPLACE FUNCTION is_owner_or_manager()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('OWNER', 'MANAGER')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function: Get user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================================================
-- RLS POLICIES: BUSINESS PROFILES
-- ============================================================================

-- Anyone can create a business profile (for owner signup)
CREATE POLICY "Allow business creation on signup" 
ON public.business_profiles
FOR INSERT WITH CHECK (true);

-- Users can view their own business
CREATE POLICY "Users can view their business" 
ON public.business_profiles
FOR SELECT USING (id = get_user_business_id());

-- Only owner can update business
CREATE POLICY "Only owner can update business" 
ON public.business_profiles
FOR UPDATE USING (
  id = get_user_business_id() 
  AND is_owner()
);

-- Allow viewing by subdomain (for employee signup)
CREATE POLICY "Allow viewing by invite code or subdomain" 
ON public.business_profiles
FOR SELECT USING (
  subdomain IS NOT NULL 
  OR invite_code IS NOT NULL
);

-- ============================================================================
-- RLS POLICIES: USERS
-- ============================================================================

-- Users can view other users in same business
CREATE POLICY "Users can view users in same business" 
ON public.users
FOR SELECT USING (
  business_id = get_user_business_id() 
  OR id = auth.uid()
);

-- Owner can insert users
CREATE POLICY "Owner can insert users" 
ON public.users
FOR INSERT WITH CHECK (
  is_owner() 
  OR auth.uid() = id
);

-- Owner/Manager can update users in same business
CREATE POLICY "Owner/Manager can update users" 
ON public.users
FOR UPDATE USING (
  business_id = get_user_business_id() 
  AND (
    is_owner() 
    OR (is_owner_or_manager() AND role != 'OWNER')
  )
);

-- Owner can delete non-owner users
CREATE POLICY "Owner can delete non-owner users" 
ON public.users
FOR DELETE USING (
  business_id = get_user_business_id() 
  AND is_owner() 
  AND role != 'OWNER'
);

-- ============================================================================
-- RLS POLICIES: ORGANIZATION INVITES
-- ============================================================================

-- Owner/Manager can manage invites
CREATE POLICY "Owner/Manager can manage invites" 
ON public.organization_invites
FOR ALL USING (
  business_id = get_user_business_id() 
  AND is_owner_or_manager()
);

-- Anyone can view invites by token (for accepting invites)
CREATE POLICY "Anyone can view invite by token" 
ON public.organization_invites
FOR SELECT USING (
  status = 'PENDING' 
  AND expires_at > now()
);

-- ============================================================================
-- RLS POLICIES: PRODUCTS
-- ============================================================================

-- All users in business can view products
CREATE POLICY "Users can view products in their business" 
ON public.products
FOR SELECT USING (business_id = get_user_business_id());

-- Owner/Manager can insert products
CREATE POLICY "Owner/Manager can insert products" 
ON public.products
FOR INSERT WITH CHECK (
  business_id = get_user_business_id() 
  AND is_owner_or_manager()
);

-- Owner/Manager can update products
CREATE POLICY "Owner/Manager can update products" 
ON public.products
FOR UPDATE USING (
  business_id = get_user_business_id() 
  AND is_owner_or_manager()
);

-- Owner/Manager can delete products
CREATE POLICY "Owner/Manager can delete products" 
ON public.products
FOR DELETE USING (
  business_id = get_user_business_id() 
  AND is_owner_or_manager()
);

-- ============================================================================
-- RLS POLICIES: SALES
-- ============================================================================

-- All users in business can view sales
CREATE POLICY "Users can view sales in their business" 
ON public.sales
FOR SELECT USING (business_id = get_user_business_id());

-- All users in business can create sales (for POS)
CREATE POLICY "Users can create sales" 
ON public.sales
FOR INSERT WITH CHECK (
  business_id = get_user_business_id()
);

-- Owner/Manager can update/delete sales
CREATE POLICY "Owner/Manager can update sales" 
ON public.sales
FOR UPDATE USING (
  business_id = get_user_business_id() 
  AND is_owner_or_manager()
);

CREATE POLICY "Owner/Manager can delete sales" 
ON public.sales
FOR DELETE USING (
  business_id = get_user_business_id() 
  AND is_owner_or_manager()
);

-- ============================================================================
-- RLS POLICIES: ACTIVITY LOGS
-- ============================================================================

-- All users can view activity logs in their business
CREATE POLICY "Users can view activity logs" 
ON public.activity_logs
FOR SELECT USING (business_id = get_user_business_id());

-- All users can insert activity logs
CREATE POLICY "Users can insert activity logs" 
ON public.activity_logs
FOR INSERT WITH CHECK (
  business_id = get_user_business_id()
);

-- ============================================================================
-- RLS POLICIES: EXPENSES
-- ============================================================================

-- All users can view expenses
CREATE POLICY "Users can view expenses" 
ON public.expenses
FOR SELECT USING (business_id = get_user_business_id());

-- Owner/Manager can manage expenses
CREATE POLICY "Owner/Manager can manage expenses" 
ON public.expenses
FOR ALL USING (
  business_id = get_user_business_id() 
  AND is_owner_or_manager()
);

-- ============================================================================
-- RLS POLICIES: CATEGORIES
-- ============================================================================

-- All users can view categories
CREATE POLICY "Users can view categories" 
ON public.categories
FOR SELECT USING (business_id = get_user_business_id());

-- Owner/Manager can manage categories
CREATE POLICY "Owner/Manager can manage categories" 
ON public.categories
FOR ALL USING (
  business_id = get_user_business_id() 
  AND is_owner_or_manager()
);

-- ============================================================================
-- RLS POLICIES: BUSINESS INSIGHTS
-- ============================================================================

-- All users can view insights
CREATE POLICY "Users can view insights" 
ON public.business_insights
FOR SELECT USING (business_id = get_user_business_id());

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_business_profiles_updated_at 
BEFORE UPDATE ON public.business_profiles 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
BEFORE UPDATE ON public.users 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
BEFORE UPDATE ON public.products 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate invite code on business creation
CREATE OR REPLACE FUNCTION generate_business_invite_code()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate a unique 8-character invite code
  NEW.invite_code := upper(substring(md5(random()::text) from 1 for 8));
  
  -- Generate subdomain from business name if not provided
  IF NEW.subdomain IS NULL OR NEW.subdomain = '' THEN
    NEW.subdomain := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9]', '', 'g')) || '-' || substring(NEW.id::text from 1 for 6);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_invite_code_trigger
BEFORE INSERT ON public.business_profiles
FOR EACH ROW
EXECUTE FUNCTION generate_business_invite_code();

-- Log activity when product is created
CREATE OR REPLACE FUNCTION log_product_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.activity_logs (
    business_id,
    type,
    product_id,
    description,
    performed_by,
    quantity_change,
    metadata
  ) VALUES (
    NEW.business_id,
    'PRODUCT_CREATED',
    NEW.id,
    'Product created: ' || NEW.name,
    NEW.created_by,
    NEW.quantity,
    jsonb_build_object('initial_quantity', NEW.quantity, 'cost_price', NEW.cost_price, 'selling_price', NEW.selling_price)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_product_created_trigger
AFTER INSERT ON public.products
FOR EACH ROW
EXECUTE FUNCTION log_product_created();

-- Log activity when stock is updated
CREATE OR REPLACE FUNCTION log_stock_update()
RETURNS TRIGGER AS $$
DECLARE
  qty_change INTEGER;
  activity_type TEXT;
BEGIN
  qty_change := NEW.quantity - OLD.quantity;
  
  IF qty_change > 0 THEN
    activity_type := 'STOCK_IN';
  ELSIF qty_change < 0 THEN
    activity_type := 'STOCK_OUT';
  ELSE
    activity_type := 'STOCK_ADJUST';
  END IF;
  
  INSERT INTO public.activity_logs (
    business_id,
    type,
    product_id,
    description,
    quantity_change,
    performed_by,
    metadata
  ) VALUES (
    NEW.business_id,
    activity_type,
    NEW.id,
    'Stock updated for ' || NEW.name || ': ' || qty_change || ' units',
    NEW.updated_by,
    qty_change,
    jsonb_build_object('old_quantity', OLD.quantity, 'new_quantity', NEW.quantity)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_stock_update_trigger
AFTER UPDATE OF quantity ON public.products
FOR EACH ROW
WHEN (OLD.quantity IS DISTINCT FROM NEW.quantity)
EXECUTE FUNCTION log_stock_update();

-- Update product stock when sale is made
CREATE OR REPLACE FUNCTION update_stock_on_sale()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrease product quantity
  UPDATE public.products
  SET quantity = quantity - NEW.quantity,
      updated_at = NOW()
  WHERE id = NEW.product_id;
  
  -- Log the sale activity
  INSERT INTO public.activity_logs (
    business_id,
    type,
    product_id,
    description,
    quantity_change,
    performed_by,
    metadata
  ) VALUES (
    NEW.business_id,
    'SALE',
    NEW.product_id,
    'Sale: ' || NEW.quantity || ' x ' || NEW.product_name,
    NEW.recorded_by,
    -NEW.quantity,
    jsonb_build_object('sale_id', NEW.id, 'total_amount', NEW.total_amount, 'profit', NEW.profit)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stock_on_sale_trigger
AFTER INSERT ON public.sales
FOR EACH ROW
EXECUTE FUNCTION update_stock_on_sale();

-- ============================================================================
-- REALTIME SETUP
-- ============================================================================

-- Enable realtime for key tables
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime;

ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.expenses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;

-- ============================================================================
-- DEFAULT CATEGORIES
-- ============================================================================

-- Insert default Nigerian business categories into a reference table
-- (Businesses can create their own custom categories)

CREATE TABLE IF NOT EXISTS public.default_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#004838'
);

INSERT INTO public.default_categories (name, description) VALUES
('Electronics', 'Phones, laptops, gadgets, and accessories'),
('Fashion', 'Clothing, shoes, bags, and accessories'),
('Food & Beverages', 'Groceries, drinks, and consumables'),
('Health & Beauty', 'Cosmetics, skincare, and wellness products'),
('Home & Garden', 'Furniture, decor, and household items'),
('Automotive', 'Car parts, accessories, and maintenance'),
('Sports & Fitness', 'Exercise equipment and sporting goods'),
('Books & Stationery', 'Educational materials and office supplies'),
('Baby & Kids', 'Children products and toys'),
('Hardware & Tools', 'Construction and repair materials'),
('Jewelry & Watches', 'Accessories and timepieces'),
('Pharmaceuticals', 'Medicines and medical supplies'),
('Other', 'Miscellaneous items')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- STORED PROCEDURES FOR COMMON OPERATIONS
-- ============================================================================

-- Procedure: Create organization with owner
CREATE OR REPLACE FUNCTION create_organization_with_owner(
    p_business_name TEXT,
    p_owner_name TEXT,
    p_email TEXT,
    p_business_type TEXT,
    p_currency TEXT DEFAULT 'NGN'
)
RETURNS TABLE(business_id UUID, invite_code TEXT, subdomain TEXT) AS $$
DECLARE
    v_business_id UUID;
    v_invite_code TEXT;
    v_subdomain TEXT;
BEGIN
    -- Create business profile
    INSERT INTO public.business_profiles (
        name,
        owner_name,
        email,
        business_type,
        currency,
        onboarded
    ) VALUES (
        p_business_name,
        p_owner_name,
        p_email,
        p_business_type,
        p_currency,
        true
    )
    RETURNING id, invite_code, subdomain 
    INTO v_business_id, v_invite_code, v_subdomain;
    
    RETURN QUERY SELECT v_business_id, v_invite_code, v_subdomain;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Procedure: Invite employee to organization
CREATE OR REPLACE FUNCTION invite_employee(
    p_business_id UUID,
    p_email TEXT,
    p_role TEXT DEFAULT 'EMPLOYEE'
)
RETURNS TABLE(invite_id UUID, token TEXT) AS $$
DECLARE
    v_invite_id UUID;
    v_token TEXT;
BEGIN
    -- Check if inviter is owner or manager
    IF NOT EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND business_id = p_business_id 
        AND role IN ('OWNER', 'MANAGER')
    ) THEN
        RAISE EXCEPTION 'Only owner or manager can invite employees';
    END IF;
    
    -- Generate token
    v_token := encode(gen_random_bytes(32), 'hex');
    
    -- Create invite
    INSERT INTO public.organization_invites (
        business_id,
        email,
        role,
        invited_by,
        token,
        expires_at
    ) VALUES (
        p_business_id,
        p_email,
        p_role,
        auth.uid(),
        v_token,
        NOW() + INTERVAL '7 days'
    )
    ON CONFLICT (business_id, email, status) 
    DO UPDATE SET 
        token = v_token,
        expires_at = NOW() + INTERVAL '7 days',
        invited_by = auth.uid(),
        role = p_role,
        status = 'PENDING',
        created_at = NOW()
    RETURNING id INTO v_invite_id;
    
    RETURN QUERY SELECT v_invite_id, v_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Procedure: Accept invite and join organization
CREATE OR REPLACE FUNCTION accept_invite(
    p_token TEXT,
    p_user_id UUID
)
RETURNS TABLE(business_id UUID, role TEXT) AS $$
DECLARE
    v_invite RECORD;
    v_business_id UUID;
    v_role TEXT;
BEGIN
    -- Get and validate invite
    SELECT * INTO v_invite
    FROM public.organization_invites
    WHERE token = p_token 
    AND status = 'PENDING' 
    AND expires_at > NOW();
    
    IF v_invite IS NULL THEN
        RAISE EXCEPTION 'Invalid or expired invite token';
    END IF;
    
    v_business_id := v_invite.business_id;
    v_role := v_invite.role;
    
    -- Create user record
    INSERT INTO public.users (
        id,
        business_id,
        name,
        email,
        role,
        invite_status,
        invited_by,
        is_active
    ) VALUES (
        p_user_id,
        v_business_id,
        '', -- Will be updated from auth metadata
        v_invite.email,
        v_role,
        'ACTIVE',
        v_invite.invited_by,
        true
    )
    ON CONFLICT (id) DO UPDATE SET
        business_id = v_business_id,
        role = v_role,
        invite_status = 'ACTIVE',
        invited_by = v_invite.invited_by,
        updated_at = NOW();
    
    -- Mark invite as accepted
    UPDATE public.organization_invites
    SET status = 'ACCEPTED', accepted_at = NOW()
    WHERE id = v_invite.id;
    
    RETURN QUERY SELECT v_business_id, v_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Procedure: Join organization by invite code
CREATE OR REPLACE FUNCTION join_organization_by_code(
    p_invite_code TEXT,
    p_user_id UUID,
    p_email TEXT,
    p_name TEXT
)
RETURNS TABLE(business_id UUID, business_name TEXT, role TEXT) AS $$
DECLARE
    v_business RECORD;
    v_business_id UUID;
BEGIN
    -- Get business by invite code
    SELECT * INTO v_business
    FROM public.business_profiles
    WHERE invite_code = upper(p_invite_code);
    
    IF v_business IS NULL THEN
        RAISE EXCEPTION 'Invalid invite code';
    END IF;
    
    v_business_id := v_business.id;
    
    -- Create user as employee
    INSERT INTO public.users (
        id,
        business_id,
        name,
        email,
        role,
        invite_status,
        is_active
    ) VALUES (
        p_user_id,
        v_business_id,
        p_name,
        p_email,
        'EMPLOYEE',
        'ACTIVE',
        true
    )
    ON CONFLICT (id) DO UPDATE SET
        business_id = v_business_id,
        name = p_name,
        role = 'EMPLOYEE',
        updated_at = NOW();
    
    RETURN QUERY SELECT v_business_id, v_business.name, 'EMPLOYEE'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- VIEWS FOR CONVENIENCE
-- ============================================================================

-- View: Business with owner info
CREATE OR REPLACE VIEW public.business_with_owner AS
SELECT 
    bp.*,
    u.name as owner_name_from_user,
    u.email as owner_email,
    u.last_login as owner_last_login
FROM public.business_profiles bp
LEFT JOIN public.users u ON u.business_id = bp.id AND u.role = 'OWNER';

-- View: Products with stock status
CREATE OR REPLACE VIEW public.products_with_status AS
SELECT 
    p.*,
    CASE 
        WHEN p.quantity = 0 THEN 'OUT_OF_STOCK'
        WHEN p.quantity <= p.low_stock_threshold THEN 'LOW_STOCK'
        ELSE 'IN_STOCK'
    END as stock_status
FROM public.products p;

-- View: Daily sales summary
CREATE OR REPLACE VIEW public.daily_sales_summary AS
SELECT 
    business_id,
    DATE(timestamp) as sale_date,
    COUNT(*) as total_transactions,
    SUM(total_amount) as total_revenue,
    SUM(profit) as total_profit,
    SUM(quantity) as items_sold
FROM public.sales
GROUP BY business_id, DATE(timestamp);

-- ============================================================================
-- SEED DATA (Optional - for testing)
-- ============================================================================

-- Example: Insert some test data (comment out for production)
-- Uncomment below if you want to test with sample data

/*
-- Test business
INSERT INTO public.business_profiles (id, name, owner_name, email, business_type, currency, onboarded, subdomain, invite_code)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Test Store',
    'Test Owner',
    'test@example.com',
    'Retail',
    'NGN',
    true,
    'teststore',
    'TEST1234'
);

-- Test categories
INSERT INTO public.categories (business_id, name) VALUES
('00000000-0000-0000-0000-000000000001', 'Electronics'),
('00000000-0000-0000-0000-000000000001', 'Fashion'),
('00000000-0000-0000-0000-000000000001', 'Food & Beverages');
*/

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
