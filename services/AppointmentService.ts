import  prisma  from '@/lib/prisma';

// Tipos generados
export type Appointment = {
  id: string;
  date: string;
  timeSlotId: string;
  serviceId: string;
  userId: string
  createdAt: string;
  updatedAt: string;
};

// Servicios CRUD
export const getAllAppointments = async () => {
  return await prisma.appointment.findMany();
};

export const getAppointmentById = async (id: string) => {
  return await prisma.appointment.findUnique({ where: { id } });
};

// export const createAppointment = async (data: Omit<Appointment, 'id'>) => {
//   return await prisma.appointment.create({ data });
// };

export const updateAppointment = async (id: string, data: Partial<Appointment>) => {
  return await prisma.appointment.update({ where: { id }, data });
};

export const deleteAppointment = async (id: string) => {
  return await prisma.appointment.delete({ where: { id } });
};