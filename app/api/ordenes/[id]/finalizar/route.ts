/**
 * app/api/ordenes/[id]/finalizar/route.ts
 * 
 * Ruta de API para finalizar una orden.
 * Cambia el estado a 'paid' y libera la mesa vinculada.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  // Solo meseros y admins pueden finalizar órdenes
  const userRole = (session?.user as any)?.role;
  if (!session || !['mesero', 'admin'].includes(userRole)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    await db.finalizeOrder(parseInt(id));
    return NextResponse.json({ message: 'Orden finalizada con éxito' });
  } catch (error) {
    console.error('Error al finalizar orden:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
