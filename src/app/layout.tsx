import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sersif Académie | Préparation au Concours",
  description: "Plateforme de préparation au concours de l'enseignement en Physique et Chimie.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="light">
      <body>
        {children}
      </body>
    </html>
  );
}
