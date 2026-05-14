/**
 * lib/db.ts (STRUCTURED DATABASE IMPLEMENTATION)
 * 
 * Este archivo implementa la estructura de base de datos solicitada,
 * organizando la información en "tablas" por categoría con columnas específicas.
 */

import { Drink, Category, Order, OrderItem, Table } from '@/types';

// Definición de Categorías (Tablas Virtuales)
const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Cerveza', description: 'Nacionales, Artesanales e Importadas', display_order: 1 },
  { id: 2, name: 'Aguardiente', description: 'Tradición Colombiana', display_order: 2 },
  { id: 3, name: 'Ron', description: 'Añejados Premium', display_order: 3 },
  { id: 4, name: 'Tequila', description: 'Destilados de Agave', display_order: 4 },
  { id: 5, name: 'Cóctel', description: 'Mixología y RTDs', display_order: 5 },
  { id: 6, name: 'Whisky', description: 'Escocia y el Mundo', display_order: 6 },
  { id: 7, name: 'No Alcohol', description: 'Bebidas refrescantes sin alcohol', display_order: 7 },
];

/**
 * TABLAS DE LA BASE DE DATOS (Organizadas por Categoría)
 * Cada fila contiene las columnas solicitadas:
 * nombre, precio, descripcion, caracteristicas, contenido, estilo, color, aroma, sabor, cuerpo, alcohol, origen, cervecera, presentacion y maridaje
 */

const TABLA_CERVEZA: Drink[] = [
  {
    id: 101,
    nombre: 'Cerveza Erdinger Premium Weissbier 500ml',
    precio: 20000,
    descripcion: 'La Cerveza Erdinger Premium Weissbier 500ml es una cerveza de trigo alemana clásica, elaborada por la cervecería Erdinger Weißbräu en Baviera, Alemania. Con una graduación alcohólica del 5.3%, esta Weissbier destaca por su sabor suave y refrescante, característico de las cervezas de trigo sin filtrar. Su color dorado turbio y su espuma blanca y cremosa invitan a disfrutarla en cualquier ocasión.',
    caracteristicas: 'Alta calidad, fermentación en botella, tradición bávara.',
    contenido: '500ml',
    estilo: 'Weissbier (cerveza de trigo)',
    color: 'Dorado turbio',
    aroma: 'Notas de plátano, clavo y vainilla',
    sabor: 'Suave, frutal con un toque especiado, final refrescante',
    cuerpo: 'Medio, textura cremosa',
    alcohol: '5.3%',
    origen: 'Alemania (Baviera)',
    cervecera: 'Erdinger Weißbräu',
    presentacion: 'Botella de vidrio de 500ml',
    maridaje: 'Platos de pescado, ensaladas ligeras, quesos suaves, salchichas blancas',
    category_id: 1,
    image_url: 'https://images.unsplash.com/photo-1618885472179-5e474019f2a9?auto=format&fit=crop&q=80&w=800',
    active: true,
    stock: 50
  },
  {
    id: 102,
    nombre: 'Cerveza Club Colombia Dorada 330ml',
    precio: 10000,
    descripcion: 'La representación del orgullo y la maestría cervecera colombiana. Desde su lanzamiento en 1949, ha sido reconocida internacionalmente por su calidad superior, utilizando maltas seleccionadas y un proceso de maduración prolongado.',
    caracteristicas: 'Premium, filtrado en frío, sabor balanceado.',
    contenido: '330ml',
    estilo: 'Lager Premium',
    color: 'Dorado intenso',
    aroma: 'Maltas dulces y lúpulos nobles',
    sabor: 'Equilibrado, amargor refinado',
    cuerpo: 'Medio-ligero',
    alcohol: '4.7%',
    origen: 'Colombia',
    cervecera: 'Bavaria',
    presentacion: 'Botella de vidrio',
    maridaje: 'Carnes blancas, mariscos, quesos semimaduros',
    category_id: 1,
    image_url: 'https://images.unsplash.com/photo-1559526642-c3f001ea68ee?auto=format&fit=crop&q=80&w=800',
    active: true,
    stock: 100
  }
];

