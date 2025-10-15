'use client'

import { useState } from 'react'

export default function SimpleLoginPage() {
  const [email, setEmail] = useState('admin@finance.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setResult('Testing login...\n')
    
    try {
      // Test environment variables first
      const envCheck = {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'present' : 'missing'
      }
      
      setResult(prev => prev + `Environment: ${JSON.stringify(envCheck, null, 2)}\n\n`)
      
      // Import Supabase dynamically to avoid SSR issues
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      
      setResult(prev => prev + `Supabase client created successfully\n`)
      
      // Test login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      setResult(prev => prev + `Login result: ${JSON.stringify({ data, error }, null, 2)}\n`)
      
      if (data.user) {
        setResult(prev => prev + `\n✅ Login successful! Redirecting to dashboard...\n`)
        window.location.href = '/dashboard'
      }
      
    } catch (err) {
      setResult(prev => prev + `\n❌ Error: ${err}\n`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Simple Login Test
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Test Supabase authentication
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Login'}
          </button>
        </div>
        
        <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-64">
          {result}
        </pre>
      </div>
    </div>
  )
}
