import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Drug {
  id: string
  name: string
  category: string
  description?: string
  unit_price: number
  stock_quantity: number
  reorder_level: number
  expiry_date: string
  supplier: string
  batch_number: string
  status: 'active' | 'inactive' | 'expired'
  created_at: string
  updated_at: string
}

export interface Sale {
  id: string
  patient_name: string
  patient_contact?: string
  total_amount: number
  payment_method: 'cash' | 'card' | 'insurance'
  status: 'completed' | 'pending' | 'cancelled'
  created_by: string
  created_at: string
}

export interface SaleItem {
  id: string
  sale_id: string
  drug_id: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface ProcurementOrder {
  id: string
  supplier: string
  total_amount: number
  status: 'pending' | 'approved' | 'received' | 'cancelled'
  created_by: string
  requested_date: string
  approved_date?: string
  received_date?: string
}

export interface Request {
  id: string
  drug_id: string
  quantity_requested: number
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled'
  requested_by: string
  approved_by?: string
  notes?: string
  created_at: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'pharmacist' | 'staff'
  initials: string
  created_at: string
}