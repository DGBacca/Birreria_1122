import { sql } from '@vercel/postgres';

const CAT = 1; // Cerveza
const drinks = [
  { n:'Águila Original', c:'Lata 269 ml', e:'Lager', al:'4.0%', or:'Colombia', m:'Postobón S.A.', p:'Refrescante, ligera', pr:'8000' },
  { n:'Águila Original', c:'Lata 330 ml', e:'Lager', al:'4.0%', or:'Colombia', m:'Postobón S.A.', p:'Refrescante, ligera', pr:'9000' },
  { n:'Águila Original', c:'Lata 473 ml', e:'Lager', al:'4.0%', or:'Colombia', m:'Postobón S.A.', p:'Refrescante, ligera', pr:'12000' },
  { n:'Águila Original', c:'Botella 330 ml', e:'Lager', al:'4.0%', or:'Colombia', m:'Postobón S.A.', p:'Refrescante, ligera', pr:'9000' },
  { n:'Águila Original', c:'Botella 750 ml', e:'Lager', al:'4.0%', or:'Colombia', m:'Postobón S.A.', p:'Refrescante, ligera', pr:'16000' },
  { n:'Águila Light', c:'Lata 330 ml', e:'Lager Light', al:'3.5%', or:'Colombia', m:'Postobón S.A.', p:'Ligera, bajas calorías', pr:'9000' },
  { n:'Águila Light', c:'Lata 473 ml', e:'Lager Light', al:'3.5%', or:'Colombia', m:'Postobón S.A.', p:'Ligera, bajas calorías', pr:'12000' },
  { n:'Águila Light', c:'Botella 330 ml', e:'Lager Light', al:'3.5%', or:'Colombia', m:'Postobón S.A.', p:'Ligera, bajas calorías', pr:'9000' },
  { n:'Águila 0.0', c:'Lata 330 ml', e:'Sin alcohol', al:'0.0%', or:'Colombia', m:'Postobón S.A.', p:'Sin alcohol, refrescante', pr:'9000' },
  { n:'Poker', c:'Lata 330 ml', e:'Lager', al:'4.0%', or:'Colombia', m:'Bavaria S.A.', p:'Suave y refrescante', pr:'8500' },
  { n:'Poker', c:'Lata 473 ml', e:'Lager', al:'4.0%', or:'Colombia', m:'Bavaria S.A.', p:'Suave y refrescante', pr:'11000' },
  { n:'Poker', c:'Botella 330 ml', e:'Lager', al:'4.0%', or:'Colombia', m:'Bavaria S.A.', p:'Suave y refrescante', pr:'8500' },
  { n:'Club Colombia Dorada', c:'Lata 330 ml', e:'Lager Premium', al:'4.7%', or:'Colombia', m:'Bavaria S.A.', p:'Dorada, malta premium', pr:'10000' },
  { n:'Club Colombia Dorada', c:'Botella 330 ml', e:'Lager Premium', al:'4.7%', or:'Colombia', m:'Bavaria S.A.', p:'Dorada, malta premium', pr:'10000' },
  { n:'Club Colombia Roja', c:'Lata 330 ml', e:'Amber Lager', al:'5.0%', or:'Colombia', m:'Bavaria S.A.', p:'Caramelo, tostada', pr:'10000' },
  { n:'Club Colombia Negra', c:'Lata 330 ml', e:'Dark Lager', al:'5.0%', or:'Colombia', m:'Bavaria S.A.', p:'Oscura, malta', pr:'10000' },
  { n:'Costeña', c:'Lata 330 ml', e:'Lager', al:'4.0%', or:'Colombia', m:'Bavaria S.A.', p:'Refrescante, ligera', pr:'8000' },
  { n:'Andina', c:'Lata 330 ml', e:'Lager', al:'4.0%', or:'Colombia', m:'Bavaria S.A.', p:'Suave, refrescante', pr:'8000' },
  { n:'Pilsen', c:'Lata 330 ml', e:'Pilsner', al:'4.0%', or:'Colombia', m:'Postobón S.A.', p:'Clásica colombiana', pr:'8000' },
  { n:'Corona', c:'Botella 355 ml', e:'Pale Lager', al:'4.5%', or:'México', m:'Grupo Modelo', p:'Cítrica, refrescante', pr:'14000' },
  { n:'Heineken', c:'Lata 330 ml', e:'Pale Lager', al:'5.0%', or:'Países Bajos', m:'Heineken N.V.', p:'Amarga suave, malta', pr:'13000' },
  { n:'Heineken', c:'Botella 330 ml', e:'Pale Lager', al:'5.0%', or:'Países Bajos', m:'Heineken N.V.', p:'Amarga suave, malta', pr:'13000' },
  { n:'Stella Artois', c:'Lata 330 ml', e:'Pale Lager', al:'5.2%', or:'Bélgica', m:'AB InBev', p:'Seca, refrescante', pr:'13000' },
  { n:'Budweiser', c:'Lata 330 ml', e:'Pale Lager', al:'5.0%', or:'EE.UU.', m:'AB InBev', p:'Suave, granos de arroz', pr:'12000' },
  { n:'Miller Lite', c:'Lata 330 ml', e:'Light Lager', al:'4.2%', or:'EE.UU.', m:'Molson Coors', p:'Ligera, poco amarga', pr:'12000' },
  { n:'Sol', c:'Botella 330 ml', e:'Pale Lager', al:'4.5%', or:'México', m:'Cuauhtémoc Moctezuma', p:'Cítrica, verano', pr:'13000' },
  { n:'3 Cordilleras Mestiza', c:'Botella 330 ml', e:'Artesanal Amber', al:'5.0%', or:'Colombia', m:'3 Cordilleras', p:'Caramelo, tostada artesanal', pr:'16000' },
  { n:'3 Cordilleras Rosada', c:'Botella 330 ml', e:'Artesanal Rosé', al:'4.5%', or:'Colombia', m:'3 Cordilleras', p:'Frutal, fresca', pr:'16000' },
  { n:'BBC Monserrate Roja', c:'Botella 330 ml', e:'Artesanal Red Ale', al:'5.2%', or:'Colombia', m:'Bogotá Beer Company', p:'Malta caramelo, equilibrada', pr:'18000' },
  { n:'La Milagrosa Blonde Ale', c:'Botella 330 ml', e:'Artesanal Blonde', al:'4.8%', or:'Colombia', m:'La Milagrosa', p:'Suave, ligero dulzor', pr:'17000' },
  { n:'Non Grata', c:'Botella 330 ml', e:'Artesanal IPA', al:'6.0%', or:'Colombia', m:'Non Grata Brewing', p:'Lúpulo intenso, cítrico', pr:'18000' },
];

async function seed() {
  console.log('Insertando cervezas...');
  for (const d of drinks) {
    await sql`
      INSERT INTO drinks (nombre, contenido, estilo, alcohol, origen, cervecera, descripcion, precio, category_id, active, stock)
      VALUES (${d.n}, ${d.c}, ${d.e}, ${d.al}, ${d.or}, ${d.m}, ${d.p}, ${parseFloat(d.pr)}, ${CAT}, true, 100)
      ON CONFLICT DO NOTHING
    `;
  }
  console.log(`✅ ${drinks.length} cervezas insertadas.`);
  process.exit();
}
seed().catch(console.error);
