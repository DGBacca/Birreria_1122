/**
 * app/api/categorias/[id]/imagen/route.ts
 *
 * API para subir/actualizar la imagen de portada de una categoría.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { put } from '@vercel/blob';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const categoryId = parseInt(id);
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se subió ningún archivo' }, { status: 400 });
    }

    const blob = await put(`categories/${categoryId}-${Date.now()}-${file.name}`, file, {
      access: 'public',
    });

    await db.updateCategoryImage(categoryId, blob.url);

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al subir imagen' }, { status: 500 });
  }
}
