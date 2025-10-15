'use client'

import { useState, useEffect } from 'react'

export default function DiagnosePage() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const addResult = (message: string) => {
    setResults(prev => [...prev, message])
  }

  useEffect(() => {
    const runDiagnostics = async () => {
      setResults([])
      addResult('🔍 Starting comprehensive diagnostics...\n')
      
      // 1. Check environment variables
      addResult('1. Checking environment variables...')
      const envCheck = {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'present' : 'missing'
      }
      addResult(`   URL: ${envCheck.url ? '✅ Present' : '❌ Missing'}`)
      addResult(`   Key: ${envCheck.key === 'present' ? '✅ Present' : '❌ Missing'}`)
      
      if (!envCheck.url || envCheck.key === 'missing') {
        addResult('❌ Environment variables are missing!')
        setLoading(false)
        return
      }
      
      // 2. Test Supabase client creation
      addResult('\n2. Testing Supabase client creation...')
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        addResult('   ✅ Supabase client created successfully')
      } catch (err) {
        addResult(`   ❌ Failed to create client: ${err}`)
        setLoading(false)
        return
      }
      
      // 3. Test basic connection
      addResult('\n3. Testing basic connection...')
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) {
          addResult(`   ⚠️  User check error: ${userError.message}`)
        } else {
          addResult(`   ✅ Connection successful (User: ${user ? 'Logged in' : 'Not logged in'})`)
        }
      } catch (err) {
        addResult(`   ❌ Connection failed: ${err}`)
      }
      
      // 4. Test authentication without login
      addResult('\n4. Testing authentication system...')
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        
        // Test with invalid credentials first
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'test@invalid.com',
          password: 'invalid'
        })
        
        if (error) {
          addResult(`   ✅ Auth system responding (Expected error: ${error.message})`)
        } else {
          addResult('   ⚠️  Unexpected: Invalid credentials worked')
        }
      } catch (err) {
        addResult(`   ❌ Auth system error: ${err}`)
      }
      
      // 5. Test database tables
      addResult('\n5. Testing database tables...')
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        
        const tables = ['budgets', 'rules_regulations', 'downloads', 'latest_updates']
        
        for (const table of tables) {
          try {
            const { data, error } = await supabase
              .from(table)
              .select('*')
              .limit(1)
            
            if (error) {
              addResult(`   ❌ ${table}: ${error.message}`)
            } else {
              addResult(`   ✅ ${table}: OK`)
            }
          } catch (err) {
            addResult(`   ❌ ${table}: ${err}`)
          }
        }
      } catch (err) {
        addResult(`   ❌ Database test failed: ${err}`)
      }
      
      // 6. Test actual login
      addResult('\n6. Testing actual login...')
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'admin@finance.com',
          password: 'admin123'
        })
        
        if (error) {
          addResult(`   ❌ Login failed: ${error.message}`)
        } else if (data.user) {
          addResult(`   ✅ Login successful! User: ${data.user.email}`)
        } else {
          addResult('   ❌ Login failed: No user data')
        }
      } catch (err) {
        addResult(`   ❌ Login error: ${err}`)
      }
      
      addResult('\n🏁 Diagnostics completed!')
      setLoading(false)
    }
    
    runDiagnostics()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            🔧 Supabase Diagnostics
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Comprehensive system health check
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Diagnostic Results</h3>
            {loading && (
              <div className="flex items-center text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Running...
              </div>
            )}
          </div>
          
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96 whitespace-pre-wrap">
            {results.join('\n')}
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
            href="/simple-login" 
            className="text-green-600 hover:text-green-500"
          >
            Simple Login Test
          </a>
        </div>
      </div>
    </div>
  )
}
