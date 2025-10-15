'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestLoginPage() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResult('Testing...')
    
    try {
      const supabase = createClient()
      
      // Test 1: Check environment variables
      const envCheck = {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        keyExists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
      
      setResult(`Environment Check: ${JSON.stringify(envCheck, null, 2)}\n`)
      
      // Test 2: Try to get current session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      setResult(prev => prev + `Session Check: ${JSON.stringify({ sessionData, sessionError }, null, 2)}\n`)
      
      // Test 3: Try login
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'admin@finance.com',
        password: 'admin123'
      })
      
      setResult(prev => prev + `Login Test: ${JSON.stringify({ loginData, loginError }, null, 2)}`)
      
    } catch (err) {
      setResult(`Error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Login Test Page</h1>
      <button 
        onClick={testLogin} 
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Login'}
      </button>
      <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
        {result}
      </pre>
    </div>
  )
}
