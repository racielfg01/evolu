// import  prisma  from '@/lib/prisma';

// // Tipos generados
// export type Service = {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   imageUrl: string;
//   duration: number
//   createdAt?: string;
//   updatedAt?: string;
// };

// // Servicios CRUD
// export const getAllServices = async () => {
//   return await prisma.service.findMany();
// };

// export const getServiceById = async (id: string) => {
//   return await prisma.service.findUnique({ where: { id } });
// };

// export const createService = async (data: Omit<Service, 'id'>) => {
//   return await prisma.service.create({ data });
// };

// export const updateService = async (id: string, data: Partial<Service>) => {
//   return await prisma.service.update({ where: { id }, data });
// };

// export const deleteService = async (id: string) => {
//   return await prisma.service.delete({ where: { id } });
// };