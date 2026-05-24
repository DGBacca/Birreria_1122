import { db } from '../lib/db';

async function resetTables() {
  console.log('🧹 Iniciando ajuste de cantidad de mesas a 10...');
  try {
    // 1. Encontrar los IDs de las mesas con table_number > 10
    const { rows: tablesToDelete } = await db.query('SELECT id, table_number FROM tables WHERE table_number > 10');
    
    if (tablesToDelete.length > 0) {
      const ids = tablesToDelete.map(t => t.id).join(',');
      console.log(`Mesas a eliminar: ${tablesToDelete.map(t => t.table_number).join(', ')}`);

      // 2. Eliminar ítems de órdenes vinculadas a esas mesas
      await db.query(`
        DELETE FROM order_items 
        WHERE order_id IN (SELECT id FROM orders WHERE table_id IN (${ids}))
      `);
      console.log('✅ Ítems de órdenes de mesas eliminados');

      // 3. Eliminar órdenes vinculadas a esas mesas
      await db.query(`DELETE FROM orders WHERE table_id IN (${ids})`);
      console.log('✅ Órdenes de mesas eliminadas');

      // 4. Eliminar las mesas superiores a 10
      await db.query(`DELETE FROM tables WHERE id IN (${ids})`);
      console.log('✅ Mesas sobrantes eliminadas');
    } else {
      console.log('No se encontraron mesas mayores a la mesa 10.');
    }

    // 5. Asegurar que las mesas 1 a 10 existan
    for (let i = 1; i <= 10; i++) {
      await db.query(`
        INSERT INTO tables (table_number, status)
        VALUES (${i}, 'available')
        ON CONFLICT (table_number) DO NOTHING
      `);
    }
    console.log('✅ Mesas del 1 al 10 garantizadas y habilitadas.');
  } catch (error) {
    console.error('❌ Error al ajustar mesas:', error);
  }
}

resetTables();
