'use client'

import { useState } from 'react'

export default function TestLoginCredentialsPage() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('shaniparacha2021@gmail.com')
  const [password, setPassword] = useState('Shani@123321')

  const testLogin = async () => {
    setLoading(true)
    setResult('Testing login with your database credentials...\n\n')
    
    try {
      const { createClient } = await import('@supabase/supabase-js')
      
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      setResult(prev => prev + `URL: ${url}\n`)
      setResult(prev => prev + `Key: ${key ? 'Present' : 'Missing'}\n`)
      setResult(prev => prev + `Email: ${email}\n`)
      setResult(prev => prev + `Password: ${password}\n\n`)
      
      if (!url || !key) {
        setResult(prev => prev + '❌ Missing environment variables!\n')
        return
      }
      
      const supabase = createClient(url, key)
      
      setResult(prev => prev + 'Attempting login...\n')
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })
      
      if (error) {
        setResult(prev => prev + `❌ Login error: ${error.message}\n`)
        setResult(prev => prev + `Error code: ${error.status}\n`)
        setResult(prev => prev + `Full error: ${JSON.stringify(error, null, 2)}\n`)
      } else if (data.user) {
        setResult(prev => prev + `✅ Login successful!\n`)
        setResult(prev => prev + `User: ${data.user.email}\n`)
        setResult(prev => prev + `ID: ${data.user.id}\n`)
        setResult(prev => prev + `Confirmed: ${data.user.email_confirmed_at ? 'Yes' : 'No'}\n`)
        setResult(prev => prev + `Last sign in: ${data.user.last_sign_in_at || 'Never'}\n`)
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
            Test Login with Your Credentials
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Test login with shaniparacha2021@gmail.com
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
            onClick={testLogin}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Login'}
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
        </div>
      </div>
    </div>
  )
}
