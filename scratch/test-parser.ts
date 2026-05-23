import * as fs from 'fs';
import * as path from 'path';

interface DrinkParsed {
  category: string;
  nombre: string;
  precio: number;
  descripcion: string;
  caracteristicas: Record<string, string>;
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

const parsed = parseDrinksFile(path.join(process.cwd(), 'lista_bebidas.txt'));
console.log(`Parsed total of ${parsed.length} drinks!`);

const categoryCounts: Record<string, number> = {};
for (const drink of parsed) {
  categoryCounts[drink.category] = (categoryCounts[drink.category] || 0) + 1;
}
console.log('Drinks per category:', categoryCounts);

