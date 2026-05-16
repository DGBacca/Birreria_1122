/**
 * app/api/carousel/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { put } from '@vercel/blob';

export async function GET() {
  try {
    const images = await db.getCarouselImages();
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener imágenes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se subió ningún archivo' }, { status: 400 });
    }

    const blob = await put(`carousel/${Date.now()}-${file.name}`, file, {
      access: 'public',
    });

    await db.addCarouselImage(blob.url);

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    return NextResponse.json({ error: 'Error al subir imagen' }, { status: 500 });
  }
}
