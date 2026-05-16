/**
 * app/mesero/mesas/[id]/page.tsx
 * 
 * Interfaz de control para una mesa específica (Vista del Mesero).
 * Permite ver el estado actual de la mesa, agregar bebidas a la orden activa
 * y ver el resumen del total consumido.
 */

import { db } from '@/lib/db';
import { OrderItem } from '@/types';
import { AddItemsForm } from '@/components/mesero/AddItemsForm';
import { OrderSummary } from '@/components/mesero/OrderSummary';
import Link from 'next/link';

export default async function MesaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tableId = parseInt(id);
  
  // Cargamos toda la información necesaria en paralelo desde la DB (Server-side)
  const [table, order, drinks, categories] = await Promise.all([
    db.getTableById(tableId),
    db.getOrderByTable(tableId),
    db.getDrinks(),
    db.getCategories()
  ]);

  // Si hay una orden activa, obtenemos sus productos detallados
  let orderItems: OrderItem[] = [];
  if (order) {
    orderItems = await db.getOrderItems(order.id);
  }

  // Si la mesa no existe, mostramos un error
  if (!table) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error: Mesa no encontrada</h1>
        <Link href="/mesero/mesas" className="text-blue-600 underline mt-4 inline-block">
          Volver al panel de mesas
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Encabezado con estado de la mesa */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/mesero/mesas" className="text-gray-500 hover:text-gray-700 text-sm mb-1 block">
            ← Volver a mesas
          </Link>
          <h1 className="text-3xl font-black text-gray-900">Mesa #{table.table_number}</h1>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${
          table.status === 'available' ? 'bg-green-100 text-green-700' : 
          table.status === 'occupied' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {table.status.toUpperCase()}
        </div>
      </div>
      
      {/* Layout de dos columnas: Selección de productos y Resumen de orden */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Principal: Buscador y lista de bebidas para agregar */}
        <div className="lg:col-span-2">
          <AddItemsForm
            tableId={tableId}
            drinks={drinks}
            categories={categories}
          />
        </div>

        {/* Columna Lateral: Resumen de la orden actual y botón de cierre/pago */}
        <div className="relative">
          <div className="sticky top-8">
            <OrderSummary
              order={order}
              items={orderItems}
              tableId={tableId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
