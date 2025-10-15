export interface Database {
  public: {
    Tables: {
      budgets: {
        Row: {
          id: string
          financial_year: string
          description: string
          file_url: string | null
          file_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          financial_year: string
          description: string
          file_url?: string | null
          file_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          financial_year?: string
          description?: string
          file_url?: string | null
          file_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rules_regulations: {
        Row: {
          id: string
          year: number
          type: 'Rules' | 'Regulations'
          description: string
          file_url: string | null
          file_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          year: number
          type: 'Rules' | 'Regulations'
          description: string
          file_url?: string | null
          file_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          year?: number
          type?: 'Rules' | 'Regulations'
          description?: string
          file_url?: string | null
          file_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      downloads: {
        Row: {
          id: string
          year: number
          description: string
          file_url: string | null
          file_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          year: number
          description: string
          file_url?: string | null
          file_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          year?: number
          description?: string
          file_url?: string | null
          file_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      latest_updates: {
        Row: {
          id: string
          description: string
          file_url: string | null
          file_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          description: string
          file_url?: string | null
          file_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          description?: string
          file_url?: string | null
          file_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Budget = Database['public']['Tables']['budgets']['Row']
export type BudgetInsert = Database['public']['Tables']['budgets']['Insert']
export type BudgetUpdate = Database['public']['Tables']['budgets']['Update']

export type RulesRegulation = Database['public']['Tables']['rules_regulations']['Row']
export type RulesRegulationInsert = Database['public']['Tables']['rules_regulations']['Insert']
export type RulesRegulationUpdate = Database['public']['Tables']['rules_regulations']['Update']

export type Download = Database['public']['Tables']['downloads']['Row']
export type DownloadInsert = Database['public']['Tables']['downloads']['Insert']
export type DownloadUpdate = Database['public']['Tables']['downloads']['Update']

export type LatestUpdate = Database['public']['Tables']['latest_updates']['Row']
export type LatestUpdateInsert = Database['public']['Tables']['latest_updates']['Insert']
export type LatestUpdateUpdate = Database['public']['Tables']['latest_updates']['Update']
