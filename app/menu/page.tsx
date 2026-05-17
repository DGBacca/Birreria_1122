/**
 * app/menu/page.tsx
 *
 * Pantalla 1: Grilla de categorías con imagen de fondo.
 */

import Link from 'next/link';
import { db } from '@/lib/db';

export default async function MenuPage() {
  const categories = await db.getCategories();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Encabezado */}
      <div className="pt-12 pb-8 px-6 text-center">
        <p className="text-amber-500 text-xs font-black uppercase tracking-[0.4em] mb-3">Birreria 11•22</p>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter">NUESTRO MENÚ</h1>
        <p className="text-gray-600 mt-3 font-medium text-sm">Selecciona una categoría para explorar</p>
      </div>

      {/* Grilla de Categorías */}
      <main className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/menu/categoria/${category.id}`}
              className="group relative overflow-hidden rounded-[1.75rem] aspect-square cursor-pointer border border-white/10 hover:border-amber-500/50 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-amber-500/20 active:scale-[0.97]"
            >
              {/* Imagen de fondo */}
              {category.image_url ? (
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                /* Placeholder si no tiene imagen aún */
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
              )}

              {/* Capa de gradiente siempre presente para legibilidad */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Efecto hover ámbar */}
              <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors duration-300" />

              {/* Texto en la parte inferior */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <h2 className="font-black text-base md:text-lg text-white leading-tight tracking-tight group-hover:text-amber-400 transition-colors">
                  {category.name.toUpperCase()}
                </h2>
                {category.description && (
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-0.5 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {category.description}
                  </p>
                )}
              </div>

              {/* Flecha en esquina superior derecha */}
              <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Badge sin imagen */}
              {!category.image_url && (
                <div className="absolute top-4 left-4 bg-white/5 border border-white/10 text-gray-600 text-[9px] font-black uppercase px-2 py-1 rounded-lg">
                  Sin imagen
                </div>
              )}
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-32">
            <p className="text-6xl mb-6">🍾</p>
            <p className="text-gray-600 font-bold text-lg">El menú se está preparando</p>
          </div>
        )}
      </main>

      <footer className="py-10 border-t border-white/5 text-center text-gray-800 text-[10px] font-black uppercase tracking-[0.4em]">
        Birreria 11•22 — Calidad y Tradición
      </footer>
    </div>
  );
}
