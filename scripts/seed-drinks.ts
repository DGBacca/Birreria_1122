import { db } from '../lib/db';

const drinksData = [
  {
    category: 'Cerveza',
    drinks: [
      { nombre: 'Águila Original', presentacion: 'Lata 269 ml' },
      { nombre: 'Águila Original', presentacion: 'Lata 330 ml' },
      { nombre: 'Águila Original', presentacion: 'Lata 473 ml' },
      { nombre: 'Águila Original', presentacion: 'Botella 330 ml' },
      { nombre: 'Águila Original', presentacion: 'Botella 750 ml' },
      { nombre: 'Águila Light', presentacion: 'Lata 330 ml' },
      { nombre: 'Águila Light', presentacion: 'Lata 473 ml' },
      { nombre: 'Águila Light', presentacion: 'Botella 330 ml' },
      { nombre: 'Águila 0.0', presentacion: 'Lata 330 ml' },
      { nombre: 'Poker', presentacion: 'Lata 330 ml' },
      { nombre: 'Poker', presentacion: 'Lata 473 ml' },
      { nombre: 'Poker', presentacion: 'Botella 330 ml' },
      { nombre: 'Club Colombia Dorada', presentacion: 'Lata 330 ml' },
      { nombre: 'Club Colombia Dorada', presentacion: 'Botella 330 ml' },
      { nombre: 'Club Colombia Roja', presentacion: 'Lata 330 ml' },
      { nombre: 'Club Colombia Negra', presentacion: 'Lata 330 ml' },
      { nombre: 'Costeña', presentacion: 'Lata 330 ml' },
      { nombre: 'Andina', presentacion: 'Lata 330 ml' },
      { nombre: 'Pilsen', presentacion: 'Lata 330 ml' },
      { nombre: 'Corona', presentacion: 'Botella 355 ml' },
      { nombre: 'Heineken', presentacion: 'Lata 330 ml' },
      { nombre: 'Heineken', presentacion: 'Botella 330 ml' },
      { nombre: 'Stella Artois', presentacion: 'Lata 330 ml' },
      { nombre: 'Budweiser', presentacion: 'Lata 330 ml' },
      { nombre: 'Miller Lite', presentacion: 'Lata 330 ml' },
      { nombre: 'Sol', presentacion: 'Botella 330 ml' },
      { nombre: '3 Cordilleras Mestiza', presentacion: 'Botella 330 ml' },
      { nombre: '3 Cordilleras Rosada', presentacion: 'Botella 330 ml' },
      { nombre: 'BBC Monserrate Roja', presentacion: 'Botella 330 ml' },
      { nombre: 'La Milagrosa Blonde Ale', presentacion: 'Botella 330 ml' },
      { nombre: 'Non Grata', presentacion: 'Botella 330 ml' },
      { nombre: 'Peroni Nastro Azzurro', presentacion: 'Botella 330 ml' },
      { nombre: 'AC/DC German Beer Australian Hardrock', presentacion: 'Lata 568 ml' },
      { nombre: 'Flensburger Pilsener', presentacion: 'Botella 330 ml' },
      { nombre: 'Innis & Gunn The Original', presentacion: 'Botella 330 ml' },
      { nombre: 'Flensburger Dunkel', presentacion: 'Botella 330 ml' },
      { nombre: 'Erdinger Weißbier', presentacion: 'Botella 500 ml' },
      { nombre: 'Erdinger Pikantus', presentacion: 'Botella 500 ml' },
      { nombre: 'Flensburger Weizen', presentacion: 'Botella 330 ml' }
    ]
  },
  {
    category: 'Aguardiente',
    drinks: [
      { nombre: 'Aguardiente Antioqueño Tapa Roja', presentacion: 'Botella 375 ml (media)' },
      { nombre: 'Aguardiente Antioqueño Tapa Roja', presentacion: 'Botella 750 ml' },
      { nombre: 'Aguardiente Antioqueño Tapa Roja', presentacion: 'Garrafa 1000 ml / 1750 ml' },
      { nombre: 'Aguardiente Antioqueño Tapa Azul (sin azúcar)', presentacion: 'Botella 375 ml' },
      { nombre: 'Aguardiente Antioqueño Tapa Azul (sin azúcar)', presentacion: 'Botella 750 ml' },
      { nombre: 'Aguardiente Antioqueño Tapa Verde (sin azúcar)', presentacion: 'Botella 750 ml' },
      { nombre: 'Aguardiente Antioqueño Reserva', presentacion: 'Botella 750 ml' },
      { nombre: 'Aguardiente Néctar Rojo', presentacion: 'Botella 375 ml' },
      { nombre: 'Aguardiente Néctar Rojo', presentacion: 'Botella 750 ml' },
      { nombre: 'Aguardiente Néctar Azul (sin azúcar)', presentacion: 'Botella 750 ml' },
      { nombre: 'Aguardiente Néctar Club (sin azúcar)', presentacion: 'Botella 750 ml' },
      { nombre: 'Aguardiente Cristal Tradicional', presentacion: 'Botella 750 ml' },
      { nombre: 'Aguardiente Cristal Sin Azúcar (Tapa Azul)', presentacion: 'Botella 750 ml' },
      { nombre: 'Aguardiente Amarillo de Manzanares', presentacion: 'Botella 750 ml' },
      { nombre: 'Aguardiente Tapa Roja del Tolima', presentacion: 'Botella 750 ml' },
      { nombre: 'Aguardiente Llanero', presentacion: 'Botella 750 ml' },
      { nombre: 'Aguardiente Onix', presentacion: 'Botella 750 ml' },
      { nombre: 'Aguardiente Blanco del Valle', presentacion: 'Botella 750 ml' }
    ]
  },
  {
    category: 'Ron',
    drinks: [
      { nombre: 'Ron Medellín Dorado', presentacion: 'Botella 750 ml' },
      { nombre: 'Ron Medellín Añejo 3 Años', presentacion: 'Botella 750 ml' },
      { nombre: 'Ron Medellín Extra Añejo 5 Años', presentacion: 'Botella 750 ml' },
      { nombre: 'Ron Viejo de Caldas Tradicional', presentacion: 'Botella 750 ml' },
      { nombre: 'Ron Viejo de Caldas Tradicional', presentacion: 'Garrafa 1750 ml' },
      { nombre: 'Ron Viejo de Caldas Carta de Oro', presentacion: 'Botella 750 ml' },
      { nombre: 'Ron La Hechicera', presentacion: 'Botella 700 ml / 750 ml' },
      { nombre: 'Ron Dictador (varias edades)', presentacion: 'Botella 700 ml' },
      { nombre: 'Ron Parce (12 años)', presentacion: 'Botella 700 ml' },
      { nombre: 'Ron Zacapa (importado)', presentacion: 'Botella 700 ml' },
      { nombre: 'Ron Bacardí (importado)', presentacion: 'Botella 750 ml / 1L' }
    ]
  },
  {
    category: 'Tequila',
    drinks: [
      { nombre: 'Tequila José Cuervo Especial Silver (Blanco)', presentacion: 'Botella 750 ml' },
      { nombre: 'Tequila José Cuervo Reposado', presentacion: 'Botella 750 ml' },
      { nombre: 'Tequila Don Julio Blanco', presentacion: 'Botella 700 ml' },
      { nombre: 'Tequila Don Julio Reposado', presentacion: 'Botella 700 ml' },
      { nombre: 'Tequila Patrón Silver', presentacion: 'Botella 750 ml' },
      { nombre: 'Tequila 1800 Reposado', presentacion: 'Botella 750 ml' },
      { nombre: 'Tequila Herradura Reposado', presentacion: 'Botella 750 ml' },
      { nombre: 'Tequila Gran Centenario Plata', presentacion: 'Botella 750 ml' },
      { nombre: 'Tequila Maestro Dobel', presentacion: 'Botella 700 ml' }
    ]
  },
  {
    category: 'Whisky',
    drinks: [
      { nombre: 'Johnnie Walker Red Label', presentacion: 'Botella 750 ml / 1L' },
      { nombre: 'Johnnie Walker Black Label', presentacion: 'Botella 750 ml' },
      { nombre: 'Buchanan’s Deluxe', presentacion: 'Botella 750 ml / 1L' },
      { nombre: 'Old Parr 12 Años', presentacion: 'Botella 750 ml / 1L' },
      { nombre: 'Something Special', presentacion: 'Botella 750 ml' },
      { nombre: 'Chivas Regal 12 Años', presentacion: 'Botella 750 ml' },
      { nombre: 'Jack Daniel’s (Tennessee)', presentacion: 'Botella 750 ml' }
    ]
  },
  {
    category: 'Cóctel',
    drinks: [
      { nombre: 'Ron Viejo de Caldas Cóctel Mojito', presentacion: 'Lata 295 ml' },
      { nombre: 'Ron Viejo de Caldas Cóctel Cuba Libre (limón cola)', presentacion: 'Lata 295 ml' },
      { nombre: 'Ron Viejo de Caldas Cóctel Daiquiri', presentacion: 'Lata 295 ml' },
      { nombre: 'Ron Viejo de Caldas Cóctel Gin Tonic (o similar)', presentacion: 'Lata 295 ml' },
      { nombre: 'Four Loko Blue', presentacion: 'Lata 473 ml' },
      { nombre: 'Four Loko Purple', presentacion: 'Lata 473 ml' },
      { nombre: 'Four Loko Red', presentacion: 'Lata 473 ml' },
      { nombre: 'Four Loko Green', presentacion: 'Lata 473 ml' },
      { nombre: 'Smirnoff Tamarindo', presentacion: 'Lata 355 ml' },
      { nombre: 'Smirnoff Green Apple', presentacion: 'Lata 355 ml' },
      { nombre: 'Smirnoff Ice Original', presentacion: 'Lata 330 ml' },
      { nombre: 'Smirnoff Ice Berry', presentacion: 'Lata 330 ml' },
      { nombre: 'Juniper Gin Tonic', presentacion: 'Lata 280 ml' },
      { nombre: 'Juniper Paloma', presentacion: 'Lata 280 ml' },
      { nombre: 'Juniper Moscow Mule', presentacion: 'Lata 280 ml' },
      { nombre: 'Like', presentacion: 'Lata' },
      { nombre: 'JP Chenet Fizzy Mimosa', presentacion: 'Botella 250 ml' },
      { nombre: 'JP Chenet Fizzy Rosé', presentacion: 'Botella 250 ml' },
      { nombre: 'Cóctel Margarita (varias marcas)', presentacion: 'Lata 330 ml' },
      { nombre: 'Cóctel Piña Colada (pre-mixed)', presentacion: 'Lata / Botella 330 ml' },
      { nombre: 'Cóctel Sex on the Beach (RTD)', presentacion: 'Lata' },
      { nombre: 'Cóctel Long Island Iced Tea (RTD)', presentacion: 'Lata' },
      { nombre: 'Cóctel Mule (Maracuyá o Ginger)', presentacion: 'Lata 330 ml' },
      { nombre: 'Jonron Cóctel Mojito', presentacion: 'Botella PET 250 ml / 400 ml' },
      { nombre: 'Jonron Cóctel Maracuyá', presentacion: 'Botella PET 250 ml / 400 ml' },
      { nombre: 'Los Cuates', presentacion: 'Lata' },
      { nombre: 'White Claw (importado, varios sabores)', presentacion: 'Lata 355 ml' },
      { nombre: 'Truly (varios sabores)', presentacion: 'Lata 355 ml' }
    ]
  },
  {
    category: 'No Alcohol',
    drinks: [
      { nombre: 'Águila 0.0', presentacion: 'Lata 330 ml' },
      { nombre: 'Heineken 0.0', presentacion: 'Lata 330 ml' }
    ]
  },
  {
    category: 'Gaseosas',
    drinks: []
  },
  {
    category: 'Agua',
    drinks: []
  },
  {
    category: 'Electrolic',
    drinks: []
  }
];

