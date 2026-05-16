/**
 * app/api/perfil/foto/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = (session.user as any).id;

    if (!file) {
      return NextResponse.json({ error: 'No se subió ningún archivo' }, { status: 400 });
    }

    // Subir a Vercel Blob
    const blob = await put(`profiles/${userId}-${Date.now()}-${file.name}`, file, {
      access: 'public',
    });

    // Actualizar en base de datos
    await db.updateUser(userId, { photo_url: blob.url });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json({ error: 'Error al subir la foto' }, { status: 500 });
  }
}
