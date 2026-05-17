/**
 * app/admin/categorias/page.tsx
 *
 * Panel exclusivo del administrador para gestionar las imágenes
 * de portada de cada categoría del menú.
 */

'use client';

import { useState, useEffect } from 'react';

interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
}

export default function CategoriasAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const res = await fetch('/api/categorias');
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    categoryId: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(categoryId);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`/api/categorias/${categoryId}/imagen`, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      await fetchCategories();
    }
    setUploadingId(null);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <p className="text-amber-500 text-xs font-black uppercase tracking-[0.3em] mb-2">Administración</p>
          <h1 className="text-4xl font-black text-white tracking-tighter">IMÁGENES DE CATEGORÍAS</h1>
          <p className="text-gray-600 mt-2 text-sm">
            Asigna una foto de portada a cada categoría. Aparecerán como fondo en la pantalla del menú.
          </p>
        </div>

        {/* Grid de categorías */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="aspect-square bg-white/5 rounded-[1.75rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {categories.map((category) => (
              <div key={category.id} className="flex flex-col gap-3">
                {/* Tarjeta de previsualización */}
                <div className="relative aspect-square rounded-[1.75rem] overflow-hidden border border-white/10 group bg-[#0a0a0a]">
                  {/* Imagen actual */}
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-gray-700 text-xs font-black uppercase tracking-widest text-center px-4">
                        Sin imagen
                      </p>
                    </div>
                  )}

                  {/* Gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  {/* Overlay de carga */}
                  {uploadingId === category.id && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
                      <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                    </div>
                  )}

                  {/* Botón de cambiar (hover) */}
                  <label className="absolute inset-0 flex items-end justify-center pb-5 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <span className="bg-amber-500 text-black text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-xl">
                      {category.image_url ? 'CAMBIAR' : 'SUBIR IMAGEN'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, category.id)}
                    />
                  </label>

                  {/* Nombre siempre visible */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
                    <p className="text-white font-black text-sm leading-tight">
                      {category.name.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Estado debajo de la tarjeta */}
                <div className="flex items-center gap-2 px-1">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${category.image_url ? 'bg-green-500' : 'bg-red-500/50'}`} />
                  <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">
                    {category.image_url ? 'Con imagen' : 'Sin imagen'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Instrucciones */}
        <div className="mt-12 p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10">
          <p className="text-amber-500/70 text-xs font-bold uppercase tracking-widest mb-2">📌 Cómo funciona</p>
          <ul className="text-gray-500 text-sm space-y-1">
            <li>• Pasa el cursor sobre una categoría y haz clic en el botón que aparece.</li>
            <li>• Sube una foto representativa de esa categoría (ej: foto de cervezas para "Cerveza").</li>
            <li>• La imagen aparecerá automáticamente como fondo de ese cuadro en el menú del cliente.</li>
            <li>• Se recomiendan fotos cuadradas o verticales para mejor visualización.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
