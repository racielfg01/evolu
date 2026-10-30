# Ver detalles de un servicio en el admin

Fecha: 2026-10-29
Estado: implementado y verificado

## Intención

Desde `/admin/services` solo se podía editar o borrar un servicio. Faltaba una
forma de consultarlo completo —imágenes incluidas— sin abrir el formulario de
edición, donde los datos están repartidos en campos y las imágenes solo se ven
como miniaturas de gestión.

## Alcance

- Botón **Ver detalles** (icono de ojo) en cada fila de la tabla de servicios.
- Modal de solo lectura con imágenes, datos, textos y listas del servicio.
- Miniatura de la primera imagen en la columna **Nombre** de la tabla.
- **Fuera de alcance:** editar desde el modal, cambiar el formulario de alta/edición,
  tocar el catálogo público.

## Cambios

| Archivo | Qué hace |
|---|---|
| `components/admin-view/ServiceDetailsModal.tsx` | Modal nuevo: galería con imagen principal, flechas y miniaturas; precio en USD y CUP; duración, categoría, estado, fecha de creación; descripción corta y detallada; beneficios; preparación; fecha de actualización. |
| `components/admin-view/ServiceManagment.tsx` | Estado `detailService` + `isDetailsModalOpen`, acción **Ver detalles** en la columna Acciones, miniatura en la columna Nombre y montaje del modal con el `usdRate` ya cargado. |

## Decisiones

- **Modal, no página aparte.** Es el patrón que ya usa el detalle de citas
  (`AppointmentDetailsModal`) y no obliga a salir del listado.
- **Solo lectura.** Reutiliza el formulario de edición sería más código y más
  riesgo; el detalle responde a "¿qué tiene este servicio?" sin riesgo de
  cambios accidentales.
- **Fallback de imágenes.** Si una URL falla, se descarta de la galería y se
  muestra un aviso (`ImageOff`); si no hay ninguna, "Este servicio no tiene imágenes".
  No se rompe el modal por una imagen caída.
- **`next/image` sin optimizador** (la config del proyecto ya tiene `unoptimized: true`),
  con `sizes` para el contenedor principal y 64x64 para las miniaturas.

## Evidencia

- Datos reales: 113 filas en `ServiceFile`, 60 de 70 servicios con imágenes; todas
  las URLs apuntan a `https://kyw6bm6or8.ufs.sh/f/...`, host ya permitido en
  `next.config.ts`.
- `curl` sobre dos URLs reales → `200 image/jpeg`.
- Prueba en navegador (ruta temporal, datos reales, luego eliminada): el modal
  abrió con 3 imágenes y las cuatro etiquetas `<img>` terminaron con
  `naturalWidth > 0` y `complete: true`.
- `npx tsc --noEmit` → `exit=0`.
