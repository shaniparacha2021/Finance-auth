'use client'

import { useState, useEffect } from 'react'

export default function EnvTestPage() {
  const [envVars, setEnvVars] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Present' : 'Missing',
      NODE_ENV: process.env.NODE_ENV,
    })
    setLoading(false)
  }, [])

  const testLogin = async () => {
    setLoading(true)
    try {
      const { createClient } = await import('@supabase/supabase-js')
      
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!url || !key) {
        alert('Missing environment variables!')
        return
      }
      
      const supabase = createClient(url, key)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@finance.com',
        password: 'admin123'
      })
      
      if (error) {
        alert(`Login error: ${error.message}`)
      } else if (data.user) {
        alert(`Login successful! User: ${data.user.email}`)
      } else {
        alert('No user data received')
      }
    } catch (err) {
      alert(`Error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Environment Variables Test
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Check if environment variables are loaded correctly
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Environment Variables:</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(envVars, null, 2)}
          </pre>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={testLogin}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Login'}
          </button>
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
