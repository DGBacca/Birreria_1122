import { db } from '../lib/db';
import { sql } from '@vercel/postgres';

async function updateNoAlcohol() {
  console.log('Obteniendo id de Cerveza...');
  const cats = await db.getCategories();
  const cervezaCat = cats.find(c => c.name === 'Cerveza');
  
  if (!cervezaCat) {
    console.log('No se encontró la categoría Cerveza');
    return;
  }

  console.log('Moviendo Águila 0.0 y Heineken 0.0 a Cerveza (ID:', cervezaCat.id, ')');
  
  await sql`
    UPDATE drinks
    SET category_id = ${cervezaCat.id}
    WHERE nombre ILIKE '%0.0%' AND category_id = (SELECT id FROM categories WHERE name = 'Sin Alcohol' OR name = 'No Alcohol' LIMIT 1);
  `;
  
  console.log('Listo.');
}

updateNoAlcohol().catch(console.error);
