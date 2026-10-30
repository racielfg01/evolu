# Eliminar una imagen de un servicio no se reflejaba en la tabla

Fecha: 2026-10-29
Estado: corregido y verificado

## Intención

Al editar un servicio y quitarle una imagen, la tabla de `/admin/services`
seguía mostrando la imagen eliminada como miniatura. El borrado llegaba a la
base de datos, pero la tabla no se enteraba.

## Causa raíz

En `components/ImageUploader.tsx`, los botones de quitar imagen (la X sobre
cada miniatura) eran `<Button>` **sin `type`** dentro del `<form>` del modal de
alta/edición. En HTML, un botón sin `type` dentro de un formulario es
`type="submit"`.

Resultado: pulsar la X **enviaba el formulario completo** en ese instante, con
el estado anterior al clic (`imagesToDelete` todavía vacío). El modal se cerraba
de golpe, el servicio se guardaba sin borrar nada y la tabla quedaba igual.

Ese mismo submit prematuro lanzaba la invalidación de React Query **antes** de
que la mutación terminara, compitiendo con la invalidación de `onSuccess`.

## Cambios

| Archivo | Qué hace |
|---|---|
| `components/ImageUploader.tsx` | Los dos botones de quitar imagen llevan `type="button"` (imágenes existentes y nuevas) y `aria-label` descriptivo. |
| `components/comun/AddServiceModal.tsx` | `handleSubmit` espera (`await`) a `onSubmitEdit` / `onSubmit`; los props aceptan `void \| Promise<void>`. El modal solo se cierra cuando el guardado terminó. |
| `components/admin-view/ServiceManagment.tsx` | `handleUpdate` usa `mutateAsync` y espera la mutación antes de cerrar. Así la invalidación posterior a `handleClose` corre después del commit, no antes. |

## Evidencia

Reproducción en navegador sobre un servicio temporal con dos imágenes:

| Paso | Antes del arreglo | Después |
|---|---|---|
| Clic en la X | El diálogo se cerraba al instante | El diálogo sigue abierto, quedan 2/3 imágenes |
| Filas en `ServiceFile` tras el clic | 3 (no se borraba nada) | 3 hasta pulsar «Actualizar» |
| Clic en «Actualizar Servicio» | No aplica (ya se había cerrado) | Se borra en la base y la miniatura pasa a la imagen 2 |
| Datos de la consulta (`dataUpdatedAt`) | Sin cambios | Avanza **después** del commit (20:28:53 > 20:28:44) |

- Comprobado también contra la base de datos: tras guardar quedan solo las
  imágenes que no se eliminaron.
- `npx tsc --noEmit` → `exit=0`.
- La prueba se hizo en una copia limpia del proyecto (`/tmp/evolu-test`) porque
  el servidor de desarrollo original recompilaba sin parar al detectar los
  archivos que escriben el harness (`.rsc/`) y Playwright (`.playwright-mcp/`).
- El servicio y la ruta temporales usados para la prueba se borraron al terminar.

## Nota para el futuro

Cualquier `<button>` dentro de un `<form>` que no deba enviar el formulario
necesita `type="button"` explícito. Los botones del asistente de pasos y el de
cancelar ya lo tenían; solo faltaban los de quitar imagen.
