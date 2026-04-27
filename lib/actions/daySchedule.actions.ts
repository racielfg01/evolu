// // lib/actions/daySchedule.actions.ts
// import prisma from '@/lib/prisma';
// import { DaySchedule } from '@prisma/client';

// export const fetchAllDaySchedules = async (): Promise<DaySchedule[]> => {
//   try {
//     return await prisma.daySchedule.findMany({
//       orderBy: { date: 'asc' }
//     });
//   } catch (error) {
//     console.error('Error fetching day schedules:', error);
//     throw new Error('Failed to fetch day schedules');
//   }
// };

// export const createDaySchedule = async (date: string): Promise<DaySchedule> => {
//   try {
//     if (!date) throw new Error('Date is required');
//     return await prisma.daySchedule.create({
//       data: { date }
//     });
//   } catch (error) {
//     console.error('Error creating day schedule:', error);
//     throw new Error(error instanceof Error ? error.message : 'Failed to create day schedule');
//   }
// };

// export const deleteDaySchedule = async (date: string): Promise<void> => {
//   try {
//     if (!date) throw new Error('Date is required');
//     await prisma.daySchedule.delete({
//       where: { date }
//     });
//   } catch (error) {
//     console.error(`Error deleting day schedule ${date}:`, error);
//     throw new Error(error instanceof Error ? error.message : 'Failed to delete day schedule');
//   }
// };