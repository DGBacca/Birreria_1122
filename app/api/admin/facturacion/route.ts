/**
 * app/api/admin/facturacion/route.ts
 *
 * Devuelve todas las mesas con el total acumulado de consumos históricos
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session || !['mesero', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    // Obtener las mesas y la suma de sus consumos históricos (solo órdenes pagadas)
    const { rows: mesasFacturacion } = await db.query(`
      SELECT 
        t.id,
        t.table_number,
        COALESCE(SUM(o.total), 0) as total_historico,
        COUNT(o.id) as total_ocupaciones
      FROM tables t
      LEFT JOIN orders o ON t.id = o.table_id AND o.status = 'paid'
      GROUP BY t.id, t.table_number
      ORDER BY t.table_number ASC
    `);

    return NextResponse.json(mesasFacturacion);
  } catch (error) {
    console.error('Error en API facturación:', error);
    return NextResponse.json({ error: 'Error al obtener datos de facturación' }, { status: 500 });
  }
}
