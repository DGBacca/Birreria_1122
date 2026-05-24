/**
 * app/api/mesas/[id]/cuenta/route.ts
 * Obtiene la cuenta activa de una mesa con todos sus ítems
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || !['mesero', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const { id } = await params;
  const tableId = parseInt(id);

  try {
    const order = await db.getOrderByTable(tableId);
    if (!order) {
      return NextResponse.json({ message: 'Sin cuenta activa' }, { status: 200 });
    }

    const items = await db.getOrderItems(order.id);
    return NextResponse.json({ ...order, items });
  } catch (error) {
    console.error('Error al obtener cuenta:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
