/**
 * scripts/manage-users.ts
 * 
 * Script de utilidad para gestionar usuarios desde la terminal.
 * Permite crear administradores, resetear contraseñas y ver la lista de usuarios.
 * Uso: npx tsx scripts/manage-users.ts [comando] [argumentos]
 */

import { db } from '../lib/db';
import bcrypt from 'bcryptjs';

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  if (!command) {
    console.log(`
🚀 GESTIÓN DE USUARIOS - BIRRERIA 11•22
---------------------------------------
Comandos disponibles:

1. set-admin [email] [password] [nombre]
   - Crea/actualiza un admin (se activa automáticamente).
   
2. reset-password [email] [nueva_password]
   - Cambia la contraseña.

3. list
   - Muestra todos los usuarios y su estado (ACTIVO/INACTIVO).

4. set-mesero [email] [password] [nombre]
   - Crea un mesero (activo por defecto).

5. activate [email]
   - ÚNICA FORMA de volver a activar una cuenta desactivada.

6. deactivate [email]
   - Desactiva una cuenta (mantiene el registro).
    `);
    return;
  }

  try {
    switch (command) {
      case 'set-admin': {
        const [email, password, name] = args.slice(1);
        if (!email || !password || !name) {
          console.error('❌ Error: Faltan argumentos.');
          return;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        await db.query(
          `INSERT INTO users (email, name, password_hash, role, active) 
           VALUES ($1, $2, $3, 'admin', true) 
           ON CONFLICT (email) DO UPDATE SET password_hash = $3, name = $2, role = 'admin', active = true`,
          [email, name, passwordHash]
        );
        console.log(`✅ ADMINISTRADOR ${email} configurado y ACTIVADO.`);
        break;
      }

      case 'activate': {
        const email = args[1];
        await db.query(`UPDATE users SET active = true WHERE email = $1`, [email]);
        console.log(`✅ Usuario ${email} ACTIVADO.`);
        break;
      }

      case 'deactivate': {
        const email = args[1];
        await db.query(`UPDATE users SET active = false WHERE email = $1`, [email]);
        console.log(`⚠️ Usuario ${email} DESACTIVADO.`);
        break;
      }

      case 'list': {
        const { rows } = await db.query(`SELECT id, email, name, role, active FROM users ORDER BY active DESC, role ASC`);
        console.table(rows);
        break;
      }

      case 'set-mesero': {
        const [email, password, name] = args.slice(1);
        if (!email || !password || !name) {
          console.error('❌ Error: Uso: set-mesero [email] [password] [nombre]');
          return;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        await db.query(
          `INSERT INTO users (email, name, password_hash, role) VALUES ($1, $2, $3, 'mesero') ON CONFLICT (email) DO NOTHING`,
          [email, name, passwordHash]
        );
        console.log(`✅ Nuevo MESERO creado: ${email}`);
        break;
      }

      default:
        console.log('❌ Comando no reconocido.');
    }
  } catch (error) {
    console.error('❌ Error en el script:', error);
  } finally {
    process.exit();
  }
}

main();
