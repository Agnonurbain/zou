/**
 * Shared JSON type used for JSONB columns in Supabase.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface ProfilesRow {
  id: string;
  business_name: string;
  phone_number: string;
  avatar_url: string | null;
  created_at: string;
}

export interface ProfilesInsert {
  id: string;
  business_name: string;
  phone_number: string;
  avatar_url?: string | null;
  created_at?: string;
}

export interface ProfilesUpdate {
  business_name?: string;
  phone_number?: string;
  avatar_url?: string | null;
  created_at?: string;
}

export interface ProductsRow {
  id: string;
  seller_id: string;
  name: string;
  description: string | null;
  price: number;
  images: string[] | null;
  stock: number;
  is_active: boolean;
  created_at: string;
}

export interface ProductsInsert {
  id?: string;
  seller_id: string;
  name: string;
  description?: string | null;
  price: number;
  images?: string[] | null;
  stock?: number;
  is_active?: boolean;
  created_at?: string;
}

export interface ProductsUpdate {
  name?: string;
  description?: string | null;
  price?: number;
  images?: string[] | null;
  stock?: number;
  is_active?: boolean;
}

export interface OrdersRow {
  id: string;
  seller_id: string;
  customer_name: string;
  customer_phone: string;
  items: Json;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  whatsapp_link: string | null;
  created_at: string;
}

export interface OrdersInsert {
  id?: string;
  seller_id: string;
  customer_name: string;
  customer_phone: string;
  items: Json;
  total_amount: number;
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  whatsapp_link?: string | null;
  created_at?: string;
}

export interface OrdersUpdate {
  customer_name?: string;
  customer_phone?: string;
  items?: Json;
  total_amount?: number;
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  whatsapp_link?: string | null;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfilesRow;
        Insert: ProfilesInsert;
        Update: ProfilesUpdate;
      };
      products: {
        Row: ProductsRow;
        Insert: ProductsInsert;
        Update: ProductsUpdate;
      };
      orders: {
        Row: OrdersRow;
        Insert: OrdersInsert;
        Update: OrdersUpdate;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderUpdate = Database['public']['Tables']['orders']['Update'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
