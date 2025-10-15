import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request })
  }

  try {
    const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (
      !user &&
      !request.nextUrl.pathname.startsWith('/login') &&
      !request.nextUrl.pathname.startsWith('/auth') &&
      !request.nextUrl.pathname.startsWith('/diagnose') &&
      !request.nextUrl.pathname.startsWith('/minimal-test') &&
      !request.nextUrl.pathname.startsWith('/test-') &&
      !request.nextUrl.pathname.startsWith('/simple-')
    ) {
      // no user, potentially respond by redirecting the user to the login page
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    return NextResponse.next({ request })
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next({ request })
  }
}
