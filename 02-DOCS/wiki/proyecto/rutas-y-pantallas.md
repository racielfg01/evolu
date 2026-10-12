---
type: article
title: Rutas y pantallas
description: Mapa de rutas de App Router, pantallas de cliente y panel de administración.
resource: ../../app
tags: [rutas, ui, admin, app-router]
timestamp: 2026-10-12T12:00:00Z
topic: proyecto
status: stable
sources: []
score: 0.0
---

# Rutas y pantallas

## Overview

Las rutas viven en `app/` (App Router) y se agrupan por área con route groups:
público (raíz), `(auth)`, `(client)` y `admin` (sin grupo). La raíz es el
flujo de reserva; el panel admin gestiona todo el negocio.

## Rutas

| Ruta | Archivo | Pantalla |
|------|---------|----------|
| `/` | `app/page.tsx` | Reserva pública (catálogo + asistente). Server Component que carga categorías/servicios y usuario actual. |
| `/login` | `app/(auth)/login/page.tsx` | Inicio de sesión (Supabase). |
| `/register` | `app/(auth)/register/page.tsx` | Registro. |
| `/update-password` | `app/(auth)/update-password/page.tsx` | Cambio de contraseña (`loading.tsx` de soporte). |
| `/bookings` | `app/(client)/bookings/page.tsx` | Citas del cliente. |
| `/profile` | `app/(client)/profile/page.tsx` | Perfil del cliente. |
| `/admin` | `app/admin/page.tsx` + `layout.tsx` | Panel de administración. |
| `/admin/appointments` | `app/admin/appointments/page.tsx` | Gestión de citas. |
| `/admin/services` | `app/admin/services/page.tsx` | Gestión de servicios. |
| `/admin/users` | `app/admin/users/page.tsx` | Listado de usuarios. |
| `/admin/users/[id]` | `app/admin/users/[id]/page.tsx` | Detalle de usuario. |
| `/admin/settings` | `app/admin/settings/page.tsx` | Configuración del negocio. |
| `/api/auth/confirm` | `app/api/auth/confirm/route.ts` | Confirmación de email. |
| `/api/auth/new-password` | `app/api/auth/new-password/route.ts` | Nueva contraseña. |
| `/api/auth/signout` | `app/api/auth/signout/route.ts` | Cerrar sesión. |

## Home de reserva

`app/page.tsx` (Server Component) resuelve `getCurrentUser`, `fetchAllCategories`
y `fetchAllServices`, y los pasa a `BookingContent`
(`components/new-bookings/enhanced-beauty-booking.tsx`). El asistente se apoya en
los contextos de reserva montados en `app/layout.tsx`.

## Panel de administración

| Componente (`components/admin-view/`) | Uso |
|---------------------------------------|-----|
| `admin-dashboard.tsx` | Vista principal del panel. |
| `section-cards.tsx`, `chart-area-interactive.tsx` | Métricas y gráficas. |
| `data-table.tsx`, `appoinment/` | Tablas y detalle de citas. |
| `UserModal.tsx`, `ClientManagment .tsx` | Gestión de usuarios/clientes. |
| `ServiceManagment.tsx`, `CategoryManagment.tsx` | Catálogo. |
| `RolManagment.tsx`, `SexManagment.tsx` | Catálogos auxiliares. |
| `Configuration.tsx` | Configuración del negocio. |
| `app-sidebar.tsx`, `nav-*.tsx`, `site-header.tsx` | Navegación (shadcn sidebar). |
| `SearchAppointments.tsx` | Búsqueda de citas. |

> `app/admin/AdminClientPage.tsx` está enteramente comentado (resto antiguo de
> la vista admin).

## Componentes de UI

- `components/ui/*` — librería shadcn/ui (Radix).
- `components/new-bookings/*` — implementación **activa** del flujo de reserva.
- `components/booking/*` — implementación **duplicada** del mismo flujo (legacy).
- `components/comun/*` — modales y tablas reutilizables (español).
- `components/admin-view/*` — panel admin.

## Related

- [Arquitectura](./arquitectura.md) — flujo de reserva paso a paso.
- [Deuda técnica](./deuda-tecnica.md) — duplicación entre `booking/` y `new-bookings/`.
