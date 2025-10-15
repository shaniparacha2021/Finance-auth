'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('shaniparacha2021@gmail.com')
  const [password, setPassword] = useState('Shani@123321')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted with:', { email, password })
    setLoading(true)
    setError('')

    try {
      console.log('Creating Supabase client...')
      const supabaseClient = createClient()
      console.log('Supabase client created successfully')
      
      console.log('Attempting login...')
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })

      console.log('Login response:', { data, error })

      if (error) {
        console.error('Login error:', error)
        setError(`Login failed: ${error.message}`)
      } else if (data.user) {
        console.log('Login successful:', data.user)
        setError('')
        // Force a page reload to ensure proper session handling
        window.location.href = '/dashboard'
      } else {
        console.log('No user data received')
        setError('Login failed - no user data received')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError(`An unexpected error occurred: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the Finance Admin Panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the Finance Admin Panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full mt-2" 
              onClick={async () => {
                console.log('Testing Supabase connection...')
                console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
                console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
                try {
                  const supabaseClient = createClient()
                  const { data, error } = await supabaseClient.auth.getSession()
                  console.log('Current session:', { data, error })
                } catch (err) {
                  console.error('Connection test error:', err)
                }
              }}
            >
              Test Connection
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
