/**
 * app/admin/branding/page.tsx
 *
 * Panel de administración para configurar el Logotipo de Marca de la Birreria.
 */

'use client';

import { useState, useEffect } from 'react';

export default function BrandingAdminPage() {
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    fetchLogo();
  }, []);

  const fetchLogo = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/branding');
      const data = await res.json();
      if (data.logoUrl) {
        setLogoUrl(data.logoUrl);
      } else {
        setLogoUrl('');
      }
    } catch (e) {
      console.error(e);
      setError('No se pudo cargar el logotipo actual.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecciona un archivo de imagen válido.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/branding', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setLogoUrl(data.logoUrl);
        setSuccess('¡Logotipo actualizado con éxito!');
        // Despachar evento para refrescar la cabecera en tiempo real
        window.location.reload();
      } else {
        setError(data.error || 'Ocurrió un error al subir el logotipo.');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión al subir el logotipo.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleReset = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar tu logotipo personalizado y restaurar el texto original?')) {
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('action', 'reset');

      const res = await fetch('/api/branding', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setLogoUrl('');
        setSuccess('¡Logotipo personalizado eliminado! Se restauró el texto original.');
        // Despachar evento para refrescar la cabecera en tiempo real
        window.location.reload();
      } else {
        setError(data.error || 'Ocurrió un error al restaurar el logotipo.');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión al restaurar el logotipo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Encabezado */}
        <div className="mb-12">
          <p className="text-amber-500 text-xs font-black uppercase tracking-[0.3em] mb-2">Administración</p>
          <h1 className="text-4xl font-black tracking-tighter">LOGOTIPO DE MARCA</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Personaliza el logotipo que aparece en la barra de navegación superior de la aplicación para tus clientes y meseros.
          </p>
        </div>

        {/* Notificaciones */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold flex items-center gap-3">
            <span>❌</span> {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold flex items-center gap-3 animate-fade-in">
            <span>✨</span> {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tarjeta de estado actual */}
          <div className="bg-white/3 border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-between min-h-[350px]">
            <div className="w-full text-center">
              <span className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-6">
                VISTA PREVIA ACTUAL
              </span>
              
              <div className="h-32 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-center p-6 mb-6 overflow-hidden relative group">
                {loading ? (
                  <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                ) : logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo Birreria Actual"
                    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <span className="text-2xl font-black tracking-tighter text-white/50">
                    BIRRERIA <span className="text-amber-500/50">11•22</span>
                  </span>
                )}
              </div>
            </div>

            <div className="w-full text-center">
              <p className="text-gray-500 text-xs font-bold mb-4">
                {logoUrl ? 'Actualmente usando logotipo de imagen personalizado' : 'Actualmente usando logotipo de texto (Código Fallback)'}
              </p>
              {logoUrl && (
                <button
                  onClick={handleReset}
                  disabled={uploading || loading}
                  className="px-6 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-500 hover:text-red-400 text-xs font-black tracking-wider uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  RESTAURAR ORIGINAL
                </button>
              )}
            </div>
          </div>

          {/* Tarjeta de acciones y subida */}
          <div className="bg-white/3 border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-between min-h-[350px]">
            <div>
              <span className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-4">
                SUBIR NUEVO LOGOTIPO
              </span>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Elige una imagen transparente (preferiblemente en formato **PNG** o **SVG** y con orientación horizontal) para que luzca óptima y elegante sobre el fondo negro de la barra de navegación.
              </p>
            </div>

            <div className="w-full">
              <label
                className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 hover:border-amber-500/50 rounded-3xl cursor-pointer transition-all duration-300 bg-white/2 hover:bg-amber-500/5 ${
                  uploading ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {uploading ? (
                    <>
                      <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-sm font-bold text-amber-500">SUBIENDO LOGOTIPO...</p>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl mb-3">🖼</span>
                      <p className="mb-2 text-sm text-gray-400 font-bold">
                        <span className="text-amber-500">Haz clic</span> o arrastra tu logo
                      </p>
                      <p className="text-xs text-gray-600 font-bold">PNG, JPG, SVG, WEBP (Máx. 4MB)</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                  disabled={uploading || loading}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Recomendaciones de Diseño */}
        <div className="mt-12 p-8 rounded-[2rem] bg-amber-500/5 border border-amber-500/10">
          <p className="text-amber-500 text-sm font-black uppercase tracking-widest mb-3">
            📌 RECOMENDACIONES DE DISEÑO PREMIUM
          </p>
          <ul className="text-gray-400 text-sm space-y-2 leading-relaxed list-disc list-inside">
            <li>**Fondo Transparente:** Usa imágenes con canal Alfa (PNG o SVG) para evitar cuadros blancos antiestéticos.</li>
            <li>**Proporciones:** Los logotipos horizontales o cuadrados con altura moderada se renderizan mejor en la cabecera de 20rem (h-12).</li>
            <li>**Color:** Diseños con tonalidades doradas, ámbar, blancas o grises contrastan perfectamente con la identidad oscura de Birreria.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
