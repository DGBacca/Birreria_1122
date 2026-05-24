import { db } from '../lib/db';

async function migrate() {
  console.log('🚀 Iniciando migración de inventario y lotes...');

  try {
    // 1. Crear tabla compras_proveedor
    await db.query(`
      CREATE TABLE IF NOT EXISTS compras_proveedor (
        id SERIAL PRIMARY KEY,
        proveedor_nombre TEXT NOT NULL,
        fecha_compra TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        total_inversion DECIMAL(12, 2) NOT NULL
      );
    `);
    console.log('✅ Tabla compras_proveedor creada');

    // 2. Crear tabla lotes_inventario
    await db.query(`
      CREATE TABLE IF NOT EXISTS lotes_inventario (
        id SERIAL PRIMARY KEY,
        bebida_id INTEGER REFERENCES drinks(id),
        cantidad_inicial INTEGER NOT NULL,
        cantidad_actual INTEGER NOT NULL,
        costo_compra_unitario DECIMAL(12, 2) NOT NULL,
        fecha_ingreso TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        compra_id INTEGER REFERENCES compras_proveedor(id) ON DELETE SET NULL
      );
    `);
    console.log('✅ Tabla lotes_inventario creada');

    // 3. Crear una compra inicial y lotes para las bebidas existentes si no tienen lotes aún
    const { rows: drinks } = await db.query('SELECT id, precio, nombre FROM drinks');
    const { rows: existingLotes } = await db.query('SELECT id FROM lotes_inventario LIMIT 1');

    if (existingLotes.length === 0 && drinks.length > 0) {
      console.log('📦 Inicializando lotes de inventario de prueba para bebidas existentes...');
      
      // Crear registro de compra
      const { rows: purchase } = await db.query(`
        INSERT INTO compras_proveedor (proveedor_nombre, total_inversion)
        VALUES ('Proveedor Central de Bebidas', 0)
        RETURNING id
      `);
      
      const purchaseId = purchase[0].id;
      let totalInversion = 0;

      for (const drink of drinks) {
        // Asignar un costo de compra ficticio (aprox. 45% del precio de venta para margen saludable)
        const unitCost = Math.round(Number(drink.precio) * 0.45);
        const qty = 50; // Cantidad inicial estándar
        totalInversion += unitCost * qty;

        await db.query(`
          INSERT INTO lotes_inventario (bebida_id, cantidad_inicial, cantidad_actual, costo_compra_unitario, compra_id)
          VALUES (${drink.id}, ${qty}, ${qty}, ${unitCost}, ${purchaseId})
        `);

        // Actualizar el stock acumulado en la tabla de bebidas
        await db.query(`UPDATE drinks SET stock = ${qty} WHERE id = ${drink.id}`);
      }

      // Actualizar el total invertido en la compra
      await db.query(`UPDATE compras_proveedor SET total_inversion = ${totalInversion} WHERE id = ${purchaseId}`);
      console.log(`✅ Lotes creados para ${drinks.length} bebidas. Inversión inicial total: $${totalInversion.toLocaleString('es-CO')}`);
    }

    console.log('✨ Migración de inventario completada con éxito.');
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  }
}

migrate();
