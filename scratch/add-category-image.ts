import { db } from '../lib/db';

async function migrate() {
  console.log('🚀 Añadiendo image_url a la tabla categories...');
  try {
    await db.query(`ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT`);
    console.log('✅ Columna image_url añadida a categories.');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit();
  }
}

migrate();
