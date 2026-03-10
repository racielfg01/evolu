"use server"
// lib/actions/appointment.actions.ts
import prisma from '@/lib/prisma';
import { Appointment, User, Service,
  //  TimeSlot,
    AppointmentService
    // , $Enums 
  } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export type FullAppointment = Appointment & {
  user: User;
  // timeSlot: TimeSlot;
  services: (AppointmentService & {
    service: Service;
  })[];
};



interface AppointmentData {
    cuid: string;
    note: string;
    date: Date;
    endDate: Date;
    duration: number;
    total_price: number;
    user_id: string;
    services: {
        create: {
            service_id: string;
            quantity: number;
        }[];
    };
}

interface FullAppointmentData extends Appointment  {
    user: {
        name: string | null;
        id: string;
        cuid: string;
        email: string;
        password: string;
        role_id: string;
        sex_id: string;
        image: string;
        createdAt: Date;
        updatedAt: Date;
    };
    services: ({
        service: {
            name: string;
            id: string;
            cuid: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            detailedDescription: string;
            price: number;
            duration: number;
            benefits: string[];
            preparation: string[];
            category_id: string;
            isActive: boolean;
        };
    } & {
        id: string;
        appointment_id: string;
        service_id: string;
        quantity: number;
    })[];
} 
   
  


export const fetchAllAppointments = async (): Promise<FullAppointment[]> => {
  try {
    return await prisma.appointment.findMany({
      include: {
        user: true,
        // timeSlot: true,
        services: {
          include: {
            service: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw new Error('Failed to fetch appointments');
  }
};

export const fetchAppointmentsByUser = async (userId: string): Promise<FullAppointment[]> => {
  try {
    if (!userId) throw new Error('User ID is required');
    
    return await prisma.appointment.findMany({
      where: { user_id: userId },
      include: {
        user: true,
        // timeSlot: true,
        services: {
          include: {
            service: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
  } catch (error) {
    console.error(`Error fetching appointments for user ${userId}:`, error);
    throw new Error('Failed to fetch user appointments');
  }
};

export const fetchAppointmentById = async (id: string): Promise<FullAppointment> => {
  try {
    if (!id) throw new Error('Appointment ID is required');
    
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        user: true,
        // timeSlot: true,
        services: {
          include: {
            service: true
          }
        }
      }
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    return appointment;
  } catch (error) {
    console.error(`Error fetching appointment ${id}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch appointment');
  }
};


export const fetchAppointmentByRangDay = async (startOfDay:Date,endOfDay:Date)=> {
  // Crear la cita en la base de datos
  const appointments = await prisma.appointment.findMany({
    where: {
          date: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },
          services: {
            include: {
              service: {
                select: {
                  id: true,
                  name: true,
                  duration: true,
                  price: true
                }
              }
            }
          }
        },
        orderBy: {
          date: 'asc'
        }
      });
      
      return appointments
    };
    
    
    
    // export const createAppointment = async (data: AppointmentData): Promise<FullAppointmentData> => {
    //  // Crear la cita en la base de datos
    //     const appointment = await prisma.appointment.create({
    //       data,
    //       include: {
    //         services: {
    //           include: {
    //             service: true
    //           }
    //         },
    //         user: true
    //       }
    //     });
    
    //     return appointment
    // };


export const createAppointment = async (data: AppointmentData): Promise<FullAppointmentData> => {
  try {
    // Usar transacción para evitar condiciones de carrera
    const appointment = await prisma.$transaction(async (tx) => {
      // 1. Verificar si existe alguna cita que se superponga con el nuevo horario
      const overlappingAppointment = await tx.appointment.findFirst({
        where: {
          AND: [
            { date: { lt: data.endDate } }, // La cita existente empieza ANTES de que termine la nueva
            { endDate: { gt: data.date } }, // La cita existente termina DESPUÉS de que empieza la nueva
          ],
        },
      });

      if (overlappingAppointment) {
        // Formatear las fechas para mostrar al usuario
        const startTime = overlappingAppointment.date.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        const endTime = overlappingAppointment.endDate.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        const dateStr = overlappingAppointment.date.toLocaleDateString('es-ES');

        throw new Error(
          `El horario seleccionado (${dateStr} de ${startTime} a ${endTime}) ya está ocupado. ` +
          `Por favor elige otro horario.`
        );
      }

      // 2. Si no hay superposición, crear la cita
      return await tx.appointment.create({
        data,
        include: {
          services: {
            include: {
              service: true
            }
          },
          user: true
        }
      });
    });

    return appointment;
  } catch (error) {
    console.error('Error en createAppointment:', error);
    // Re-lanzar el error para que sea manejado en el frontend
    throw error;
  }
};

export const updateAppointment = async (
  id: string,
  data: Partial<FullAppointmentData>
): Promise<FullAppointment> => {
  try {
    if (!id) throw new Error('Appointment ID is required');

    // Verificar disponibilidad si se actualiza el time slot
    if ( data.date) {
      const existingAppointment = await prisma.appointment.findFirst({
        where: {
          date: data.date,
          // endDate: data.time_slot_id,
          NOT: { id }
        }
      });

      if (existingAppointment) {
        throw new Error('New time slot already booked for this date');
      }
    }

    // Actualizar datos básicos de la cita
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        date: data.date,
        // endDate: data.time_slot_id
        // Nota: No permitimos cambiar el user_id
      },
      include: {
        user: true,
        // endDate: true,
        services: {
          include: {
            service: true
          }
        }
      }
    });

    // Actualizar servicios si se proporcionan
    if (data.services) {
      // Primero eliminamos todos los servicios actuales
      await prisma.appointmentService.deleteMany({
        where: { appointment_id: id }
      });

      // Luego creamos los nuevos
      await prisma.appointmentService.createMany({
        data: data.services.map(service => ({
          appointment_id: id,
          service_id: service.service_id,
          quantity: service.quantity || 1
        }))
      });

      // Volvemos a cargar la cita con los servicios actualizados
      return await prisma.appointment.findUnique({
        where: { id },
        include: {
          user: true,
          // timeSlot: true,
          services: {
            include: {
              service: true
            }
          }
        }
      }) as FullAppointment;
    }

    return updatedAppointment;
  } catch (error) {
    console.error(`Error updating appointment ${id}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update appointment');
  }
};

export const deleteAppointment = async (id: string): Promise<void> => {
  try {
    if (!id) throw new Error('Appointment ID is required');
    
    // Primero eliminamos los servicios asociados
    await prisma.appointmentService.deleteMany({
      where: { appointment_id: id }
    });
    
    // Luego eliminamos la cita
    await prisma.appointment.delete({
      where: { id }
    });
  } catch (error) {
    console.error(`Error deleting appointment ${id}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to delete appointment');
  }
};