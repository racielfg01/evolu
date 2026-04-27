// // lib/services/file-upload.service.ts
// import { supabase } from '@/lib/supabase/client'
// import prisma from '@/lib/prisma'

// export class FileUploadService {
//   static async uploadServiceFile({
//     serviceId,
//     file,
//     userId,
//     bucket = 'service-files'
//   }: {
//     serviceId: string
//     file: File
//     userId: string
//     bucket?: string
//   }) {
//     // 1. Subir a Supabase Storage
//     const fileExt = file.name.split('.').pop()
//     const fileName = `${userId}/${serviceId}/${crypto.randomUUID()}.${fileExt}`
    
//     const { data: uploadData, error: uploadError } = await supabase.storage
//       .from(bucket)
//       .upload(fileName, file)

//     if (uploadError) throw uploadError

//     // 2. Obtener URL pública
//     const { data: { publicUrl } } = supabase.storage
//       .from(bucket)
//       .getPublicUrl(uploadData.path)

//     // 3. Guardar metadatos en Prisma
//     const dbFile = await prisma.serviceFile.create({
//       data: {
//         serviceId,
//         name: file.name,
//         path: uploadData.path,
//         url: publicUrl,
//         size: file.size,
//         type: file.type
//       }
//     })

//     return dbFile
//   }

//   static async deleteServiceFile(fileId: string, bucket = 'service-files') {
//     // 1. Obtener metadatos
//     const file = await prisma.serviceFile.findUnique({
//       where: { id: fileId }
//     })

//     if (!file) throw new Error('File not found')

//     // 2. Eliminar de Supabase Storage
//     const { error: deleteError } = await supabase.storage
//       .from(bucket)
//       .remove([file.path])

//     if (deleteError) throw deleteError

//     // 3. Eliminar registro de Prisma
//     await prisma.serviceFile.delete({
//       where: { id: fileId }
//     })

//     return true
//   }
// }