const TABLA_AGUARDIENTE: Drink[] = [
  {
    id: 201,
    nombre: 'Aguardiente Amarillo de Manzanares 750ml',
    precio: 85000,
    descripcion: 'Una leyenda que ha renacido para transformar la categoría en Colombia. Inspirado en una receta artesanal del pueblo de Manzanares, Caldas, este licor destaca por su color ámbar único y una suavidad excepcional.',
    caracteristicas: 'Sin azúcar, anisado suave, receta tradicional.',
    contenido: '750ml',
    estilo: 'Aguardiente Sin Azúcar',
    color: 'Amarillo vibrante traslúcido',
    aroma: 'Anís estrellado puro y caña de azúcar',
    sabor: 'Suave, anisado equilibrado, final dulce natural',
    cuerpo: 'Sedoso y elegante',
    alcohol: '24%',
    origen: 'Colombia (Caldas)',
    cervecera: 'Industria Licorera de Caldas',
    presentacion: 'Botella de vidrio',
    maridaje: 'Chicharrón, picadas típicas, frutas ácidas',
    category_id: 2,
    image_url: 'https://images.unsplash.com/photo-1569701881643-4318bc0493ae?auto=format&fit=crop&q=80&w=800',
    active: true,
    stock: 40
  }
];

const TABLA_RON: Drink[] = [
  {
    id: 301,
    nombre: 'Ron La Hechicera Solera 21 700ml',
    precio: 215000,
    descripcion: 'Un ron de mezcla (12-21 años) sin aditivos ni azúcar añadida. Añejado bajo el sistema solera en barricas de roble blanco americano en la costa colombiana.',
    caracteristicas: 'Natural, sin azúcar añadida, añejamiento solera.',
    contenido: '700ml',
    estilo: 'Extra Añejo',
    color: 'Marrón caoba',
    aroma: 'Madera, tabaco, café, vainilla, cáscara de naranja',
    sabor: 'Seco, profundo, notas de cacao y frutos secos',
    cuerpo: 'Pleno y complejo',
    alcohol: '40%',
    origen: 'Colombia (Barranquilla)',
    cervecera: 'La Hechicera',
    presentacion: 'Botella artesanal',
    maridaje: 'Chocolate amargo, habanos, carnes maduradas',
    category_id: 3,
    image_url: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&q=80&w=800',
    active: true,
    stock: 20
  }
];

const TABLA_TEQUILA: Drink[] = [
  {
    id: 401,
    nombre: 'Tequila Don Julio Reposado 750ml',
    precio: 320000,
    descripcion: 'Elaborado 100% con Agave Azul recolectado a mano en los Altos de Jalisco. Envejecido durante ocho meses en barricas de roble blanco americano.',
    caracteristicas: '100% Agave Azul, premium, reposado.',
    contenido: '750ml',
    estilo: 'Reposado',
    color: 'Ámbar pajizo brillante',
    aroma: 'Agave cocido, miel, limón y roble',
    sabor: 'Miel de agave, notas de chocolate y vainilla',
    cuerpo: 'Cremoso y pleno',
    alcohol: '38%',
    origen: 'México (Jalisco)',
    cervecera: 'Don Julio',
    presentacion: 'Botella artesanal',
    maridaje: 'Carnes a la parrilla, platos con mole, postres cítricos',
    category_id: 4,
    image_url: 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?auto=format&fit=crop&q=80&w=800',
    active: true,
    stock: 15
  }
];

