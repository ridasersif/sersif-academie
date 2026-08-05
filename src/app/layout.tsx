import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

// Using Inter font for a very clean, Apple-like / Vercel-like aesthetic
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sersif Académie | Préparation au Concours",
  description: "Plateforme premium de préparation au concours de l'enseignement en Physique et Chimie.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
