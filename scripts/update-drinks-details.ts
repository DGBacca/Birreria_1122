import { db } from '../lib/db';
import * as fs from 'fs';
import * as path from 'path';

interface DrinkParsed {
  category: string;
  nombre: string;
  precio: number;
  descripcion: string;
  caracteristicas: Record<string, string>;
}

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/(\d+)(ml|l|oz|g|cl)\b/gi, '$1 $2') // Separate numbers from units
    .replace(/\b(cerveza|aguardiente|ron|tequila|whisky|whiskey|coctel|cóctel|bebida)\b/gi, '') // Remove prefixes/types
    .replace(/[^a-z0-9]/g, ' ') // Replace non-alphanumeric with spaces
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

function areSimilar(name1: string, name2: string): boolean {
  // Ensure same numbers/volumes (e.g. 750 vs 375)
  const nums1 = name1.match(/\d+/g) || [];
  const nums2 = name2.match(/\d+/g) || [];
  if (nums1.join('') !== nums2.join('')) {
    return false;
  }

  const n1 = normalizeString(name1);
  const n2 = normalizeString(name2);
  
  if (n1 === n2) return true;
  if (n1.includes(n2) || n2.includes(n1)) return true;
  
  // Split into words
  const words1 = n1.split(' ').filter(w => w.length > 1);
  const words2 = n2.split(' ').filter(w => w.length > 1);
  
  // Stop words to exclude from similarity intersection
  const stopWords = new Set([
    'ml', 'lata', 'botella', 'vidrio', 'pet', 'l', 'cl', 'oz', 'g', 
    'de', 'del', 'con', 'y', 'en', 'para', 'sin', 'sabor', 'sabores', 
    'varias', 'marcas', 'importado', 'nacional', 'original'
  ]);
  
  // Filter out numbers and stop words for the keyword sets
  const set1 = new Set(words1.filter(w => !stopWords.has(w) && !/^\d+$/.test(w)));
  const set2 = new Set(words2.filter(w => !stopWords.has(w) && !/^\d+$/.test(w)));
  
  let intersectCount = 0;
  for (const w of set1) {
    if (set2.has(w)) intersectCount++;
  }
  
  const minSize = Math.min(set1.size, set2.size);
  if (minSize === 0) return false;
  
  const similarity = intersectCount / minSize;
  
  return similarity >= 0.85;
}

function parseDrinksFile(filePath: string): DrinkParsed[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').map(line => line.trim());
  
  const drinks: DrinkParsed[] = [];
  let currentCategory = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    
    // Check if it's a category
    const catMatch = line.match(/^Categoria:\s*(.+)$/i);
    if (catMatch) {
      currentCategory = catMatch[1].trim();
      continue;
    }
    
    // Check if the NEXT line is a Price line.
    const nextLine = lines[i + 1] || '';
    const isPriceLine = nextLine.toLowerCase().startsWith('precio:');
    
    if (isPriceLine) {
      let rawName = line;
      rawName = rawName.replace(/^(nombre|nomnbre|Nombre):\s*/i, '').trim();
      
      const priceText = nextLine.replace(/^(precio|Precio):\s*\$/i, '').trim();
      const precio = parseInt(priceText.replace(/\./g, ''), 10) || 0;
      
      let descLines: string[] = [];
      const caracteristicas: Record<string, string> = {};
      
      let j = i + 2;
      let inCharacteristics = false;
      
      while (j < lines.length) {
        const subLine = lines[j];
        
        const checkNext = lines[j + 1] || '';
        const checkNextIsPrice = checkNext.toLowerCase().startsWith('precio:');
        if (checkNextIsPrice || subLine.toLowerCase().startsWith('categoria:')) {
          break;
        }
        
        if (subLine.toLowerCase().startsWith('características:')) {
          inCharacteristics = true;
          j++;
          continue;
        }
        
        if (!inCharacteristics) {
          let descText = subLine.replace(/^(descripcion|Descripcion):\s*/i, '').trim();
          if (descText) {
            descLines.push(descText);
          }
        } else {
          const colonIdx = subLine.indexOf(':');
          if (colonIdx > -1) {
            const key = subLine.substring(0, colonIdx).trim().toLowerCase();
            const value = subLine.substring(colonIdx + 1).trim();
            caracteristicas[key] = value;
          }
        }
        
        j++;
      }
      
      drinks.push({
        category: currentCategory,
        nombre: rawName,
        precio,
        descripcion: descLines.join('\n'),
        caracteristicas
      });
      
      i = j - 1;
    }
  }
  
  return drinks;
}

