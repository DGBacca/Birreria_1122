/**
 * app/api/branding/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { put } from '@vercel/blob';

export async function GET() {
  try {
    const logoUrl = await db.getLogoUrl();
    return NextResponse.json({ logoUrl });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener logotipo' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // Verificar que el usuario sea administrador
  const role = (session.user as any).role;
  if (role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const action = formData.get('action');

    // Opción para restaurar el logo por defecto
    if (action === 'reset') {
      await db.setLogoUrl('');
      return NextResponse.json({ success: true, logoUrl: '' });
    }

    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No se subió ningún archivo' }, { status: 400 });
    }

    // Subir a Vercel Blob
    const blob = await put(`branding/logo-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`, file, {
      access: 'public',
    });

    // Guardar en la base de datos
    await db.setLogoUrl(blob.url);

    return NextResponse.json({ success: true, logoUrl: blob.url });
  } catch (error) {
    console.error('Error al actualizar branding:', error);
    return NextResponse.json({ error: 'Error al subir logotipo' }, { status: 500 });
  }
}
