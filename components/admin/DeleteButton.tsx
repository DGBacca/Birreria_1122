/**
 * components/admin/DeleteButton.tsx
 * 
 * Componente cliente para manejar el borrado de una bebida.
 * Incluye una confirmación nativa del navegador antes de ejecutar la acción.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DeleteButton({ drinkId }: { drinkId: number }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Confirmación de seguridad
    if (!confirm('¿Estás seguro de que deseas eliminar esta bebida? Esta acción no se puede deshacer.')) {
      return;
    }

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/bebidas/${drinkId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Refrescamos la página para actualizar la lista de bebidas
        router.refresh();
      } else {
        alert('Ocurrió un error al intentar eliminar la bebida.');
      }
    } catch (error) {
      console.error('Error al borrar bebida:', error);
      alert('Error de conexión con el servidor.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors border border-red-100 disabled:opacity-50"
    >
      {isDeleting ? 'Borrando...' : 'Borrar'}
    </button>
  );
}
