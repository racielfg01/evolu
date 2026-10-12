---
type: article
title: Modelo de datos
description: Tablas Prisma de Evolu, relaciones, enumeraciones y estado del esquema.
resource: ../../prisma/schema.prisma
tags: [datos, prisma, esquema, postgres]
timestamp: 2026-10-12T12:00:00Z
topic: proyecto
status: stable
sources: []
score: 0.0
---

# Modelo de datos

## Overview

El esquema Prisma (`prisma/schema.prisma`, proveedor PostgreSQL) modela el
catálogo de servicios, la agenda, los usuarios y su autenticación. La sesión
vive en Supabase, pero los usuarios de negocio se replican en la tabla `users`.

## Entidades de negocio

| Modelo | Tabla | Rol |
|--------|-------|-----|
| `User` | `users` | Cliente/admin. `cuid` = id de Supabase; `role_id`, `sex_id`. |
| `Role` | `roles` | `SUPER_ADMIN` / `ADMIN` / `USER` (nombre único). |
| `Sex` | `sexes` | Catálogo de sexos. |
| `Category` | `categories` | Categoría de servicios. |
| `Service` | `services` | Servicio con precio, duración, beneficios y preparación. |
| `ServiceFile` | (por defecto) | Imagen/archivo de un servicio (Supabase Storage). |
| `Appointment` | `appointments` | Cita: `date`, `endDate`, `duration`, `total_price`, `status`. |
| `AppointmentService` | `appointment_services` | Join cita↔servicio con `quantity`. |

## Disponibilidad y configuración

| Modelo | Tabla | Rol |
|--------|-------|-----|
| `WorkingHours` | `working_hours` | Horario por `dayOfWeek` (único) con descansos. |
| `BreakTime` | `break_times` | Descansos de un `WorkingHours`. |
| `BusinessConfig` | `business_config` | Aviso mínimo de reserva (`minBookingNotice`, horas). |
| `DayAvailability` | `day_availability` | Franjas mañana/tarde por `dayOfWeek` (único). |
| `SpecialDate` | `special_dates` | Excepciones por fecha concreta. |

## Autenticación y perfiles

- `Account`, `Session`, `VerificationToken`: residuo de **NextAuth** (hoy en
  desuso; el código que los usaba está comentado).
- `ClientAdminProfile` | `client_admin_profiles`: notas y tags del admin sobre un
  cliente (`clientId` único).

## Relaciones clave

```
Role 1─n User n─1 Sex
User 1─n Appointment 1─n AppointmentService n─1 Service
Category 1─n Service 1─n ServiceFile
WorkingHours 1─n BreakTime
```

`Appointment` tiene índices en `date`, `user_id` y `status`.
`AppointmentService` es único por `(appointment_id, service_id)` y borra en
cascada con la cita.

## Enumeraciones

- `AppointmentStatus`: `PENDING` (por defecto), `COMPLETED`, `CANCELLED`.
  `autoCompletePastAppointments` marca como `COMPLETED` las `PENDING` cuya
  `endDate` ya pasó.

## Migraciones

14 migraciones en `prisma/migrations/`, desde `init` hasta
`add_servicesfields_is_active` (2025-08). El seed está en `prisma/seed.ts`
(ejecutado con `tsx`); existe también un `prisma/seed.js` legacy.

## Related

- [Arquitectura](./arquitectura.md) — quién lee/escribe estos modelos.
- [Deuda técnica](./deuda-tecnica.md) — modelos y tipos desincronizados.
