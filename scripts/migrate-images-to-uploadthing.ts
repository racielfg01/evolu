/**
 * Migra las imágenes de servicio que aún están en Supabase Storage
 * hacia UploadThing y actualiza la fila de ServiceFile.
 *
 * Uso:
 *   npx tsx scripts/migrate-images-to-uploadthing.ts --dry-run
 *   npx tsx scripts/migrate-images-to-uploadthing.ts
 *
 * Notas:
 * - Es idempotente: las imágenes que ya apuntan a UploadThing se saltan.
 * - No borra las copias de Supabase; solo copia y actualiza la base de datos.
 * - Requiere UPLOADTHING_TOKEN y DATABASE_URL en el entorno (.env).
 */
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const CONCURRENCY = 3;

interface Failure {
  id: string;
  url: string;
  error: string;
}

function getArgValue(name: string) {
  const prefix = `--${name}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const limit = Number(getArgValue("limit") || "0") || undefined;

  const { default: prisma } = await import("../lib/prisma");
  const { getUtapi } = await import("../lib/uploadthing.server");
  const { UTFile } = await import("uploadthing/server");

  const utapi = getUtapi();

  const rows = await prisma.serviceFile.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      path: true,
      url: true,
      size: true,
      type: true,
    },
  });

  const pending = rows
    .filter((row) => !row.url.includes(".ufs.sh/"))
    .slice(0, limit);

  console.log(
    `Imágenes totales: ${rows.length} · pendientes: ${pending.length} · ` +
      `ya migradas: ${rows.length - pending.length}`
  );

  if (pending.length === 0) {
    console.log("Nada que migrar.");
    await prisma.$disconnect();
    return;
  }

  if (dryRun) {
    pending.slice(0, 5).forEach((row) => console.log(`- ${row.url}`));
    console.log(
      `Modo simulación: no se subió nada. Quita --dry-run para migrar las ${pending.length} imágenes.`
    );
    await prisma.$disconnect();
    return;
  }

  const failures: Failure[] = [];
  let migrated = 0;
  let processed = 0;

  async function migrateOne(row: (typeof pending)[number]) {
    try {
      const response = await fetch(row.url);
      if (!response.ok) {
        throw new Error(`Descarga falló con estado ${response.status}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const fileName = row.name || `${row.id}.${row.type.split("/").pop() || "jpg"}`;
      const file = new UTFile([buffer], fileName, { type: row.type });

      const [uploaded] = await utapi.uploadFiles([file]);

      if (uploaded.error || !uploaded.data) {
        throw new Error(uploaded.error?.message || "UploadThing no devolvió datos");
      }

      const { key, ufsUrl } = uploaded.data;

      await prisma.serviceFile.update({
        where: { id: row.id },
        data: {
          path: key,
          url: ufsUrl,
          size: buffer.byteLength,
        },
      });

      migrated++;
      console.log(`[${processed}/${pending.length}] ok ${row.id} -> ${ufsUrl}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push({ id: row.id, url: row.url, error: message });
      console.error(`[${processed}/${pending.length}] error ${row.id}: ${message}`);
    }
  }

  // Pool de trabajadores para no saturar la red.
  let cursor = 0;
  async function worker() {
    while (cursor < pending.length) {
      const row = pending[cursor++];
      processed++;
      await migrateOne(row);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, pending.length) }, worker)
  );

  await prisma.$disconnect();

  console.log(
    `\nResultado: ${migrated} migradas, ${failures.length} fallidas de ${pending.length}.`
  );

  if (failures.length > 0) {
    console.log("\nFallidas (puedes volver a ejecutar el script):");
    failures.forEach((failure) =>
      console.log(`- ${failure.id}: ${failure.error}`)
    );
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Error global de migración:", error);
  process.exit(1);
});
