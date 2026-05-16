/**
 * app/admin/usuarios/page.tsx
 */

'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ email: '', name: '', password: '', role: 'mesero' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/usuarios');
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/usuarios', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      setShowModal(false);
      fetchUsers();
    }
  };

  const handleDeactivate = async (id: number) => {
    if (!confirm('¿Estás seguro de desactivar esta cuenta? El usuario ya no podrá ingresar.')) return;
    
    const res = await fetch(`/api/usuarios/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ active: false })
    });
    
    if (res.ok) {
      fetchUsers();
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">GESTIÓN DE PERSONAL</h1>
          <p className="text-gray-500">Administra los accesos del sistema</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-amber-500 text-black px-6 py-3 rounded-2xl font-black hover:bg-amber-600 transition-all"
        >
          + NUEVO USUARIO
        </button>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-[#161b22] border border-white/5 p-6 rounded-3xl flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${user.active ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
              <div>
                <h3 className="text-white font-bold text-lg">{user.name}</h3>
                <p className="text-gray-500 text-sm">{user.email} • <span className="uppercase font-black text-[10px] tracking-widest">{user.role}</span></p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {user.active ? 'ACTIVO' : 'INACTIVO'}
              </span>
              
              {user.active ? (
                <button 
                  onClick={() => handleDeactivate(user.id)}
                  className="bg-red-500/10 text-red-500 px-6 py-2 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all"
                >
                  DESACTIVAR
                </button>
              ) : (
                <span className="text-gray-600 text-xs font-bold italic px-2">Requiere activación por código</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Crear Usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#161b22] w-full max-w-md rounded-[2.5rem] border border-white/10 p-8">
            <h2 className="text-2xl font-black text-white mb-2">REGISTRAR NUEVO</h2>
            <p className="text-gray-500 text-sm mb-6">La cuenta estará ACTIVA al momento de guardarse.</p>
            <form onSubmit={handleCreate} className="space-y-4">
              <input 
                placeholder="Nombre completo"
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-amber-500"
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
              <input 
                type="email"
                placeholder="Email"
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-amber-500"
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
              <input 
                type="password"
                placeholder="Contraseña inicial"
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-amber-500"
                onChange={e => setFormData({...formData, password: e.target.value})}
                required
              />
              <select 
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-amber-500"
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option value="mesero">Mesero</option>
                <option value="admin">Administrador</option>
              </select>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-gray-500 font-bold">CANCELAR</button>
                <button type="submit" className="flex-1 bg-amber-500 text-black font-black rounded-2xl">GUARDAR Y ACTIVAR</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
