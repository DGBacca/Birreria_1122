/**
 * app/menu/page.tsx
 *
 * Pantalla 1: Grilla de categorías.
 * El cliente ve las categorías como tarjetas grandes y elige la que le interesa.
 */

import Link from 'next/link';
import { db } from '@/lib/db';

// Mapeo de emojis/iconos para cada categoría por nombre
const categoryIcons: Record<string, string> = {
  'Cerveza': '🍺',
  'Aguardiente': '🥃',
  'Ron': '🥃',
  'Tequila': '🌵',
  'Cóctel': '🍹',
  'Whisky': '🥃',
  'No Alcohol': '🥤',
  'Vino': '🍷',
  'Vodka': '🍸',
  'default': '🍾',
};

export default async function MenuPage() {
  const categories = await db.getCategories();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Encabezado de sección */}
      <div className="pt-12 pb-8 px-6 text-center">
        <p className="text-amber-500 text-xs font-black uppercase tracking-[0.4em] mb-3">Birreria 11•22</p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
          NUESTRO MENÚ
        </h1>
        <p className="text-gray-600 mt-3 font-medium">Selecciona una categoría para explorar</p>
      </div>

      {/* Grilla de Categorías */}
      <main className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => {
            const icon = categoryIcons[category.name] || categoryIcons['default'];
            return (
              <Link
                key={category.id}
                href={`/menu/categoria/${category.id}`}
                className="group relative bg-[#0a0a0a] hover:bg-amber-500 border border-white/5 hover:border-amber-500 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-amber-500/20 active:scale-[0.98] cursor-pointer aspect-square"
              >
                {/* Icono grande */}
                <span className="text-5xl md:text-6xl transition-transform duration-300 group-hover:scale-110">
                  {icon}
                </span>

                {/* Nombre */}
                <div className="text-center">
                  <h2 className="font-black text-lg md:text-xl text-white group-hover:text-black transition-colors leading-tight">
                    {category.name.toUpperCase()}
                  </h2>
                  {category.description && (
                    <p className="text-gray-600 group-hover:text-black/60 text-[10px] font-bold uppercase tracking-widest mt-1 transition-colors line-clamp-1">
                      {category.description}
                    </p>
                  )}
                </div>

                {/* Flecha */}
                <div className="absolute bottom-4 right-4 w-7 h-7 rounded-full bg-white/5 group-hover:bg-black/10 flex items-center justify-center transition-all">
                  <svg className="w-3.5 h-3.5 text-gray-600 group-hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-32">
            <p className="text-6xl mb-6">🍾</p>
            <p className="text-gray-600 font-bold text-lg">El menú se está preparando</p>
            <p className="text-gray-700 text-sm mt-2">¡Vuelve pronto!</p>
          </div>
        )}
      </main>

      <footer className="py-10 border-t border-white/5 text-center text-gray-800 text-[10px] font-black uppercase tracking-[0.4em]">
        Birreria 11•22 — Calidad y Tradición
      </footer>
    </div>
  );
}
