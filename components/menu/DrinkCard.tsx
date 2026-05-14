/**
 * components/menu/DrinkCard.tsx
 * 
 * Componente que muestra una bebida en el menú público.
 * Incluye un modal (popup) con el detalle técnico completo al hacer clic.
 */

'use client';

import { useState } from 'react';
import { Drink } from '@/types';

export function DrinkCard({ drink }: { drink: Drink }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Tarjeta de la Bebida */}
      <div
        onClick={() => setShowModal(true)}
        className="group bg-[#161b22] rounded-3xl overflow-hidden border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer"
      >
        <div className="relative h-64 overflow-hidden">
          {drink.image_url ? (
            <img
              src={drink.image_url}
              alt={drink.nombre}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-[#1c2128] flex items-center justify-center text-gray-600">
              No disponible
            </div>
          )}
          {/* Badge de Estilo */}
          {drink.estilo && (
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-amber-500 border border-amber-500/20">
              {drink.estilo}
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h3 className="font-bold text-xl mb-1 line-clamp-1">{drink.nombre}</h3>
          <p className="text-gray-500 text-sm mb-4">{drink.contenido || 'Presentación estándar'}</p>
          <div className="flex justify-between items-center">
            <p className="text-2xl font-black text-amber-500">
              ${drink.precio.toLocaleString('es-CO')}
            </p>
            <button className="bg-white/5 hover:bg-amber-500 hover:text-black p-2 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Detalle Técnico (Glassmorphism Effect) */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-md"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-[#0d1117] rounded-[2.5rem] max-w-6xl w-full max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Columna Izquierda: Imagen */}
            <div className="md:w-1/2 h-64 md:h-auto relative bg-[#161b22]">
              {drink.image_url ? (
                <img
                  src={drink.image_url}
                  alt={drink.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-700">No hay imagen</div>
              )}
              {/* Botón Cerrar (Mobile) */}
              <button 
                onClick={() => setShowModal(false)}
                className="md:hidden absolute top-4 right-4 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            
            {/* Columna Derecha: Contenido */}
            <div className="md:w-1/2 p-6 md:p-12 overflow-y-auto bg-gradient-to-br from-[#0d1117] to-[#161b22]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl md:text-5xl font-black mb-2 text-white leading-tight">{drink.nombre}</h2>
                  <p className="text-4xl font-black text-amber-500">
                    ${drink.precio.toLocaleString('es-CO')}
                  </p>
                </div>
                {/* Botón Cerrar (Desktop) */}
                <button 
                  onClick={() => setShowModal(false)}
                  className="hidden md:flex bg-white/5 text-white w-12 h-12 rounded-full items-center justify-center hover:bg-amber-500 hover:text-black transition-all"
                >
                  ✕
                </button>
              </div>

              {drink.descripcion && (
                <div className="mb-6">
                  <p className="text-gray-400 leading-relaxed text-lg font-medium">
                    {drink.descripcion}
                  </p>
                </div>
              )}

              {drink.caracteristicas && (
                <div className="mb-10 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-amber-500 text-xs font-black uppercase tracking-widest block mb-2">Destacado:</span>
                  <p className="text-gray-300 italic text-sm">{drink.caracteristicas}</p>
                </div>
              )}

              {/* Ficha Técnica Estructurada */}
              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-black uppercase tracking-[0.2em] text-amber-500">
                    Características
                  </h3>
                  <div className="h-px flex-1 bg-amber-500/20"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  <TechInfo label="Contenido" value={drink.contenido} />
                  <TechInfo label="Estilo" value={drink.estilo} />
                  <TechInfo label="Color" value={drink.color} />
                  <TechInfo label="Aroma" value={drink.aroma} />
                  <TechInfo label="Sabor" value={drink.sabor} />
                  <TechInfo label="Cuerpo" value={drink.cuerpo} />
                  <TechInfo label="Graduación alcohólica" value={drink.alcohol} />
                  <TechInfo label="Maridaje recomendado" value={drink.maridaje} />
                  <TechInfo label="Presentación" value={drink.presentacion} />
                  <TechInfo label="Origen" value={drink.origen} />
                  <TechInfo label="Cervecera / Marca" value={drink.cervecera} />
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-full mt-12 bg-amber-500 hover:bg-amber-600 text-black py-5 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-amber-500/20 active:scale-95"
              >
                CERRAR DETALLE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Componente interno para mostrar pares clave-valor técnicos
 */
function TechInfo({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col border-l-2 border-amber-500/10 pl-4 py-1 hover:border-amber-500 transition-colors group">
      <span className="text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest group-hover:text-amber-500/70 transition-colors">{label}:</span>
      <span className="text-gray-200 font-semibold text-sm leading-relaxed">{value}</span>
    </div>
  );
}
