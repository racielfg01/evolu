// lib/uploadthing.server.ts
// Utilidades de almacenamiento con UploadThing (solo servidor).
// El token (UPLOADTHING_TOKEN) nunca debe llegar al navegador.
import { UTApi } from "uploadthing/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

let utapi: UTApi | null = null;

export function getUtapi() {
  if (!utapi) {
    utapi = new UTApi();
  }
  return utapi;
}

// Las rutas antiguas se guardaron como "services/<serviceId>/<archivo>".
// Las nuevas son la clave (key) que devuelve UploadThing.
const LEGACY_PREFIX = "services/";

export function isLegacySupabasePath(path: string) {
  return path.startsWith(LEGACY_PREFIX);
}

export function isUploadThingPath(path: string) {
  return path.length > 0 && !isLegacySupabasePath(path);
}

/**
 * Borra archivos del almacenamiento.
 * - Claves de UploadThing -> UTApi.
 * - Rutas antiguas de Supabase -> se siguen borrando en Supabase
 *   para que la migración parcial no deje huérfanos.
 */
export async function deleteStoredFiles(paths: string[]) {
  const cleanPaths = paths.filter((path) => typeof path === "string" && path.length > 0);
  const uploadThingKeys = cleanPaths.filter(isUploadThingPath);
  const legacyPaths = cleanPaths.filter(isLegacySupabasePath);

  if (uploadThingKeys.length > 0) {
    const result = await getUtapi().deleteFiles(uploadThingKeys);
    if (!result.success) {
      console.error("UploadThing delete error:", uploadThingKeys);
    }
  }

  if (legacyPaths.length > 0) {
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME as string;
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase.storage.from(bucket).remove(legacyPaths);
    if (error) {
      console.error("Supabase delete error:", error.message);
    }
  }
}
