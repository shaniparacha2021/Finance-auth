'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestSupabasePage() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    setLoading(true)
    setResult('Testing Supabase connection...\n')
    
    try {
      const supabase = createClient()
      
      // Test 1: Check environment variables
      const envCheck = {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        keyExists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        siteUrl: process.env.NEXT_PUBLIC_APP_URL
      }
      
      setResult(prev => prev + `Environment Check: ${JSON.stringify(envCheck, null, 2)}\n\n`)
      
      // Test 2: Try to get current session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      setResult(prev => prev + `Session Check: ${JSON.stringify({ sessionData, sessionError }, null, 2)}\n\n`)
      
      // Test 3: Try to get user
      const { data: userData, error: userError } = await supabase.auth.getUser()
      setResult(prev => prev + `User Check: ${JSON.stringify({ userData, userError }, null, 2)}\n\n`)
      
      // Test 4: Test database connection
      const { data: dbData, error: dbError } = await supabase
        .from('budgets')
        .select('count')
        .limit(1)
      
      setResult(prev => prev + `Database Check: ${JSON.stringify({ dbData, dbError }, null, 2)}\n\n`)
      
    } catch (err) {
      setResult(prev => prev + `Error: ${err}\n`)
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    setResult('Testing login...\n')
    
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@finance.com',
        password: 'admin123'
      })
      
      setResult(prev => prev + `Login Test: ${JSON.stringify({ data, error }, null, 2)}\n`)
      
    } catch (err) {
      setResult(prev => prev + `Login Error: ${err}\n`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      
      <div className="space-y-4 mb-4">
        <button 
          onClick={testConnection} 
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 mr-2"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        
        <button 
          onClick={testLogin} 
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Login
        </button>
      </div>
      
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
        {result}
      </pre>
    </div>
  )
}
