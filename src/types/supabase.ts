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
          business_id: string | null
          description: string
          id: string
          metadata: Json | null
          performed_by: string | null
          product_id: string | null
          quantity_change: number | null
          reason: string | null
          timestamp: string | null
          type: string
        }
        Insert: {
          business_id?: string | null
          description: string
          id?: string
          metadata?: Json | null
          performed_by?: string | null
          product_id?: string | null
          quantity_change?: number | null
          reason?: string | null
          timestamp?: string | null
          type: string
        }
        Update: {
          business_id?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          performed_by?: string | null
          product_id?: string | null
          quantity_change?: number | null
          reason?: string | null
          timestamp?: string | null
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
        ]
      }
      business_profiles: {
        Row: {
          address: string | null
          business_type: string | null
          created_at: string | null
          currency: string | null
          email: string | null
          id: string
          name: string
          onboarded: boolean | null
          owner_name: string
          plan: string | null
          pos_balance: number | null
          settings: Json | null
          subdomain: string | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          business_type?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          id?: string
          name: string
          onboarded?: boolean | null
          owner_name: string
          plan?: string | null
          pos_balance?: number | null
          settings?: Json | null
          subdomain?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          business_type?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          id?: string
          name?: string
          onboarded?: boolean | null
          owner_name?: string
          plan?: string | null
          pos_balance?: number | null
          settings?: Json | null
          subdomain?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          business_id: string | null
          category: string
          description: string
          id: string
          notes: string | null
          receipt_image_url: string | null
          recorded_by: string | null
          timestamp: string | null
        }
        Insert: {
          amount: number
          business_id?: string | null
          category: string
          description: string
          id?: string
          notes?: string | null
          receipt_image_url?: string | null
          recorded_by?: string | null
          timestamp?: string | null
        }
        Update: {
          amount?: number
          business_id?: string | null
          category?: string
          description?: string
          id?: string
          notes?: string | null
          receipt_image_url?: string | null
          recorded_by?: string | null
          timestamp?: string | null
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
            foreignKeyName: "expenses_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          business_id: string | null
          category: string
          cost_price: number
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          low_stock_threshold: number | null
          name: string
          quantity: number | null
          selling_price: number
          sku: string | null
          updated_at: string | null
        }
        Insert: {
          barcode?: string | null
          business_id?: string | null
          category: string
          cost_price: number
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          low_stock_threshold?: number | null
          name: string
          quantity?: number | null
          selling_price: number
          sku?: string | null
          updated_at?: string | null
        }
        Update: {
          barcode?: string | null
          business_id?: string | null
          category?: string
          cost_price?: number
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          low_stock_threshold?: number | null
          name?: string
          quantity?: number | null
          selling_price?: number
          sku?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          business_id: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          notes: string | null
          payment_method: string | null
          product_id: string | null
          product_name: string
          profit: number
          quantity: number
          recorded_by: string | null
          timestamp: string | null
          total_amount: number
          unit_price: number
        }
        Insert: {
          business_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          product_id?: string | null
          product_name: string
          profit: number
          quantity: number
          recorded_by?: string | null
          timestamp?: string | null
          total_amount: number
          unit_price: number
        }
        Update: {
          business_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          product_id?: string | null
          product_name?: string
          profit?: number
          quantity?: number
          recorded_by?: string | null
          timestamp?: string | null
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
            foreignKeyName: "sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
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
          business_id: string | null
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          last_login: string | null
          name: string
          password_hash: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          name: string
          password_hash: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          name?: string
          password_hash?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_business_id: { Args: never; Returns: string }
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
