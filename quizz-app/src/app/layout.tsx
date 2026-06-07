import type { Metadata } from "next";
import Nav from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claude Cert Quizz",
  description: "Préparation à la certification Claude — quizz et contenu",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen">
        <Nav />
        <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
