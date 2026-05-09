export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          business_id: string
          description: string
          id: string
          metadata: Json | null
          performed_by: string | null
          product_id: string | null
          quantity_change: number | null
          reason: string | null
          timestamp: string
          type: string
        }
        Insert: {
          business_id: string
          description: string
          id?: string
          metadata?: Json | null
          performed_by?: string | null
          product_id?: string | null
          quantity_change?: number | null
          reason?: string | null
          timestamp?: string
          type: string
        }
        Update: {
          business_id?: string
          description?: string
          id?: string
          metadata?: Json | null
          performed_by?: string | null
          product_id?: string | null
          quantity_change?: number | null
          reason?: string | null
          timestamp?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_with_owner"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_with_status"
            referencedColumns: ["id"]
          },
        ]
      }
      business_insights: {
        Row: {
          business_id: string
          data_points: Json | null
          generated_at: string
          id: string
          period_end: string | null
          period_start: string | null
          recommendations: string[]
          risk_level: string
          summary: string
        }
        Insert: {
          business_id: string
          data_points?: Json | null
          generated_at?: string
          id?: string
          period_end?: string | null
          period_start?: string | null
          recommendations: string[]
          risk_level?: string
          summary: string
        }
        Update: {
          business_id?: string
          data_points?: Json | null
          generated_at?: string
          id?: string
          period_end?: string | null
          period_start?: string | null
          recommendations?: string[]
          risk_level?: string
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_insights_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_insights_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_with_owner"
            referencedColumns: ["id"]
          },
        ]
      }
      business_profiles: {
        Row: {
          address: string | null
          business_type: string | null
          created_at: string
          currency: string
          email: string | null
          id: string
          invite_code: string | null
          name: string
          onboarded: boolean
          owner_name: string
          phone: string | null
          plan: string
          pos_balance: number
          settings: Json | null
          subdomain: string | null
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          business_type?: string | null
          created_at?: string
          currency?: string
          email?: string | null
          id?: string
          invite_code?: string | null
          name: string
          onboarded?: boolean
          owner_name: string
          phone?: string | null
          plan?: string
          pos_balance?: number
          settings?: Json | null
          subdomain?: string | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          business_type?: string | null
          created_at?: string
          currency?: string
          email?: string | null
          id?: string
          invite_code?: string | null
          name?: string
          onboarded?: boolean
          owner_name?: string
          phone?: string | null
          plan?: string
          pos_balance?: number
          settings?: Json | null
          subdomain?: string | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          business_id: string
          color: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          business_id: string
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          business_id?: string
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_with_owner"
            referencedColumns: ["id"]
          },
        ]
      }
      default_categories: {
        Row: {
          color: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          business_id: string
          category: string
          description: string
          id: string
          notes: string | null
          receipt_image_url: string | null
          recorded_by: string | null
          timestamp: string
        }
        Insert: {
          amount: number
          business_id: string
          category: string
          description: string
          id?: string
          notes?: string | null
          receipt_image_url?: string | null
          recorded_by?: string | null
          timestamp?: string
        }
        Update: {
          amount?: number
          business_id?: string
          category?: string
          description?: string
          id?: string
          notes?: string | null
          receipt_image_url?: string | null
          recorded_by?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_with_owner"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_invites: {
        Row: {
          accepted_at: string | null
          business_id: string
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          role: string
          status: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          business_id: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          invited_by?: string | null
          role?: string
          status?: string
          token: string
        }
        Update: {
          accepted_at?: string | null
          business_id?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: string
          status?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_invites_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_invites_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_with_owner"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          business_id: string
          category: string
          cost_price: number
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          low_stock_threshold: number
          name: string
          quantity: number
          selling_price: number
          sku: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          barcode?: string | null
          business_id: string
          category: string
          cost_price: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          low_stock_threshold?: number
          name: string
          quantity?: number
          selling_price: number
          sku?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          barcode?: string | null
          business_id?: string
          category?: string
          cost_price?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          low_stock_threshold?: number
          name?: string
          quantity?: number
          selling_price?: number
          sku?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_with_owner"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          business_id: string
          customer_name: string | null
          customer_phone: string | null
          id: string
          notes: string | null
          payment_method: string
          product_id: string | null
          product_name: string
          profit: number
          quantity: number
          recorded_by: string | null
          timestamp: string
          total_amount: number
          unit_price: number
        }
        Insert: {
          business_id: string
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          notes?: string | null
          payment_method?: string
          product_id?: string | null
          product_name: string
          profit: number
          quantity: number
          recorded_by?: string | null
          timestamp?: string
          total_amount: number
          unit_price: number
        }
        Update: {
          business_id?: string
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          notes?: string | null
          payment_method?: string
          product_id?: string | null
          product_name?: string
          profit?: number
          quantity?: number
          recorded_by?: string | null
          timestamp?: string
          total_amount?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_with_owner"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_with_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          business_id: string
          created_at: string
          email: string
          id: string
          invite_status: string
          invited_by: string | null
          is_active: boolean
          last_login: string | null
          name: string
          password_hash: string | null
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          email: string
          id: string
          invite_status?: string
          invited_by?: string | null
          is_active?: boolean
          last_login?: string | null
          name: string
          password_hash?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          email?: string
          id?: string
          invite_status?: string
          invited_by?: string | null
          is_active?: boolean
          last_login?: string | null
          name?: string
          password_hash?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_with_owner"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      business_with_owner: {
        Row: {
          address: string | null
          business_type: string | null
          created_at: string
          currency: string
          email: string | null
          id: string
          invite_code: string | null
          name: string
          onboarded: boolean
          owner_email: string | null
          owner_last_login: string | null
          owner_name_from_user: string | null
          owner_name: string
          phone: string | null
          plan: string
          pos_balance: number
          settings: Json | null
          subdomain: string | null
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          business_type?: string | null
          created_at?: string
          currency?: string
          email?: string | null
          id?: string
          invite_code?: string | null
          name: string
          onboarded?: boolean
          owner_email?: never
          owner_last_login?: never
          owner_name_from_user?: never
          owner_name: string
          phone?: string | null
          plan?: string
          pos_balance?: number
          settings?: Json | null
          subdomain?: string | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          business_type?: string | null
          created_at?: string
          currency?: string
          email?: string | null
          id?: string
          invite_code?: string | null
          name?: string
          onboarded?: boolean
          owner_email?: never
          owner_last_login?: never
          owner_name_from_user?: never
          owner_name?: string
          phone?: string | null
          plan?: string
          pos_balance?: number
          settings?: Json | null
          subdomain?: string | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_sales_summary: {
        Row: {
          business_id: string | null
          items_sold: number | null
          sale_date: string | null
          total_profit: number | null
          total_revenue: number | null
          total_transactions: number | null
        }
        Insert: never
        Update: never
        Relationships: [
          {
            foreignKeyName: "sales_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products_with_status: {
        Row: {
          barcode: string | null
          business_id: string | null
          category: string | null
          cost_price: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string | null
          image_url: string | null
          is_active: boolean | null
          low_stock_threshold: number | null
          name: string | null
          quantity: number | null
          selling_price: number | null
          sku: string | null
          stock_status: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          barcode?: string | null
          business_id?: string | null
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string | null
          image_url?: string | null
          is_active?: boolean | null
          low_stock_threshold?: number | null
          name?: string | null
          quantity?: number | null
          selling_price?: number | null
          sku?: string | null
          stock_status?: never
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          barcode?: string | null
          business_id?: string | null
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string | null
          image_url?: string | null
          is_active?: boolean | null
          low_stock_threshold?: number | null
          name?: string | null
          quantity?: number | null
          selling_price?: number | null
          sku?: string | null
          stock_status?: never
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_with_owner"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      accept_invite: {
        Args: { p_token: string; p_user_id: string }
        Returns: {
          business_id: string
          role: string
        }[]
      }
      create_organization_with_owner: {
        Args: {
          p_business_name: string
          p_business_type: string
          p_currency?: string
          p_email: string
          p_owner_name: string
        }
        Returns: string
      }
      get_user_business_id: { Args: never; Returns: string }
      get_user_role: { Args: never; Returns: string }
      invite_employee: {
        Args: { p_business_id: string; p_email: string; p_role?: string }
        Returns: {
          invite_id: string
          token: string
        }[]
      }
      is_owner: { Args: never; Returns: boolean }
      is_owner_or_manager: { Args: never; Returns: boolean }
      join_organization_by_code: {
        Args: {
          p_email: string
          p_invite_code: string
          p_name: string
          p_user_id: string
        }
        Returns: {
          business_id: string
          business_name: string
          role: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  TableName extends keyof Database['public']['Tables'],
> = Database['public']['Tables'][TableName]['Row']

export type TablesInsert<
  TableName extends keyof Database['public']['Tables'],
> = Database['public']['Tables'][TableName]['Insert']

export type TablesUpdate<
  TableName extends keyof Database['public']['Tables'],
> = Database['public']['Tables'][TableName]['Update']
