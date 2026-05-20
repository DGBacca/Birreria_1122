import { NextResponse } from 'next/server';
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
