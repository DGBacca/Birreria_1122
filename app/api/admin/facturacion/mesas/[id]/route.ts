/**
 * app/api/admin/facturacion/mesas/[id]/route.ts
 *
 * Devuelve el historial de ocupaciones y facturas detalladas de una mesa específica
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
    // 1. Obtener todas las órdenes pagadas de la mesa
    const { rows: orders } = await db.query(`
      SELECT 
        o.id,
        o.total,
        o.created_at as fecha_apertura,
        o.closed_at as hora_cierre,
        u.name as atendido_por,
        u.role as rol_atendedor
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.table_id = ${tableId} AND o.status = 'paid'
      ORDER BY o.closed_at DESC
    `);

    // 2. Para cada orden, obtener sus ítems de bebida
    const ordersWithItems = [];
    for (const order of orders) {
      const { rows: items } = await db.query(`
        SELECT 
          oi.id,
          d.nombre as drink_name,
          oi.quantity,
          oi.unit_price,
          oi.subtotal
        FROM order_items oi
        JOIN drinks d ON oi.drink_id = d.id
        WHERE oi.order_id = ${order.id}
        ORDER BY oi.id ASC
      `);
      ordersWithItems.push({
        ...order,
        items
      });
    }

    return NextResponse.json(ordersWithItems);
  } catch (error) {
    console.error('Error al obtener historial de mesa:', error);
    return NextResponse.json({ error: 'Error al obtener historial de la mesa' }, { status: 500 });
  }
}
