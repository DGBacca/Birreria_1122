import { db } from '../lib/db';
import { sql } from '@vercel/postgres';

async function updateCategories() {
  const cats = await db.getCategories();
  const noAlcoholCat = cats.find(c => c.name === 'Sin Alcohol' || c.name === 'No Alcohol');
  const cervezaCat = cats.find(c => c.name === 'Cerveza');
  
  if (!noAlcoholCat) {
    console.log('No se encontró la categoría Sin Alcohol/No Alcohol');
    return;
  }

  console.log(`Asegurando que Gaseosa, Agua y Electrolit estén en ${noAlcoholCat.name} (ID: ${noAlcoholCat.id})`);
  
  await sql`
    UPDATE drinks
    SET category_id = ${noAlcoholCat.id}
    WHERE nombre ILIKE '%gaseosa%' 
       OR nombre ILIKE '%agua%' 
       OR nombre ILIKE '%electrolit%'
       OR nombre ILIKE '%electrolic%';
  `;

  if (cervezaCat) {
    console.log(`Asegurando que Águila 0.0 y Heineken 0.0 estén en ${cervezaCat.name} (ID: ${cervezaCat.id})`);
    await sql`
      UPDATE drinks
      SET category_id = ${cervezaCat.id}
      WHERE nombre ILIKE '%0.0%';
    `;
  }
  
  console.log('Listo.');
}

updateCategories().catch(console.error);
