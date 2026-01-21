// app/(protected)/services/actions.ts
"use server";

import prisma from "@/lib/prisma";
import { Service, Category, ServiceFile } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { StorageService } from "../supabase/storage";

export type FullService = Service & {
  category: Category;
  images: ServiceFile[];
};

interface UploadedImage {
  name: string;
  path: string;
  url: string;
  size: number;
  type: string;
}

export interface ServiceInput {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category_id: string;
  images?: Omit<ServiceFile, "id" | "createdAt" | "updatedAt" | "serviceId">[];
  detailedDescription: string;
  benefits: string[];
  preparation: string[];

  isActive: boolean;
}

// Primero, crea un tipo más específico para el resultado de la consulta
export type ServiceWithRelations = {
  id: string;
  cuid: string;
  name: string;
  description: string;
  detailedDescription: string;
  price: number;
  duration: number;
  benefits: string[];
  preparation: string[];
  category_id: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
  };
  images: {
    id: string;
    name: string;
    url: string;
  }[];
};

// export async function createService(formData: FormData) {

//   const supabase = createClient()
//   const response = (await supabase).auth.getUser()
//   const user =(await response).data.user

//   if (!user) throw new Error('Authentication required')

//   const name = formData.get('name') as string
//   const description = formData.get('description') as string
//   const price = parseFloat(formData.get('price') as string)
//   const duration = parseInt(formData.get('duration') as string)

//   const service = await prisma.service.create({
//     data: {
//       cuid: crypto.randomUUID(),
//       name,
//       description,
//       price,
//       duration,
//       category_id: 1 // Ajustar según tu schema
//     }
//   })

//   revalidatePath('/services')
//   return service
// }

export const fetchAllServicesActive = async (): Promise<ServiceWithRelations[]> => {
  try {
    const services = await prisma.service.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true, // Solo la URL y quizás otros campos necesarios
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      where: {
        isActive: true, // Opcional: filtrar solo servicios activos
      },
    });
    console.log(" fetching services:");
    return services;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw new Error("Failed to fetch services");
  }
};
export const fetchAllServices = async (): Promise<ServiceWithRelations[]> => {
  try {
    const services = await prisma.service.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true, // Solo la URL y quizás otros campos necesarios
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      }
    });
    console.log(" fetching services:");
    return services;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw new Error("Failed to fetch services");
  }
};

export const fetchServiceById = async (id: string): Promise<FullService> => {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
      },
    });

    if (!service) {
      throw new Error("Service not found");
    }

    return service;
  } catch (error) {
    console.error(`Error fetching service with ID ${id}:`, error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch service"
    );
  }
};

