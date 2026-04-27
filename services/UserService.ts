// import { prisma } from '../lib/prisma';

// // Tipos generados
// export type User = {
//   id: string;
//   name?: String;
//   email: String;
//   password: String;
//   role: Role;
//   sex: Sex
//   createdAt: string;
//   updatedAt: string;
// };

// // Servicios CRUD
// export const getAllUsers = async () => {
//   return await prisma.user.findMany();
// };

// export const getUserById = async (id: string) => {
//   return await prisma.user.findUnique({ where: { id } });
// };

// export const createUser = async (data: Omit<User, 'id'>) => {
//   return await prisma.user.create({ data });
// };

// export const updateUser = async (id: string, data: Partial<User>) => {
//   return await prisma.user.update({ where: { id }, data });
// };

// export const deleteUser = async (id: string) => {
//   return await prisma.user.delete({ where: { id } });
// };