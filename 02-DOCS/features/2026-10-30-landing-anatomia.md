# Anatomía de landing de conversión aplicada a la home

Fecha: 2026-10-30
Estado: aplicado y verificado en navegador

## Intención

La home pública tenía las secciones en un orden que no seguía una lógica de
conversión: los servicios salían de datos de prueba, no había categorías, ni
preguntas frecuentes, ni un cierre con llamada a la acción. Además el skill de
diseño no tenía una referencia de landing.

## Alcance

- Referencia `references/conversion-homepage.md` en el skill `design`, enlazada
  desde su `SKILL.md`.
- Orden de la landing: Hero → Los más Pedidos → Categorías → Testimonios →
  ¿Por qué elegirnos? → Sobre nosotros → Preguntas frecuentes → CTA final.
- **Fuera de alcance:** logos de prensa, reseñas en video (UGC) y calificaciones
  de producto: el negocio no tiene esos datos y no se inventan.

## Cambios

| Archivo | Qué hace |
|---|---|
| `.rsc/skills/design/references/conversion-homepage.md` | Anatomía de las 11 secciones, reglas de conversión y cómo aplicarla a una landing existente. |
| `.rsc/skills/design/SKILL.md` | Enlaza la referencia para los modos **Persuade**. |
| `lib/actions/services.actions.ts` | `fetchPopularServices`: ordena por citas registradas reales y completa con los servicios más recientes. |
| `components/Services.tsx` | Tarjetas con servicios reales: imagen, nombre, descripción, duración, precio en USD y botón **Reservar**. Se quitó `mockServices` y la etiqueta "Popular" inventada. |
| `components/Categories.tsx` | Categorías reales de la base, sin "Información"; al pulsar abre el catálogo ya filtrado por esa categoría. |
| `components/Hero.tsx` | Tres beneficios (certificados, productos premium, atención personalizada), CTA **Reservar cita** visible sin scroll y enlace secundario a servicios. |
| `components/Booking.tsx` | "¿Por qué elegirnos?" con CTA al final; se eliminó una sección anidada y el `id="contact"` engañoso. |
| `components/Faq.tsx` | Seis preguntas con respuestas tomadas del flujo real (cuenta, cancelación, horario del footer, WhatsApp). |
| `components/FinalCta.tsx` | Cierre con titular y botón **Reservar cita**. |
| `components/new-bookings/home-page.tsx` | Nuevo orden de secciones y paso de servicios y categorías reales. |
| `components/new-bookings/enhanced-beauty-booking.tsx` | Estado `catalogCategoryId` y `openCatalog` / `openCatalogCategory`. |
| `components/new-bookings/UnifiedServicesComponent.tsx` | Prop `initialCategoryId` para abrir el catálogo filtrado desde una categoría. |
| `app/page.tsx` | Consulta `fetchPopularServices(4)` en el servidor. |

## Decisiones

- **Los más pedidos se calculan de verdad.** `AppointmentService` tiene 798
  citas registradas; se agrupa por `service_id` y se ordena por cantidad. Si no
  hay historial suficiente, se completa con los servicios activos más recientes.
- **Nada de prueba social inventada.** No hay logos de prensa, reseñas en video
  ni puntuaciones en la base, así que esas tres secciones del guion no se
  montan y se anotan como pendientes de contenido real.
- **Las preguntas frecuentes solo dicen lo que ya es cierto:** cómo se reserva,
  que hace falta cuenta, que se puede cancelar desde Mis citas, el horario del
  footer y el WhatsApp de contacto.
- **Categoría "Información" fuera de la landing.** Agrupa avisos (por ejemplo,
  políticas de depósito), no tratamientos; en el catálogo sigue disponible.

## Verificación

- `npx tsc --noEmit` → `exit=0`.
- Navegador a 1440 y 390 px: sin scroll horizontal (`scrollWidth` ≤ viewport),
  CTA principal dentro del primer pantallazo (top 419 px a 390 de ancho).
- Orden comprobado en el DOM: servicios, categorías, testimonios, beneficios,
  sobre nosotros, FAQ, CTA final.
- "Los más Pedidos" muestra servicios reales por popularidad: BRASILEÑO 3SS y +,
  DEPILACIÓN DE AXILAS 3ss y +, DEPILACIÓN DE BOZO, Brasileño 2da sesión.
- Pulsar **Faciales** abre el catálogo con ese filtro activo y solo servicios de
  esa categoría.
- FAQ abre y muestra la respuesta (elemento `details`).
- Consola del navegador: 0 errores.
