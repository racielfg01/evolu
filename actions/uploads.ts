// 'use server'

// import { supabase } from '@/lib/supabase/client'
// import { revalidatePath } from 'next/cache'

// export async function uploadImage(formData: FormData) {
//     const file = formData.get('file') as File
//     const userId = formData.get('userId') as string
//     const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME as string

//   if (!file || !userId) {
//     throw new Error('Missing file or user ID')
//   }

//   try {
//     // Generar nombre único para el archivo
//     const fileExt = file.name.split('.').pop()
//     const fileName = `services/${crypto.randomUUID()}.${fileExt}`
//     console.log(fileName)

//     // Subir a Supabase Storage
//     const { error } = await supabase.storage
//       .from(bucket)
//       .upload(fileName, file )

//      if(error) {console.error(error)}

//     // Obtener URL pública
//     const { data: { publicUrl } } = supabase.storage
//       .from(bucket)
//       .getPublicUrl(fileName);

//       console.log('images',publicUrl)

//     revalidatePath('/upload')
//     return { success: true, url: publicUrl, path: fileName }
//   } catch (error) {
//     console.error('Upload error:', error)
//     return { success: false, error: (error as Error).message }
//   }
// }

// "use server";

// import { supabase } from "@/lib/supabase/client";
// import { revalidatePath } from "next/cache";
// import { v4 as uuidv4 } from "uuid";

// interface UploadResult {
//   success: boolean;
//   url?: string;
//   path?: string;
//   error?: string;
// }

// export async function uploadImages(
//   formData: FormData
// ): Promise<UploadResult[]> {
//   const files = formData.getAll("files") as File[];
//   console.log("llego upload", files);
//   const serviceId = formData.get("serviceId") as string;
//   const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME as string;

//   if (!files || files.length === 0 || !serviceId) {
//     throw new Error("Missing files or user ID");
//   }

//   try {
//     // Procesar todas las subidas en paralelo
//     const uploadPromises = files.map(async (file) => {
//       try {
//         // Validar el archivo
//         if (!file || file.size === 0) {
//           return {
//             success: false,
//             error: "Archivo inválido",
//           };
//         }

//         // Generar nombre único para el archivo
//         const fileExt = file.name.split(".").pop();
//         const fileName = `services/${serviceId}/${crypto.randomUUID()}.${fileExt}`;

//         // Subir a Supabase Storage
//         const { error: uploadError } = await supabase.storage
//           .from(bucket)
//           .upload(fileName, file);

//         if (uploadError) {
//           console.error("Upload error:", uploadError);
//           return {
//             success: false,
//             error: uploadError.message,
//           };
//         }

//         // Obtener URL pública
//         const {
//           data: { publicUrl },
//         } = supabase.storage.from(bucket).getPublicUrl(fileName);

//          const {  error: serviceFileError} = await supabase
//           .from("ServiceFile")
//           .insert([
//             {  
//          id: uuidv4(),
//         serviceId: serviceId,
//         name: fileName,
//         path: `services/${serviceId}/${fileName}`,
//         url: publicUrl,
//         size: file.size,
//         type: file.type,
//         createdAt: new Date().toISOString(), 
//         updatedAt: new Date().toISOString()
              
//               }])
//           .select();

//               if (serviceFileError) {
//           console.error("Upload error:", serviceFileError);
//           return {
//             success: false,
//             error: serviceFileError.message,
//           };
//         }

      

//         return {
//           success: true,
//           url: publicUrl,
//           path: fileName,
//         };
//       } catch (error) {
//         console.error("Error processing file:", error);
//         return {
//           success: false,
//           error: (error as Error).message,
//         };
//       }
//     });

//     // Esperar a que todas las subidas terminen
//     const results = await Promise.all(uploadPromises);

//     // Revalidar cache si al menos una subida fue exitosa
//     if (results.some((result) => result.success)) {
//       revalidatePath("/upload");
//     }

//     return results;
//   } catch (error) {
//     console.error("Global upload error:", error);
//     return [
//       {
//         success: false,
//         error: (error as Error).message,
//       },
//     ];
//   }
// }

