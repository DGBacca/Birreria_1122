/**
 * app/menu/page.tsx
 * 
 * Vista pública del menú digital para los clientes.
 * Optimizado para dispositivos móviles.
 * Permite filtrar por categorías y ver el detalle técnico de cada bebida.
 */

import { db } from '@/lib/db';
import { DrinkCard } from '@/components/menu/DrinkCard';
import { CategoryFilter } from '@/components/menu/CategoryFilter';

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; table?: string }>;
}) {
  const { category, table } = await searchParams;
  // Obtenemos el ID de categoría de la URL si existe
  const categoryId = category ? parseInt(category) : undefined;
  
  // Cargamos bebidas y categorías en el servidor
  const drinks = await db.getDrinks(categoryId);
  const categories = await db.getCategories();

  return (
    <div className="min-h-screen bg-[#0f1115] text-white">
      {/* Componente de Filtro: Permite al usuario navegar entre Cervezas, Vinos, etc. */}
      <CategoryFilter categories={categories} currentCategory={categoryId} />

      <main className="container mx-auto px-4 py-8">
        {/* Título de la sección actual */}
        <div className="mb-8">
          <h2 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">
            {categoryId 
              ? categories.find(c => c.id === categoryId)?.name 
              : 'Todas nuestras bebidas'}
          </h2>
          <div className="h-1 w-12 bg-amber-500 rounded-full"></div>
        </div>

        {/* Grid de Bebidas con diseño tipo tarjeta moderna */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {drinks.map((drink) => (
            <DrinkCard key={drink.id} drink={drink} />
          ))}
        </div>

        {/* Estado si no hay resultados */}
        {drinks.length === 0 && (
          <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/5 mt-12">
            <p className="text-gray-500 text-lg">Pronto tendremos más opciones aquí.</p>
            <p className="text-amber-500/50 text-sm mt-2">¡Salud!</p>
          </div>
        )}
      </main>

      {/* Footer minimalista */}
      <footer className="py-12 border-t border-white/5 text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} Birreria 11•22 - Menú Digital</p>
      </footer>
    </div>
  );
}
