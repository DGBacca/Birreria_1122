/**
 * components/admin/DrinkForm.tsx
 * 
 * Componente de formulario para crear o editar bebidas.
 * Maneja el estado local para la carga de imágenes y el envío de datos a la API.
 */

'use client'; // Indica que este es un Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/types';

interface DrinkFormProps {
  categories: Category[];
  initialData?: any; // Datos iniciales si estamos en modo edición
}

export function DrinkForm({ categories, initialData }: DrinkFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialData?.image_url || '');

  /**
   * Maneja la subida de la imagen a Vercel Blob
   */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Enviamos el archivo a nuestra ruta de API /api/upload
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Error al subir imagen');

      const { url } = await res.json();
      // Guardamos la URL generada para mostrar una vista previa y enviarla luego con el formulario
      setImagePreview(url);
    } catch (error) {
      alert('Error al subir la imagen. Por favor intenta de nuevo.');
      console.error(error);
    }
  };

  /**
   * Maneja el envío del formulario completo
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Recolectamos todos los datos del formulario usando FormData
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      price: parseFloat(formData.get('price') as string),
      description: formData.get('description'),
      category_id: parseInt(formData.get('category_id') as string),
      image_url: imagePreview,
      stock: parseInt(formData.get('stock') as string),
      // Características técnicas adicionales
      content: formData.get('content'),
      style: formData.get('style'),
      color: formData.get('color'),
      flavor: formData.get('flavor'),
      aroma: formData.get('aroma'),
      alcohol_content: formData.get('alcohol_content'),
      body: formData.get('body'),
      presentation: formData.get('presentation'),
      pairing: formData.get('pairing'),
    };

    try {
      // Determinamos si es creación (POST) o edición (PUT)
      const method = initialData ? 'PUT' : 'POST';
      const url = initialData ? `/api/bebidas/${initialData.id}` : '/api/bebidas';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Error al guardar los datos');

      // Redirigir a la lista y refrescar los Server Components
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
              name="name"
              required
              placeholder="Ej: Erdinger Pikantus 500ml"
              defaultValue={initialData?.name}
              className="w-full border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Precio (S) *</label>
            <input
              type="number"
              name="price"
              step="0.01"
              required
              placeholder="0.00"
              defaultValue={initialData?.price}
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
            name="description"
            rows={3}
            placeholder="Escribe una breve descripción para el cliente..."
            defaultValue={initialData?.description}
            className="w-full border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none border resize-none"
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
          Características Técnicas (Específicas)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Contenido</label>
            <input type="text" name="content" placeholder="ej: 500ml" defaultValue={initialData?.content} className="technical-input" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Estilo</label>
            <input type="text" name="style" placeholder="ej: Weizenbock" defaultValue={initialData?.style} className="technical-input" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Color</label>
            <input type="text" name="color" placeholder="ej: Marrón oscuro" defaultValue={initialData?.color} className="technical-input" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Graduación Alcohólica</label>
            <input type="text" name="alcohol_content" placeholder="ej: 7.3%" defaultValue={initialData?.alcohol_content} className="technical-input" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Cuerpo</label>
            <input type="text" name="body" placeholder="ej: Pleno y aterciopelado" defaultValue={initialData?.body} className="technical-input" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Presentación</label>
            <input type="text" name="presentation" placeholder="ej: Botella de vidrio" defaultValue={initialData?.presentation} className="technical-input" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Sabor</label>
            <textarea name="flavor" rows={2} placeholder="Notas de malta, caramelo..." defaultValue={initialData?.flavor} className="technical-input resize-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Aroma</label>
            <textarea name="aroma" rows={2} placeholder="Aromas frutales, clavo..." defaultValue={initialData?.aroma} className="technical-input resize-none" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">Maridaje Sugerido</label>
            <textarea name="pairing" rows={2} placeholder="Carnes ahumadas, quesos curados..." defaultValue={initialData?.pairing} className="technical-input resize-none" />
          </div>
        </div>
      </div>

      {/* Botones de acción */}
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

      {/* Estilos locales para inputs técnicos */}
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
