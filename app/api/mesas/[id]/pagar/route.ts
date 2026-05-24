/**
 * app/api/mesas/[id]/pagar/route.ts
 * Procesa el pago de una mesa y la libera
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || !['mesero', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const { id } = await params;
  const { orderId } = await request.json();

  try {
    await db.finalizeOrder(orderId);
    return NextResponse.json({ success: true, message: 'Pago confirmado, mesa liberada' });
  } catch (error) {
    console.error('Error al procesar pago:', error);
    return NextResponse.json({ error: 'Error al procesar pago' }, { status: 500 });
  }
}
