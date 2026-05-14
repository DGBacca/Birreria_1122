/**
 * app/admin/bebidas/[id]/editar/page.tsx
 * 
 * Página para editar una bebida existente.
 * Obtiene los datos actuales de la bebida y las categorías.
 */

import { db } from '@/lib/db';
import { DrinkForm } from '@/components/admin/DrinkForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditarBebidaPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const drinkId = parseInt(id);

  // Cargamos los datos en paralelo
  const [drink, categories] = await Promise.all([
    db.getDrinkById(drinkId),
    db.getCategories()
  ]);

  if (!drink) {
    notFound();
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link 
        href="/admin/bebidas" 
        className="text-blue-600 hover:underline mb-4 inline-block flex items-center gap-2"
      >
        ← Volver a la lista
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Editar Bebida: {drink.nombre}</h1>
        <p className="text-gray-500">Actualiza la información técnica o comercial del producto</p>
      </div>

      {/* Pasamos los datos actuales al formulario mediante initialData */}
      <DrinkForm categories={categories} initialData={drink} />
    </div>
  );
}
