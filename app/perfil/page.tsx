/**
 * app/perfil/page.tsx
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [carouselImages, setCarouselImages] = useState<any[]>([]);

  useEffect(() => {
    fetchCarousel();
  }, []);

  if (!session) {
    router.push('/login');
    return null;
  }

  const user = session.user as any;

  const fetchCarousel = async () => {
    try {
      const res = await fetch('/api/carousel');
      if (res.ok) {
        const data = await res.json();
        setCarouselImages(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      setMessage({ text: 'Las contraseñas no coinciden', type: 'error' });
      return;
    }

    setLoading(true);
    const res = await fetch('/api/perfil/password', {
      method: 'POST',
      body: JSON.stringify(passwordData)
    });

    if (res.ok) {
      setMessage({ text: 'Contraseña actualizada con éxito', type: 'success' });
      setPasswordData({ current: '', new: '', confirm: '' });
    } else {
      const data = await res.json();
      setMessage({ text: data.error || 'Error al actualizar', type: 'error' });
    }
    setLoading(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/perfil/foto', { method: 'POST', body: formData });
    if (res.ok) {
      const { url } = await res.json();
      await update({ photo_url: url });
      window.location.reload();
    }
    setLoading(false);
  };

  const handleCarouselUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    await fetch('/api/carousel', { method: 'POST', body: formData });
    fetchCarousel();
    setLoading(false);
  };

  const handleDeleteCarousel = async (id: number) => {
    await fetch(`/api/carousel/${id}`, { method: 'DELETE' });
    fetchCarousel();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto pb-32">
      <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">CONFIGURACIÓN</h1>
      <p className="text-gray-500 mb-10 uppercase tracking-widest text-xs font-bold">Gestión de cuenta y contenido</p>

      {message.text && (
        <div className={`mb-8 p-4 rounded-2xl text-center font-bold text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Perfil */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 text-center h-fit">
          <div className="relative w-32 h-32 mx-auto mb-6 group">
            <div className="w-full h-full rounded-full bg-white/5 overflow-hidden border-2 border-amber-500/30 flex items-center justify-center">
              {user.photo_url ? (
                <img src={user.photo_url} className="w-full h-full object-cover" alt={user.name} />
              ) : (
                <span className="text-4xl text-gray-700 font-black">{user.name[0]}</span>
              )}
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <input type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
              <span className="text-white text-[10px] font-black uppercase">Cambiar</span>
            </label>
          </div>
          <h2 className="text-xl font-black text-white">{user.name} {user.apellido}</h2>
          <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mt-1">{user.role}</p>
        </div>

        {/* Seguridad */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 md:p-12">
          <h3 className="text-2xl font-black text-white mb-8">SEGURIDAD</h3>
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase ml-1">Contraseña Actual</label>
              <input 
                type="password" required
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-amber-500"
                value={passwordData.current}
                onChange={e => setPasswordData({...passwordData, current: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                type="password" placeholder="Nueva Contraseña" required
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-amber-500"
                value={passwordData.new}
                onChange={e => setPasswordData({...passwordData, new: e.target.value})}
              />
              <input 
                type="password" placeholder="Confirmar Nueva" required
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-amber-500"
                value={passwordData.confirm}
                onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-5 rounded-2xl text-lg">
              {loading ? 'ACTUALIZANDO...' : 'CAMBIAR CONTRASEÑA'}
            </button>
          </form>
        </div>
      </div>

      {/* Gestión de Carrusel */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 md:p-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-black text-white">CARRUSEL DE BIENVENIDA</h3>
            <p className="text-gray-600 text-xs mt-1 uppercase font-bold tracking-widest">Imágenes de la pantalla principal</p>
          </div>
          <label className="bg-amber-500 text-black px-6 py-3 rounded-2xl font-black text-sm cursor-pointer hover:bg-amber-400 transition-all active:scale-95">
            + SUBIR IMAGEN
            <input type="file" className="hidden" onChange={handleCarouselUpload} accept="image/*" />
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {carouselImages.map((img) => (
            <div key={img.id} className="relative aspect-video rounded-3xl overflow-hidden group border border-white/5 shadow-2xl">
              <img src={img.url} className="w-full h-full object-cover" alt="Carousel" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => handleDeleteCarousel(img.id)}
                  className="bg-red-500 text-white p-3 rounded-2xl hover:bg-red-600 transition-colors shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
          {carouselImages.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
              <p className="text-gray-600 font-bold italic">No hay imágenes en el carrusel</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
