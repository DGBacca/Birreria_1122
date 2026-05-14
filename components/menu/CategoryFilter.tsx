/**
 * components/menu/CategoryFilter.tsx
 * 
 * Barra de navegación horizontal para filtrar las bebidas por categoría.
 * Permite al usuario desplazarse lateralmente por las opciones.
 */

'use client';

import { Category } from '@/types';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function CategoryFilter({ 
  categories, 
  currentCategory 
}: { 
  categories: Category[]; 
  currentCategory?: number 
}) {
  const searchParams = useSearchParams();
  const table = searchParams.get('table');

  return (
    <div className="bg-[#161b22]/50 border-b border-white/5 overflow-x-auto no-scrollbar">
      <div className="container mx-auto px-4 flex gap-4 py-4 min-w-max">
        {/* Opción "Todas" */}
        <Link
          href={`/menu${table ? `?table=${table}` : ''}`}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
            !currentCategory 
              ? 'bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/20' 
              : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/10'
          }`}
        >
          Todas
        </Link>

        {/* Botones de Categorías Dinámicas */}
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/menu?category=${cat.id}${table ? `&table=${table}` : ''}`}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
              currentCategory === cat.id
                ? 'bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/20' 
                : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/10'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
