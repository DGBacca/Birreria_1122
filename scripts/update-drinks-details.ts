import { db } from '../lib/db';
import * as fs from 'fs';
import * as path from 'path';

async function updateDrinksDetails() {
  console.log('🚀 Iniciando actualización de detalles de bebidas...');
  
  const filePath = path.join(process.cwd(), 'lista_bebidas.txt');
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ No se encontró el archivo ${filePath}. Por favor crea este archivo y pega toda la información allí.`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Dividir por bloques de bebidas (separados por líneas en blanco o un patrón)
  // Como el formato tiene el nombre en la primera línea, Precio en la segunda, y luego descripción y Características.
  const blocks = content.split(/(?=\n[A-ZÁÉÍÓÚ][^\n]+\nPrecio: \$)/g);

  console.log(`📋 Se encontraron ${blocks.length} posibles bloques de bebidas para procesar.`);

  for (let block of blocks) {
    block = block.trim();
    if (!block) continue;

    const lines = block.split('\n').map(l => l.trim()).filter(l => l !== '');
    
    // La primera línea es el nombre
    let nombre = lines[0];
    
    // La segunda línea es el precio
    let precioLine = lines[1] || '';
    let precio = 0;
    if (precioLine.startsWith('Precio:')) {
      const pMatch = precioLine.replace(/\./g, '').match(/\d+/);
      if (pMatch) precio = parseInt(pMatch[0]);
    }

    // Extraer descripción y características
    let inFeatures = false;
    let descripcion = [];
    let caracteristicasObj: any = {};

    for (let i = 2; i < lines.length; i++) {
      const line = lines[i];
      if (line === 'Características:') {
        inFeatures = true;
        continue;
      }

      if (!inFeatures) {
        descripcion.push(line);
      } else {
        const colonIdx = line.indexOf(':');
        if (colonIdx > -1) {
          const key = line.substring(0, colonIdx).trim().toLowerCase();
          const value = line.substring(colonIdx + 1).trim();
          caracteristicasObj[key] = value;
        }
      }
    }

    const descripcionTexto = descripcion.join('\n');

    const mappedData = {
      contenido: caracteristicasObj['contenido'] || null,
      estilo: caracteristicasObj['estilo'] || null,
      color: caracteristicasObj['color'] || null,
      aroma: caracteristicasObj['aroma'] || null,
      sabor: caracteristicasObj['sabor'] || null,
      cuerpo: caracteristicasObj['cuerpo'] || null,
      alcohol: caracteristicasObj['graduación alcohólica'] || null,
      maridaje: caracteristicasObj['maridaje recomendado'] || null,
      presentacion: caracteristicasObj['presentación'] || null,
      origen: caracteristicasObj['origen'] || null,
      cervecera: caracteristicasObj['cervecera'] || null,
    };

    try {
      // Buscar la bebida en la base de datos que coincida más o menos con el nombre
      // Usaremos un ILIKE para encontrar coincidencias. 
      // O podemos simplemente buscar la que empiece igual, o actualizar todas las que coincidan.
      
      const searchName = '%' + nombre.replace(/Cerveza |Aguardiente |Ron |Tequila |Whisky /i, '') + '%';
      
      const { rows } = await db.query(`
        SELECT id, nombre FROM drinks 
        WHERE nombre ILIKE $1 OR $2 ILIKE '%' || nombre || '%'
      `, [searchName, nombre]);

      if (rows.length > 0) {
        const drinkId = rows[0].id;
        console.log(`✅ Actualizando [${rows[0].nombre}] (ID: ${drinkId})`);
        
        await db.query(`
          UPDATE drinks SET
            precio = $1,
            descripcion = $2,
            contenido = $3,
            estilo = $4,
            color = $5,
            aroma = $6,
            sabor = $7,
            cuerpo = $8,
            alcohol = $9,
            maridaje = $10,
            presentacion = $11,
            origen = $12,
            cervecera = $13
          WHERE id = $14
        `, [
          precio > 0 ? precio : rows[0].precio,
          descripcionTexto || null,
          mappedData.contenido,
          mappedData.estilo,
          mappedData.color,
          mappedData.aroma,
          mappedData.sabor,
          mappedData.cuerpo,
          mappedData.alcohol,
          mappedData.maridaje,
          mappedData.presentacion,
          mappedData.origen,
          mappedData.cervecera,
          drinkId
        ]);
      } else {
        console.log(`⚠️ No se encontró coincidencia en BD para: ${nombre}`);
      }
    } catch (err) {
      console.error(`❌ Error actualizando ${nombre}:`, err);
    }
  }

  console.log('✨ Proceso de actualización finalizado.');
  process.exit(0);
}

updateDrinksDetails();
