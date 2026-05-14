/**
 * app/api/bebidas/route.ts
 * 
 * Ruta de API para la gestión de bebidas.
 * Soporta GET para listar bebidas y POST para crear nuevas (solo admin).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * Maneja solicitudes GET
 * Permite listar todas las bebidas o filtrar por categoría mediante query params.
 * Ejemplo: /api/bebidas?category=1
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const categoryId = searchParams.get('category');
  
  try {
    const drinks = await db.getDrinks(categoryId ? parseInt(categoryId) : undefined);
    return NextResponse.json(drinks);
  } catch (error) {
    console.error('Error al obtener bebidas:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

/**
 * Maneja solicitudes POST
 * Crea una nueva bebida. Requiere que el usuario sea administrador.
 */
export async function POST(request: NextRequest) {
  // Verificar la sesión del usuario en el servidor
  const session = await getServerSession(authOptions);
  
  // Control de acceso: solo admins pueden crear bebidas
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado - Se requieren permisos de administrador' }, { status: 403 });
  }

  try {
    const data = await request.json();
    
    // Validación básica (puedes expandir esto con Zod)
    if (!data.name || !data.price || !data.category_id) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const drink = await db.createDrink(data);
    return NextResponse.json(drink, { status: 201 });
  } catch (error) {
    console.error('Error al crear bebida:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
