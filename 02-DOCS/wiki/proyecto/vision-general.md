---
type: article
title: Visión general de Evolu
description: Qué es el proyecto Evolu, su dominio de negocio, stack y cómo arrancarlo en local.
resource: ../../
tags: [overview, negocio, stack, onboarding]
timestamp: 2026-10-12T12:00:00Z
topic: proyecto
status: stable
sources: []
score: 0.0
---

# Visión general de Evolu

## Overview

Evolu es una aplicación web de reserva de servicios de belleza y bienestar
(depilación, masajes, podología y estética). Permite a un cliente elegir
servicios, ver disponibilidad real, reservar una cita y gestionarla; y a un
administrador gestionar servicios, categorías, usuarios, roles, horarios y
configuración del negocio. El paquete se llama `evolu-app` y vive en este
repositorio (raíz `package.json`).

## Dominio de negocio

- **Cliente**: se registra/inicia sesión, navega el catálogo, reserva y consulta
  o cancela sus citas.
- **Administrador**: gestiona el catálogo (servicios, categorías), la agenda
  (disponibilidad, citas, estados) y los usuarios (roles, sexos, perfiles).
- **Negocio**: se configura mediante disponibilidad semanal, fechas especiales
  y aviso mínimo de reserva (`BusinessConfig`).

Roles previstos: `SUPER_ADMIN`, `ADMIN`, `USER` (ver [modelo de datos](./modelo-de-datos.md)).

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 15.1.11 (App Router, Server Actions) |
| UI | React 19, TypeScript 5.8, TailwindCSS 3.4, shadcn/ui (Radix), framer-motion, lucide-react |
| Datos (cliente) | TanStack Query v5 (`lib/hooks/*`), Zustand (`stores/`) |
| Formularios / validación | react-hook-form, zod |
| Base de datos | PostgreSQL vía Prisma 6 (`DATABASE_URL` + `DIRECT_URL`) |
| Auth | Supabase Auth con `@supabase/ssr` |
| Almacenamiento | Supabase Storage (bucket `evolufiles001`) |
| Gráficas | recharts |
| PWA | Service Worker (`ServiceWorkerRegister`) + `public/manifest.json` |

Detalle de capas en [arquitectura](./arquitectura.md).

## Cómo arrancar en local

```bash
npm install
npx prisma migrate dev      # aplica migraciones
npx prisma db seed          # datos iniciales (prisma/seed.ts)
npm run dev                 # http://localhost:3000
```

- `npm run build` → `prisma generate && next build`.
- `npm run lint` → `next lint` (deprecado en Next 15, ver [deuda técnica](./deuda-tecnica.md)).

## Variables de entorno

Definidas en `.env.example`: `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`,
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`NEXT_PUBLIC_SUPABASE_BUCKET_NAME`, `NEXT_PUBLIC_SITE_URL` y `DATABASE_URL_PROD`.

> ⚠️ `.env.example` contiene lo que parece una clave real de Prisma Postgres en
> `DATABASE_URL_PROD`. Debe rotarse y sustituirse por un placeholder.

## Related

- [Arquitectura](./arquitectura.md) — cómo se conectan las capas.
- [Modelo de datos](./modelo-de-datos.md) — tablas y relaciones.
- [Rutas y pantallas](./rutas-y-pantallas.md) — mapa de la aplicación.
- [Deuda técnica](./deuda-tecnica.md) — lo que hay que saber antes de tocar nada.
