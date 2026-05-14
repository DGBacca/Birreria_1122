/**
 * components/mesero/OrderSummary.tsx
 * 
 * Muestra el resumen de la cuenta actual de la mesa.
 * Permite ver el total acumulado y finalizar la orden para liberar la mesa.
 */

'use client';

import { Order, OrderItem } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function OrderSummary({ 
  order, 
  items, 
  tableId 
}: { 
  order: Order | null; 
  items: OrderItem[]; 
  tableId: number 
}) {
  const router = useRouter();
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinalize = async () => {
    if (!order) return;
    if (!confirm('¿Deseas finalizar y marcar como pagada esta orden? La mesa quedará disponible.')) return;

    setIsFinishing(true);
    try {
      // Llamamos a la API para finalizar (deberías crear este endpoint en /api/ordenes/[id]/finalizar)
      const res = await fetch(`/api/ordenes/${order.id}/finalizar`, {
        method: 'PATCH'
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error al finalizar orden:', error);
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gray-900 p-6 text-white">
        <h3 className="font-black text-xl tracking-tight">RESUMEN DE CUENTA</h3>
        <p className="text-gray-400 text-xs mt-1">
          {order ? `Orden #${order.id}` : 'Sin orden activa'}
        </p>
      </div>

      <div className="p-6">
        {/* Lista de productos consumidos */}
        <div className="space-y-4 mb-8 min-h-[200px]">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-start text-sm">
              <div className="flex-1">
                <p className="font-bold text-gray-800">
                  <span className="text-blue-600 mr-2">{item.quantity}x</span> 
                  {(item as any).drink_name}
                </p>
                <p className="text-gray-400 text-xs">${item.unit_price.toLocaleString()}</p>
              </div>
              <p className="font-black text-gray-900">${item.subtotal.toLocaleString()}</p>
            </div>
          ))}

          {items.length === 0 && (
            <div className="h-40 flex flex-col items-center justify-center text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              <p className="text-sm font-medium">No hay consumos registrados</p>
            </div>
          )}
        </div>

        {/* Total y Botón de Pago */}
        <div className="border-t border-dashed border-gray-200 pt-6">
          <div className="flex justify-between items-end mb-6">
            <span className="text-gray-500 font-bold">TOTAL</span>
            <span className="text-3xl font-black text-blue-600">
              ${order?.total.toLocaleString() || '0'}
            </span>
          </div>

          <button
            onClick={handleFinalize}
            disabled={!order || isFinishing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            {isFinishing ? 'PROCESANDO...' : 'FINALIZAR Y COBRAR'}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-4 text-center">
        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
          Birreria 11•22 - Sistema de Meseros
        </p>
      </div>
    </div>
  );
}
