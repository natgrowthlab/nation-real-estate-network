import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NATION | Red de distribución inmobiliaria",
  description: "Una red centralizada de inventario, clientes y cierres inmobiliarios.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
