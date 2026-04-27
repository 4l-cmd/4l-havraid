import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "4L HAVRAID | Le Havre → Marrakech · 4L Trophy 2026",
  description: "Suivez l'aventure 4L HAVRAID du Havre à Marrakech. Adoptez un kilomètre, devenez sponsor, suivez notre parcours en temps réel.",
  keywords: "4L Trophy 2026, 4L HAVRAID, sponsor raid étudiant, adopter kilomètre, Le Havre Marrakech",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ background: 'var(--night)', color: 'var(--text)', margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
