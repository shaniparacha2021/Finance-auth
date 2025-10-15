'use client'

import { useState } from 'react'

export default function CheckProjectPage() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const checkProject = async () => {
    setLoading(true)
    setResult('Checking Supabase project status...\n\n')
    
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      setResult(prev => prev + `Project URL: ${url}\n`)
      setResult(prev => prev + `API Key: ${key ? 'Present' : 'Missing'}\n\n`)
      
      if (!url || !key) {
        setResult(prev => prev + '❌ Missing environment variables\n')
        return
      }
      
      // Test 1: Check if project is accessible
      setResult(prev => prev + '1. Testing project accessibility...\n')
      try {
        const response = await fetch(`${url}/rest/v1/`, {
          headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`
          }
        })
        
        if (response.ok) {
          setResult(prev => prev + '   ✅ Project is accessible\n')
        } else {
          setResult(prev => prev + `   ❌ Project error: ${response.status} ${response.statusText}\n`)
        }
      } catch (err) {
        setResult(prev => prev + `   ❌ Network error: ${err}\n`)
      }
      
      // Test 2: Check auth endpoint
      setResult(prev => prev + '\n2. Testing auth endpoint...\n')
      try {
        const response = await fetch(`${url}/auth/v1/`, {
          headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`
          }
        })
        
        if (response.ok) {
          setResult(prev => prev + '   ✅ Auth endpoint accessible\n')
        } else {
          setResult(prev => prev + `   ❌ Auth error: ${response.status} ${response.statusText}\n`)
        }
      } catch (err) {
        setResult(prev => prev + `   ❌ Auth network error: ${err}\n`)
      }
      
      // Test 3: Check if tables exist
      setResult(prev => prev + '\n3. Checking database tables...\n')
      try {
        const response = await fetch(`${url}/rest/v1/budgets?select=*&limit=1`, {
          headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`
          }
        })
        
        if (response.ok) {
          setResult(prev => prev + '   ✅ Budgets table exists\n')
        } else {
          setResult(prev => prev + `   ❌ Budgets table error: ${response.status} ${response.statusText}\n`)
          const errorText = await response.text()
          setResult(prev => prev + `   Error details: ${errorText}\n`)
        }
      } catch (err) {
        setResult(prev => prev + `   ❌ Table check error: ${err}\n`)
      }
      
      // Test 4: Try to create Supabase client and test login
      setResult(prev => prev + '\n4. Testing Supabase client login...\n')
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(url, key)
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'admin@finance.com',
          password: 'admin123'
        })
        
        if (error) {
          setResult(prev => prev + `   ❌ Login error: ${error.message}\n`)
          setResult(prev => prev + `   Error details: ${JSON.stringify(error, null, 2)}\n`)
        } else if (data.user) {
          setResult(prev => prev + `   ✅ Login successful: ${data.user.email}\n`)
        } else {
          setResult(prev => prev + '   ❌ No user data\n')
        }
      } catch (err) {
        setResult(prev => prev + `   ❌ Client error: ${err}\n`)
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
            🔍 Supabase Project Check
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Check if your Supabase project is accessible and configured correctly
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={checkProject}
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Check Project Status'}
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
          <a 
            href="/direct-test" 
            className="text-green-600 hover:text-green-500"
          >
            Direct Test
          </a>
        </div>
      </div>
    </div>
  )
}
