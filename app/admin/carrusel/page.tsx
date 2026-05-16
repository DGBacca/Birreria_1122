/**
 * app/admin/carrusel/page.tsx
 *
 * Panel exclusivo del administrador para gestionar las imágenes del carrusel
 * de la pantalla de bienvenida. Sin necesidad de tocar código fuente.
 */

'use client';

import { useState, useEffect } from 'react';

interface CarouselImage {
  id: number;
  url: string;
  alt_text?: string;
  created_at?: string;
}

export default function CarouselAdminPage() {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/carousel');
      const data = await res.json();
      setImages(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      await fetch('/api/carousel', { method: 'POST', body: formData });
    }
    await fetchImages();
    setUploading(false);
    // Limpiar el input para permitir subir el mismo archivo de nuevo
    e.target.value = '';
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta imagen del carrusel?')) return;
    await fetch(`/api/carousel/${id}`, { method: 'DELETE' });
    setImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">

        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div>
            <p className="text-amber-500 text-xs font-black uppercase tracking-[0.3em] mb-2">Administración</p>
            <h1 className="text-4xl font-black text-white tracking-tighter">CARRUSEL DE BIENVENIDA</h1>
            <p className="text-gray-600 mt-2 text-sm">
              Las imágenes que subas aquí aparecerán automáticamente en la pantalla de inicio para tus clientes.
            </p>
          </div>
          <label className={`relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-base cursor-pointer transition-all active:scale-95 shadow-2xl shadow-amber-500/20 ${uploading ? 'bg-amber-500/50 text-black/50 cursor-wait' : 'bg-amber-500 hover:bg-amber-400 text-black'}`}>
            {uploading ? (
              <>
                <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                SUBIENDO...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                SUBIR IMÁGENES
              </>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Contador */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-white/5"></div>
          <span className="text-gray-600 text-xs font-black uppercase tracking-widest">
            {images.length} {images.length === 1 ? 'imagen' : 'imágenes'} en el carrusel
          </span>
          <div className="h-px flex-1 bg-white/5"></div>
        </div>

        {/* Grid de imágenes */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-video bg-white/5 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="py-32 text-center bg-white/3 rounded-[2.5rem] border border-dashed border-white/10">
            <div className="text-6xl mb-6">🖼</div>
            <p className="text-gray-500 font-bold text-lg">No hay imágenes en el carrusel</p>
            <p className="text-gray-700 text-sm mt-2">Sube la primera usando el botón de arriba</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {images.map((img, index) => (
              <div key={img.id} className="relative aspect-video rounded-3xl overflow-hidden group border border-white/10 shadow-xl">
                <img
                  src={img.url}
                  alt={img.alt_text || `Carrusel ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay con número y botón borrar */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                  <span className="text-white/60 text-xs font-black uppercase tracking-widest">
                    #{index + 1}
                  </span>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-black transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    ELIMINAR
                  </button>
                </div>

                {/* Indicador de orden */}
                <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Nota informativa */}
        <div className="mt-12 p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10">
          <p className="text-amber-500/70 text-xs font-bold uppercase tracking-widest mb-1">📌 Nota</p>
          <p className="text-gray-500 text-sm">
            Las imágenes se muestran en el carrusel en el orden en que fueron subidas. 
            Puedes subir varias imágenes a la vez. Se recomiendan imágenes horizontales (16:9) para mejor visualización.
          </p>
        </div>
      </div>
    </div>
  );
}
