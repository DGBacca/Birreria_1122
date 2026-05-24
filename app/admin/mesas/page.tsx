'use client';

import { useState, useEffect } from 'react';

interface TableData {
  id: number;
  table_number: number;
  status: string;
}

interface OrderItemData {
  id: number;
  drink_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface OrderData {
  id: number;
  total: number;
  status: string;
  created_at: string;
  items: OrderItemData[];
}

export default function MesasPage() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [payingId, setPayingId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await fetch('/api/mesas');
      const data = await res.json();
      setTables(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openTable = async (table: TableData) => {
    setSelectedTable(table);
    setOrder(null);
    setOrderLoading(true);
    try {
      const res = await fetch(`/api/mesas/${table.id}/cuenta`);
      const data = await res.json();
      if (data && data.id) {
        setOrder(data);
      } else {
        setOrder(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setOrderLoading(false);
    }
  };

  const handlePay = () => {
    setShowConfirm(true);
  };

  const confirmPay = async () => {
    if (!order) return;
    setPayingId(order.id);
    setShowConfirm(false);
    try {
      const res = await fetch(`/api/mesas/${selectedTable!.id}/pagar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      });
      if (res.ok) {
        setSuccessMsg('✅ Pago confirmado. Mesa liberada.');
        setOrder(null);
        setSelectedTable(null);
        fetchTables();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-amber-500 text-xs font-black uppercase tracking-[0.3em] mb-2">Gestión</p>
          <h1 className="text-4xl font-black tracking-tighter">MESAS</h1>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold">
            {successMsg}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tables.map((t) => (
              <button
                key={t.id}
                onClick={() => openTable(t)}
                className={`p-6 rounded-2xl border-2 text-center transition-all hover:scale-105 active:scale-95 ${
                  t.status === 'occupied'
                    ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                    : 'border-white/10 bg-white/3 hover:border-white/30'
                }`}
              >
                <span className="text-3xl font-black block">{t.table_number}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest mt-2 block ${
                  t.status === 'occupied' ? 'text-amber-500' : 'text-gray-500'
                }`}>
                  {t.status === 'occupied' ? 'OCUPADA' : 'LIBRE'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal de cuenta/factura */}
      {selectedTable && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedTable(null)}>
          <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#111] z-10 rounded-t-3xl">
              <div>
                <h2 className="text-2xl font-black">Mesa #{selectedTable.table_number}</h2>
                <span className={`text-xs font-black uppercase tracking-widest ${
                  selectedTable.status === 'occupied' ? 'text-amber-500' : 'text-gray-500'
                }`}>
                  {selectedTable.status === 'occupied' ? 'OCUPADA' : 'LIBRE'}
                </span>
              </div>
              <button onClick={() => setSelectedTable(null)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-xl">
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {orderLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : order ? (
                <>
                  {/* Tabla de factura */}
                  <table className="w-full text-sm mb-6">
                    <thead>
                      <tr className="text-gray-500 text-[10px] font-black uppercase tracking-widest border-b border-white/10">
                        <th className="text-left py-3">Bebida</th>
                        <th className="text-center py-3">Cant.</th>
                        <th className="text-right py-3">P. Unit.</th>
                        <th className="text-right py-3">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.id} className="border-b border-white/5">
                          <td className="py-3 text-white font-bold">{item.drink_name}</td>
                          <td className="py-3 text-center text-gray-400">{item.quantity}</td>
                          <td className="py-3 text-right text-gray-400">${Number(item.unit_price).toLocaleString('es-CO')}</td>
                          <td className="py-3 text-right text-amber-500 font-bold">${Number(item.subtotal).toLocaleString('es-CO')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Total */}
                  <div className="flex justify-between items-center p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl mb-6">
                    <span className="text-sm font-black uppercase tracking-widest text-amber-500">Total a Pagar</span>
                    <span className="text-2xl font-black text-amber-500">${Number(order.total).toLocaleString('es-CO')}</span>
                  </div>

                  {/* Botón Pagar */}
                  <button
                    onClick={handlePay}
                    disabled={payingId === order.id}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black text-sm uppercase tracking-widest rounded-2xl transition-all hover:scale-[1.02] active:scale-95"
                  >
                    {payingId === order.id ? 'PROCESANDO...' : '💵 PAGAR CUENTA'}
                  </button>
                </>
              ) : (
                <div className="text-center py-12">
                  <span className="text-4xl block mb-4">🍺</span>
                  <p className="text-gray-500 font-bold">Esta mesa no tiene cuenta activa.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dialogo de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <span className="text-5xl block mb-4">💰</span>
            <h3 className="text-xl font-black mb-2">Confirmar el pago</h3>
            <p className="text-gray-400 text-sm mb-6">¿Deseas confirmar el pago y liberar la mesa #{selectedTable?.table_number}?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmPay}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl transition-colors"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
