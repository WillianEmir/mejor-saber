import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/src/components/providers/AuthProvider";
import { ThemeManager } from "@/src/components/providers/ThemeManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"], 
}); 

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "App SABER 11",
  description: "Aplicación de entrenamiento para presentación de las Pruebas SABER 11",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeManager />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
