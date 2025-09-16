// import prisma  from '../lib/prisma';

// // Tipos generados
// export type DaySchedule = {
//   id: string;
//   date: String
//   createdAt: string;
//   updatedAt: string;
// };

// // Servicios CRUD
// export const getAllDaySchedules = async () => {
//   return await prisma.dayschedule.findMany();
// };

// export const getDayScheduleById = async (id: string) => {
//   return await prisma.dayschedule.findUnique({ where: { id } });
// };

// export const createDaySchedule = async (data: Omit<DaySchedule, 'id'>) => {
//   return await prisma.dayschedule.create({ data });
// };

// export const updateDaySchedule = async (id: string, data: Partial<DaySchedule>) => {
//   return await prisma.dayschedule.update({ where: { id }, data });
// };

// export const deleteDaySchedule = async (id: string) => {
//   return await prisma.dayschedule.delete({ where: { id } });
// };