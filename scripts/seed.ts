/**
 * scripts/seed.ts
 * 
 * Script de inicialización de la base de datos.
 * Crea el usuario administrador por defecto, categorías base y mesas iniciales.
 * Ejecutar con: npx ts-node scripts/seed.ts (o similar)
 */

import { db } from '../lib/db';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🚀 Iniciando proceso de seed...');

  try {
    // 1. Crear usuario administrador por defecto
    const passwordHash = await bcrypt.hash('admin123', 10);
    await db.query(`
      INSERT INTO users (email, name, password_hash, role)
      VALUES ('admin@birreria.com', 'Admin Birreria', '${passwordHash}', 'admin')
      ON CONFLICT (email) DO NOTHING;
    `);
    console.log('✅ Usuario admin creado (admin@birreria.com / admin123)');

    // 2. Crear categorías de ejemplo
    const categories = [
      ['Cervezas', 'Nuestra selección de cervezas artesanales e importadas'],
      ['Vinos', 'Vinos tintos, blancos y espumosos'],
      ['Cócteles', 'Mezclas de autor y clásicos internacionales'],
      ['Sin Alcohol', 'Gaseosas, jugos naturales y mocktails']
    ];

    for (const [name, desc] of categories) {
      await db.createCategory(name, desc);
    }
    console.log('✅ Categorías base creadas');

    // 3. Crear mesas iniciales (20 mesas)
    for (let i = 1; i <= 20; i++) {
      await db.query(`
        INSERT INTO tables (table_number, status)
        VALUES (${i}, 'available')
        ON CONFLICT (table_number) DO NOTHING;
      `);
    }
    console.log('✅ 20 Mesas inicializadas');

    console.log('✨ Seed completado con éxito');
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  }
}

// Ejecutar si el archivo se llama directamente
seed();
