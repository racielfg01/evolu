---
type: article
title: Arquitectura de Evolu
description: Capas, flujo de datos, autenticación y flujo de reserva de la aplicación.
resource: ../../app
tags: [arquitectura, capas, auth, data-flow]
timestamp: 2026-10-12T12:00:00Z
topic: proyecto
status: stable
sources: []
score: 0.0
---

# Arquitectura de Evolu

## Overview

Evolu es una app Next.js 15 con App Router que combina **Server Components**,
**Server Actions** y **Client Components**. La persistencia es Prisma/Postgres.
La autenticación es Supabase Auth (email + contraseña). El estado de UI vive en
providers de React (TanStack Query + contextos de reserva) y en Zustand.

## Capas

```
app/ (rutas, Server Components, layouts)
  └── lib/actions/*.actions.ts   ("use server" → Prisma)      ← acceso a datos
        └── lib/prisma.ts         (PrismaClient singleton)
  └── lib/hooks/*.hooks.ts        (TanStack Query)             ← cliente
  └── components/ (UI; client components)                      ← presentación
        └── lib/actions/*         (server actions, mutaciones/lecturas)
stores/  (Zustand, estado global de UI)
lib/supabase/  (client/server/middleware/auth/storage)
```

- **`lib/actions/*.actions.ts`** son Server Actions (`"use server"`) que
  consultan Prisma y devuelven datos tipados. Aquí está la lógica de negocio
  real: p. ej. `createAppointment` valida solapamiento dentro de una
  transacción (`lib/actions/appointment.actions.ts`).
- **`lib/hooks/*.hooks.ts`** envuelven esas acciones con `useQuery`/`useMutation`
  e invalidan las claves de caché (`['appointments']`, etc.).
- **`services/*.ts`** es una capa antigua, casi toda comentada; solo
  `services/AppointmentService.ts` tiene funciones activas y quedó desincronizada
  del esquema (ver [deuda técnica](./deuda-tecnica.md)).

## Providers (orden de anidado)

`lib/providers/Provider.tsx`:

```
TanstackProvider (QueryClient; staleTime 60s)
  └── EnhancedBookingProvider (components/new-bookings/enhanced-booking-context)
        └── BookingProvider (components/new-bookings/booking-context)
              └── children
```

`app/layout.tsx` monta `Providers` + `Toaster` + `ServiceWorkerRegister`.

## Autenticación

- **Activa: Supabase Auth.** `lib/supabase/auth.ts` (`"use server"`) expone
  `login`, `signUp`, `signOut`, `resetPassword`, `updatePassword`,
  `getCurrentUser`, `getSession`.
- `signUp` crea el usuario en Supabase y luego un registro `User` en Prisma
  (vinculado por `cuid = supabase user.id`), asignando el rol `USER`.
- `lib/supabase/server.ts` y `client.ts` crean clientes SSR/browser.
- `middleware.ts` llama a `updateSession` (`lib/supabase/middleware.ts`), que
  **solo refresca el token**; la protección de rutas está comentada.
- **NextAuth v4 es código muerto**: `auth.ts` está íntegramente comentado, junto
  con los modelos `Account`/`Session`/`VerificationToken` del esquema.

## Flujo de reserva

Implementado en `components/new-bookings/*` (versión "enhanced"):

1. **Selección de servicios** (`enhanced-service-selection.tsx` / catálogo).
2. **Fecha y hora** (`date-time-selection.tsx`), alimentado por las acciones de
   disponibilidad (`availability.actions.ts`, `daySchedule.actions.ts`,
   `timeSlot.actions.ts`).
3. **Datos del usuario** (`user-information.tsx`).
4. **Confirmación** (`confirmation.tsx`) → `createAppointment`, que verifica
   solapamiento en transacción y crea `Appointment` + `AppointmentService`.

La disponibilidad se deriva de `BusinessConfig` (aviso mínimo),
`DayAvailability` (horario semanal), `SpecialDate` (excepciones) y las citas
`PENDING` existentes.

## API routes

- `app/api/auth/confirm/route.ts` — confirma email (token Supabase).
- `app/api/auth/new-password/route.ts` — flujo de nueva contraseña.
- `app/api/auth/signout/route.ts` — cierre de sesión.

## Related

- [Visión general](./vision-general.md)
- [Modelo de datos](./modelo-de-datos.md)
- [Rutas y pantallas](./rutas-y-pantallas.md)
- [Deuda técnica](./deuda-tecnica.md)
