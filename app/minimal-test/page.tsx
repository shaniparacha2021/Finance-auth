'use client'

import { useState } from 'react'

export default function MinimalTestPage() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testMinimalLogin = async () => {
    setLoading(true)
    setResult('Testing minimal Supabase setup...\n')
    
    try {
      // Import Supabase directly without our wrapper
      const { createClient } = await import('@supabase/supabase-js')
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      setResult(prev => prev + `URL: ${supabaseUrl}\n`)
      setResult(prev => prev + `Key: ${supabaseKey ? 'Present' : 'Missing'}\n\n`)
      
      if (!supabaseUrl || !supabaseKey) {
        setResult(prev => prev + '❌ Missing environment variables\n')
        return
      }
      
      // Create minimal client
      const supabase = createClient(supabaseUrl, supabaseKey)
      setResult(prev => prev + '✅ Minimal client created\n')
      
      // Test login
      setResult(prev => prev + 'Testing login...\n')
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@finance.com',
        password: 'admin123'
      })
      
      if (error) {
        setResult(prev => prev + `❌ Login error: ${error.message}\n`)
        setResult(prev => prev + `Error code: ${error.status}\n`)
        setResult(prev => prev + `Full error: ${JSON.stringify(error, null, 2)}\n`)
      } else if (data.user) {
        setResult(prev => prev + `✅ Login successful!\n`)
        setResult(prev => prev + `User: ${data.user.email}\n`)
        setResult(prev => prev + `ID: ${data.user.id}\n`)
      } else {
        setResult(prev => prev + '❌ No user data received\n')
      }
      
    } catch (err) {
      setResult(prev => prev + `❌ Exception: ${err}\n`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Minimal Supabase Test
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Bypass all wrappers and test direct Supabase connection
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={testMinimalLogin}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Minimal Login'}
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-64 whitespace-pre-wrap">
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
          <a 
            href="/diagnose" 
            className="text-green-600 hover:text-green-500"
          >
            Full Diagnostics
          </a>
        </div>
      </div>
    </div>
  )
}
