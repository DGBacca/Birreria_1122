/**
 * app/api/perfil/password/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { current, new: newPassword } = await request.json();
    const userId = (session.user as any).id;

    // Obtener el hash actual
    const { rows } = await sql`SELECT password_hash FROM users WHERE id = ${userId}`;
    const user = rows[0];

    const isMatch = await bcrypt.compare(current, user.password_hash);
    if (!isMatch) {
      return NextResponse.json({ error: 'La contraseña actual es incorrecta' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.updateUser(userId, { password_hash: hashed });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al cambiar contraseña' }, { status: 500 });
  }
}
