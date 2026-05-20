"use client";

import { useEffect, useState } from "react";
import { Order, OrderItem } from "@/types";

export default function TableOrderDrawer({ 
  tableId, 
  tableNumber,
  onClose 
}: { 
  tableId: number; 
  tableNumber: number;
  onClose: () => void; 
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [finalizing, setFinalizing] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [tableId]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/mesas/${tableId}/orden`);
      const data = await res.json();
      setOrder(data.order);
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async () => {
    if (!order) return;
    if (!confirm('¿Estás seguro de cerrar esta cuenta y liberar la mesa?')) return;

    setFinalizing(true);
    try {
      const res = await fetch('/api/ordenes/finalizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id })
      });
      
      if (res.ok) {
        alert('Cuenta cerrada exitosamente.');
        onClose();
      } else {
        alert('Error al cerrar la cuenta.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión.');
    } finally {
      setFinalizing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm">
      {/* Overlay to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#111] h-full shadow-2xl border-l border-white/10 flex flex-col transform transition-transform animate-slide-in-right">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black">
          <div>
            <h2 className="text-xl font-black uppercase tracking-wider text-white">Mesa {tableNumber}</h2>
            <p className="text-xs text-amber-500 font-bold uppercase mt-1">
              {order ? `Orden #${order.id}` : 'Mesa Disponible'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {loading ? (
            <p className="text-center text-gray-500 mt-10">Cargando detalles...</p>
          ) : !order ? (
            <div className="text-center mt-20 opacity-50">
              <p className="text-4xl mb-4">🍽️</p>
              <p className="font-bold">No hay ninguna orden activa</p>
              <p className="text-xs text-gray-400 mt-2">Esta mesa está lista para recibir nuevos clientes.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-black/50 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    {item.drink_image ? (
                      <img src={item.drink_image} alt={item.drink_name} className="w-10 h-10 object-cover rounded-lg" />
                    ) : (
                      <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-xl">🍺</div>
                    )}
                    <div>
                      <p className="font-bold text-sm leading-tight text-white">{item.drink_name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.quantity} x ${Number(item.unit_price).toLocaleString('es-CO')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-amber-500 text-sm">
                      ${Number(item.subtotal).toLocaleString('es-CO')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {order && (
          <div className="p-6 bg-black border-t border-white/10">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400 font-bold uppercase text-sm">Total a Pagar</span>
              <span className="text-3xl font-black text-white">
                ${Number(order.total).toLocaleString('es-CO')}
              </span>
            </div>
            <button
              onClick={handleFinalize}
              disabled={finalizing}
              className="w-full bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/50 disabled:opacity-50 py-4 rounded-xl font-black uppercase tracking-widest transition-all"
            >
              {finalizing ? 'Cerrando Cuenta...' : 'Cerrar Cuenta'}
            </button>
            <p className="text-[10px] text-gray-500 text-center mt-3 uppercase tracking-wider">
              Al cerrar la cuenta, la mesa quedará liberada.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .animate-slide-in-right {
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
