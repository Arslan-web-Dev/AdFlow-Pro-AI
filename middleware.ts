import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  
  // Public routes
  if (url.pathname === '/' || url.pathname.startsWith('/explore') || url.pathname.startsWith('/auth') || url.pathname.startsWith('/api/public')) {
    return supabaseResponse
  }

  if (!user) {
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // RBAC checks
  const { data: userRecord } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = userRecord?.role || 'client'

  if (url.pathname.startsWith('/admin') && !['admin', 'super_admin'].includes(role)) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  if (url.pathname.startsWith('/moderator') && !['moderator', 'admin', 'super_admin'].includes(role)) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  if (url.pathname.startsWith('/dashboard') && !['client', 'moderator', 'admin', 'super_admin'].includes(role)) {
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