const TABLA_COCTEL: Drink[] = [
  {
    id: 501,
    nombre: 'Smirnoff Ice Original 275ml',
    precio: 12000,
    descripcion: 'Bebida de malta lista para tomar con un perfil fresco y cítrico. Ideal para reuniones casuales y celebraciones.',
    caracteristicas: 'RTD, refrescante, carbonatado.',
    contenido: '275ml',
    estilo: 'RTD',
    color: 'Blanco traslúcido',
    aroma: 'Cítrico, limón-lima',
    sabor: 'Dulce, refrescante, burbujeante',
    cuerpo: 'Ligero',
    alcohol: '4.5%',
    origen: 'Global',
    cervecera: 'Diageo',
    presentacion: 'Botella de vidrio',
    maridaje: 'Snacks salados, comida rápida',
    category_id: 5,
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800',
    active: true,
    stock: 100
  }
];

const TABLA_WHISKY: Drink[] = [
  {
    id: 601,
    nombre: 'Whisky Old Parr 12 Años 750ml',
    precio: 195000,
    descripcion: 'Un blend escocés legendario con una suavidad excepcional. Su icónica botella cuadrada craquelada es símbolo de hospitalidad en Colombia.',
    caracteristicas: 'Blended Scotch, 12 años, icónico.',
    contenido: '750ml',
    estilo: 'Blended Scotch',
    color: 'Dorado intenso',
    aroma: 'Miel, vainilla, frutas maduras y leve humo',
    sabor: 'Suave, meloso con notas de toffee y malta',
    cuerpo: 'Medio y balanceado',
    alcohol: '40%',
    origen: 'Escocia',
    cervecera: 'Old Parr (Diageo)',
    presentacion: 'Botella cuadrada',
    maridaje: 'Quesos maduros, carnes asadas, chocolate oscuro',
    category_id: 6,
    image_url: 'https://images.unsplash.com/photo-1527281473232-9c4703011297?auto=format&fit=crop&q=80&w=800',
    active: true,
    stock: 30
  }
];

const TABLA_NO_ALCOHOL: Drink[] = [
  {
    id: 701,
    nombre: 'Limonada de Coco Birreria',
    precio: 15000,
    descripcion: 'Nuestra refrescante limonada de la casa, elaborada con limones frescos y una base cremosa de coco natural.',
    caracteristicas: 'Natural, cremosa, refrescante.',
    contenido: '400ml',
    estilo: 'Bebida Natural',
    color: 'Blanco nieve',
    aroma: 'Coco fresco y cítricos',
    sabor: 'Equilibrio perfecto entre dulce y ácido',
    cuerpo: 'Cremoso y denso',
    alcohol: '0%',
    origen: 'Colombia (Casa)',
    cervecera: 'Birreria 11.22',
    presentacion: 'Vaso de cristal con decoración',
    maridaje: 'Platos picantes, asados, tardes soleadas',
    category_id: 7,
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800',
    active: true,
    stock: 100
  }
];

// Base de Datos Consolidada (Simulación de Motor de Búsqueda)
const DATABASE: Record<string, Drink[]> = {
  'Cerveza': TABLA_CERVEZA,
  'Aguardiente': TABLA_AGUARDIENTE,
  'Ron': TABLA_RON,
  'Tequila': TABLA_TEQUILA,
  'Cóctel': TABLA_COCTEL,
  'Whisky': TABLA_WHISKY,
  'No Alcohol': TABLA_NO_ALCOHOL,
};

let MOCK_TABLES: Table[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1, table_number: i + 1, status: 'available'
}));

let MOCK_ORDERS: Order[] = [];
let MOCK_ORDER_ITEMS: OrderItem[] = [];

