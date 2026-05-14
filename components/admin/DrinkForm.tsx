'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category, Drink } from '@/types';

interface DrinkFormProps {
  categories: Category[];
  initialData?: Drink; // Usamos el tipo Drink correctamente
}

export function DrinkForm({ categories, initialData }: DrinkFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialData?.image_url || '');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Error al subir imagen');

      const { url } = await res.json();
      setImagePreview(url);
    } catch (error) {
      alert('Error al subir la imagen. Por favor intenta de nuevo.');
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      nombre: formData.get('nombre'),
      precio: parseFloat(formData.get('precio') as string),
      descripcion: formData.get('descripcion'),
      caracteristicas: formData.get('caracteristicas'),
      category_id: parseInt(formData.get('category_id') as string),
      image_url: imagePreview,
      stock: parseInt(formData.get('stock') as string),
      contenido: formData.get('contenido'),
      estilo: formData.get('estilo'),
      color: formData.get('color'),
      sabor: formData.get('sabor'),
      aroma: formData.get('aroma'),
      alcohol: formData.get('alcohol'),
      cuerpo: formData.get('cuerpo'),
      presentacion: formData.get('presentacion'),
      maridaje: formData.get('maridaje'),
      origen: formData.get('origen'),
      cervecera: formData.get('cervecera'),
      active: true,
    };

    try {
      const method = initialData ? 'PUT' : 'POST';
      const url = initialData ? `/api/bebidas/${initialData.id}` : '/api/bebidas';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Error al guardar los datos');

      router.push('/admin/bebidas');
      router.refresh();
    } catch (error) {
      alert('Error al guardar la bebida.');
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Sección 1: Información Básica */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
          Información Básica
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Nombre de la bebida *</label>
            <input
              type="text"
              name="nombre"
              required
              placeholder="Ej: Erdinger Pikantus 500ml"
              defaultValue={initialData?.nombre}
              className="w-full border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Precio (S) *</label>
            <input
              type="number"
              name="precio"
              step="1"
              required
              placeholder="0"
              defaultValue={initialData?.precio}
              className="w-full border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Categoría *</label>
            <select
              name="category_id"
              required
              defaultValue={initialData?.category_id}
              className="w-full border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none border bg-white"
            >
              <option value="">Seleccionar una categoría...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Stock Inicial</label>
            <input
              type="number"
              name="stock"
              defaultValue={initialData?.stock || 0}
              className="w-full border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none border"
            />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <label className="text-sm font-semibold text-gray-700">Descripción Comercial</label>
          <textarea
            name="descripcion"
            rows={3}
            placeholder="Escribe una breve descripción para el cliente..."
            defaultValue={initialData?.descripcion}
            className="w-full border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none border resize-none"
          />
        </div>

        <div className="mt-4 space-y-2">
          <label className="text-sm font-semibold text-gray-700">Características Destacadas</label>
          <input
            type="text"
            name="caracteristicas"
            placeholder="Ej: Medalla de oro 2023, Edición limitada..."
            defaultValue={initialData?.caracteristicas}
            className="w-full border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none border"
          />
        </div>
      </div>

      {/* Sección 2: Multimedia */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
          Imagen del Producto
        </h3>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 w-full">
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="file-upload"
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-blue-600 font-semibold text-lg mb-1">Haz clic para subir</div>
                <p className="text-gray-400 text-sm">PNG, JPG hasta 5MB</p>
              </label>
            </div>
          </div>
          
          {imagePreview && (
            <div className="w-full md:w-64 h-48 relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={() => setImagePreview('')}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs"
              >
                Remover
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sección 3: Ficha Técnica */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
          Ficha Técnica
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Contenido</label>
            <input type="text" name="contenido" placeholder="ej: 500ml" defaultValue={initialData?.contenido} className="technical-input" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Estilo</label>
            <input type="text" name="estilo" placeholder="ej: Weizenbock" defaultValue={initialData?.estilo} className="technical-input" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Color</label>
            <input type="text" name="color" placeholder="ej: Marrón oscuro" defaultValue={initialData?.color} className="technical-input" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Graduación Alcohólica</label>
            <input type="text" name="alcohol" placeholder="ej: 7.3%" defaultValue={initialData?.alcohol} className="technical-input" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Cuerpo</label>
            <input type="text" name="cuerpo" placeholder="ej: Pleno y aterciopelado" defaultValue={initialData?.cuerpo} className="technical-input" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Presentación</label>
            <input type="text" name="presentacion" placeholder="ej: Botella de vidrio" defaultValue={initialData?.presentacion} className="technical-input" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Origen</label>
            <input type="text" name="origen" placeholder="ej: Alemania" defaultValue={initialData?.origen} className="technical-input" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Cervecera / Marca</label>
            <input type="text" name="cervecera" placeholder="ej: Erdinger" defaultValue={initialData?.cervecera} className="technical-input" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Sabor</label>
            <textarea name="sabor" rows={2} placeholder="Notas de malta, caramelo..." defaultValue={initialData?.sabor} className="technical-input resize-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Aroma</label>
            <textarea name="aroma" rows={2} placeholder="Aromas frutales, clavo..." defaultValue={initialData?.aroma} className="technical-input resize-none" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">Maridaje Sugerido</label>
            <textarea name="maridaje" rows={2} placeholder="Carnes ahumadas, quesos curados..." defaultValue={initialData?.maridaje} className="technical-input resize-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-4 sticky bottom-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all"
        >
          {loading ? 'Procesando...' : initialData ? 'Actualizar Bebida' : 'Guardar Bebida'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-4 border-2 border-gray-100 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
        >
          Cancelar
        </button>
      </div>

      <style jsx>{`
        .technical-input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          transition: all 0.2s;
          outline: none;
        }
        .technical-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </form>
  );
}
