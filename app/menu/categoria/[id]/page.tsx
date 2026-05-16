/**
 * app/menu/categoria/[id]/page.tsx
 *
 * Pantalla 2: Bebidas dentro de una categoría seleccionada.
 * Se accede desde la grilla de categorías.
 */

import Link from 'next/link';
import { db } from '@/lib/db';
import { DrinkCard } from '@/components/menu/DrinkCard';
import { notFound } from 'next/navigation';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryId = parseInt(id);

  if (isNaN(categoryId)) notFound();

  const [drinks, categories] = await Promise.all([
    db.getDrinks(categoryId),
    db.getCategories(),
  ]);

  const currentCategory = categories.find((c) => c.id === categoryId);

  if (!currentCategory) notFound();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Breadcrumb + Encabezado */}
      <div className="pt-10 pb-8 px-6 max-w-6xl mx-auto">
        {/* Volver */}
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-500 text-xs font-black uppercase tracking-widest transition-colors mb-8 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Todas las categorías
        </Link>

        {/* Título de categoría */}
        <div className="flex items-end gap-6 mb-2">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
            {currentCategory.name.toUpperCase()}
          </h1>
          <div className="h-2 w-16 bg-amber-500 rounded-full mb-3 hidden sm:block"></div>
        </div>
        {currentCategory.description && (
          <p className="text-gray-600 font-medium mt-2">{currentCategory.description}</p>
        )}
        <p className="text-gray-700 text-xs font-black uppercase tracking-widest mt-4">
          {drinks.length} {drinks.length === 1 ? 'bebida disponible' : 'bebidas disponibles'}
        </p>
      </div>

      {/* Grilla de bebidas */}
      <main className="max-w-6xl mx-auto px-4 pb-20">
        {drinks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {drinks.map((drink) => (
              <DrinkCard key={drink.id} drink={drink} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white/3 rounded-[2.5rem] border border-dashed border-white/10">
            <p className="text-5xl mb-6">🍾</p>
            <p className="text-gray-500 font-bold text-lg">Próximamente en esta categoría</p>
            <p className="text-gray-700 text-sm mt-2">¡Estamos preparando algo especial!</p>
            <Link
              href="/menu"
              className="mt-8 inline-block bg-amber-500 hover:bg-amber-400 text-black px-8 py-3 rounded-2xl font-black text-sm transition-all"
            >
              VER OTRAS CATEGORÍAS
            </Link>
          </div>
        )}
      </main>

      <footer className="py-10 border-t border-white/5 text-center text-gray-800 text-[10px] font-black uppercase tracking-[0.4em]">
        Birreria 11•22 — Calidad y Tradición
      </footer>
    </div>
  );
}
