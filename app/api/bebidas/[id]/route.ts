/**
 * app/api/bebidas/[id]/route.ts
 * 
 * Ruta de API para la gestión individual de una bebida.
 * Soporta GET (obtener), PUT (actualizar) y DELETE (eliminar).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * GET /api/bebidas/[id]
 * Obtiene los detalles de una bebida específica.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const drink = await db.getDrinkById(parseInt(id));
    if (!drink) {
      return NextResponse.json({ error: 'Bebida no encontrada' }, { status: 404 });
    }
    return NextResponse.json(drink);
  } catch (error) {
    console.error('Error al obtener bebida:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

/**
 * PUT /api/bebidas/[id]
 * Actualiza una bebida existente. Requiere ser administrador.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const data = await request.json();
    const drink = await db.updateDrink(parseInt(id), data);
    if (!drink) {
      return NextResponse.json({ error: 'Bebida no encontrada' }, { status: 404 });
    }
    return NextResponse.json(drink);
  } catch (error) {
    console.error('Error al actualizar bebida:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}

/**
 * DELETE /api/bebidas/[id]
 * Marca una bebida como inactiva (borrado lógico). Requiere ser administrador.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const success = await db.deleteDrink(parseInt(id));
    if (!success) {
      return NextResponse.json({ error: 'Bebida no encontrada' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Bebida eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar bebida:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
