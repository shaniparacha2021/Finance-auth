'use client'

import { useEffect, useState } from 'react'

export default function DebugPage() {
  const [envVars, setEnvVars] = useState<any>({})

  useEffect(() => {
    setEnvVars({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing',
      appUrl: process.env.NEXT_PUBLIC_APP_URL
    })
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Debug</h1>
      <div className="bg-gray-100 p-4 rounded">
        <pre>{JSON.stringify(envVars, null, 2)}</pre>
      </div>
    </div>
  )
}
