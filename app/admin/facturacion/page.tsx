/**
 * app/admin/facturacion/page.tsx
 *
 * Módulo de Facturación Histórica.
 * Muestra consumo total por mesa, sesiones de ocupación, fecha/hora y mesero encargado.
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface BillingTable {
  id: number;
  table_number: number;
  total_historico: number;
  total_ocupaciones: number;
}

interface InvoiceItem {
  id: number;
  drink_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface InvoiceSession {
  id: number;
  total: number;
  fecha_apertura: string;
  hora_cierre: string;
  atendido_por: string;
  rol_atendedor: string;
  items: InvoiceItem[];
}

export default function FacturacionPage() {
  const { data: session } = useSession();
  const [tables, setTables] = useState<BillingTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<BillingTable | null>(null);
  const [sessions, setSessions] = useState<InvoiceSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await fetch('/api/admin/facturacion');
      const data = await res.json();
      setTables(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openTableHistory = async (table: BillingTable) => {
    setSelectedTable(table);
    setSessions([]);
    setActiveSessionId(null);
    setSessionsLoading(true);
    try {
      const res = await fetch(`/api/admin/facturacion/mesas/${table.id}`);
      const data = await res.json();
      setSessions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setSessionsLoading(false);
    }
  };

  // Formateador de fecha legible en español
  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <p className="text-amber-500 text-xs font-black uppercase tracking-[0.3em] mb-1">Auditoría</p>
            <h1 className="text-4xl font-black tracking-tighter">HISTORIAL DE FACTURACIÓN</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/mesas"
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all"
            >
              🪑 Mesas en Vivo
            </Link>
            <Link
              href="/admin"
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/10"
            >
              📊 Rentabilidad
            </Link>
          </div>
        </div>

        {/* Grid de Mesas */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {tables.map((t) => (
              <button
                key={t.id}
                onClick={() => openTableHistory(t)}
                className={`p-6 rounded-3xl border text-left transition-all hover:scale-[1.03] active:scale-95 bg-white/3 hover:border-amber-500/50 border-white/5 flex flex-col justify-between min-h-[140px]`}
              >
                <div>
                  <span className="text-2xl font-black block text-white">Mesa {t.table_number}</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1 block">
                    {t.total_ocupaciones} ocupaciones históricas
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 w-full flex justify-between items-end">
                  <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Consumo Total:</span>
                  <span className="text-lg font-black text-amber-500">
                    ${Number(t.total_historico).toLocaleString('es-CO')}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal Lateral / Detalle de Historial por Mesa */}
      {selectedTable && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-end p-0" onClick={() => setSelectedTable(null)}>
          <div 
            className="bg-[#0f0f0f] border-l border-white/10 w-full max-w-2xl h-screen overflow-y-auto shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#0f0f0f] z-10">
              <div>
                <h2 className="text-2xl font-black text-white">Historial Mesa #{selectedTable.table_number}</h2>
                <p className="text-xs text-gray-500">
                  Consumo acumulado total: <span className="text-amber-500 font-bold">${Number(selectedTable.total_historico).toLocaleString('es-CO')}</span>
                </p>
              </div>
              <button 
                onClick={() => setSelectedTable(null)} 
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-xl"
              >
                ✕
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-6 flex-1">
              {sessionsLoading ? (
                <div className="flex justify-center py-20">
                  <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : sessions.length > 0 ? (
                <div className="space-y-4">
                  {sessions.map((s, idx) => (
                    <div 
                      key={s.id} 
                      className={`border rounded-2xl transition-all overflow-hidden ${
                        activeSessionId === s.id 
                          ? 'border-amber-500/50 bg-amber-500/5' 
                          : 'border-white/5 bg-white/2 hover:border-white/10'
                      }`}
                    >
                      {/* Cabecera de la factura/ocupación */}
                      <button
                        onClick={() => setActiveSessionId(activeSessionId === s.id ? null : s.id)}
                        className="w-full p-5 text-left flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-wider">
                              Factura #{s.id}
                            </span>
                            <span className="text-xs text-gray-400">
                              Ocupación #{sessions.length - idx}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            <span className="font-bold text-gray-400">Apertura:</span> {formatDateTime(s.fecha_apertura)}
                          </p>
                          <p className="text-xs text-gray-500">
                            <span className="font-bold text-gray-400">Cierre:</span> {formatDateTime(s.hora_cierre)}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Atendido por: <span className="text-white font-bold">{s.atendido_por}</span> ({s.rol_atendedor})
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500 block font-bold uppercase tracking-wider">Monto Total</span>
                          <span className="text-xl font-black text-amber-500">${Number(s.total).toLocaleString('es-CO')}</span>
                          <span className="text-[10px] text-gray-400 block mt-1">Ver detalles {activeSessionId === s.id ? '▲' : '▼'}</span>
                        </div>
                      </button>

                      {/* Detalles del consumo expandido */}
                      {activeSessionId === s.id && (
                        <div className="px-5 pb-5 pt-2 border-t border-white/5 bg-black/40">
                          <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-3">Detalle de Consumos</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="text-gray-500 text-[9px] font-black uppercase tracking-widest border-b border-white/10 pb-2">
                                  <th className="text-left pb-2">Bebida</th>
                                  <th className="text-center pb-2">Cantidad</th>
                                  <th className="text-right pb-2">P. Unitario</th>
                                  <th className="text-right pb-2">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {s.items.map((item) => (
                                  <tr key={item.id} className="border-b border-white/5">
                                    <td className="py-2.5 font-bold text-white">{item.drink_name}</td>
                                    <td className="py-2.5 text-center text-gray-400">{item.quantity}</td>
                                    <td className="py-2.5 text-right text-gray-400">${Number(item.unit_price).toLocaleString('es-CO')}</td>
                                    <td className="py-2.5 text-right text-amber-500 font-bold">${Number(item.subtotal).toLocaleString('es-CO')}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <span className="text-5xl block mb-4">🧾</span>
                  <p className="text-gray-500 font-bold">Esta mesa no tiene registros de facturación cerrados aún.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
