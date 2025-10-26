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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          plan: 'starter' | 'pro' | 'enterprise'
          status: 'active' | 'suspended' | 'cancelled'
          stripe_customer_id: string | null
          email_verified: boolean
          email_verified_at: string | null
          verification_token: string | null
          verification_sent_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          plan?: 'starter' | 'pro' | 'enterprise'
          status?: 'active' | 'suspended' | 'cancelled'
          stripe_customer_id?: string | null
          email_verified?: boolean
          email_verified_at?: string | null
          verification_token?: string | null
          verification_sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          plan?: 'starter' | 'pro' | 'enterprise'
          status?: 'active' | 'suspended' | 'cancelled'
          stripe_customer_id?: string | null
          email_verified?: boolean
          email_verified_at?: string | null
          verification_token?: string | null
          verification_sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      business_profiles: {
        Row: {
          id: string
          user_id: string
          business_name: string
          tagline: string | null
          description: string | null
          phone: string | null
          whatsapp: string | null
          email: string | null
          site_url: string | null
          address: string | null
          lat: number | null
          lng: number | null
          hours_json: Json
          logo_url: string | null
          cover_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          tagline?: string | null
          description?: string | null
          phone?: string | null
          whatsapp?: string | null
          email?: string | null
          site_url?: string | null
          address?: string | null
          lat?: number | null
          lng?: number | null
          hours_json?: Json
          logo_url?: string | null
          cover_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          tagline?: string | null
          description?: string | null
          phone?: string | null
          whatsapp?: string | null
          email?: string | null
          site_url?: string | null
          address?: string | null
          lat?: number | null
          lng?: number | null
          hours_json?: Json
          logo_url?: string | null
          cover_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          name: string
          category: 'business' | 'creative' | 'professional' | 'minimal'
          preview_url: string | null
          blocks_json: Json
          is_premium: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: 'business' | 'creative' | 'professional' | 'minimal'
          preview_url?: string | null
          blocks_json?: Json
          is_premium?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: 'business' | 'creative' | 'professional' | 'minimal'
          preview_url?: string | null
          blocks_json?: Json
          is_premium?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      cards: {
        Row: {
          id: string
          user_id: string
          business_id: string
          slug: string
          template_id: string | null
          theme_preset: Json
          is_published: boolean
          published_at: string | null
          og_image_url: string | null
          views_count: number
          qr_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_id: string
          slug: string
          template_id?: string | null
          theme_preset?: Json
          is_published?: boolean
          published_at?: string | null
          og_image_url?: string | null
          views_count?: number
          qr_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_id?: string
          slug?: string
          template_id?: string | null
          theme_preset?: Json
          is_published?: boolean
          published_at?: string | null
          og_image_url?: string | null
          views_count?: number
          qr_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      media_gallery: {
        Row: {
          id: string
          business_id: string
          file_url: string
          alt: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          file_url: string
          alt?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          file_url?: string
          alt?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      links: {
        Row: {
          id: string
          card_id: string
          type: 'phone' | 'whatsapp' | 'map' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'website' | 'custom'
          label: string
          url: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          card_id: string
          type: 'phone' | 'whatsapp' | 'map' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'website' | 'custom'
          label: string
          url: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          card_id?: string
          type?: 'phone' | 'whatsapp' | 'map' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'website' | 'custom'
          label?: string
          url?: string
          sort_order?: number
          created_at?: string
        }
      }
      coupons: {
        Row: {
          id: string
          code: string
          type: 'percent' | 'fixed'
          value: number
          starts_at: string
          ends_at: string | null
          max_uses: number | null
          used_count: number
          min_amount: number | null
          allowed_plans: string[] | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          type: 'percent' | 'fixed'
          value: number
          starts_at?: string
          ends_at?: string | null
          max_uses?: number | null
          used_count?: number
          min_amount?: number | null
          allowed_plans?: string[] | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          type?: 'percent' | 'fixed'
          value?: number
          starts_at?: string
          ends_at?: string | null
          max_uses?: number | null
          used_count?: number
          min_amount?: number | null
          allowed_plans?: string[] | null
          is_active?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          plan: 'starter' | 'pro' | 'enterprise'
          amount: number
          currency: string
          coupon_id: string | null
          discount_amount: number
          status: 'pending' | 'paid' | 'failed' | 'refunded'
          gateway: 'cardcom' | 'stripe' | null
          transaction_ref: string | null
          period_start: string
          period_end: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan: 'starter' | 'pro' | 'enterprise'
          amount: number
          currency?: string
          coupon_id?: string | null
          discount_amount?: number
          status?: 'pending' | 'paid' | 'failed' | 'refunded'
          gateway?: 'cardcom' | 'stripe' | null
          transaction_ref?: string | null
          period_start: string
          period_end: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan?: 'starter' | 'pro' | 'enterprise'
          amount?: number
          currency?: string
          coupon_id?: string | null
          discount_amount?: number
          status?: 'pending' | 'paid' | 'failed' | 'refunded'
          gateway?: 'cardcom' | 'stripe' | null
          transaction_ref?: string | null
          period_start?: string
          period_end?: string
          created_at?: string
          updated_at?: string
        }
      }
      events_analytics: {
        Row: {
          id: string
          card_id: string
          event_type: string
          user_agent: string | null
          ip_hash: string | null
          referrer: string | null
          created_at: string
        }
        Insert: {
          id?: string
          card_id: string
          event_type: string
          user_agent?: string | null
          ip_hash?: string | null
          referrer?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          card_id?: string
          event_type?: string
          user_agent?: string | null
          ip_hash?: string | null
          referrer?: string | null
          created_at?: string
        }
      }
    }
  }
}
