import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

// Cargamos fuentes modernas de Google Fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Birreria 11•22 | Menú Digital de Bebidas",
  description: "Disfruta de nuestra selección premium de cervezas artesanales, vinos y cócteles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}
