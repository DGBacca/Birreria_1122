import { db } from '../lib/db';

async function migrate() {
  console.log('🚀 Iniciando migración de tabla users...');
  try {
    await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT false');
    await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS activation_code TEXT');
    console.log('✅ Columnas active y activation_code añadidas.');
    
    // Aseguramos que los admins actuales estén activos
    await db.query("UPDATE users SET active = true WHERE role = 'admin'");
    console.log('✅ Administradores activados por defecto.');
    
  } catch (error) {
    console.error('❌ Error en la migración:', error);
  } finally {
    process.exit();
  }
}

migrate();
