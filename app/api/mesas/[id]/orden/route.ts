import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tableId = parseInt(id);

    if (isNaN(tableId)) {
      return NextResponse.json({ error: 'ID de mesa inválido' }, { status: 400 });
    }

    const order = await db.getOrderByTable(tableId);

    if (!order) {
      return NextResponse.json({ order: null, items: [] });
    }

    const items = await db.getOrderItems(order.id);
    return NextResponse.json({ order, items });
  } catch (error) {
    console.error('Error fetching table order:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
