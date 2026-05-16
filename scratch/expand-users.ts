import { db } from '../lib/db';

async function migrate() {
  console.log('🚀 Expandiendo tabla de usuarios con datos personales...');
  try {
    await db.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS apellido TEXT,
      ADD COLUMN IF NOT EXISTS cedula TEXT,
      ADD COLUMN IF NOT EXISTS telefono TEXT,
      ADD COLUMN IF NOT EXISTS direccion TEXT,
      ADD COLUMN IF NOT EXISTS photo_url TEXT
    `);
    console.log('✅ Campos de perfil añadidos con éxito.');
  } catch (error) {
    console.error('❌ Error en la migración:', error);
  } finally {
    process.exit();
  }
}

migrate();
