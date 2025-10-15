// Test Supabase connection
// Run this in your browser console to test the connection

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://udsjzftiuhjpakzrufbl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkc2p6ZnRpdWhqcGFrenJ1ZmJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTIyNzYsImV4cCI6MjA3NjA4ODI3Nn0.9Xuwdya_tUEXZlnIpmzz8yQhp74d-Y9F6X2OiSEb988'

const supabase = createClient(supabaseUrl, supabaseKey)

// Test connection
async function testConnection() {
  try {
    const { data, error } = await supabase.auth.getSession()
    console.log('Supabase connection test:', { data, error })
    
    // Test login
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'shaniparacha2021@gmail.com',
      password: 'your_password_here' // Replace with actual password
    })
    
    console.log('Login test:', { loginData, loginError })
  } catch (err) {
    console.error('Test failed:', err)
  }
}

testConnection()
