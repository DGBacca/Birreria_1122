import { sql } from '@vercel/postgres';

const drinks = [
  // Aguardiente cat=2
  { n:'Aguardiente Antioqueño Tapa Roja', c:'Botella 375 ml', e:'Aguardiente', al:'29%', or:'Colombia', m:'Fábrica de Licores de Antioquia', p:'Anisado, dulce', pr:'35000', cat:2 },
  { n:'Aguardiente Antioqueño Tapa Roja', c:'Botella 750 ml', e:'Aguardiente', al:'29%', or:'Colombia', m:'Fábrica de Licores de Antioquia', p:'Anisado, dulce', pr:'60000', cat:2 },
  { n:'Aguardiente Antioqueño Tapa Roja', c:'Garrafa 1750 ml', e:'Aguardiente', al:'29%', or:'Colombia', m:'Fábrica de Licores de Antioquia', p:'Anisado, dulce', pr:'120000', cat:2 },
  { n:'Aguardiente Antioqueño Tapa Azul', c:'Botella 375 ml', e:'Aguardiente Sin Azúcar', al:'29%', or:'Colombia', m:'Fábrica de Licores de Antioquia', p:'Anisado, sin azúcar', pr:'37000', cat:2 },
  { n:'Aguardiente Antioqueño Tapa Azul', c:'Botella 750 ml', e:'Aguardiente Sin Azúcar', al:'29%', or:'Colombia', m:'Fábrica de Licores de Antioquia', p:'Anisado, sin azúcar', pr:'62000', cat:2 },
  { n:'Aguardiente Antioqueño Tapa Verde', c:'Botella 750 ml', e:'Aguardiente Sin Azúcar', al:'24%', or:'Colombia', m:'Fábrica de Licores de Antioquia', p:'Suave, sin azúcar', pr:'60000', cat:2 },
  { n:'Aguardiente Antioqueño Reserva', c:'Botella 750 ml', e:'Aguardiente Premium', al:'29%', or:'Colombia', m:'Fábrica de Licores de Antioquia', p:'Reserva especial, suave', pr:'80000', cat:2 },
  { n:'Aguardiente Néctar Rojo', c:'Botella 375 ml', e:'Aguardiente', al:'29%', or:'Colombia', m:'Licores del Valle', p:'Anisado suave', pr:'35000', cat:2 },
  { n:'Aguardiente Néctar Rojo', c:'Botella 750 ml', e:'Aguardiente', al:'29%', or:'Colombia', m:'Licores del Valle', p:'Anisado suave', pr:'58000', cat:2 },
  { n:'Aguardiente Néctar Azul', c:'Botella 750 ml', e:'Aguardiente Sin Azúcar', al:'29%', or:'Colombia', m:'Licores del Valle', p:'Sin azúcar, anisado', pr:'60000', cat:2 },
  { n:'Aguardiente Néctar Club', c:'Botella 750 ml', e:'Aguardiente Sin Azúcar', al:'24%', or:'Colombia', m:'Licores del Valle', p:'Suave, sin azúcar', pr:'62000', cat:2 },
  { n:'Aguardiente Cristal Tradicional', c:'Botella 750 ml', e:'Aguardiente', al:'29%', or:'Colombia', m:'Industria Licorera de Caldas', p:'Anisado tradicional', pr:'55000', cat:2 },
  { n:'Aguardiente Cristal Sin Azúcar', c:'Botella 750 ml', e:'Aguardiente Sin Azúcar', al:'29%', or:'Colombia', m:'Industria Licorera de Caldas', p:'Sin azúcar, anisado', pr:'57000', cat:2 },
  { n:'Aguardiente Amarillo de Manzanares', c:'Botella 750 ml', e:'Aguardiente', al:'29%', or:'Colombia', m:'Manzanares', p:'Anisado, dorado', pr:'55000', cat:2 },
  { n:'Aguardiente Tapa Roja del Tolima', c:'Botella 750 ml', e:'Aguardiente', al:'29%', or:'Colombia', m:'Licorera del Tolima', p:'Anisado, tradición tolimense', pr:'55000', cat:2 },
  { n:'Aguardiente Llanero', c:'Botella 750 ml', e:'Aguardiente', al:'29%', or:'Colombia', m:'Licorera de los Llanos', p:'Anisado, sabor llanero', pr:'52000', cat:2 },
  { n:'Aguardiente Onix', c:'Botella 750 ml', e:'Aguardiente', al:'29%', or:'Colombia', m:'Onix', p:'Suave, anisado', pr:'55000', cat:2 },
  { n:'Aguardiente Blanco del Valle', c:'Botella 750 ml', e:'Aguardiente', al:'29%', or:'Colombia', m:'Licorera del Valle', p:'Anisado, limpio', pr:'55000', cat:2 },
  // Ron cat=3
  { n:'Ron Medellín Dorado', c:'Botella 750 ml', e:'Ron Dorado', al:'35%', or:'Colombia', m:'Ron Medellín', p:'Caramelo, vainilla, suave', pr:'65000', cat:3 },
  { n:'Ron Medellín Añejo 3 Años', c:'Botella 750 ml', e:'Ron Añejo', al:'35%', or:'Colombia', m:'Ron Medellín', p:'Roble, caramelo, complejo', pr:'75000', cat:3 },
  { n:'Ron Medellín Extra Añejo 5 Años', c:'Botella 750 ml', e:'Ron Extra Añejo', al:'35%', or:'Colombia', m:'Ron Medellín', p:'Intenso, frutas secas, roble', pr:'90000', cat:3 },
  { n:'Ron Viejo de Caldas Tradicional', c:'Botella 750 ml', e:'Ron Tradicional', al:'35%', or:'Colombia', m:'Industria Licorera de Caldas', p:'Suave, vainilla, melaza', pr:'60000', cat:3 },
  { n:'Ron Viejo de Caldas Tradicional', c:'Garrafa 1750 ml', e:'Ron Tradicional', al:'35%', or:'Colombia', m:'Industria Licorera de Caldas', p:'Suave, vainilla, melaza', pr:'130000', cat:3 },
  { n:'Ron Viejo de Caldas Carta de Oro', c:'Botella 750 ml', e:'Ron Premium', al:'35%', or:'Colombia', m:'Industria Licorera de Caldas', p:'Frutas, miel, elegante', pr:'70000', cat:3 },
  { n:'Ron La Hechicera', c:'Botella 750 ml', e:'Ron Solera', al:'40%', or:'Colombia', m:'Ron La Hechicera', p:'Vainilla, frutas tropicales, roble', pr:'180000', cat:3 },
  { n:'Ron Dictador', c:'Botella 700 ml', e:'Ron Premium', al:'40%', or:'Colombia', m:'Dictador', p:'Complejo, especiado, largo final', pr:'250000', cat:3 },
  { n:'Ron Parce 12 Años', c:'Botella 700 ml', e:'Ron Extra Añejo', al:'40%', or:'Colombia', m:'Parce Rum', p:'Frutas secas, chocolate, roble', pr:'220000', cat:3 },
  { n:'Ron Zacapa', c:'Botella 700 ml', e:'Ron Premium Importado', al:'40%', or:'Guatemala', m:'Ron Zacapa', p:'Muy suave, panela, frutas', pr:'280000', cat:3 },
  { n:'Ron Bacardí', c:'Botella 750 ml', e:'Ron Blanco', al:'40%', or:'Puerto Rico', m:'Bacardí', p:'Limpio, ligero, versátil', pr:'120000', cat:3 },
  // Tequila cat=4
  { n:'Tequila José Cuervo Silver', c:'Botella 750 ml', e:'Tequila Blanco', al:'38%', or:'México', m:'José Cuervo', p:'Agave fresco, ligero', pr:'100000', cat:4 },
  { n:'Tequila José Cuervo Reposado', c:'Botella 750 ml', e:'Tequila Reposado', al:'38%', or:'México', m:'José Cuervo', p:'Suave, vainilla, agave', pr:'110000', cat:4 },
  { n:'Tequila Don Julio Blanco', c:'Botella 700 ml', e:'Tequila Blanco', al:'38%', or:'México', m:'Don Julio', p:'Agave puro, cítrico', pr:'200000', cat:4 },
  { n:'Tequila Don Julio Reposado', c:'Botella 700 ml', e:'Tequila Reposado', al:'38%', or:'México', m:'Don Julio', p:'Roble, caramelo, agave', pr:'220000', cat:4 },
  { n:'Tequila Patrón Silver', c:'Botella 750 ml', e:'Tequila Blanco Premium', al:'40%', or:'México', m:'Patrón', p:'Agave fresco, floral, limpio', pr:'280000', cat:4 },
  { n:'Tequila 1800 Reposado', c:'Botella 750 ml', e:'Tequila Reposado', al:'38%', or:'México', m:'1800 Tequila', p:'Roble americano, agave', pr:'180000', cat:4 },
  { n:'Tequila Herradura Reposado', c:'Botella 750 ml', e:'Tequila Reposado', al:'40%', or:'México', m:'Herradura', p:'Frutas maduras, roble', pr:'190000', cat:4 },
  { n:'Tequila Gran Centenario Plata', c:'Botella 750 ml', e:'Tequila Blanco', al:'38%', or:'México', m:'Gran Centenario', p:'Agave suave, floral', pr:'160000', cat:4 },
  { n:'Tequila Maestro Dobel', c:'Botella 700 ml', e:'Tequila Cristalino', al:'40%', or:'México', m:'Maestro Dobel', p:'Triple añejo filtrado, cristalino', pr:'300000', cat:4 },
  // Whisky cat=6
  { n:'Johnnie Walker Red Label', c:'Botella 750 ml', e:'Blended Scotch', al:'40%', or:'Escocia', m:'Diageo', p:'Ahumado, especiado, intenso', pr:'130000', cat:6 },
  { n:'Johnnie Walker Black Label', c:'Botella 750 ml', e:'Blended Scotch 12 Años', al:'40%', or:'Escocia', m:'Diageo', p:'Suave, frutas, ahumado suave', pr:'200000', cat:6 },
  { n:'Buchanan\'s Deluxe', c:'Botella 750 ml', e:'Blended Scotch', al:'40%', or:'Escocia', m:'Diageo', p:'Suave, frutal, notas de miel', pr:'180000', cat:6 },
  { n:'Old Parr 12 Años', c:'Botella 750 ml', e:'Blended Scotch', al:'40%', or:'Escocia', m:'Diageo', p:'Seco, especiado, largo', pr:'190000', cat:6 },
  { n:'Something Special', c:'Botella 750 ml', e:'Blended Scotch', al:'40%', or:'Escocia', m:'Seagram\'s', p:'Suave, miel, vanilla', pr:'150000', cat:6 },
  { n:'Chivas Regal 12 Años', c:'Botella 750 ml', e:'Blended Scotch', al:'40%', or:'Escocia', m:'Pernod Ricard', p:'Frutal, cremoso, miel', pr:'200000', cat:6 },
  { n:'Jack Daniel\'s', c:'Botella 750 ml', e:'Tennessee Whiskey', al:'40%', or:'EE.UU.', m:'Brown-Forman', p:'Vainilla, caramelo, carbón', pr:'200000', cat:6 },
];

async function seed() {
  console.log('Insertando aguardiente, ron, tequila, whisky...');
  for (const d of drinks) {
    await sql`
      INSERT INTO drinks (nombre, contenido, estilo, alcohol, origen, cervecera, descripcion, precio, category_id, active, stock)
      VALUES (${d.n}, ${d.c}, ${d.e}, ${d.al}, ${d.or}, ${d.m}, ${d.p}, ${parseFloat(d.pr)}, ${d.cat}, true, 100)
      ON CONFLICT DO NOTHING
    `;
  }
  console.log(`✅ ${drinks.length} bebidas insertadas.`);
  process.exit();
}
seed().catch(console.error);
