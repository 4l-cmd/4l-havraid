export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      news: {
        Row: NewsItem
        Insert: Omit<NewsItem, 'id' | 'created_at'>
        Update: Partial<NewsItem>
      }
      etapes: {
        Row: Etape
        Insert: Omit<Etape, 'id'>
        Update: Partial<Etape>
      }
      sponsors: {
        Row: Sponsor
        Insert: Omit<Sponsor, 'id' | 'created_at'>
        Update: Partial<Sponsor>
      }
      km_adoptions: {
        Row: KmAdoption
        Insert: Omit<KmAdoption, 'id' | 'created_at'>
        Update: Partial<KmAdoption>
      }
      tickets: {
        Row: Ticket
        Insert: Omit<Ticket, 'id' | 'created_at'>
        Update: Partial<Ticket>
      }
      gps_positions: {
        Row: GpsPosition
        Insert: Omit<GpsPosition, 'id' | 'created_at'>
        Update: Partial<GpsPosition>
      }
      equipe: {
        Row: MembreEquipe
        Insert: Omit<MembreEquipe, 'id'>
        Update: Partial<MembreEquipe>
      }
    }
  }
}

export interface NewsItem {
  id: string
  created_at: string
  title: string
  content: string
  image_url?: string
  type: 'actualite' | 'sponsor' | 'etape' | 'info'
  published: boolean
  author: string
}

export interface Etape {
  id: string
  order: number
  label: string
  icon: string
  done: boolean
  done_at?: string
  description?: string
}

export interface Sponsor {
  id: string
  created_at: string
  company: string
  contact: string
  email: string
  phone?: string
  address: string
  siret?: string
  position: string
  tier: 'Bronze' | 'Argent' | 'Or'
  amount: number
  paid: boolean
  logo_url?: string
  description?: string
  approved: boolean
}

export interface KmAdoption {
  id: string
  created_at: string
  user_email: string
  user_name: string
  km_number: number
  amount: number
  paid: boolean
  message?: string
  message_public: boolean
  photo_url?: string
  photo_uploaded: boolean
}

export interface Ticket {
  id: string
  created_at: string
  user_email: string
  user_name: string
  subject: string
  message: string
  status: 'ouvert' | 'en_cours' | 'resolu' | 'ferme'
  type: 'remboursement' | 'changement_km' | 'changement_sponsor' | 'question' | 'autre'
  admin_response?: string
  responded_at?: string
}

export interface GpsPosition {
  id: string
  created_at: string
  lat: number
  lng: number
  label?: string
  km_parcourus?: number
}

export interface MembreEquipe {
  id: string
  order: number
  name: string
  role: string
  details?: string
  bio: string
  photo_url?: string
  phone?: string
  email?: string
  instagram?: string
}
