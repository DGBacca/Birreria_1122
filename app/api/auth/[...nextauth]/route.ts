/**
 * app/api/auth/[...nextauth]/route.ts
 * 
 * Punto de entrada para todas las solicitudes de autenticación de NextAuth.
 * Conecta las opciones definidas en lib/auth.ts con el App Router de Next.js.
 */

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Exportamos los controladores para GET y POST
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
