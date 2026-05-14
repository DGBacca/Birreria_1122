/**
 * app/admin/bebidas/page.tsx
 * 
 * Página de gestión de bebidas para el administrador.
 * Renderizada en el servidor (Server Component) para mayor rapidez y SEO.
 * Muestra una lista de todas las bebidas y permite acceder a los formularios de creación/edición.
 */

import { db } from '@/lib/db';
import Link from 'next/link';
// Nota: DeleteButton debe ser un Client Component ya que maneja eventos de click
import { DeleteButton } from '@/components/admin/DeleteButton';

export default async function BebidasPage() {
  // Cargar datos directamente desde la DB (Server-side)
  const drinks = await db.getDrinks();

  return (
    <div className="p-8">
      {/* Encabezado con botón de acción */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Inventario</h1>
          <p className="text-gray-500">Administra las bebidas disponibles en el menú</p>
        </div>
        <Link 
          href="/admin/bebidas/nueva"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center gap-2"
        >
          <span className="text-xl">+</span> Nueva Bebida
        </Link>
      </div>

      {/* Grid de Bebidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {drinks.map((drink) => (
          <div key={drink.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Imagen de la bebida */}
            <div className="relative h-48 bg-gray-100">
              {drink.image_url ? (
                <img 
                  src={drink.image_url} 
                  alt={drink.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Sin Imagen
                </div>
              )}
              {/* Etiqueta de Stock */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                Stock: {drink.stock}
              </div>
            </div>

            {/* Información de la bebida */}
            <div className="p-5">
              <div className="mb-1">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {/* El nombre de la categoría viene del LEFT JOIN en la DB */}
                  {(drink as any).category_name || 'Sin categoría'}
                </span>
              </div>
              <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{drink.name}</h3>
              <p className="text-2xl font-black text-blue-600 mt-2">
                ${drink.price.toLocaleString('es-CO')}
              </p>
              
              {/* Acciones */}
              <div className="flex gap-2 mt-6">
                <Link
                  href={`/admin/bebidas/${drink.id}/editar`}
                  className="flex-1 bg-gray-50 text-gray-700 text-center py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  Editar
                </Link>
                {/* Componente cliente para manejar el borrado con confirmación */}
                <DeleteButton drinkId={drink.id} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estado vacío si no hay bebidas */}
      {drinks.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 mt-8">
          <p className="text-gray-400 text-lg">No hay bebidas registradas aún.</p>
          <Link href="/admin/bebidas/nueva" className="text-blue-600 font-bold mt-2 inline-block">
            Empieza agregando una aquí
          </Link>
        </div>
      )}
    </div>
  );
}
