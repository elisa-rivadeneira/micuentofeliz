# Mi Cuento Feliz — imagen de producción para Easypanel (o cualquier Docker).
#
# Datos persistentes: /app/data (base de datos db.json y archivos subidos).
# Monta ahí un volumen; si está vacío, se copia el contenido inicial de datos-iniciales/.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
COPY --from=build --chown=app:app /app/datos-iniciales ./datos-iniciales
COPY --chown=app:app docker-entrypoint.sh ./docker-entrypoint.sh
RUN mkdir -p /app/data/uploads && chown -R app:app /app/data && chmod +x ./docker-entrypoint.sh
USER app
VOLUME ["/app/data"]
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
