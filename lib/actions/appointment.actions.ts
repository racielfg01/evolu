// "use server"
// // lib/actions/appointment.actions.ts
// import prisma from '@/lib/prisma';
// import { Appointment, User, Service, TimeSlot, AppointmentService } from '@prisma/client';
// export type FullAppointment = Appointment & {
//   user: User;
//   timeSlot: TimeSlot;
//   services: (AppointmentService & {
//     service: Service;
//   })[];
// };

// type AppointmentInput = {
//   date: string;
//   time_slot_id: number;
//   user_id: string;
//   services: {
//     service_id: string;
//     quantity?: number;
//   }[];
// };

// export const fetchAllAppointments = async (): Promise<FullAppointment[]> => {
//   try {
//     return await prisma.appointment.findMany({
//       include: {
//         user: true,
//         timeSlot: true,
//         services: {
//           include: {
//             service: true
//           }
//         }
//       },
//       orderBy: {
//         date: 'desc'
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching appointments:', error);
//     throw new Error('Failed to fetch appointments');
//   }
// };

// export const fetchAppointmentsByUser = async (userId: string): Promise<FullAppointment[]> => {
//   try {
//     if (!userId) throw new Error('User ID is required');
    
//     return await prisma.appointment.findMany({
//       where: { user_id: userId },
//       include: {
//         service: true,
//         timeSlot: true
//       },
//       orderBy: {
//         date: 'asc'
//       }
//     });
//   } catch (error) {
//     console.error(`Error fetching appointments for user ${userId}:`, error);
//     throw new Error('Failed to fetch user appointments');
//   }
// };

// export const fetchAppointmentById = async (id: string): Promise<FullAppointment> => {
//   try {
//     if (!id) throw new Error('Appointment ID is required');
    
//     const appointment = await prisma.appointment.findUnique({
//       where: { id },
//       include: {
//         user: true,
//         service: true,
//         timeSlot: true
//       }
//     });

//     if (!appointment) {
//       throw new Error('Appointment not found');
//     }

//     return appointment;
//   } catch (error) {
//     console.error(`Error fetching appointment ${id}:`, error);
//     throw new Error(error instanceof Error ? error.message : 'Failed to fetch appointment');
//   }
// };

// export const createAppointment = async (data: AppointmentInput): Promise<Appointment> => {
//   try {
//     // Validación básica
//     if (!data.date || !data.time_slot_id || !data.service_id || !data.user_id) {
//       throw new Error('All fields are required');
//     }

//     // Verificar disponibilidad del time slot
//     const existingAppointment = await prisma.appointment.findFirst({
//       where: {
//         date: data.date,
//         time_slot_id: data.time_slot_id
//       }
//     });

//     if (existingAppointment) {
//       throw new Error('Time slot already booked for this date');
//     }

//     return await prisma.appointment.create({
//       data: {
//         cuid: crypto.randomUUID(),
//         date: data.date,
//         time_slot_id: data.time_slot_id,
//         service_id: data.service_id,
//         user_id: data.user_id
//       }
//     });
//   } catch (error) {
//     console.error('Error creating appointment:', error);
//     throw new Error(error instanceof Error ? error.message : 'Failed to create appointment');
//   }
// };

// export const updateAppointment = async (
//   id: string,
//   data: Partial<AppointmentInput>
// ): Promise<Appointment> => {
//   try {
//     if (!id) throw new Error('Appointment ID is required');

//     // Verificar disponibilidad si se actualiza el time slot
//     if (data.time_slot_id && data.date) {
//       const existingAppointment = await prisma.appointment.findFirst({
//         where: {
//           date: data.date,
//           time_slot_id: data.time_slot_id,
//           NOT: { id }
//         }
//       });

//       if (existingAppointment) {
//         throw new Error('New time slot already booked for this date');
//       }
//     }

//     return await prisma.appointment.update({
//       where: { id },
//       data: {
//         date: data.date,
//         time_slot_id: data.time_slot_id,
//         service_id: data.service_id
//         // Nota: Normalmente no permitiríamos cambiar el user_id
//       }
//     });
//   } catch (error) {
//     console.error(`Error updating appointment ${id}:`, error);
//     throw new Error(error instanceof Error ? error.message : 'Failed to update appointment');
//   }
// };

// export const deleteAppointment = async (id: string): Promise<void> => {
//   try {
//     if (!id) throw new Error('Appointment ID is required');
    
//     await prisma.appointment.delete({
//       where: { id }
//     });
//   } catch (error) {
//     console.error(`Error deleting appointment ${id}:`, error);
//     throw new Error(error instanceof Error ? error.message : 'Failed to delete appointment');
//   }
// };


"use server"
// lib/actions/appointment.actions.ts
import prisma from '@/lib/prisma';
import { Appointment, User, Service,
  //  TimeSlot,
    AppointmentService
    // , $Enums 
  } from '@prisma/client';

export type FullAppointment = Appointment & {
  user: User;
  // timeSlot: TimeSlot;
  services: (AppointmentService & {
    service: Service;
  })[];
};

// type AppointmentInput = {
//   date: string;
//   time_slot_id: number;
//   user_id: string;
//   services: {
//     service_id: string;
//     quantity?: number;
//   }[];
// };


interface AppointmentData {
    cuid: string;
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

export const createAppointment = async (data: AppointmentData): Promise<FullAppointmentData> => {
 // Crear la cita en la base de datos
    const appointment = await prisma.appointment.create({
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

    return appointment
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