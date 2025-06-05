import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple access level determination from cookies/headers
// In a real app, this would validate JWT tokens and fetch user profile
function getAccessLevelFromRequest(request: NextRequest): 'none' | 'limited' | 'full' {
  const authToken = request.cookies.get('auth-token')
  
  if (!authToken) {
    return 'none'
  }

  // In a real implementation, you would:
  // 1. Validate the JWT token
  // 2. Fetch user profile completion status from your backend
  // 3. Calculate access level based on profile status
  
  // For demo purposes, check if there's user data indicating completion status
  const userData = request.cookies.get('user_profile_status')
  
  if (userData) {
    try {
      const profileStatus = JSON.parse(userData.value)
      const { basicInfoComplete, identityVerified, paymentSetupComplete } = profileStatus
      
      if (basicInfoComplete && identityVerified && paymentSetupComplete) {
        return 'full'
      }
      
      if (basicInfoComplete) {
        return 'limited'
      }
    } catch (error) {
      // If parsing fails, default to limited for authenticated users
      return 'limited'
    }
  }
  
  // Default to limited access for authenticated users without profile data
  return 'limited'
}

// Route access configuration
const routeConfigs = {
  none: ['/auth', '/auth/signin', '/auth/signup'],
  limited: [
    '/dashboard',
    '/docs', 
    '/documentation',
    '/cost-estimator',
    '/ai-studio',
    '/profile',
    '/support',
    '/settings/profile',
    '/dashboard/profile-completion'
  ],
  full: ['*'] // Wildcard for full access
}

function checkRouteAccess(pathname: string, accessLevel: 'none' | 'limited' | 'full'): boolean {
  const allowedRoutes = routeConfigs[accessLevel]
  
  // Full access allows everything
  if (allowedRoutes.includes('*')) {
    return true
  }
  
  // Check exact match
  if (allowedRoutes.includes(pathname)) {
    return true
  }
  
  // Check prefix match (for nested routes)
  return allowedRoutes.some(route => {
    const normalizedRoute = route.replace(/\/$/, '')
    const normalizedPath = pathname.replace(/\/$/, '')
    return normalizedPath.startsWith(normalizedRoute)
  })
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // TEMPORARY: Bypass auth for testing
  // TODO: Remove this bypass after testing
  if (pathname.startsWith('/dashboard')) {
    const response = NextResponse.next()
    response.headers.set('x-user-access-level', 'limited')
    return response
  }

  const accessLevel = getAccessLevelFromRequest(request)
  const hasAccess = checkRouteAccess(pathname, accessLevel)

  // If user doesn't have access to the route
  if (!hasAccess) {
    // For unauthenticated users, redirect to signin
    if (accessLevel === 'none') {
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(signInUrl)
    }
    
    // For limited access users trying to access restricted routes
    if (accessLevel === 'limited') {
      // Check if it's a compute/storage/billing route
      const restrictedPaths = [
        '/compute', '/storage', '/billing', '/api-keys', 
        '/ssh-keys', '/kubernetes', '/networking', '/infrastructure'
      ]
      
      const isRestrictedPath = restrictedPaths.some(path => pathname.startsWith(path))
      
      if (isRestrictedPath) {
        // Redirect to profile completion with context
        const profileUrl = new URL('/dashboard/profile-completion', request.url)
        profileUrl.searchParams.set('redirect', pathname)
        profileUrl.searchParams.set('feature', pathname.split('/')[1] || 'feature')
        return NextResponse.redirect(profileUrl)
      }
      
      // For other restricted routes, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // For profile completion routes, ensure user is authenticated
  if (pathname.startsWith('/dashboard/profile-completion') && accessLevel === 'none') {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Add access level header for client-side components
  const response = NextResponse.next()
  response.headers.set('x-user-access-level', accessLevel)
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 