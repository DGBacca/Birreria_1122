/**
 * app/api/ordenes/route.ts
 * 
 * Ruta de API para la gestión de órdenes.
 * Utilizada principalmente por los meseros para crear y actualizar pedidos.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * Maneja solicitudes POST
 * Crea una nueva orden o agrega items a una existente si la mesa ya está ocupada.
 * Solo accesible para meseros (y admins).
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  // Control de acceso: solo meseros o admins pueden tomar pedidos
  const userRole = (session?.user as any)?.role;
  if (!session || !['mesero', 'admin'].includes(userRole)) {
    return NextResponse.json({ error: 'No autorizado - Acceso restringido a personal' }, { status: 403 });
  }

  try {
    const { tableId, items } = await request.json();
    
    if (!tableId || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Datos de orden inválidos' }, { status: 400 });
    }

    // 1. Buscar si la mesa ya tiene una orden activa
    let order = await db.getOrderByTable(tableId);
    
    // 2. Si no hay orden activa, crear una nueva e inicializar la mesa como ocupada
    if (!order) {
      const userId = parseInt((session.user as any).id);
      order = await db.createOrder(tableId, userId);
      await db.updateTableStatus(tableId, 'occupied');
    }

    // 3. Procesar y agregar cada ítem a la orden
    // Nota: addOrderItem también actualiza el total acumulado de la orden en cada paso
    for (const item of items) {
      await db.addOrderItem(order.id, item.drinkId, item.quantity);
    }

    return NextResponse.json({
      message: 'Orden procesada con éxito',
      orderId: order.id
    });
  } catch (error) {
    console.error('Error al procesar orden:', error);
    return NextResponse.json({ error: 'Error al registrar el pedido' }, { status: 500 });
  }
}
