/**
 * tipos/index.ts
 * 
 * Este archivo contiene todas las interfaces de TypeScript utilizadas en el proyecto.
 * Define la estructura de los datos para usuarios, categorías, bebidas, mesas y órdenes.
 * Centralizar estos tipos ayuda a mantener la consistencia en todo el código y facilita
 * el autocompletado en el editor.
 */

// Representa a un usuario del sistema (Administrador o Mesero)
export interface User {
  id: number;
  email: string;
  name: string;
  apellido?: string;
  cedula?: string;
  telefono?: string;
  direccion?: string;
  photo_url?: string;
  role: 'admin' | 'mesero'; // Roles definidos en la documentación
  active?: boolean;
  created_at?: Date;
  password_hash?: string;
}

// Representa una categoría de bebidas (ej: Cervezas, Vinos)
export interface Category {
  id: number;
  name: string;
  description?: string; // Campo opcional para detalles de la categoría
  display_order: number; // Orden en que se mostrará en el menú
}

// Representa una bebida individual y todas sus características técnicas (Estructura de Base de Datos)
export interface Drink {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  caracteristicas?: string; // Resumen o detalles adicionales
  contenido: string;
  estilo: string;
  color: string;
  aroma: string;
  sabor: string;
  cuerpo: string;
  alcohol: string; // Porcentaje de alcohol
  origen: string;
  cervecera: string; // O Marca
  presentacion: string;
  maridaje: string; // Maridaje recomendado
  category_id: number;
  image_url: string;
  active: boolean;
  stock: number;
}

// Representa una mesa física en el establecimiento
export interface Table {
  id: number;
  table_number: number;
  status: 'available' | 'occupied' | 'reserved';
  qr_code?: string; // Código QR en formato base64 o URL
}

// Representa una orden o pedido realizado en una mesa
export interface Order {
  id: number;
  table_id: number;
  table?: Table;
  user_id: number;
  user?: User; // Mesero que tomó la orden
  total: number;
  status: 'active' | 'paid' | 'cancelled';
  created_at: Date;
  closed_at?: Date; // Fecha de cierre cuando se paga
  items?: OrderItem[]; // Detalles de la orden
}

// Representa un ítem específico dentro de una orden
export interface OrderItem {
  id: number;
  order_id: number;
  drink_id: number;
  drink?: Drink;
  quantity: number;
  unit_price: number;
  subtotal: number;
}
