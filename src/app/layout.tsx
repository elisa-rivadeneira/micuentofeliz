import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/eb-garamond/400.css";
import "@fontsource/eb-garamond/400-italic.css";
import "@fontsource/eb-garamond/500.css";
import "@fontsource/eb-garamond/600.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "./globals.css";
import { SiteNav } from "@/components/SiteNav";
import { APP_VERSION } from "@/lib/version";

export const metadata: Metadata = {
  title: { default: "Mi Cuento Feliz", template: "%s · Mi Cuento Feliz" },
  description: "Un Universo de Historias Compartidas. Un jardín de puertas hacia mis historias, ideas y conocimientos.",
  icons: { icon: "/icon.svg" },
  other: { "mcf-version": APP_VERSION },
};

export const viewport: Viewport = {
  themeColor: "#0b0f30",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
