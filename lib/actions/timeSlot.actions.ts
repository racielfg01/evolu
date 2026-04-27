// // lib/actions/timeSlot.actions.ts
// import prisma from '@/lib/prisma';
// import { TimeSlot } from '@prisma/client';

// type TimeSlotInput = {
//   cuid?: string;
//   start_time: string;
//   end_time: string;
//   service_id: string;
//   day_schedule_date?: string;
// };

// export const fetchAllTimeSlots = async (): Promise<TimeSlot[]> => {
//   try {
//     return await prisma.timeSlot.findMany({
//       include: {
//         service: true,
//         daySchedule: true
//       },
//       orderBy: { start_time: 'asc' }
//     });
//   } catch (error) {
//     console.error('Error fetching time slots:', error);
//     throw new Error('Failed to fetch time slots');
//   }
// };

// export const fetchTimeSlotsByService = async (serviceId: string): Promise<TimeSlot[]> => {
//   try {
//     if (!serviceId) throw new Error('Service ID is required');
//     return await prisma.timeSlot.findMany({
//       where: { service_id: serviceId },
//       include: {
//         daySchedule: true
//       },
//       orderBy: { start_time: 'asc' }
//     });
//   } catch (error) {
//     console.error(`Error fetching time slots for service ${serviceId}:`, error);
//     throw new Error('Failed to fetch time slots by service');
//   }
// };

// export const createTimeSlot = async (data: TimeSlotInput): Promise<TimeSlot> => {
//   try {
//     if (!data.start_time || !data.end_time || !data.service_id) {
//       throw new Error('Start time, end time and service ID are required');
//     }
//     return await prisma.timeSlot.create({
//       data: {
//         cuid: data.cuid || crypto.randomUUID(),
//         start_time: data.start_time,
//         end_time: data.end_time,
//         service_id: data.service_id,
//         day_schedule_date: data.day_schedule_date
//       }
//     });
//   } catch (error) {
//     console.error('Error creating time slot:', error);
//     throw new Error(error instanceof Error ? error.message : 'Failed to create time slot');
//   }
// };

// export const updateTimeSlot = async (id: number, data: Partial<TimeSlotInput>): Promise<TimeSlot> => {
//   try {
//     if (!id) throw new Error('Time slot ID is required');
//     return await prisma.timeSlot.update({
//       where: { id },
//       data: {
//         start_time: data.start_time,
//         end_time: data.end_time,
//         day_schedule_date: data.day_schedule_date
//       }
//     });
//   } catch (error) {
//     console.error(`Error updating time slot ${id}:`, error);
//     throw new Error(error instanceof Error ? error.message : 'Failed to update time slot');
//   }
// };

// export const deleteTimeSlot = async (id: number): Promise<void> => {
//   try {
//     if (!id) throw new Error('Time slot ID is required');
//     await prisma.timeSlot.delete({
//       where: { id }
//     });
//   } catch (error) {
//     console.error(`Error deleting time slot ${id}:`, error);
//     throw new Error(error instanceof Error ? error.message : 'Failed to delete time slot');
//   }
// };