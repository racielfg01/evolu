# Imágenes de servicios en UploadThing

Fecha: 2026-10-29
Estado: implementado y verificado

## Intención

Dejar de guardar las imágenes de los servicios en Supabase Storage y usar
UploadThing, aprovechando el token `UPLOADTHING_TOKEN` que ya estaba en `.env`.
Todo el almacenamiento queda en una sola cuenta, tanto lo nuevo como lo existente.

## Alcance

- Subida de imágenes nuevas de servicios (modal de alta/edición del admin).
- Lectura de esas imágenes en el catálogo, la home y el panel de admin.
- Borrado de imágenes al editarlas.
- Copia de las 112 imágenes que ya vivían en Supabase.
- **Fuera de alcance:** borrar las copias de Supabase (se conservan como respaldo),
  avatares u otros archivos (no existen en el proyecto).

## Cambios

| Archivo | Qué hace |
|---|---|
| `lib/uploadthing.server.ts` | Instancia perezosa de `UTApi` (token solo en servidor) y borrado de archivos, con compatibilidad para rutas viejas de Supabase. |
| `app/api/uploads/route.ts` | `POST /api/uploads`: exige sesión con rol distinto de `USER`, valida hasta 5 imágenes de 5MB, sube a UploadThing y crea la fila en `ServiceFile` con Prisma. |
| `lib/uploads-client.ts` | `uploadImages(formData)` en el navegador: hace `fetch` al route handler. Misma firma y mismo resultado que antes. |
| `components/comun/AddServiceModal.tsx` | Importa `uploadImages` desde el cliente nuevo. Sin cambios de UI. |
| `lib/actions/services.actions.ts` | Al editar, borra los archivos con `utapi.deleteFiles` **después** de confirmar la transacción. |
| `next.config.ts` | Añade `kyw6bm6or8.ufs.sh/f/**` a `remotePatterns` de `next/image`. |
| `scripts/migrate-images-to-uploadthing.ts` | Copia las imágenes existentes: descarga de Supabase, sube a UploadThing, actualiza `path` y `url`. Idempotente, `--dry-run` y `--limit=N`. |
| `package.json`, `.env.example` | Dependencia `uploadthing`, script `migrate:images` y variable documentada. |

## Decisiones

- **Subida por route handler**, no server action: las server actions de Next tienen
  un límite de cuerpo de 1MB por defecto y las imágenes permiten 5MB.
- **Token solo en servidor.** Antes el navegador subía directo a Supabase con la
  clave anónima; ahora el navegador nunca ve credenciales de almacenamiento.
- **Ruta y URL guardadas en `ServiceFile`**: `path` = clave de UploadThing,
  `url` = `https://kyw6bm6or8.ufs.sh/f/<clave>`.
- **Borrado después del commit**: si la transacción falla, no se pierde el archivo.
- Las copias de Supabase se conservan: borrarlas es irreversible y no hacía falta
  para el cambio.

## Evidencia

- `npx tsc --noEmit` → 0 errores.
- Subida de prueba real a UploadThing: `201/200` y archivo servido con
  `content-type: image/jpeg` (el archivo de prueba se borró).
- `POST /api/uploads` sin sesión → `401 {"error":"No autorizado"}`.
- `next dev` arranca sin errores; la home responde `200` y sirve URLs `ufs.sh`.
- Migración: `112` filas, `112` migradas, `0` fallidas, `0` URLs de Supabase restantes.
- Muestra de 11 imágenes migradas: `11` con `HEAD 200` e `image/*`.

## Siguiente paso

- Revisar en el panel de admin que se pueden subir y borrar imágenes con una
  sesión real.
- Cuando haya confianza, decidir si se borra el bucket `evolufiles001` de Supabase.
