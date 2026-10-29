// lib/uploads-client.ts
// Cliente de subida de imágenes. Envía los archivos al route handler
// /api/uploads, que los guarda en UploadThing con el token del servidor.

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
  name?: string;
  size?: number;
  type?: string;
}

export async function uploadImages(formData: FormData): Promise<UploadResult[]> {
  try {
    const response = await fetch("/api/uploads", {
      method: "POST",
      body: formData,
    });

    const json = (await response.json().catch(() => null)) as
      | { results?: UploadResult[]; error?: string }
      | null;

    if (!response.ok) {
      return [
        {
          success: false,
          error: json?.error || `Error al subir las imágenes (${response.status})`,
        },
      ];
    }

    return json?.results ?? [];
  } catch (error) {
    return [
      {
        success: false,
        error: (error as Error).message,
      },
    ];
  }
}
