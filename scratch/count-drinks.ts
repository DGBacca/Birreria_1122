import { sql } from '@vercel/postgres';

async function go() {
  const totalRes = await sql`SELECT COUNT(*) as count FROM drinks`;
  const priceRes = await sql`SELECT COUNT(*) as count FROM drinks WHERE precio > 0`;
  const zeroPriceRes = await sql`SELECT COUNT(*) as count FROM drinks WHERE precio = 0`;
  const zeroPriceDrinks = await sql`SELECT id, nombre, category_id FROM drinks WHERE precio = 0`;
  
  console.log('Total drinks:', totalRes.rows[0].count);
  console.log('Drinks with price > 0:', priceRes.rows[0].count);
  console.log('Drinks with price = 0:', zeroPriceRes.rows[0].count);
  console.log('Zero price drinks detail:', JSON.stringify(zeroPriceDrinks.rows, null, 2));
  
  process.exit();
}
go();
