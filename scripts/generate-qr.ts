/**
 * scripts/generate-qr.ts
 * 
 * Script para generar códigos QR únicos para cada mesa.
 * Los QR apuntan a la URL del menú público con el parámetro de mesa.
 * Ejemplo: https://mi-sitio.com/menu?table=5
 */

import QRCode from 'qrcode';
import { db } from '../lib/db';

async function generateQRs() {
  console.log('🔍 Obteniendo mesas para generar QRs...');
  
  const tables = await db.getTables();
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  for (const table of tables) {
    // Definimos la URL que se codificará en el QR
    const menuUrl = `${baseUrl}/menu?table=${table.id}`;
    
    try {
      // Generamos el QR en formato Data URL (base64)
      const qrDataUrl = await QRCode.toDataURL(menuUrl, {
        margin: 2,
        scale: 10,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      
      // Guardamos el QR generado en la base de datos para cada mesa
      await db.query(`
        UPDATE tables SET qr_code = '${qrDataUrl}' WHERE id = ${table.id}
      `);
      
      console.log(`✅ QR generado con éxito para Mesa ${table.table_number}`);
    } catch (err) {
      console.error(`❌ Error generando QR para mesa ${table.table_number}:`, err);
    }
  }
  
  console.log('✨ Proceso de generación de QRs finalizado.');
}

generateQRs();
