import { sql } from '@vercel/postgres';

async function go() {
  const r = await sql`SELECT id, name FROM categories ORDER BY display_order`;
  console.log(JSON.stringify(r.rows));
  process.exit();
}
go();
