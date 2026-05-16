/**
 * components/mesero/AddItemsForm.tsx
 * 
 * Interfaz para que el mesero busque y agregue bebidas a una orden.
 * Incluye un buscador en tiempo real y una lista filtrada.
 */

'use client';

import { useState } from 'react';
import { Drink, Category } from '@/types';
import { useRouter } from 'next/navigation';

export function AddItemsForm({ 
  tableId, 
  drinks, 
  categories 
}: { 
  tableId: number; 
  drinks: Drink[]; 
  categories: Category[] 
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState<number | null>(null);

  // Filtrar bebidas localmente para una respuesta instantánea
  const filteredDrinks = drinks.filter(drink => {
    const matchesSearch = drink.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || drink.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = async (drinkId: number) => {
    setLoading(drinkId);
    try {
      const res = await fetch('/api/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId,
          items: [{ drinkId, quantity: 1 }]
        })
      });

      if (res.ok) {
        // Refrescamos para ver el item agregado en el resumen lateral
        router.refresh();
      }
    } catch (error) {
      console.error('Error al agregar item:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      {/* Buscador y Filtro */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Buscar bebida..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <svg className="absolute left-4 top-3.5 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
          className="bg-gray-50 border-none rounded-2xl px-6 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Lista de Bebidas Disponibles */}
      <div className="space-y-4">
        {filteredDrinks.map((drink) => (
          <div key={drink.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white overflow-hidden border border-gray-100">
                {drink.image_url && <img src={drink.image_url} alt="" className="w-full h-full object-cover" />}
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{drink.nombre}</h4>
                <p className="text-sm text-gray-500">${drink.precio.toLocaleString()}</p>
              </div>
            </div>
            
            <button
              onClick={() => handleAddItem(drink.id)}
              disabled={loading === drink.id}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                loading === drink.id ? 'bg-gray-200' : 'bg-blue-600 text-white hover:scale-110 active:scale-95'
              }`}
            >
              {loading === drink.id ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
