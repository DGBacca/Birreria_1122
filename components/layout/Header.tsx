/**
 * components/layout/Header.tsx
 */

'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function HeaderContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const table = searchParams.get('table');
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
      {/* Logo y Mesa */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black text-white tracking-tighter">
            BIRRERIA <span className="text-amber-500">11•22</span>
          </span>
        </Link>
        {table && (
          <div className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-[10px] font-black border border-amber-500/20 uppercase">
            Mesa #{table}
          </div>
        )}
      </div>

      {/* Navegación Derecha */}
      <div className="flex items-center gap-6">
        <Link href="/menu" className="text-gray-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors">
          MENÚ
        </Link>

        {session ? (
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 bg-white/5 hover:bg-white/10 p-1 pr-4 rounded-full transition-all border border-white/10"
            >
              <div className="w-8 h-8 rounded-full bg-amber-500 overflow-hidden flex items-center justify-center border border-white/20">
                {(session.user as any).photo_url ? (
                  <img src={(session.user as any).photo_url} className="w-full h-full object-cover" alt="Perfil" />
                ) : (
                  <span className="text-black font-black text-xs">{session.user?.name?.[0]}</span>
                )}
              </div>
              <span className="text-white text-xs font-bold uppercase tracking-tight hidden sm:block">
                {session.user?.name?.split(' ')[0]}
              </span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-56 bg-[#1c2128] border border-white/10 rounded-2xl shadow-2xl py-2 z-50">
                <div className="px-4 py-3 border-b border-white/5 mb-2">
                  <p className="text-white text-sm font-bold truncate">{session.user?.name}</p>
                  <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">{(session.user as any).role}</p>
                </div>
                
                <Link href="/perfil" className="block px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 text-sm font-bold transition-colors">
                  MI PERFIL
                </Link>
                
                {(session.user as any).role === 'admin' && (
                  <>
                    <Link href="/admin" className="block px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 text-sm font-bold transition-colors">
                      ADMINISTRACIÓN
                    </Link>
                    <Link href="/admin/usuarios" className="block px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 text-sm font-bold transition-colors">
                      GESTIÓN PERSONAL
                    </Link>
                  </>
                )}

                <button 
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-500/10 text-sm font-bold transition-colors mt-2 pt-2 border-t border-white/5"
                >
                  CERRAR SESIÓN
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link 
            href="/login" 
            className="text-[10px] font-black text-gray-600 hover:text-amber-500 transition-colors uppercase tracking-[0.2em]"
          >
            Acceso Staff
          </Link>
        )}
      </div>
    </div>
  );
}

export default function Header() {
  return (
    <header className="bg-[#0f1115]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 h-20">
      <Suspense fallback={<div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between opacity-50">Cargando...</div>}>
        <HeaderContent />
      </Suspense>
    </header>
  );
}
