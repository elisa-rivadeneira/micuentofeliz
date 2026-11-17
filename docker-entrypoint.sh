#!/bin/sh
# Prepara la carpeta de datos persistente antes de arrancar.
# - Si el volumen está vacío, copia el jardín inicial (datos-iniciales/db.json).
# - Nunca sobrescribe datos existentes: lo que crees en línea se conserva entre despliegues.
set -e

DATA=/app/data
mkdir -p "$DATA/uploads"

if [ ! -f "$DATA/db.json" ] && [ -f /app/datos-iniciales/db.json ]; then
  cp /app/datos-iniciales/db.json "$DATA/db.json"
  echo "[mi-cuento-feliz] Jardín inicial copiado a $DATA/db.json"
fi

if [ -d /app/datos-iniciales/uploads ] && [ -z "$(ls -A "$DATA/uploads" 2>/dev/null)" ]; then
  cp -r /app/datos-iniciales/uploads/. "$DATA/uploads/" 2>/dev/null || true
fi

if [ -z "$ADMIN_PASSWORD" ]; then
  echo "[mi-cuento-feliz] AVISO: ADMIN_PASSWORD no está definida; el área privada (/admin) queda abierta."
fi

exec "$@"
