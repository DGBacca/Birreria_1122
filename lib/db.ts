/**
 * lib/db.ts (REAL DATABASE IMPLEMENTATION)
 * 
 * Este archivo implementa la conexión real a Vercel Postgres.
 * Sustituye los mocks por consultas SQL reales.
 */

import { sql } from '@vercel/postgres';
import { Drink, Category, Order, OrderItem, Table, User } from '@/types';

export const db = {
  // --- BEBIDAS (DRINKS) ---
  
  async getDrinks(categoryId?: number): Promise<Drink[]> {
    if (categoryId) {
      const { rows } = await sql<Drink>`SELECT * FROM drinks WHERE category_id = ${categoryId} AND active = true ORDER BY nombre ASC`;
      return rows;
    }
    const { rows } = await sql<Drink>`SELECT * FROM drinks WHERE active = true ORDER BY nombre ASC`;
    return rows;
  },

  async getDrinkById(id: number): Promise<Drink | null> {
    const { rows } = await sql<Drink>`SELECT * FROM drinks WHERE id = ${id}`;
    return rows[0] || null;
  },

  async getDrinksByTable(tableName: string): Promise<Drink[]> {
    const { rows } = await sql<Drink>`
      SELECT d.* FROM drinks d
      JOIN categories c ON d.category_id = c.id
      WHERE c.name = ${tableName} AND d.active = true
      ORDER BY d.nombre ASC
    `;
    return rows;
  },

  async createDrink(data: Partial<Drink>): Promise<Drink> {
    const { rows } = await sql<Drink>`
      INSERT INTO drinks (
        nombre, precio, descripcion, caracteristicas, contenido, estilo, 
        color, aroma, sabor, cuerpo, alcohol, origen, cervecera, 
        presentacion, maridaje, category_id, image_url, active, stock
      ) VALUES (
        ${data.nombre}, ${data.precio}, ${data.descripcion}, ${data.caracteristicas}, ${data.contenido}, 
        ${data.estilo}, ${data.color}, ${data.aroma}, ${data.sabor}, ${data.cuerpo}, 
        ${data.alcohol}, ${data.origen}, ${data.cervecera}, ${data.presentacion}, 
        ${data.maridaje}, ${data.category_id}, ${data.image_url}, true, ${data.stock || 0}
      )
      RETURNING *
    `;
    return rows[0];
  },

  async updateDrink(id: number, data: Partial<Drink>): Promise<Drink | null> {
    const { rows } = await sql<Drink>`
      UPDATE drinks SET
        nombre = COALESCE(${data.nombre}, nombre),
        precio = COALESCE(${data.precio}, precio),
        descripcion = COALESCE(${data.descripcion}, descripcion),
        caracteristicas = COALESCE(${data.caracteristicas}, caracteristicas),
        contenido = COALESCE(${data.contenido}, contenido),
        estilo = COALESCE(${data.estilo}, estilo),
        color = COALESCE(${data.color}, color),
        aroma = COALESCE(${data.aroma}, aroma),
        sabor = COALESCE(${data.sabor}, sabor),
        cuerpo = COALESCE(${data.cuerpo}, cuerpo),
        alcohol = COALESCE(${data.alcohol}, alcohol),
        origen = COALESCE(${data.origen}, origen),
        cervecera = COALESCE(${data.cervecera}, cervecera),
        presentacion = COALESCE(${data.presentacion}, presentacion),
        maridaje = COALESCE(${data.maridaje}, maridaje),
        category_id = COALESCE(${data.category_id}, category_id),
        image_url = COALESCE(${data.image_url}, image_url),
        active = COALESCE(${data.active}, active),
        stock = COALESCE(${data.stock}, stock)
      WHERE id = ${id}
      RETURNING *
    `;
    return rows[0] || null;
  },

  async deleteDrink(id: number): Promise<boolean> {
    const { rowCount } = await sql`UPDATE drinks SET active = false WHERE id = ${id}`;
    return (rowCount ?? 0) > 0;
  },

  // --- CATEGORÍAS (CATEGORIES) ---

  async getCategories(): Promise<Category[]> {
    const { rows } = await sql<Category>`SELECT * FROM categories ORDER BY display_order ASC`;
    return rows;
  },

  async createCategory(name: string, description?: string): Promise<Category> {
    const { rows } = await sql<Category>`
      INSERT INTO categories (name, description, display_order)
      VALUES (${name}, ${description}, (SELECT COALESCE(MAX(display_order), 0) + 1 FROM categories))
      RETURNING *
    `;
    return rows[0];
  },

  // --- MESAS (TABLES) ---

  async getTables(): Promise<Table[]> {
    const { rows } = await sql<Table>`SELECT * FROM tables ORDER BY table_number ASC`;
    return rows;
  },

  async getTableById(id: number): Promise<Table | null> {
    const { rows } = await sql<Table>`SELECT * FROM tables WHERE id = ${id}`;
    return rows[0] || null;
  },

  async updateTableStatus(id: number, status: string): Promise<void> {
    await sql`UPDATE tables SET status = ${status} WHERE id = ${id}`;
  },

  // --- ÓRDENES (ORDERS) ---

  async getActiveOrders(): Promise<Order[]> {
    const { rows } = await sql<Order>`SELECT * FROM orders WHERE status = 'active' ORDER BY created_at DESC`;
    return rows;
  },

  async getOrderByTable(tableId: number): Promise<Order | null> {
    const { rows } = await sql<Order>`SELECT * FROM orders WHERE table_id = ${tableId} AND status = 'active'`;
    return rows[0] || null;
  },

  async createOrder(tableId: number, userId: number): Promise<Order> {
    const { rows } = await sql<Order>`
      INSERT INTO orders (table_id, user_id, total, status, created_at)
      VALUES (${tableId}, ${userId}, 0, 'active', NOW())
      RETURNING *
    `;
    // Actualizamos el estado de la mesa a ocupada
    await this.updateTableStatus(tableId, 'occupied');
    return rows[0];
  },

  async finalizeOrder(orderId: number): Promise<void> {
    const { rows } = await sql<Order>`
      UPDATE orders SET status = 'paid', closed_at = NOW() 
      WHERE id = ${orderId} 
      RETURNING table_id
    `;
    if (rows[0]) {
      // Liberamos la mesa
      await this.updateTableStatus(rows[0].table_id, 'available');
    }
  },

  // --- ÍTEMS DE ORDEN (ORDER ITEMS) ---

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    const { rows } = await sql<OrderItem>`
      SELECT oi.*, d.nombre as drink_name, d.image_url as drink_image 
      FROM order_items oi
      JOIN drinks d ON oi.drink_id = d.id
      WHERE oi.order_id = ${orderId}
      ORDER BY oi.id ASC
    `;
    return rows;
  },

  async addOrderItem(orderId: number, drinkId: number, quantity: number): Promise<OrderItem> {
    // 1. Obtener el precio actual de la bebida
    const drink = await this.getDrinkById(drinkId);
    if (!drink) throw new Error('Bebida no encontrada');

    const subtotal = drink.precio * quantity;

    // 2. Insertar el ítem
    const { rows } = await sql<OrderItem>`
      INSERT INTO order_items (order_id, drink_id, quantity, unit_price, subtotal)
      VALUES (${orderId}, ${drinkId}, ${quantity}, ${drink.precio}, ${subtotal})
      RETURNING *
    `;

    // 3. Actualizar el total de la orden
    await sql`
      UPDATE orders 
      SET total = (SELECT SUM(subtotal) FROM order_items WHERE order_id = ${orderId})
      WHERE id = ${orderId}
    `;

    return rows[0];
  },

  // --- USUARIOS (USERS) ---

  async getUsers(): Promise<User[]> {
    const { rows } = await sql<User>`
      SELECT id, email, name, apellido, cedula, telefono, direccion, photo_url, role, active, created_at 
      FROM users 
      ORDER BY created_at DESC
    `;
    return rows;
  },

  async createUser(data: Partial<User>): Promise<User> {
    const { rows } = await sql<User>`
      INSERT INTO users (email, name, apellido, cedula, telefono, direccion, password_hash, role, active, created_at)
      VALUES (${data.email}, ${data.name}, ${data.apellido}, ${data.cedula}, ${data.telefono}, ${data.direccion}, ${data.password_hash}, ${data.role || 'mesero'}, true, NOW())
      RETURNING *
    `;
    return rows[0];
  },

  async updateUser(id: number, data: Partial<User>): Promise<void> {
    // Construimos la query dinámicamente según lo que se envíe
    if (data.password_hash) {
      await sql`UPDATE users SET password_hash = ${data.password_hash} WHERE id = ${id}`;
    }
    if (data.photo_url) {
      await sql`UPDATE users SET photo_url = ${data.photo_url} WHERE id = ${id}`;
    }
    if (data.name) {
      await sql`UPDATE users SET name = ${data.name}, apellido = ${data.apellido}, cedula = ${data.cedula}, telefono = ${data.telefono}, direccion = ${data.direccion} WHERE id = ${id}`;
    }
  },

  async toggleUserActive(id: number, active: boolean): Promise<void> {
    await sql`UPDATE users SET active = ${active} WHERE id = ${id}`;
  },

  // --- CARRUSEL (CAROUSEL) ---

  async getCarouselImages(): Promise<any[]> {
    const { rows } = await sql`SELECT * FROM carousel_images ORDER BY display_order ASC, created_at DESC`;
    return rows;
  },

  async addCarouselImage(url: string, altText: string = ''): Promise<void> {
    await sql`INSERT INTO carousel_images (url, alt_text) VALUES (${url}, ${altText})`;
  },

  async deleteCarouselImage(id: number): Promise<void> {
    await sql`DELETE FROM carousel_images WHERE id = ${id}`;
  },

  // --- GENÉRICO ---
  
  async query(queryString: string, params: any[] = []) {
    // Nota: El driver de vercel/postgres usa una sintaxis ligeramente diferente para queries dinámicas
    // pero para el script de seed esto debería ser suficiente si pasamos strings directos.
    return sql.query(queryString, params);
  }
};

