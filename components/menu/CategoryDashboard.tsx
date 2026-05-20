"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Drink, Category } from '@/types';
import OrderControl from '@/components/orders/OrderControl';

interface CategoryDashboardProps {
  categories: Category[];
  currentCategory: Category;
  drinks: Drink[];
  userRole?: string;
}

export default function CategoryDashboard({
  categories,
  currentCategory,
  drinks,
  userRole,
}: CategoryDashboardProps) {
  const [selectedDrinkId, setSelectedDrinkId] = useState<number | null>(
    drinks.length > 0 ? drinks[0].id : null
  );

  const selectedDrink = drinks.find((d) => d.id === selectedDrinkId) || null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Sticky Top Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 pt-4 pb-2 px-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          {/* Logo / Header (optional small version) */}
          <Link href="/menu" className="text-amber-500 text-xs font-black uppercase tracking-[0.4em] mb-2 hover:text-amber-400">
            Birreria 11•22
          </Link>
          
          {/* Categorías (Navegación horizontal) */}
          <div className="flex w-full overflow-x-auto gap-4 pb-2 scrollbar-hide snap-x">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/menu/categoria/${cat.id}`}
                className={`snap-center shrink-0 px-5 py-2 rounded-full font-bold text-sm transition-colors border ${
                  cat.id === currentCategory.id
                    ? 'bg-amber-500 text-black border-amber-500'
                    : 'bg-transparent text-gray-400 border-white/10 hover:border-amber-500/50 hover:text-amber-500'
                }`}
              >
                {cat.name.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-6 relative">
        {/* PANEL IZQUIERDO: Lista de Bebidas (1/4) */}
        <div className="md:col-span-1 flex flex-col gap-3 h-[calc(100vh-140px)] overflow-y-auto pr-2 custom-scrollbar">
          <h2 className="text-lg font-black text-amber-500 mb-2 sticky top-0 bg-black py-2 z-10">
            {currentCategory.name.toUpperCase()}
          </h2>
          {drinks.length > 0 ? (
            drinks.map((drink) => (
              <button
                key={drink.id}
                onClick={() => setSelectedDrinkId(drink.id)}
                className={`text-left p-3 rounded-xl border transition-all ${
                  selectedDrinkId === drink.id
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-white/5 bg-white/5 hover:border-amber-500/30'
                }`}
              >
                <h3 className={`font-bold text-sm ${selectedDrinkId === drink.id ? 'text-amber-400' : 'text-white'}`}>
                  {drink.nombre}
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  ${Number(drink.precio).toLocaleString('es-CO')}
                </p>
              </button>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No hay bebidas registradas en esta categoría.</p>
          )}
        </div>

        {/* PANEL CENTRAL: Imagen de la Bebida (2/4) */}
        <div className="md:col-span-2 flex items-center justify-center bg-white/5 rounded-3xl border border-white/10 p-6 relative min-h-[300px]">
          {selectedDrink ? (
            selectedDrink.image_url ? (
              <img
                src={selectedDrink.image_url}
                alt={selectedDrink.nombre}
                className="max-w-full max-h-[60vh] object-contain drop-shadow-2xl"
              />
            ) : (
              <div className="text-center opacity-50">
                <span className="text-6xl block mb-4">🍻</span>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Sin Imagen</p>
              </div>
            )
          ) : (
            <p className="text-gray-600">Selecciona una bebida</p>
          )}
        </div>

        {/* PANEL DERECHO: Detalles y Controles (1/4) */}
        <div className="md:col-span-1 flex flex-col gap-6 h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
          {selectedDrink ? (
            <div className="bg-white/5 rounded-3xl border border-white/10 p-5 flex flex-col h-full">
              <div className="flex-1">
                <h1 className="text-2xl font-black leading-tight mb-2">
                  {selectedDrink.nombre}
                </h1>
                <p className="text-amber-500 text-xl font-bold mb-4">
                  ${Number(selectedDrink.precio).toLocaleString('es-CO')}
                </p>
                
                {selectedDrink.descripcion && (
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                    {selectedDrink.descripcion}
                  </p>
                )}

                <div className="space-y-3 mb-6">
                  {selectedDrink.estilo && (
                    <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                      <span className="text-gray-500 font-bold uppercase">Estilo</span>
                      <span className="text-white text-right max-w-[60%]">{selectedDrink.estilo}</span>
                    </div>
                  )}
                  {selectedDrink.alcohol && (
                    <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                      <span className="text-gray-500 font-bold uppercase">Alcohol</span>
                      <span className="text-white text-right max-w-[60%]">{selectedDrink.alcohol}</span>
                    </div>
                  )}
                  {selectedDrink.contenido && (
                    <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                      <span className="text-gray-500 font-bold uppercase">Contenido</span>
                      <span className="text-white text-right max-w-[60%]">{selectedDrink.contenido}</span>
                    </div>
                  )}
                  {selectedDrink.origen && (
                    <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                      <span className="text-gray-500 font-bold uppercase">Origen</span>
                      <span className="text-white text-right max-w-[60%]">{selectedDrink.origen}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Controls (Mesero / Admin Only) */}
              {(userRole === 'mesero' || userRole === 'admin') && (
                <div className="mt-auto pt-4 border-t border-white/10">
                  <OrderControl selectedDrink={selectedDrink} />
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600">
              <p>Esperando selección...</p>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(245, 158, 11, 0.3); /* amber-500/30 */
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
