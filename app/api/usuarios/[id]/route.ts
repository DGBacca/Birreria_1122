/**
 * app/api/usuarios/[id]/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { active } = await request.json();
    
    // Solo permitimos DESACTIVAR desde la web
    if (active === true) {
      return NextResponse.json({ error: 'La activación solo puede realizarse por el propietario del sistema' }, { status: 403 });
    }

    await db.toggleUserActive(parseInt(id), false);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar usuario' }, { status: 500 });
  }
}