async function seedDrinks() {
  console.log('🚀 Iniciando inserción de bebidas...');

  try {
    // 1. Asegurar que existan todas las categorías
    console.log('📋 Verificando categorías...');
    const allCategories = drinksData.map(d => d.category);
    for (const cat of allCategories) {
      await db.query(`
        INSERT INTO categories (name, display_order)
        SELECT $1, (SELECT COALESCE(MAX(display_order), 0) + 1 FROM categories)
        WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = $1);
      `, [cat]);
    }
    
    // Obtener las categorías con sus IDs
    const { rows: categoriesDb } = await db.query('SELECT id, name FROM categories');
    const categoryMap = categoriesDb.reduce((acc: any, cat: any) => {
      acc[cat.name] = cat.id;
      return acc;
    }, {});

    console.log('✅ Categorías verificadas e insertadas');

    // 2. Insertar bebidas
    console.log('🍷 Insertando bebidas...');
    for (const group of drinksData) {
      const categoryId = categoryMap[group.category];
      if (!categoryId) {
        console.warn(`Categoría no encontrada: ${group.category}`);
        continue;
      }

      for (const drink of group.drinks) {
        // Formateamos el nombre completo si es necesario, o lo guardamos separado.
        // Asumimos un precio 0 por defecto si no hay, luego lo pueden editar en el admin
        const nombreBebida = drink.presentacion ? `${drink.nombre} - ${drink.presentacion}` : drink.nombre;
        
        await db.query(`
          INSERT INTO drinks (nombre, presentacion, category_id, precio, active, stock)
          SELECT $1, $2, $3, $4, $5, $6
          WHERE NOT EXISTS (
            SELECT 1 FROM drinks WHERE nombre = $1 AND category_id = $3
          );
        `, [nombreBebida, drink.presentacion || null, categoryId, 0, true, 0]);
      }
    }

    console.log('✅ Todas las bebidas insertadas con éxito.');
  } catch (error) {
    console.error('❌ Error insertando bebidas:', error);
  } finally {
    process.exit();
  }
}

seedDrinks();
