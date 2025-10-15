'use client'

import { useState, useEffect } from 'react'

export default function TestEnvPage() {
  const [envVars, setEnvVars] = useState<any>({})

  useEffect(() => {
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'present' : 'missing',
      NODE_ENV: process.env.NODE_ENV,
    })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Environment Variables Test
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Checking if environment variables are loaded correctly
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(envVars, null, 2)}
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
