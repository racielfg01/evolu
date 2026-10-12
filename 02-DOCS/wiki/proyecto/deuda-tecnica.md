---
type: article
title: Deuda técnica y avisos
description: Código muerto, duplicaciones, riesgos de seguridad y desincronizaciones a conocer antes de tocar Evolu.
resource: ../../
tags: [deuda-tecnica, seguridad, gotchas, refactor]
timestamp: 2026-10-12T12:00:00Z
topic: proyecto
status: stable
sources: []
score: 0.0
---

# Deuda técnica y avisos

## Overview

El proyecto funciona, pero arrastra una migración a medio hacer (NextAuth →
Supabase Auth) y mucho código comentado. Antes de tocar una zona, revisar esta
lista: buena parte de los archivos son versiones antiguas conservadas como
comentarios o duplicados.

## Código muerto (comentado al 100%)

- `auth.ts` — toda la configuración NextAuth v4.
- `lib/database.ts` — operaciones Prisma antiguas.
- `actions/auth.ts` — server action de registro antiguo.
- `app/admin/AdminClientPage.tsx` — vista admin antigua.
- Partes de `lib/supabase/middleware.ts`, `lib/supabase/client.ts`,
  `lib/prisma.ts` y `lib/actions/config.actions.ts` (versión previa, luego
  redefinida en el mismo archivo).
- `services/*.ts` — casi todas las funciones comentadas; solo
  `services/AppointmentService.ts` tiene funciones activas.

## Desincronizaciones

- `services/AppointmentService.ts` usa tipos antiguos (`timeSlotId`, `serviceId`)
  que ya no existen: la cita ahora se relaciona con servicios vía
  `AppointmentService`.
- Hay **dos juegos de tipos**: `lib/types.ts` (interface `Service`, `Booking`…)
  y `types/types.ts` (enum `Role`/`Sex` + interfaces). Se solapan y no coinciden
  con el esquema Prisma.
- `lib/actions/config.actions.ts` contiene dos implementaciones del mismo
  contrato (una comentada, una activa).

## Duplicación

- Flujo de reserva duplicado: `components/booking/*` vs
  `components/new-bookings/*` (activo).
- Componentes repetidos: `Logo`, `theme-provider`, `confirmation`,
  `progress-indicator`, `date-time-selection`, `service-selection`,
  `user-information` (en `booking/` y `new-bookings/`).
- Dos dashboards: `components/admin-view/admin-dashboard.tsx` y
  `components/new-bookings/admin-dashboard.tsx`.

## Seguridad

- **Clave de Prisma Postgres en `.env.example`** (`DATABASE_URL_PROD`): parece
  real y está en el repo. Rotarla y sustituirla por un placeholder.
- **Protección de rutas desactivada**: `middleware.ts` solo refresca el token de
  Supabase; la comprobación de usuario en rutas `(client)`/`admin` está
  comentada, así que las páginas dependen de comprobaciones internas. Verificar
  el control de acceso al panel `admin`.
- En `signUp` (`lib/supabase/auth.ts`) se guarda `password: data.email` como
  placeholder en la tabla `users`; la contraseña real la gestiona Supabase. No
  usar ese campo para autenticar.

## Convenciones y detalles

- Mezcla de idiomas: identificadores en inglés, textos/UI y comentarios en
  español.
- `npm run lint` usa `next lint`, deprecado en Next 15.
- `next.config.ts` permite imágenes remotas de un proyecto Supabase concreto y
  fija `unoptimized: true`.
- Existe `prisma/seed.js` legacy además de `prisma/seed.ts` (el usado por
  `package.json`).
- Hay un cambio sin commitear conocido en
  `components/admin-view/appoinment/AppointmentDetailsModal.tsx`.

## Related

- [Visión general](./vision-general.md)
- [Arquitectura](./arquitectura.md)
- [Modelo de datos](./modelo-de-datos.md)
- [Rutas y pantallas](./rutas-y-pantallas.md)
