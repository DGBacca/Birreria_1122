/**
 * app/admin/bebidas/nueva/page.tsx
 * 
 * Página para la creación de una nueva bebida.
 * Obtiene las categorías de la base de datos y se las pasa al componente DrinkForm.
 */

import { db } from '@/lib/db';
import { DrinkForm } from '@/components/admin/DrinkForm';
import Link from 'next/link';

export default async function NuevaBebidaPage() {
  // Obtenemos las categorías para el selector del formulario
  const categories = await db.getCategories();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Botón para volver atrás */}
      <Link 
        href="/admin/bebidas" 
        className="text-blue-600 hover:underline mb-4 inline-block flex items-center gap-2"
      >
        ← Volver a la lista
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Agregar Nueva Bebida</h1>
        <p className="text-gray-500">Completa la información básica y técnica del producto</p>
      </div>

      {/* Renderizamos el formulario (Client Component) pasando las categorías obtenidas en el servidor */}
      <DrinkForm categories={categories} />
    </div>
  );
}
