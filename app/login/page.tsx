/**
 * app/login/page.tsx
 * 
 * Página de inicio de sesión con diseño premium.
 * Utiliza NextAuth (signIn) para autenticar contra las credenciales en Postgres.
 */

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Credenciales inválidas. Por favor intenta de nuevo.');
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError('Ocurrió un error inesperado.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-amber-500/10 rounded-full blur-[150px]"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#161b22] rounded-[2.5rem] border border-white/5 p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
              BIRRERIA <span className="text-amber-500">11•22</span>
            </h1>
            <p className="text-gray-500 font-medium">Acceso exclusivo para personal</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-2xl text-sm font-bold mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@birreria.com"
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black py-5 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-amber-500/20 active:scale-95 disabled:opacity-50 mt-4"
            >
              {loading ? 'INGRESANDO...' : 'ENTRAR AL SISTEMA'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-400 text-xs font-bold uppercase tracking-widest transition-colors"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
        
        <p className="text-center text-gray-700 text-[10px] font-black uppercase tracking-[0.3em] mt-8">
          Sistema de Gestión Birreria v1.0
        </p>
      </div>
    </div>
  );
}
