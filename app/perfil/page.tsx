/**
 * app/perfil/page.tsx
 */

'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  if (!session) {
    router.push('/login');
    return null;
  }

  const user = session.user as any;

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

    const res = await fetch('/api/perfil/foto', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      const { url } = await res.json();
      await update({ photo_url: url });
      setMessage({ text: 'Foto actualizada con éxito', type: 'success' });
      window.location.reload();
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-black text-white mb-2">MI PERFIL</h1>
      <p className="text-gray-500 mb-10 uppercase tracking-widest text-xs font-bold">Personalización de cuenta de staff</p>

      {message.text && (
        <div className={`mb-8 p-4 rounded-2xl text-center font-bold text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Lado Izquierdo: Foto y Datos Fijos */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-[#161b22] border border-white/5 rounded-[2.5rem] p-8 text-center">
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
            
            <h2 className="text-xl font-black text-white">{user.name}</h2>
            <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mt-1">{user.role}</p>
            
            <div className="mt-8 pt-8 border-t border-white/5 text-left space-y-4">
              <div>
                <p className="text-[10px] font-black text-gray-600 uppercase">Cédula</p>
                <p className="text-white text-sm font-medium">{user.cedula || 'No registrada'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-600 uppercase">Teléfono</p>
                <p className="text-white text-sm font-medium">{user.telefono || 'No registrado'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Cambio de Contraseña */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#161b22] border border-white/5 rounded-[2.5rem] p-8 md:p-12">
            <h3 className="text-2xl font-black text-white mb-8">SEGURIDAD</h3>
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase ml-1">Contraseña Actual</label>
                <input 
                  type="password"
                  required
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-amber-500"
                  value={passwordData.current}
                  onChange={e => setPasswordData({...passwordData, current: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase ml-1">Nueva Contraseña</label>
                  <input 
                    type="password"
                    required
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-amber-500"
                    value={passwordData.new}
                    onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase ml-1">Confirmar Nueva</label>
                  <input 
                    type="password"
                    required
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-amber-500"
                    value={passwordData.confirm}
                    onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-5 rounded-2xl text-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'ACTUALIZANDO...' : 'CAMBIAR CONTRASEÑA'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
