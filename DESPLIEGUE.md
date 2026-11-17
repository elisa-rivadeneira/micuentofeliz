# Publicar Mi Cuento Feliz en micuentofeliz.com (GitHub → Easypanel)

## 1. GitHub
1. Crea un repositorio **privado** vacío en https://github.com/new (sin README), por ejemplo `mi-cuento-feliz`.
2. Sube el proyecto:
   ```
   git remote add origin https://github.com/<tu-usuario>/mi-cuento-feliz.git
   git push -u origin main
   ```

## 2. Easypanel (http://164.90.135.125:3000)
1. **Settings → GitHub**: conecta tu cuenta de GitHub (token) si aún no lo está.
2. **Create project** → `micuentofeliz` → **+ Service → App**.
3. **Source**: GitHub → repositorio `mi-cuento-feliz`, rama `main`.
4. **Build**: *Dockerfile* (ruta `Dockerfile`).
5. **Environment**:
   ```
   ADMIN_PASSWORD=una-contraseña-larga-y-secreta
   ```
6. **Mounts → Add Volume**: nombre `datos`, ruta de montaje **`/app/data`**.
   (Aquí vive tu contenido y los archivos que subas; sin este volumen se borraría en cada despliegue).
7. **Domains**: agrega `micuentofeliz.com` y `www.micuentofeliz.com`, puerto **3000**, HTTPS activado.
8. **Deploy**. Opcional: activa *Auto Deploy* para que cada `git push` publique solo.

> Compilar requiere ~1,5–2 GB de RAM. Si el servidor tiene 1 GB, añade swap o el build fallará.

## 3. GoDaddy (DNS de micuentofeliz.com)
En *Mis productos → micuentofeliz.com → DNS*:

| Tipo  | Nombre | Valor             |
|-------|--------|-------------------|
| A     | @      | 164.90.135.125    |
| CNAME | www    | micuentofeliz.com |

Borra cualquier otro registro **A** de `@`, el “Parked”/redireccionamiento de GoDaddy y el CNAME de `www` antiguo.
La propagación suele tardar de minutos a pocas horas; después Easypanel emite el certificado HTTPS solo.

## 4. Cómo viven los datos
- La primera vez que arranca, el servidor copia `datos-iniciales/db.json` a `/app/data` (el volumen).
- Desde entonces, **lo que crees en línea queda en el servidor** y no se pisa al volver a desplegar.
- Tu copia local (`data/` en tu computadora) es independiente.
- Respaldo: descarga `/app/data` desde Easypanel (volumen `datos`) de vez en cuando.
