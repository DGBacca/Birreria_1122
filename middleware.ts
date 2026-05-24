/**
 * middleware.ts
 * 
 * Middleware de Next.js para proteger rutas de administración y meseros.
 * Utiliza NextAuth para verificar si el usuario tiene el rol adecuado.
 * Se ejecuta antes de que la solicitud llegue a la página.
 */

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Rutas que comienzan con /admin
    const isAdminRoute = pathname.startsWith('/admin');
    // Rutas que comienzan con /mesero
    const isMeseroRoute = pathname.startsWith('/mesero');

    // 1. Si intenta entrar a admin y no es admin, redirigir al login (excepto /admin/mesas para meseros)
    if (isAdminRoute && token?.role !== 'admin') {
      if (pathname === '/admin/mesas' && token?.role === 'mesero') {
        // Permitir que los meseros vean el panel de mesas
      } else {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    // 2. Si intenta entrar a mesero y no tiene el rol permitido (admin o mesero)
    if (isMeseroRoute && !['admin', 'mesero'].includes(token?.role as string)) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  },
  {
    callbacks: {
      // authorized: devuelve true si hay un token válido presente
      authorized: ({ token }) => !!token,
    },
  }
);

/**
 * El matcher define en qué rutas se ejecutará este middleware.
 * Usamos comodines para cubrir todas las subrutas de admin y mesero.
 */
export const config = {
  matcher: ['/admin/:path*', '/mesero/:path*'],
};
