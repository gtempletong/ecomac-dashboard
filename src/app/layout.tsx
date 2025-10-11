import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ECOMAC II - Dashboard de Proyectos",
  description: "Dashboard para gestión y seguimiento de proyectos inmobiliarios ECOMAC II",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}