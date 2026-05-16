/**
 * scripts/seed.ts
 * 
 * Script de inicialización de la base de datos.
 * Crea las tablas si no existen e inserta los datos iniciales.
 * Ejecutar con: npx tsx scripts/seed.ts (requiere variables de entorno de Postgres)
 */

import { db } from '../lib/db';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🚀 Iniciando proceso de seed y migración...');

  try {
    // 1. Crear Tablas (Schema)
    console.log('📋 Creando tablas...');

    // Tabla de Usuarios
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'mesero'
      );
    `);

    // Tabla de Categorías
    await db.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        display_order INTEGER NOT NULL DEFAULT 0
      );
    `);

    // Tabla de Bebidas
    await db.query(`
      CREATE TABLE IF NOT EXISTS drinks (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        precio DECIMAL(12, 2) NOT NULL,
        descripcion TEXT,
        caracteristicas TEXT,
        contenido TEXT,
        estilo TEXT,
        color TEXT,
        aroma TEXT,
        sabor TEXT,
        cuerpo TEXT,
        alcohol TEXT,
        origen TEXT,
        cervecera TEXT,
        presentacion TEXT,
        maridaje TEXT,
        category_id INTEGER REFERENCES categories(id),
        image_url TEXT,
        active BOOLEAN DEFAULT true,
        stock INTEGER DEFAULT 0
      );
    `);

    // Tabla de Mesas
    await db.query(`
      CREATE TABLE IF NOT EXISTS tables (
        id SERIAL PRIMARY KEY,
        table_number INTEGER UNIQUE NOT NULL,
        status TEXT NOT NULL DEFAULT 'available'
      );
    `);

    // Tabla de Órdenes
    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        table_id INTEGER REFERENCES tables(id),
        user_id INTEGER REFERENCES users(id),
        total DECIMAL(12, 2) DEFAULT 0,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        closed_at TIMESTAMP WITH TIME ZONE
      );
    `);

    // Tabla de Ítems de Orden
    await db.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        drink_id INTEGER REFERENCES drinks(id),
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(12, 2) NOT NULL,
        subtotal DECIMAL(12, 2) NOT NULL
      );
    `);

    console.log('✅ Tablas creadas/verificadas');

    // 2. Crear usuario administrador por defecto
    const passwordHash = await bcrypt.hash('admin123', 10);
    await db.query(`
      INSERT INTO users (email, name, password_hash, role)
      VALUES ('admin@birreria.com', 'Admin Birreria', '${passwordHash}', 'admin')
      ON CONFLICT (email) DO NOTHING;
    `);
    console.log('✅ Usuario admin verificado (admin@birreria.com / admin123)');

    // 3. Crear categorías base
    const categories = [
      { name: 'Cerveza', desc: 'Nacionales, Artesanales e Importadas' },
      { name: 'Aguardiente', desc: 'Tradición Colombiana' },
      { name: 'Ron', desc: 'Añejados Premium' },
      { name: 'Tequila', desc: 'Destilados de Agave' },
      { name: 'Cóctel', desc: 'Mixología y RTDs' },
      { name: 'Whisky', desc: 'Escocia y el Mundo' },
      { name: 'No Alcohol', desc: 'Bebidas refrescantes sin alcohol' }
    ];

    for (const cat of categories) {
      await db.query(`
        INSERT INTO categories (name, description, display_order)
        SELECT '${cat.name}', '${cat.desc}', (SELECT COALESCE(MAX(display_order), 0) + 1 FROM categories)
        WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = '${cat.name}');
      `);
    }
    console.log('✅ Categorías base verificadas');

    // 4. Crear mesas iniciales (20 mesas)
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
    process.exit(1);
  }
}

seed();

