// import { prisma } from '../lib/prisma';

// // Tipos generados
// export type TimeSlot = {
//   id: string;
//   startTime: String;
//   endTime: String;
//   serviceId: String;
//   dayScheduleDate?: String
//   createdAt: string;
//   updatedAt: string;
// };

// // Servicios CRUD
// export const getAllTimeSlots = async () => {
//   return await prisma.timeslot.findMany();
// };

// export const getTimeSlotById = async (id: string) => {
//   return await prisma.timeslot.findUnique({ where: { id } });
// };

// export const createTimeSlot = async (data: Omit<TimeSlot, 'id'>) => {
//   return await prisma.timeslot.create({ data });
// };

// export const updateTimeSlot = async (id: string, data: Partial<TimeSlot>) => {
//   return await prisma.timeslot.update({ where: { id }, data });
// };

// export const deleteTimeSlot = async (id: string) => {
//   return await prisma.timeslot.delete({ where: { id } });
// };