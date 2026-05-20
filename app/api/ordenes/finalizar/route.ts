import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  const userRole = (session?.user as any)?.role;
  if (!session || !['mesero', 'admin'].includes(userRole)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { orderId } = await request.json();
    
    if (!orderId) {
      return NextResponse.json({ error: 'ID de orden requerido' }, { status: 400 });
    }

    await db.finalizeOrder(orderId);

    return NextResponse.json({ message: 'Orden finalizada y mesa liberada' });
  } catch (error) {
    console.error('Error al finalizar orden:', error);
    return NextResponse.json({ error: 'Error al finalizar la orden' }, { status: 500 });
  }
}
