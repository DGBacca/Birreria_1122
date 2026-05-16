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
  const [formData, setFormData] = useState({ 
    email: '', 
    name: '', 
    apellido: '',
    cedula: '',
    telefono: '',
    direccion: '',
    password: '', 
    role: 'mesero' 
  });

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
          <p className="text-gray-500">Registra y administra las fichas legales de tus empleados</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-amber-500 text-black px-6 py-3 rounded-2xl font-black hover:bg-amber-600 transition-all"
        >
          + NUEVO EMPLEADO
        </button>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-[#161b22] border border-white/5 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 overflow-hidden flex items-center justify-center border border-white/10">
                {user.photo_url ? (
                  <img src={user.photo_url} className="w-full h-full object-cover" alt={user.name} />
                ) : (
                  <span className="text-gray-700 font-black">{user.name[0]}{user.apellido ? user.apellido[0] : ''}</span>
                )}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{user.name} {user.apellido}</h3>
                <p className="text-gray-500 text-xs">CC: {user.cedula || 'N/A'} • {user.email}</p>
                <div className="flex gap-2 mt-1">
                  <span className="bg-amber-500/10 text-amber-500 text-[10px] font-black px-2 py-0.5 rounded uppercase">{user.role}</span>
                  {user.active ? (
                    <span className="bg-green-500/10 text-green-500 text-[10px] font-black px-2 py-0.5 rounded uppercase">ACTIVO</span>
                  ) : (
                    <span className="bg-red-500/10 text-red-500 text-[10px] font-black px-2 py-0.5 rounded uppercase">INACTIVO</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col text-right">
              <p className="text-gray-400 text-xs font-medium">{user.telefono || 'Sin teléfono'}</p>
              <p className="text-gray-600 text-[10px]">{user.direccion || 'Sin dirección'}</p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              {user.active ? (
                <button 
                  onClick={() => handleDeactivate(user.id)}
                  className="flex-1 md:flex-none bg-red-500/10 text-red-500 px-6 py-2 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all"
                >
                  DESACTIVAR
                </button>
              ) : (
                <span className="text-gray-600 text-xs font-bold italic px-2">Solo reactivación por código</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Crear Usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#161b22] w-full max-w-2xl rounded-[2.5rem] border border-white/10 p-10 overflow-y-auto max-h-[90vh]">
            <h2 className="text-3xl font-black text-white mb-2">FICHA DE EMPLEADO</h2>
            <p className="text-gray-500 text-sm mb-8">Ingresa los datos legales para el registro de nómina.</p>
            
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase ml-1">Nombre</label>
                  <input 
                    placeholder="Ej: Juan"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-amber-500"
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase ml-1">Apellido</label>
                  <input 
                    placeholder="Ej: Pérez"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-amber-500"
                    onChange={e => setFormData({...formData, apellido: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase ml-1">Cédula de Ciudadanía</label>
                  <input 
                    placeholder="Ej: 10203040"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-amber-500"
                    onChange={e => setFormData({...formData, cedula: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase ml-1">Teléfono Móvil</label>
                  <input 
                    placeholder="Ej: 3001234567"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-amber-500"
                    onChange={e => setFormData({...formData, telefono: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase ml-1">Dirección de Residencia</label>
                <input 
                  placeholder="Ej: Calle 10 # 5-20, Barrio Central"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-amber-500"
                  onChange={e => setFormData({...formData, direccion: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase ml-1">Correo Electrónico (Acceso)</label>
                  <input 
                    type="email"
                    placeholder="juan@birreria.com"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-amber-500"
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase ml-1">Contraseña Inicial</label>
                  <input 
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-amber-500"
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase ml-1">Rol en el Negocio</label>
                <select 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="mesero">Mesero / Staff</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 text-gray-500 font-bold uppercase tracking-widest text-sm">CANCELAR</button>
                <button type="submit" className="flex-[2] bg-amber-500 text-black font-black py-5 rounded-2xl text-lg shadow-2xl shadow-amber-500/20 active:scale-95 transition-all">
                  REGISTRAR Y ACTIVAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
