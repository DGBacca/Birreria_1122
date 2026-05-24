/**
 * app/api/admin/dashboard/route.ts
 *
 * Métrica y analítica financiera consolidada para el Administrador
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session || role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    // 1. Resumen de Ventas y Financiero
    const { rows: salesKpi } = await db.query(`
      SELECT 
        COUNT(id) as count,
        COALESCE(SUM(total), 0) as total_revenue
      FROM orders
      WHERE status = 'paid'
    `);

    // 2. Inversión Actual en Inventario
    const { rows: inventoryKpi } = await db.query(`
      SELECT 
        COALESCE(SUM(cantidad_actual * costo_compra_unitario), 0) as total_cost_value
      FROM lotes_inventario
      WHERE cantidad_actual > 0
    `);

    // 3. Rentabilidad por Bebida (Ganancias / Pérdidas)
    // Calcula costo, utilidad, margen, stock y días en inventario del lote activo más antiguo
    const { rows: profitability } = await db.query(`
      SELECT 
        d.id, 
        d.nombre, 
        d.precio as precio_venta, 
        COALESCE(l.costo_compra_unitario, 0) as costo_compra,
        (d.precio - COALESCE(l.costo_compra_unitario, 0)) as utilidad,
        CASE 
          WHEN d.precio > 0 THEN ROUND(((d.precio - COALESCE(l.costo_compra_unitario, 0)) / d.precio) * 100, 1)
          ELSE 0
        END as margen,
        d.stock,
        COALESCE(EXTRACT(DAY FROM NOW() - l.fecha_ingreso), 0) as dias_inventario
      FROM drinks d
      LEFT JOIN (
        SELECT DISTINCT ON (bebida_id) bebida_id, costo_compra_unitario, fecha_ingreso
        FROM lotes_inventario
        WHERE cantidad_actual > 0
        ORDER BY bebida_id, fecha_ingreso ASC
      ) l ON d.id = l.bebida_id
      WHERE d.active = true
      ORDER BY utilidad DESC
    `);

    // 4. Consumo acumulado e histórico por Mesa
    const { rows: tableStats } = await db.query(`
      SELECT 
        t.id,
        t.table_number,
        t.status,
        COUNT(o.id) as total_ocupaciones,
        COALESCE(SUM(o.total), 0) as total_facturado
      FROM tables t
      LEFT JOIN orders o ON t.id = o.table_id AND o.status = 'paid'
      GROUP BY t.id, t.table_number, t.status
      ORDER BY total_facturado DESC
    `);

    return NextResponse.json({
      revenue: Number(salesKpi[0].total_revenue),
      ordersCount: Number(salesKpi[0].count),
      inventoryValue: Number(inventoryKpi[0].total_cost_value),
      profitability,
      tableStats
    });
  } catch (error) {
    console.error('Error al generar dashboard:', error);
    return NextResponse.json({ error: 'Error al generar la analítica' }, { status: 500 });
  }
}