export const fetchServiceByCategory = async (
  categoryId: string
): Promise<FullService[]> => {
  try {
    const services = await prisma.service.findMany({
      where: { category_id: categoryId },
      include: {
        category: true,
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return services;
  } catch (error) {
    console.error(`Error fetching services for category ${categoryId}:`, error);
    throw new Error("Failed to fetch services by category");
  }
};

export const addService = async (
  serviceData: Omit<ServiceInput, "id">
): Promise<Service> => {
  console.log("addService", serviceData);
  try {
    // Validación básica
    if (!serviceData.name || !serviceData.category_id) {
      throw new Error("Name and category are required");
    }

    const price = parseFloat(serviceData.price.toString());
    const duration = parseInt(serviceData.duration.toString());

    if (isNaN(price)) throw new Error("Invalid price");
    if (isNaN(duration)) throw new Error("Invalid duration");

    const service = await prisma.service.create({
      data: {
        cuid: crypto.randomUUID(),
        name: serviceData.name,
        description: serviceData.description,
        price,
        duration,
        category_id: serviceData.category_id,
        preparation: serviceData.preparation,
        benefits: serviceData.benefits,
        images: serviceData.images
          ? {
              create: serviceData.images.map((img) => ({
                name: img.name,
                path: img.path,
                url: img.url,
                size: img.size,
                type: img.type,
                // serviceId: serviceData.id,
              })),
            }
          : undefined,
        detailedDescription: serviceData.detailedDescription,
        isActive: serviceData.isActive,
      },
    });

    return service;
  } catch (error) {
    console.error("Error adding service:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to add service"
    );
  }
};

// export const editService = async (
//   serviceData: Partial<ServiceInput>
// ): Promise<Service> => {
//   try {
//     if (!serviceData.id) throw new Error("Service ID is required");

//     const updateData: Partial<Service> = {
//       name: serviceData.name,
//       description: serviceData.description,
//     };

//     if (serviceData.price !== undefined) {
//       updateData.price = parseFloat(serviceData.price.toString());
//       if (isNaN(updateData.price)) throw new Error("Invalid price");
//     }

//     if (serviceData.duration !== undefined) {
//       updateData.duration = parseInt(serviceData.duration.toString());
//       if (isNaN(updateData.duration)) throw new Error("Invalid duration");
//     }

//     if (serviceData.category_id !== undefined) {
//       updateData.category_id = serviceData.category_id;
//     }

//     const updatedService = await prisma.service.update({
//       where: { id:serviceData.id },
//       data: updateData,
//     });

//     return updatedService;
//   } catch (error) {
//     console.error(`Error updating service ${serviceData.id}:`, error);
//     throw new Error(
//       error instanceof Error ? error.message : "Failed to update service"
//     );
//   }
// };

// export const deleteService = async (id: string): Promise<void> => {
//   try {
//     if (!id) throw new Error("Service ID is required");

//     // Usamos una transacción para asegurar la integridad referencial
//     await prisma.$transaction([
//       // Primero eliminamos las imágenes asociadas
//       prisma.serviceFile.deleteMany({
//         where: { serviceId: id },
//       }),
//       // Luego eliminamos el servicio
//       prisma.service.delete({
//         where: { id },
//       }),
//     ]);
//   } catch (error) {
//     console.error(`Error deleting service ${id}:`, error);
//     throw new Error(
//       error instanceof Error ? error.message : "Failed to delete service"
//     );
//   }
// };

export const editService = async (
  serviceData: Partial<ServiceInput> & {
    images?: UploadedImage[];
    imagesToDelete?: string[];
  }
): Promise<Service> => {
  console.log(serviceData);

  const { deleteFile } = StorageService;

  try {
    if (!serviceData.id) throw new Error("Service ID is required");

    // Preparar datos básicos de actualización
    const updateData: Partial<Service> = {
      name: serviceData.name,
      description: serviceData.description,
      detailedDescription: serviceData.detailedDescription,
      benefits: serviceData.benefits,
      preparation: serviceData.preparation,
      category_id: serviceData.category_id,
      isActive: serviceData.isActive,
    };

    if (serviceData.price !== undefined) {
      updateData.price = parseFloat(serviceData.price.toString());
      if (isNaN(updateData.price)) throw new Error("Invalid price");
    }

    if (serviceData.duration !== undefined) {
      updateData.duration = parseInt(serviceData.duration.toString());
      if (isNaN(updateData.duration)) throw new Error("Invalid duration");
    }

    // Usar una transacción para asegurar la consistencia
    const result = await prisma.$transaction(async (tx) => {
      // 1. Eliminar imágenes marcadas para eliminación
      if (serviceData.imagesToDelete && serviceData.imagesToDelete.length > 0) {
        // Primero obtener información de las imágenes a eliminar
        const imagesToDelete = await tx.serviceFile.findMany({
          where: {
            id: { in: serviceData.imagesToDelete },
            serviceId: serviceData.id,
          },
        });

        // Eliminar archivos del almacenamiento
        const deletePromises = imagesToDelete.map(
          async (image: UploadedImage) => {
            try {
              console.log("image", image);
              // const { error } = await supabase.storage
              //   .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME as string)
              //   .remove([image.path]);

              deleteFile(image.path);

              // if (error) {
              //   console.error(`Error deleting file ${image.path}:`, error);
              // }
            } catch (error) {
              console.error(`Error deleting file ${image.path}:`, error);
            }
          }
        );

        await Promise.all(deletePromises);

        // Eliminar registros de la base de datos
        await tx.serviceFile.deleteMany({
          where: {
            id: { in: serviceData.imagesToDelete },
            serviceId: serviceData.id,
          },
        });
      }

      // // 2. Agregar nuevas imágenes
      // if (serviceData.images && serviceData.images.length > 0) {
      //   console.log('images',serviceData.images)
      //   // const fileName = `services/${serviceData.id}/${crypto.randomUUID()}.${fileExt}`;
      //   // Insertar nuevas imágenes en la base de datos
      //   await tx.serviceFile.createMany({
      //     data: serviceData.images.map((img) => ({
      //       id: uuidv4(),
      //       name: img.name,
      //       path: img.path+uuidv4(),
      //       url: img.url,
      //       size: img.size,
      //       type: img.type,
      //       serviceId: serviceData.id as string,
      //       createdAt: new Date(),
      //       updatedAt: new Date(),
      //     })),
      //   });
      // }

      // 3. Actualizar el servicio
      const updatedService = await tx.service.update({
        where: { id: serviceData.id },
        data: updateData,
        include: {
          images: true, // Incluir imágenes en la respuesta
        },
      });

      return updatedService;
    });

    // Revalidar la página de servicios
    revalidatePath("/admin/services");

    return result;
  } catch (error) {
    console.error(`Error updating service ${serviceData.id}:`, error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update service"
    );
  }
};

export async function addServiceFake() {
  const category = await prisma.category.findFirst();

  return prisma.service.create({
    data: {
      // id:uuidv4(),
      cuid: uuidv4(),
      name: "Servicio Temporal",
      description: "Servicio temporal para carga de imágenes",
      detailedDescription: "Servicio temporal para carga de imágenes",
      duration: 0,
      price: 0,
      benefits: [],
      preparation: [],
      category_id: category?.id as string,
      isActive: false,
    },
  });
}

// export async function createService(
//   data: Omit<Service, "id" | "cuid" | "createdAt" | "updatedAt">
// ) {
//   return prisma.service.create({
//     data: {
//       ...data,
//       cuid:uuidv4(),
//       isActive: true,
//     },
//   });
// }

export async function updateService(id: string, data: Partial<Service>) {
  const service = await prisma.service.update({
    where: { id },
    data,
  });
  revalidatePath("/services");
  return service;
}

// export async function deleteService(id: string) {
//   console.log('deleteService',id)
//     try {
//     // 1. Primero eliminar todos los archivos relacionados
//     await prisma.serviceFile.deleteMany({
//       where: {
//         serviceId: id
//       }
//     })

//     // 2. Eliminar las relaciones en AppointmentService
//     await prisma.appointmentService.deleteMany({
//       where: {
//         service_id: id
//       }
//     })

//     // 3. Eliminar los timeSlots relacionados
//     await prisma.timeSlot.deleteMany({
//       where: {
//         service_id: id
//       }
//     })

//     // 4. Finalmente eliminar el servicio
//     await prisma.service.delete({
//       where: {
//         id: id
//       }
//     })

//     revalidatePath('/admin/services')
//     console.log("revalido")
//     return { success: true, message: 'Servicio eliminado correctamente' }

//   } catch (error) {
//     console.error('Error deleting service:', error)
//     return {
//       success: false,
//       message: 'Error al eliminar el servicio: ' + (error instanceof Error ? error.message : 'Error desconocido')
//     }
//   }
// }

// app/(protected)/services/actions.ts

export async function deleteService(serviceId: string) {
  try {
    if (!serviceId) {
      return { success: false, message: "Servicio no encontrado" };
    }

    // Verificar directamente si tiene citas activas
    const activeAppointments = await prisma.appointmentService.findFirst({
      where: {
        service_id: serviceId,
        appointment: {
          status: {
            in: ["PENDING", "CONFIRMED"],
          },
        },
      },
    });

    if (activeAppointments) {
      return {
        success: false,
        message: "No se puede eliminar el servicio porque tiene citas activas",
      };
    }

    // Proceder con la eliminación en transacción
    await prisma.$transaction(async (tx) => {
      await tx.serviceFile.deleteMany({ where: { serviceId } });
      await tx.appointmentService.deleteMany({
        where: { service_id: serviceId },
      });
      // await tx.timeSlot.deleteMany({ where: { service_id: serviceId } });
      await tx.service.delete({ where: { id: serviceId } });
    });

    revalidatePath("/admin/services");

    return { success: true, message: "Servicio eliminado correctamente" };
  } catch (error) {
    console.error("Error deleting service:", error);
    return {
      success: false,
      message:
        "Error al eliminar el servicio: " +
        (error instanceof Error ? error.message : "Error desconocido"),
    };
  }
}
