/**
 * app/admin/page.tsx
 *
 * Tablero de Control Central del Administrador.
 * Muestra KPIs de rentabilidad, stock y consumos de mesa.
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProfitabilityItem {
  id: number;
  nombre: string;
  precio_venta: number;
  costo_compra: number;
  utilidad: number;
  margen: number;
  stock: number;
  dias_inventario: number;
}

interface TableStatItem {
  id: number;
  table_number: number;
  status: string;
  total_ocupaciones: number;
  total_facturado: number;
}

interface DashboardData {
  revenue: number;
  ordersCount: number;
  inventoryValue: number;
  profitability: ProfitabilityItem[];
  tableStats: TableStatItem[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      if (!res.ok) {
        throw new Error('No autorizado o error al cargar analítica.');
      }
      const result = await res.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProfitability = data?.profitability.filter((item) =>
    item.nombre.toLowerCase().includes(filterQuery.toLowerCase())
  ) || [];

  // Calcular márgenes promedio
  const avgMargin = data?.profitability.length
    ? Math.round(
        data.profitability.reduce((sum, item) => sum + Number(item.margen), 0) /
          data.profitability.length
      )
    : 0;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <p className="text-amber-500 text-xs font-black uppercase tracking-[0.3em] mb-1">
              Birreria 11•22
            </p>
            <h1 className="text-4xl font-black tracking-tighter">
              TABLERO DE RENTABILIDAD
            </h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/mesas"
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all"
            >
              🪑 Panel de Mesas
            </Link>
            <Link
              href="/admin/branding"
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/10"
            >
              🎨 Personalizar Logo
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl mb-8 font-bold text-sm">
            ❌ {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : data ? (
          <>
            {/* Tarjetas KPI Superiores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-white/3 border border-white/5 rounded-3xl p-6">
                <span className="text-gray-500 text-[10px] font-black uppercase tracking-wider block mb-2">
                  VENTAS TOTALES
                </span>
                <span className="text-3xl font-black text-white block">
                  ${data.revenue.toLocaleString('es-CO')}
                </span>
                <span className="text-xs text-gray-400 mt-2 block">
                  {data.ordersCount} facturas cobradas
                </span>
              </div>

              <div className="bg-white/3 border border-white/5 rounded-3xl p-6">
                <span className="text-gray-500 text-[10px] font-black uppercase tracking-wider block mb-2">
                  VALOR INVENTARIO
                </span>
                <span className="text-3xl font-black text-amber-500 block">
                  ${data.inventoryValue.toLocaleString('es-CO')}
                </span>
                <span className="text-xs text-gray-400 mt-2 block">
                  Costo total invertido en stock
                </span>
              </div>

              <div className="bg-white/3 border border-white/5 rounded-3xl p-6">
                <span className="text-gray-500 text-[10px] font-black uppercase tracking-wider block mb-2">
                  MARGEN COMERCIAL PROMEDIO
                </span>
                <span className="text-3xl font-black text-emerald-500 block">
                  {avgMargin}%
                </span>
                <span className="text-xs text-gray-400 mt-2 block">
                  Rentabilidad media por producto
                </span>
              </div>

              <div className="bg-white/3 border border-white/5 rounded-3xl p-6">
                <span className="text-gray-500 text-[10px] font-black uppercase tracking-wider block mb-2">
                  UTILIDAD ESTIMADA
                </span>
                <span className="text-3xl font-black text-white block">
                  ${Math.round(data.revenue * (avgMargin / 100)).toLocaleString('es-CO')}
                </span>
                <span className="text-xs text-emerald-400 mt-2 block font-bold">
                  Sano rendimiento financiero
                </span>
              </div>
            </div>

            {/* Dos Paneles Principales */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* PANEL 1: TABLERO DE GANANCIAS Y PÉRDIDAS POR PRODUCTO (2/3 de ancho) */}
              <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-black tracking-tight">Utilidad por Producto</h2>
                    <p className="text-gray-500 text-xs">Cruce de costo de compra (PEPS) vs precio de venta</p>
                  </div>
                  
                  {/* Buscador */}
                  <input
                    type="text"
                    placeholder="Filtrar bebida..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="px-4 py-2 text-xs bg-white/5 border border-white/10 rounded-xl focus:border-amber-500 focus:outline-none max-w-[200px]"
                  />
                </div>

                <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-gray-500 font-black uppercase border-b border-white/10">
                        <th className="pb-3 pr-2">Producto</th>
                        <th className="pb-3 text-right">Costo</th>
                        <th className="pb-3 text-right">Venta</th>
                        <th className="pb-3 text-right">Utilidad</th>
                        <th className="pb-3 text-right">Margen</th>
                        <th className="pb-3 text-center">Stock</th>
                        <th className="pb-3 text-center">Edad (Días)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProfitability.map((item) => (
                        <tr key={item.id} className="border-b border-white/5 hover:bg-white/2">
                          <td className="py-3 font-bold text-white max-w-[150px] truncate">{item.nombre}</td>
                          <td className="py-3 text-right text-gray-500">${Number(item.costo_compra).toLocaleString('es-CO')}</td>
                          <td className="py-3 text-right text-gray-300">${Number(item.precio_venta).toLocaleString('es-CO')}</td>
                          <td className="py-3 text-right text-emerald-400 font-bold">${Number(item.utilidad).toLocaleString('es-CO')}</td>
                          <td className="py-3 text-right">
                            <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 font-black">
                              {item.margen}%
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <span className={`font-bold ${item.stock < 10 ? 'text-red-500' : 'text-gray-400'}`}>
                              {item.stock}
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                              item.dias_inventario > 30 
                                ? 'bg-amber-500/10 text-amber-500' 
                                : 'bg-white/5 text-gray-400'
                            }`}>
                              {item.dias_inventario} d
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PANEL 2: CONSUMO ACUMULADO POR MESA (1/3 de ancho) */}
              <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-black tracking-tight">Tráfico de Mesas</h2>
                  <p className="text-gray-500 text-xs">Historial de ocupaciones y facturación total</p>
                </div>

                <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-gray-500 font-black uppercase border-b border-white/10">
                        <th className="pb-3">Mesa</th>
                        <th className="pb-3 text-center">Sesiones</th>
                        <th className="pb-3 text-right">Facturado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.tableStats.map((item) => (
                        <tr key={item.id} className="border-b border-white/5 hover:bg-white/2">
                          <td className="py-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            <span className="font-bold text-white text-sm">Mesa #{item.table_number}</span>
                          </td>
                          <td className="py-4 text-center text-gray-400 font-bold">{item.total_ocupaciones}</td>
                          <td className="py-4 text-right text-amber-500 font-black text-sm">
                            ${Number(item.total_facturado).toLocaleString('es-CO')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </>
        ) : null}

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(245, 158, 11, 0.3);
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
