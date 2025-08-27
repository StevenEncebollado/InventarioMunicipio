import { NextRequest, NextResponse } from 'next/server';

// Configuración del middleware
const PROTECTED_ROUTES = ['/dashboard'];
const PUBLIC_ROUTES = ['/'];
const SESSION_COOKIE_NAME = 'inventario_user_session';

/**
 * Middleware de autenticación y navegación
 * Protege rutas y maneja redirecciones automáticas
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar si hay datos de sesión en cookies
  const sessionData = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isAuthenticated = !!sessionData;
  
  // Verificar si es una ruta protegida
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  // Verificar si es una ruta pública
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  
  // Logging para desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log(`🛡️ Middleware - Ruta: ${pathname}, Autenticado: ${isAuthenticated}`);
  }
  
  // Si intenta acceder a ruta protegida sin autenticación
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    loginUrl.searchParams.set('reason', 'auth_required');
    
    console.log(`🚫 Acceso denegado a ${pathname} - Redirigiendo a login`);
    return NextResponse.redirect(loginUrl);
  }
  
  // Si está autenticado y trata de ir a login, redirigir al dashboard
  if (isPublicRoute && isAuthenticated && pathname === '/') {
    const dashboardUrl = new URL('/dashboard', request.url);
    console.log(`✅ Usuario autenticado - Redirigiendo a dashboard`);
    return NextResponse.redirect(dashboardUrl);
  }
  
  // Agregar headers de seguridad
  const response = NextResponse.next();
  
  // Headers de seguridad básicos
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

/**
 * Configuración del matcher
 * Define qué rutas deben pasar por el middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)',
  ],
};