async function updateDrinksDetails() {
  console.log('🚀 Iniciando actualización y carga de detalles de bebidas con algoritmo mejorado...');
  
  const filePath = path.join(process.cwd(), 'lista_bebidas.txt');
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ No se encontró el archivo ${filePath}.`);
    process.exit(1);
  }

  // 1. Obtener todas las bebidas y categorías de la base de datos
  const { rows: dbDrinks } = await db.query('SELECT id, nombre, category_id, precio FROM drinks');
  const { rows: dbCategories } = await db.query('SELECT id, name FROM categories');
  
  // Guardar mapa de nombre de categoría -> ID
  const categoryMap: Record<string, number> = {};
  for (const cat of dbCategories) {
    categoryMap[cat.name.toLowerCase()] = cat.id;
  }

  // 2. Parsear el archivo de texto
  const parsedDrinks = parseDrinksFile(filePath);
  console.log(`📋 Se encontraron ${parsedDrinks.length} bebidas en el archivo lista_bebidas.txt para procesar.`);

  let updatedCount = 0;
  let insertedCount = 0;

  for (const drink of parsedDrinks) {
    // Resolver ID de categoría (con normalizaciones)
    let categoryName = drink.category;
    if (categoryName.toLowerCase() === 'coctel') {
      categoryName = 'Cóctel';
    }
    
    let categoryId = categoryMap[categoryName.toLowerCase()];
    if (!categoryId) {
      // Crear categoría si no existe
      const { rows: newCat } = await db.query(`
        INSERT INTO categories (name, display_order)
        VALUES ($1, (SELECT COALESCE(MAX(display_order), 0) + 1 FROM categories))
        RETURNING id
      `, [categoryName]);
      categoryId = newCat[0].id;
      categoryMap[categoryName.toLowerCase()] = categoryId;
      console.log(`🆕 Categoría creada: ${categoryName} (ID: ${categoryId})`);
    }

    const mappedData = {
      contenido: drink.caracteristicas['contenido'] || null,
      estilo: drink.caracteristicas['estilo'] || null,
      color: drink.caracteristicas['color'] || null,
      aroma: drink.caracteristicas['aroma'] || null,
      sabor: drink.caracteristicas['sabor'] || null,
      cuerpo: drink.caracteristicas['cuerpo'] || null,
      alcohol: drink.caracteristicas['graduación alcohólica'] || null,
      maridaje: drink.caracteristicas['maridaje recomendado'] || null,
      presentacion: drink.caracteristicas['presentación'] || null,
      origen: drink.caracteristicas['origen'] || null,
      cervecera: drink.caracteristicas['cervecera'] || null,
    };

    // Buscar coincidencia en base de datos usando areSimilar
    const matchedDbDrink = dbDrinks.find(dbDrink => areSimilar(drink.nombre, dbDrink.nombre));

    if (matchedDbDrink) {
      // Si coincide, actualizar
      console.log(`✅ Actualizando [${matchedDbDrink.nombre}] (ID: ${matchedDbDrink.id}) matching [${drink.nombre}]`);
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
          cervecera = $13,
          category_id = $14
        WHERE id = $15
      `, [
        drink.precio,
        drink.descripcion || null,
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
        categoryId,
        matchedDbDrink.id
      ]);
      updatedCount++;
    } else {
      // Si no coincide, insertar como nueva bebida
      console.log(`🆕 Insertando nueva bebida: [${drink.nombre}] en categoría [${categoryName}]`);
      await db.query(`
        INSERT INTO drinks (
          nombre, precio, descripcion, contenido, estilo, color, aroma,
          sabor, cuerpo, alcohol, maridaje, presentacion, origen, cervecera, category_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `, [
        drink.nombre,
        drink.precio,
        drink.descripcion || null,
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
        categoryId
      ]);
      insertedCount++;
    }
  }

  // 3. Desactivar bebidas temporales / placeholders del seed que no se emparejaron (precio = 0)
  console.log('\n🧹 Desactivando bebidas placeholder/incompletas del seed original (precio = 0)...');
  const { rowCount: deactivatedCount } = await db.query('UPDATE drinks SET active = false WHERE precio = 0');
  console.log(`🗑️ Se desactivaron ${deactivatedCount} bebidas vacías/placeholder.`);

  console.log(`\n✨ Proceso de carga finalizado.`);
  console.log(`📊 Resumen:`);
  console.log(`   - Bebidas actualizadas: ${updatedCount}`);
  console.log(`   - Bebidas nuevas insertadas: ${insertedCount}`);
  console.log(`   - Bebidas placeholder desactivadas: ${deactivatedCount}`);
  process.exit(0);
}

updateDrinksDetails().catch(err => {
  console.error('❌ Error general durante la actualización:', err);
  process.exit(1);
});
