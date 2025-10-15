'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { User } from '@supabase/supabase-js'

export default function TestAuthPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [testResult, setTestResult] = useState('')
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Error getting user:', error)
        setTestResult(`Error: ${error.message}`)
      } else {
        setUser(user)
        setTestResult(user ? 'User found' : 'No user logged in')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setTestResult(`Unexpected error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'shaniparacha2021@gmail.com',
        password: 'test123' // Try different passwords
      })
      
      if (error) {
        setTestResult(`Login failed: ${error.message}`)
      } else {
        setTestResult(`Login successful: ${data.user?.email}`)
        setUser(data.user)
      }
    } catch (err) {
      setTestResult(`Login error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const testLogout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setTestResult('Logged out successfully')
    } catch (err) {
      setTestResult(`Logout error: ${err}`)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Supabase Auth Test</CardTitle>
          <CardDescription>Test your Supabase authentication setup</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Current User:</strong> {user ? user.email : 'None'}
          </div>
          <div>
            <strong>Test Result:</strong> {testResult}
          </div>
          <div className="flex space-x-4">
            <Button onClick={testLogin} disabled={loading}>
              Test Login
            </Button>
            <Button onClick={testLogout} variant="outline">
              Logout
            </Button>
            <Button onClick={checkUser} variant="outline">
              Check User
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            <p>Try different passwords for the existing user:</p>
            <ul className="list-disc list-inside mt-2">
              <li>test123</li>
              <li>password</li>
              <li>admin123</li>
              <li>123456</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