export const db = {
  // Simulación de llamadas a base de datos con estructura de tablas
  async getDrinks(categoryId?: number): Promise<Drink[]> {
    const allDrinks = Object.values(DATABASE).flat();
    return allDrinks.filter(d => d.active && (!categoryId || d.category_id === categoryId));
  },

  async getDrinkById(id: number): Promise<Drink | null> {
    const allDrinks = Object.values(DATABASE).flat();
    return allDrinks.find(d => d.id === id) || null;
  },

  // Obtener bebidas directamente de una "tabla" específica
  async getDrinksByTable(tableName: string): Promise<Drink[]> {
    return DATABASE[tableName] || [];
  },

  // Resto del módulo DB se mantiene similar para funcionalidad del sistema
  async getCategories(): Promise<Category[]> {
    return MOCK_CATEGORIES;
  },

  async getTables(): Promise<Table[]> { return MOCK_TABLES; },
  async getTableById(id: number): Promise<Table | null> { return MOCK_TABLES.find(t => t.id === id) || null; },
  async updateTableStatus(id: number, status: string): Promise<void> {
    const table = MOCK_TABLES.find(t => t.id === id);
    if (table) table.status = status as any;
  },

  async getActiveOrders(): Promise<Order[]> { return MOCK_ORDERS.filter(o => o.status === 'active'); },
  async getOrderByTable(tableId: number): Promise<Order | null> {
    return MOCK_ORDERS.find(o => o.table_id === tableId && o.status === 'active') || null;
  },

  async createOrder(tableId: number, userId: number): Promise<Order> {
    const newOrder: Order = { id: Date.now(), table_id: tableId, user_id: userId, total: 0, status: 'active', created_at: new Date() };
    MOCK_ORDERS.push(newOrder);
    return newOrder;
  },

  async addOrderItem(orderId: number, drinkId: number, quantity: number): Promise<OrderItem> {
    const drink = await this.getDrinkById(drinkId);
    if (!drink) throw new Error('Bebida no encontrada');
    const newItem: OrderItem = { id: Date.now(), order_id: orderId, drink_id: drinkId, quantity, unit_price: drink.precio, subtotal: drink.precio * quantity };
    MOCK_ORDER_ITEMS.push(newItem);
    const order = MOCK_ORDERS.find(o => o.id === orderId);
    if (order) order.total = MOCK_ORDER_ITEMS.filter(item => item.order_id === orderId).reduce((sum, item) => sum + item.subtotal, 0);
    return newItem;
  },

  async finalizeOrder(orderId: number): Promise<void> {
    const order = MOCK_ORDERS.find(o => o.id === orderId);
    if (order) { order.status = 'paid'; order.closed_at = new Date(); }
  },

  async createDrink(data: Partial<Drink>): Promise<Drink> {
    const newDrink: Drink = {
      id: Date.now(),
      nombre: data.nombre || '',
      precio: data.precio || 0,
      descripcion: data.descripcion || '',
      caracteristicas: data.caracteristicas || '',
      contenido: data.contenido || '',
      estilo: data.estilo || '',
      color: data.color || '',
      aroma: data.aroma || '',
      sabor: data.sabor || '',
      cuerpo: data.cuerpo || '',
      alcohol: data.alcohol || '',
      origen: data.origen || '',
      cervecera: data.cervecera || '',
      presentacion: data.presentacion || '',
      maridaje: data.maridaje || '',
      category_id: data.category_id || 1,
      image_url: data.image_url || '',
      active: true,
      stock: data.stock || 0,
    };
    
    // En una DB real esto sería un INSERT. Aquí lo agregamos a la tabla correspondiente.
    const category = MOCK_CATEGORIES.find(c => c.id === newDrink.category_id);
    if (category && DATABASE[category.name]) {
      DATABASE[category.name].push(newDrink);
    }
    
    return newDrink;
  },

  async updateDrink(id: number, data: Partial<Drink>): Promise<Drink | null> {
    const drink = await this.getDrinkById(id);
    if (!drink) return null;
    
    Object.assign(drink, data);
    return drink;
  },

  async deleteDrink(id: number): Promise<boolean> {
    for (const catName in DATABASE) {
      const index = DATABASE[catName].findIndex(d => d.id === id);
      if (index !== -1) {
        DATABASE[catName].splice(index, 1);
        return true;
      }
    }
    return false;
  },

  async query(queryString: string) {
    console.log('Query Executing on Structured DB:', queryString);
    return { rows: [] };
  }
};
