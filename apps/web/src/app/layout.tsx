import type { Metadata } from "next";
import "@verik/ui/tokens.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "VERIK",
  description: "Plataforma RegTech de cumplimiento y monitoreo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO">
      <body>{children}</body>
    </html>
  );
}
