'use client'

import { useState } from 'react'

export default function DirectTestPage() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testDirectSupabase = async () => {
    setLoading(true)
    setResult('Testing direct Supabase connection...\n\n')
    
    try {
      // Test 1: Check environment variables
      setResult(prev => prev + '1. Environment Variables:\n')
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      setResult(prev => prev + `   URL: ${url ? '✅ Present' : '❌ Missing'}\n`)
      setResult(prev => prev + `   Key: ${key ? '✅ Present' : '❌ Missing'}\n\n`)
      
      if (!url || !key) {
        setResult(prev => prev + '❌ Cannot proceed without environment variables\n')
        return
      }
      
      // Test 2: Create Supabase client directly
      setResult(prev => prev + '2. Creating Supabase client...\n')
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(url, key)
      setResult(prev => prev + '   ✅ Client created successfully\n\n')
      
      // Test 3: Test basic connection
      setResult(prev => prev + '3. Testing basic connection...\n')
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) {
        setResult(prev => prev + `   ⚠️  User check: ${userError.message}\n`)
      } else {
        setResult(prev => prev + `   ✅ Connection OK (User: ${user ? 'Logged in' : 'Not logged in'})\n`)
      }
      
      // Test 4: Test login with admin credentials
      setResult(prev => prev + '\n4. Testing admin login...\n')
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@finance.com',
        password: 'admin123'
      })
      
      if (error) {
        setResult(prev => prev + `   ❌ Login failed:\n`)
        setResult(prev => prev + `      Error: ${error.message}\n`)
        setResult(prev => prev + `      Status: ${error.status}\n`)
        setResult(prev => prev + `      Code: ${error.code || 'N/A'}\n`)
        setResult(prev => prev + `      Details: ${JSON.stringify(error, null, 2)}\n`)
      } else if (data.user) {
        setResult(prev => prev + `   ✅ Login successful!\n`)
        setResult(prev => prev + `      User: ${data.user.email}\n`)
        setResult(prev => prev + `      ID: ${data.user.id}\n`)
      } else {
        setResult(prev => prev + '   ❌ No user data received\n')
      }
      
      // Test 5: Test database access
      setResult(prev => prev + '\n5. Testing database access...\n')
      try {
        const { data: budgets, error: budgetsError } = await supabase
          .from('budgets')
          .select('*')
          .limit(1)
        
        if (budgetsError) {
          setResult(prev => prev + `   ❌ Budgets table: ${budgetsError.message}\n`)
        } else {
          setResult(prev => prev + `   ✅ Budgets table: OK (${budgets?.length || 0} records)\n`)
        }
      } catch (err) {
        setResult(prev => prev + `   ❌ Database test error: ${err}\n`)
      }
      
    } catch (err) {
      setResult(prev => prev + `\n❌ Unexpected error: ${err}\n`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            🔧 Direct Supabase Test
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Bypass all custom code and test Supabase directly
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={testDirectSupabase}
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Run Direct Test'}
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96 whitespace-pre-wrap">
            {result}
          </pre>
        </div>
        
        <div className="text-center space-x-4">
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
