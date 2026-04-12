export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      business_profiles: {
        Row: {
          id: string
          name: string
          owner_name: string
          address: string | null
          business_type: string | null
          currency: string
          onboarded: boolean
          plan: string
          trial_ends_at: string | null
          pos_balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_name: string
          address?: string | null
          business_type?: string | null
          currency?: string
          onboarded?: boolean
          plan?: string
          trial_ends_at?: string | null
          pos_balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_name?: string
          address?: string | null
          business_type?: string | null
          currency?: string
          onboarded?: boolean
          plan?: string
          trial_ends_at?: string | null
          pos_balance?: number
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          business_id: string
          name: string
          email: string
          password_hash: string
          role: string
          is_active: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          email: string
          password_hash: string
          role?: string
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          email?: string
          password_hash?: string
          role?: string
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          business_id: string
          name: string
          category: string
          cost_price: number
          selling_price: number
          quantity: number
          low_stock_threshold: number
          sku: string | null
          barcode: string | null
          image_url: string | null
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          category: string
          cost_price: number
          selling_price: number
          quantity?: number
          low_stock_threshold?: number
          sku?: string | null
          barcode?: string | null
          image_url?: string | null
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          category?: string
          cost_price?: number
          selling_price?: number
          quantity?: number
          low_stock_threshold?: number
          sku?: string | null
          barcode?: string | null
          image_url?: string | null
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      sales: {
        Row: {
          id: string
          business_id: string
          product_id: string
          product_name: string
          quantity: number
          unit_price: number
          total_amount: number
          profit: number
          payment_method: string
          customer_name: string | null
          customer_phone: string | null
          recorded_by: string
          timestamp: string
          notes: string | null
        }
        Insert: {
          id?: string
          business_id: string
          product_id: string
          product_name: string
          quantity: number
          unit_price: number
          total_amount: number
          profit: number
          payment_method?: string
          customer_name?: string | null
          customer_phone?: string | null
          recorded_by: string
          timestamp?: string
          notes?: string | null
        }
        Update: {
          id?: string
          business_id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          unit_price?: number
          total_amount?: number
          profit?: number
          payment_method?: string
          customer_name?: string | null
          customer_phone?: string | null
          recorded_by?: string
          timestamp?: string
          notes?: string | null
        }
      }
      activity_logs: {
        Row: {
          id: string
          business_id: string
          type: string
          product_id: string | null
          quantity_change: number | null
          reason: string | null
          description: string
          performed_by: string
          timestamp: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          business_id: string
          type: string
          product_id?: string | null
          quantity_change?: number | null
          reason?: string | null
          description: string
          performed_by: string
          timestamp?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          business_id?: string
          type?: string
          product_id?: string | null
          quantity_change?: number | null
          reason?: string | null
          description?: string
          performed_by?: string
          timestamp?: string
          metadata?: Json | null
        }
      }
      expenses: {
        Row: {
          id: string
          business_id: string
          description: string
          amount: number
          category: string
          receipt_image_url: string | null
          recorded_by: string
          timestamp: string
          notes: string | null
        }
        Insert: {
          id?: string
          business_id: string
          description: string
          amount: number
          category: string
          receipt_image_url?: string | null
          recorded_by: string
          timestamp?: string
          notes?: string | null
        }
        Update: {
          id?: string
          business_id?: string
          description?: string
          amount?: number
          category?: string
          receipt_image_url?: string | null
          recorded_by?: string
          timestamp?: string
          notes?: string | null
        }
      }
      business_insights: {
        Row: {
          id: string
          business_id: string
          summary: string
          recommendations: string[]
          risk_level: string
          generated_at: string
          period_start: string | null
          period_end: string | null
          data_points: Json | null
        }
        Insert: {
          id?: string
          business_id: string
          summary: string
          recommendations: string[]
          risk_level?: string
          generated_at?: string
          period_start?: string | null
          period_end?: string | null
          data_points?: Json | null
        }
        Update: {
          id?: string
          business_id?: string
          summary?: string
          recommendations?: string[]
          risk_level?: string
          generated_at?: string
          period_start?: string | null
          period_end?: string | null
          data_points?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
