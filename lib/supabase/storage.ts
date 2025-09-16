// lib/supabase/storage.ts
// "use server";

import { v4 as uuidv4 } from "uuid";
import { createClient } from "./client";

const BUCKET_NAME = "evolufiles001";

interface UploadOptions {
  userId: string;
  file: File;
  bucket?: string;
  onProgress?: (percentage: number) => void;
}

const supabase = createClient();
export const StorageService = {
  async uploadFile({
    userId,
    file,
    bucket = BUCKET_NAME,
    // onProgress,
  }: UploadOptions) {
    // const fileExt = file.name.split('.').pop()
    // const fileName = `${userId}/${crypto.randomUUID()}.${fileExt}`
    // const supabase =  createClient()

    // const { data, error } = await supabase.storage
    //   .from(bucket)
    //   .upload(fileName, file, {
    //     cacheControl: '3600',
    //     upsert: false,
    //     onUploadProgress: (progressEvent) => {
    //       const progress = Math.round(
    //         (progressEvent.loaded / progressEvent.total) * 100
    //       )
    //       onProgress?.(progress)
    //     }
    //   })

    // if (error) throw error

    // return {
    //   path: data.path,
    //   publicUrl: this.getPublicUrl(data.path, bucket)
    // }
    if (!file || file.size === 0) {
      return {
        success: false,
        error: "Archivo inválido",
      };
    }

    // Generar nombre único para el archivo
    const fileExt = file.name.split(".").pop();
    const fileName = `services/${userId}/${crypto.randomUUID()}.${fileExt}`;

    // Subir a Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);
    const path = data?.path as string;
    const publicUrl = this.getPublicUrl(path, bucket);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return {
        path,
        publicUrl,
        success: false,
        error: uploadError.message,
      };
    }
  },

  getPublicUrl(path: string, bucket = BUCKET_NAME) {
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path, {
      download: false,
    });
    return publicUrl;
  },

  async deleteFile(path: string, bucket = BUCKET_NAME) {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
  },
};

interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
  name?: string;
  size?: number;
  type?: string;
}

export async function uploadImages(
  formData: FormData
): Promise<UploadResult[]> {
  const files = formData.getAll("files") as File[];
  console.log("llego upload", files);
  const serviceId = formData.get("serviceId") as string;
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME as string;
  //  const supabase =  createClient()

  if (!files || files.length === 0 || !serviceId) {
    throw new Error("Missing files or user ID");
  }

  try {
    // Procesar todas las subidas en paralelo
    const uploadPromises = files.map(async (file) => {
      try {
        // Validar el archivo
        if (!file || file.size === 0) {
          return {
            success: false,
            error: "Archivo inválido",
          };
        }

        // Generar nombre único para el archivo
        const fileExt = file.name.split(".").pop();
        const fileName = `services/${serviceId}/${crypto.randomUUID()}.${fileExt}`;

        // Subir a Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          return {
            success: false,
            error: uploadError.message,
          };
        }

        // Obtener URL pública
        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(fileName);

        const { error: serviceFileError } = await supabase
          .from("ServiceFile")
          .insert([
            {
              id: uuidv4(),
              serviceId: serviceId,
              name: fileName,
              path: fileName,
              url: publicUrl,
              size: file.size,
              type: file.type,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ])
          .select();

        if (serviceFileError) {
          console.error("Upload error:", serviceFileError);
          return {
            success: false,
            error: serviceFileError.message,
          };
        }

        return {
          name: fileName,
          success: true,
          size: file.size,
          type: file.type,
          url: publicUrl,
          path: fileName,
        };
      } catch (error) {
        console.error("Error processing file:", error);
        return {
          success: false,
          error: (error as Error).message,
        };
      }
    });

    // Esperar a que todas las subidas terminen
    const results = await Promise.all(uploadPromises);

    // Revalidar cache si al menos una subida fue exitosa
    // if (results.some((result) => result.success)) {
    //   revalidatePath("/admin/services");
    // }

    return results;
  } catch (error) {
    console.error("Global upload error:", error);
    return [
      {
        success: false,
        error: (error as Error).message,
      },
    ];
  }
}
