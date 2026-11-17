import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  // Servidor autónomo y ligero para Docker / Easypanel.
  output: "standalone",
  // Permite compilar una prueba de producción sin pisar el servidor de desarrollo.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Las imágenes ya están optimizadas (webp); evitamos procesarlas en el servidor.
  images: { unoptimized: true },
  experimental: {
    serverActions: { bodySizeLimit: "50mb" },
    // Permite subir audios y videos grandes aunque el middleware esté activo.
    middlewareClientMaxBodySize: "200mb",
  },
};

export default nextConfig;
