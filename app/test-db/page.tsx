'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestDatabasePage() {
  const [result, setResult] = useState('Testing database connection...\n')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const testDatabase = async () => {
      try {
        const supabase = createClient()
        setResult(prev => prev + 'Supabase client created\n')
        
        // Test basic connection
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        setResult(prev => prev + `User check: ${user ? 'Logged in' : 'Not logged in'}\n`)
        if (userError) setResult(prev => prev + `User error: ${userError.message}\n`)
        
        // Test if tables exist by trying to query them
        const { data: budgets, error: budgetsError } = await supabase
          .from('budgets')
          .select('*')
          .limit(1)
        
        if (budgetsError) {
          setResult(prev => prev + `Budgets table error: ${budgetsError.message}\n`)
        } else {
          setResult(prev => prev + `Budgets table: OK (${budgets?.length || 0} records)\n`)
        }
        
        const { data: rules, error: rulesError } = await supabase
          .from('rules_regulations')
          .select('*')
          .limit(1)
        
        if (rulesError) {
          setResult(prev => prev + `Rules table error: ${rulesError.message}\n`)
        } else {
          setResult(prev => prev + `Rules table: OK (${rules?.length || 0} records)\n`)
        }
        
        const { data: downloads, error: downloadsError } = await supabase
          .from('downloads')
          .select('*')
          .limit(1)
        
        if (downloadsError) {
          setResult(prev => prev + `Downloads table error: ${downloadsError.message}\n`)
        } else {
          setResult(prev => prev + `Downloads table: OK (${downloads?.length || 0} records)\n`)
        }
        
        const { data: updates, error: updatesError } = await supabase
          .from('latest_updates')
          .select('*')
          .limit(1)
        
        if (updatesError) {
          setResult(prev => prev + `Updates table error: ${updatesError.message}\n`)
        } else {
          setResult(prev => prev + `Updates table: OK (${updates?.length || 0} records)\n`)
        }
        
        setResult(prev => prev + '\n✅ Database test completed!\n')
        
      } catch (err) {
        setResult(prev => prev + `\n❌ Error: ${err}\n`)
      } finally {
        setLoading(false)
      }
    }
    
    testDatabase()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Database Test
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Testing Supabase database connection and tables
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96 whitespace-pre-wrap">
            {result}
          </pre>
        </div>
        
        <div className="text-center">
          <a 
            href="/login" 
            className="text-blue-600 hover:text-blue-500"
          >
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  )
}
