import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://bloomdate-fiorella15.netlify.app";
const title = "Fiorella · Mis XV";
const description = "¡Mis XV se acercan! 💕 Te invito a compartir conmigo una noche inolvidable. 7 de noviembre de 2026 · 21 hs.";
const socialImage = `${siteUrl}/og-fiorella-20260906.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    type: "website",
    url: siteUrl,
    siteName: "Fiorella · Mis XV",
    locale: "es_AR",
    images: [{
      url: socialImage,
      width: 1200,
      height: 630,
      alt: "Fiorella celebra sus XV el 7 de noviembre a las 21 hs",
      type: "image/jpeg",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [socialImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
