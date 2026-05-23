import { sql } from '@vercel/postgres';

async function go() {
  const r = await sql`SELECT id, nombre, category_id, precio FROM drinks WHERE precio = 0 ORDER BY id`;
  console.log(JSON.stringify(r.rows, null, 2));
  process.exit();
}
go();
