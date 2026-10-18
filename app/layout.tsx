import type { Metadata } from "next";
import "./globals.css";
import "./final-overrides.css";

export const metadata: Metadata = {
  title: "Benaq Constructora | Operación inmobiliaria",
  description: "Inventario, clientes y cierres en una operación constructora centralizada.",
  icons: { icon: "/icon.png", apple: "/icon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
