// app/api/uploads/route.ts
// Subida de imágenes de servicios a UploadThing.
// El navegador envía FormData (files + serviceId) y este handler
// usa el token del servidor para guardar los archivos.
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";
import { getUtapi } from "@/lib/uploadthing.server";

export const runtime = "nodejs";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
  name?: string;
  size?: number;
  type?: string;
}

function isFile(value: unknown): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    "size" in value &&
    "type" in value
  );
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user || user.role?.name === "USER") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await req.formData();
  const serviceId = formData.get("serviceId");
  const files = formData.getAll("files").filter(isFile);

  if (typeof serviceId !== "string" || serviceId.length === 0) {
    return NextResponse.json(
      { error: "Falta el identificador del servicio" },
      { status: 400 }
    );
  }

  if (files.length === 0) {
    return NextResponse.json(
      { error: "No se recibió ninguna imagen" },
      { status: 400 }
    );
  }

  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { error: `No puedes subir más de ${MAX_FILES} imágenes` },
      { status: 400 }
    );
  }

  const invalidFile = files.find(
    (file) => !file.type.startsWith("image/") || file.size > MAX_FILE_SIZE
  );

  if (invalidFile) {
    return NextResponse.json(
      { error: `"${invalidFile.name}" no es una imagen válida o supera 5MB` },
      { status: 400 }
    );
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { id: true },
  });

  if (!service) {
    return NextResponse.json(
      { error: "El servicio no existe" },
      { status: 404 }
    );
  }

  // Se sube archivo por archivo para que el resultado coincida siempre
  // con el archivo de la misma posición en el array.
  const uploaded = await Promise.all(
    files.map((file) =>
      getUtapi()
        .uploadFiles([file], { acl: "public-read" })
        .then((results) => results[0])
    )
  );

  const results: UploadResult[] = [];

  for (let index = 0; index < uploaded.length; index++) {
    const response = uploaded[index];
    const file = files[index];

    if (response.error || !response.data) {
      results.push({
        success: false,
        error: response.error?.message || "No se pudo subir la imagen",
      });
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
          serviceId: service.id,
        },
      });
    } catch (error) {
      // Si la fila no se pudo guardar, el archivo queda huérfano:
      // lo borramos para no dejar basura en el almacenamiento.
      await getUtapi().deleteFiles(key).catch(() => undefined);
      results.push({
        success: false,
        error: (error as Error).message,
      });
      continue;
    }

    results.push({
      success: true,
      name: file.name,
      path: key,
      url: ufsUrl,
      size: file.size,
      type: file.type,
    });
  }

  return NextResponse.json({ results });
}
