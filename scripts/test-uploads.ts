// scripts/test-uploads.ts
// Verifica que las imágenes se suben correctamente a UploadThing y se guardan
// en la base de datos como ServiceFile. No requiere una cuenta de Supabase:
// llama directamente a UploadThing y a Prisma, imitando lo que hace el route
// handler /api/uploads.
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { randomUUID } from "node:crypto";

const TEST_SERVICE_PREFIX = "test-upload-";

async function main() {
  const { default: prisma } = await import("../lib/prisma");
  const { getUtapi } = await import("../lib/uploadthing.server");
  const { UTFile } = await import("uploadthing/server");

  const utapi = getUtapi();

  // Limpiar recursos de pruebas anteriores.
  const oldServices = await prisma.service.findMany({
    where: { cuid: { startsWith: TEST_SERVICE_PREFIX } },
    select: { id: true },
  });

  if (oldServices.length) {
    const oldIds = oldServices.map((s) => s.id);
    await prisma.serviceFile.deleteMany({ where: { serviceId: { in: oldIds } } });
    await prisma.service.deleteMany({ where: { id: { in: oldIds } } });
  }

  // Crear un servicio de prueba (usa datos mínimos válidos del schema).
  const category = await prisma.category.findFirst();
  if (!category) {
    console.error("❌ No hay categorías en la base de datos; abortando test.");
    await prisma.$disconnect();
    return;
  }

  const testService = await prisma.service.create({
    data: {
      cuid: TEST_SERVICE_PREFIX + randomUUID(),
      name: "Servicio de prueba - subida de imágenes",
      description: "Creado por scripts/test-uploads.ts",
      detailedDescription: "Descripción detallada de prueba.",
      price: 100,
      duration: 60,
      benefits: [],
      preparation: [],
      category_id: category.id,
      isActive: true,
    },
  });

  console.log(`✓ Servicio de prueba creado: ${testService.id}`);

  // Simular 3 imágenes (bytes reales, no fetch).
  const files = Array.from({ length: 3 }, (_, i) => {
    const buffer = new Uint8Array(2048).fill(i);
    return new UTFile([buffer], `test-${i + 1}.png`, { type: "image/png" });
  });

  // Subir una por una, igual que el route handler.
  const uploaded = await Promise.all(
    files.map((file) =>
      getUtapi().uploadFiles([file], { acl: "public-read" }).then((r) => r[0])
    )
  );

  const results: { key: string; url: string }[] = [];
  for (let i = 0; i < uploaded.length; i++) {
    const response = uploaded[i];
    const file = files[i];

    if (response.error || !response.data) {
      console.error(`❌ Error subiendo ${file.name}:`, response.error?.message);
      process.exitCode = 1;
      continue;
    }

    const { key, ufsUrl } = response.data;

    try {
      await prisma.serviceFile.create({
        data: {
          name: file.name,
          path: key,
          url: ufsUrl,
          size: file.size,
          type: file.type,
          serviceId: testService.id,
        },
      });
      results.push({ key, url: ufsUrl });
      console.log(`✓ ${file.name} -> ${ufsUrl}`);
    } catch (error) {
      await utapi.deleteFiles(key).catch(() => undefined);
      console.error(`❌ Error guardando ${file.name} en DB:`, error);
      process.exitCode = 1;
    }
  }

  // Verificar que las URLs son servidas (con retry por red momentánea).
  console.log("\nVerificando URLs en UploadThing...");
  let allOK = true;
  for (const result of results) {
    let ok = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetch(result.url, { method: "HEAD" });
        ok = response.ok;
        if (ok) break;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    console.log(`  ${ok ? "✓" : "✗"} ${result.url}`);
    if (!ok) allOK = false;
  }

  // Verificar que la DB tiene los ServiceFile.
  const savedFiles = await prisma.serviceFile.findMany({
    where: { serviceId: testService.id },
  });
  console.log(`\nServiceFile en DB: ${savedFiles.length} (esperado ${results.length})`);
  if (savedFiles.length !== results.length) allOK = false;

  // Limpiar.
  console.log("\nLimpiando recursos de prueba...");
  const keys = savedFiles.map((f) => f.path);
  try {
    await utapi.deleteFiles(keys);
    console.log("✓ Archivos eliminados de UploadThing.");
  } catch (error) {
    console.warn("No se pudieron eliminar los archivos de UploadThing:", error);
  }
  await prisma.serviceFile.deleteMany({ where: { serviceId: testService.id } });
  await prisma.service.delete({ where: { id: testService.id } });

  const remainingTestFiles = await prisma.serviceFile.count({
    where: { serviceId: testService.id },
  });
  const testStillExists = await prisma.service.findUnique({
    where: { id: testService.id },
  });

  await prisma.$disconnect();

  const testServiceRemoved = !testStillExists;

  if (
    allOK &&
    savedFiles.length === results.length &&
    testServiceRemoved &&
    remainingTestFiles === 0
  ) {
    console.log(
      "\n🎉 Test completado con éxito: las imágenes se suben y guardan correctamente."
    );
  } else {
    console.log("\n❌ El test falló. Revisar la salida anterior.");
    console.log("  URLs OK:", allOK);
    console.log("  ServiceFile guardados:", savedFiles.length, "de", results.length);
    console.log("  Servicio eliminado:", testServiceRemoved);
    console.log("  ServiceFile de prueba restantes:", remainingTestFiles);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Error inesperado:", error);
  process.exit(1);
});