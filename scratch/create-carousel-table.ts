import { db } from '../lib/db';

async function migrate() {
  console.log('🚀 Creando tabla para el carrusel dinámico...');
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS carousel_images (
        id SERIAL PRIMARY KEY,
        url TEXT NOT NULL,
        alt_text TEXT,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla carousel_images lista.');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit();
  }
}

migrate();
