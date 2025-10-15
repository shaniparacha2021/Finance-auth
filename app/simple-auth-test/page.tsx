'use client'

import { useState } from 'react'

export default function SimpleAuthTestPage() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testSimpleAuth = async () => {
    setLoading(true)
    setResult('Testing simple authentication...\n\n')
    
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      setResult(prev => prev + `URL: ${url}\n`)
      setResult(prev => prev + `Key: ${key ? 'Present' : 'Missing'}\n\n`)
      
      if (!url || !key) {
        setResult(prev => prev + '❌ Missing environment variables\n')
        return
      }
      
      // Test 1: Check if auth endpoint is accessible
      setResult(prev => prev + '1. Testing auth endpoint directly...\n')
      try {
        const authResponse = await fetch(`${url}/auth/v1/`, {
          method: 'GET',
          headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
          }
        })
        
        setResult(prev => prev + `   Auth endpoint status: ${authResponse.status}\n`)
        if (authResponse.ok) {
          setResult(prev => prev + '   ✅ Auth endpoint accessible\n')
        } else {
          setResult(prev => prev + `   ❌ Auth endpoint error: ${authResponse.status}\n`)
          const errorText = await authResponse.text()
          setResult(prev => prev + `   Error details: ${errorText}\n`)
        }
      } catch (err) {
        setResult(prev => prev + `   ❌ Auth endpoint error: ${err}\n`)
      }
      
      // Test 2: Try to get session without login
      setResult(prev => prev + '\n2. Testing session retrieval...\n')
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(url, key)
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          setResult(prev => prev + `   ❌ Session error: ${sessionError.message}\n`)
        } else {
          setResult(prev => prev + `   ✅ Session check OK (Session: ${session ? 'Active' : 'None'})\n`)
        }
      } catch (err) {
        setResult(prev => prev + `   ❌ Session error: ${err}\n`)
      }
      
      // Test 3: Try login with different approach
      setResult(prev => prev + '\n3. Testing login with different approach...\n')
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(url, key, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
          }
        })
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'admin@finance.com',
          password: 'admin123'
        })
        
        if (error) {
          setResult(prev => prev + `   ❌ Login error: ${error.message}\n`)
          setResult(prev => prev + `   Error code: ${error.status}\n`)
          setResult(prev => prev + `   Full error: ${JSON.stringify(error, null, 2)}\n`)
        } else if (data.user) {
          setResult(prev => prev + `   ✅ Login successful!\n`)
          setResult(prev => prev + `   User: ${data.user.email}\n`)
        } else {
          setResult(prev => prev + '   ❌ No user data received\n')
        }
      } catch (err) {
        setResult(prev => prev + `   ❌ Login exception: ${err}\n`)
      }
      
      // Test 4: Check if it's a project region issue
      setResult(prev => prev + '\n4. Checking project region...\n')
      try {
        const regionResponse = await fetch(`${url}/rest/v1/`, {
          headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`
          }
        })
        
        if (regionResponse.ok) {
          setResult(prev => prev + '   ✅ Project region accessible\n')
        } else {
          setResult(prev => prev + `   ❌ Project region error: ${regionResponse.status}\n`)
        }
      } catch (err) {
        setResult(prev => prev + `   ❌ Region check error: ${err}\n`)
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
            🔍 Simple Auth Test
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Test authentication with different approaches
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={testSimpleAuth}
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Run Simple Auth Test'}
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
