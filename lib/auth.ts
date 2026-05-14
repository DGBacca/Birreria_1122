/**
 * lib/auth.ts
 * 
 * Configuración de NextAuth.js para manejar la autenticación de la aplicación.
 * Define cómo se validan los usuarios (admin y meseros) y cómo se gestionan
 * las sesiones mediante JSON Web Tokens (JWT).
 */

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  // Configuración de proveedores (en este caso solo credenciales: email y contraseña)
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Validar que se hayan enviado ambos campos
        if (!credentials?.email || !credentials?.password) return null;

        // Buscar al usuario en la base de datos por su email
        const { rows } = await sql`
          SELECT * FROM users WHERE email = ${credentials.email}
        `;
        
        const user = rows[0];
        // Si el usuario no existe, rechazamos la autenticación
        if (!user) return null;

        // Comparar la contraseña ingresada con el hash guardado en la DB
        const isValid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!isValid) return null;

        // Si es válido, retornamos el objeto de usuario (esto se guardará en el JWT)
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role, // Guardamos el rol para control de accesos posterior
        };
      }
    })
  ],
  callbacks: {
    // El callback JWT se ejecuta cuando se crea o actualiza el token
    async jwt({ token, user }) {
      // Si el usuario acaba de iniciar sesión, inyectamos su rol en el token
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    // El callback session define qué información será accesible desde el cliente (useSession)
    async session({ session, token }) {
      if (session.user) {
        // Pasamos el rol y el ID del token a la sesión del cliente
        (session.user as any).role = token.role as string;
        (session.user as any).id = token.id as string;
      }
      return session;
    }
  },
  // Páginas personalizadas de NextAuth
  pages: {
    signIn: '/login', // Redirigir a esta ruta si no está autenticado
  },
  session: {
    strategy: 'jwt', // Usar JWT en lugar de sesiones en base de datos (más ligero)
  },
};
