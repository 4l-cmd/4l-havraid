import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "4L HAVRAID | Le Havre → Marrakech · 4L Trophy 2026",
  description: "Suivez l'aventure de Gabin et Jules, du Havre à Marrakech pour le 4L Trophy 2026. GPS en temps réel, adoptez un km, devenez sponsor.",
  openGraph: {
    title: "4L HAVRAID",
    description: "Le Havre → Marrakech · 4L Trophy 2026",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
