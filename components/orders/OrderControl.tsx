"use client";

import { useState, useEffect } from 'react';
import { Drink, Table } from '@/types';
import TableOrderDrawer from './TableOrderDrawer';

export default function OrderControl({ selectedDrink }: { selectedDrink: Drink }) {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await fetch('/api/mesas');
      const data = await res.json();
      setTables(data);
    } catch (err) {
      console.error('Error loading tables:', err);
    }
  };

  const handleAdd = async () => {
    if (!selectedTableId) {
      alert('Por favor selecciona una mesa primero');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: selectedTableId,
          items: [{ drinkId: selectedDrink.id, quantity }]
        })
      });

      if (res.ok) {
        setQuantity(1);
        // Refresh tables to get updated status
        fetchTables();
        setShowDrawer(true);
      } else {
        alert('Error al agregar el pedido');
      }
    } catch (err) {
      console.error(err);
      alert('Error en la conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/10">
        <span className="text-gray-400 font-bold text-xs uppercase">Cantidad</span>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-xl"
          >
            -
          </button>
          <span className="font-black text-xl w-6 text-center">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 hover:bg-amber-500/40 flex items-center justify-center font-bold text-xl"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-400 uppercase">Seleccionar Mesa</label>
        <select 
          value={selectedTableId}
          onChange={(e) => setSelectedTableId(Number(e.target.value))}
          className="bg-black border border-white/20 rounded-xl p-3 text-sm focus:border-amber-500 focus:outline-none w-full"
        >
          <option value="">-- Elige una mesa --</option>
          {tables.map(t => (
            <option key={t.id} value={t.id}>
              Mesa {t.table_number} {t.status === 'occupied' ? '(Ocupada)' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 mt-2">
        <button
          onClick={handleAdd}
          disabled={loading || !selectedTableId}
          className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black text-sm uppercase tracking-wider py-3 rounded-xl transition-colors"
        >
          {loading ? 'Agregando...' : 'Agregar a la Mesa'}
        </button>
        
        {selectedTableId && (
          <button
            onClick={() => setShowDrawer(true)}
            className="px-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
            title="Ver Orden Activa"
          >
            🧾
          </button>
        )}
      </div>

      {showDrawer && selectedTableId && (
        <TableOrderDrawer 
          tableId={Number(selectedTableId)}
          tableNumber={tables.find(t => t.id === Number(selectedTableId))?.table_number || 0}
          onClose={() => {
            setShowDrawer(false);
            fetchTables();
          }}
        />
      )}
    </div>
  );
}
