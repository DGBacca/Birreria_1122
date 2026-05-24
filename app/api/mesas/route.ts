import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const tables = await db.getTables();
    return NextResponse.json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session || role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    // Buscar el número de mesa más alto actual
    const { rows } = await db.query('SELECT COALESCE(MAX(table_number), 0) as max_num FROM tables');
    const nextTableNumber = Number(rows[0].max_num) + 1;

    // Crear la nueva mesa
    const { rows: newTable } = await db.query(`
      INSERT INTO tables (table_number, status)
      VALUES (${nextTableNumber}, 'available')
      RETURNING *
    `);

    return NextResponse.json(newTable[0], { status: 201 });
  } catch (error) {
    console.error('Error al agregar mesa:', error);
    return NextResponse.json({ error: 'Error al agregar nueva mesa' }, { status: 500 });
  }
}

