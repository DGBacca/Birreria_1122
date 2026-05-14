/**
 * app/api/upload/route.ts
 * 
 * Ruta de API para la carga de imágenes.
 * Utiliza Vercel Blob Storage para almacenar los archivos de forma persistente.
 * Solo accesible para administradores.
 */

import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  // Verificar autorización
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    // Obtener el archivo del cuerpo de la solicitud (multipart/form-data)
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No se encontró ningún archivo para subir' }, { status: 400 });
    }

    // Subir el archivo a Vercel Blob
    // 'access: public' permite que la imagen sea visible mediante su URL
    const blob = await put(file.name, file, {
      access: 'public',
    });

    // Retornar la URL generada para que el frontend la guarde en la DB de bebidas
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Error al subir imagen a Vercel Blob:', error);
    return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 });
  }
}
