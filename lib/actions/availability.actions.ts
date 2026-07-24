"use server";

import { type Appointment, type BreakTime } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getBusinessConfig } from "./config.actions";
import { BusinessHours } from "@/components/booking/availability-configurator";

interface TimeSlot {
  time: string;
  available: boolean;
  startDateTime: Date;
  endDateTime: Date;
}

interface AppointmentWithServices extends Appointment {
  services: Array<{
    service: {
      duration: number;
    };
    quantity: number;
  }>;
}

// CORRECCIÓN: Función getAvailablePeriods corregida
export async function getAvailablePeriods(workingHours: BusinessHours): Promise<string>  {
  const periods: string[] = [];
  
  if (workingHours.morning) {
    periods.push(`Mañana: ${workingHours.morning.start} - ${workingHours.morning.end}`);
  }
  
  if (workingHours.afternoon) {
    periods.push(`Tarde: ${workingHours.afternoon.start} - ${workingHours.afternoon.end}`);
  }
  
  return periods.length > 0 ? periods.join(' | ') : 'No hay horarios configurados';
}

// CORRECCIÓN: Función para obtener periodos del día
export async function getDayAvailablePeriods(date: Date): Promise<string> {
  try {
    const businessConfig = await getBusinessConfig();
    if (!businessConfig) return 'No hay horarios configurados';

    const dayOfWeek = date.getDay();
    const dateStr = date.toISOString().split('T')[0];
    
    const specialDateConfig = businessConfig.specificDateOverrides.find(
      d => d.date === dateStr
    );

    const dayConfig = specialDateConfig || businessConfig.weekAvailability[dayOfWeek];
    
    if (!dayConfig?.available || !dayConfig.hours) {
      return 'Día no disponible';
    }

    return getAvailablePeriods(dayConfig.hours);
  } catch (error) {
    console.error("Error getting day periods:", error);
    return 'Error al cargar horarios';
  }
}

// export async function getAvailableSlots(date: Date, totalDuration: number) {
 
//   try {
//   // Normalizar la fecha a inicio del día en UTC
//     const normalizedDate = new Date(Date.UTC(
//       date.getFullYear(),
//       date.getMonth(),
//       date.getDate()
//     ));
    

//     const businessConfig = await getBusinessConfig();
//     if (!businessConfig) return [];

//     const dayOfWeek = normalizedDate.getDay();
//     const dateStr = normalizedDate.toISOString().split("T")[0];

//     const specialDateConfig = businessConfig.specificDateOverrides.find(
//       (d) => d.date === dateStr
//     );

//     const dayConfig = specialDateConfig || businessConfig.weekAvailability[dayOfWeek];

//     if (!dayConfig?.available) return [];
//     if (!dayConfig?.hours) return [];

//     const workingHours = dayConfig.hours;

//    ;
//     const startOfDay = new Date(normalizedDate);
//     const endOfDay = new Date(normalizedDate);
//     endOfDay.setUTCHours(23, 59, 59, 999);

//     console.log("📅 Fecha normalizada:", normalizedDate.toISOString());
//     console.log("🕒 Inicio del día:", startOfDay.toISOString());
//     console.log("🕒 Fin del día:", endOfDay.toISOString());

//     const existingAppointments = (await prisma.appointment.findMany({
//       where: {
//         date: {
//           gte: startOfDay,
//           lte: endOfDay,
//         },
//         status: {
//           in: ["PENDING"],
//         },
//       },
//       include: {
//         services: {
//           include: {
//             service: {
//               select: {
//                 duration: true,
//               },
//             },
//           },
//         },
//       },
//     })) as AppointmentWithServices[];

//     console.log("📅 Citas existentes:", existingAppointments.length);

//     const breakTimes: BreakTime[] = [];

//     const slots = generateTimeSlots(
//       workingHours,
//       totalDuration,
//       existingAppointments,
//       breakTimes,
//       date,
//       businessConfig.minBookingNotice
//     );

//     console.log(`✅ Slots generados: ${slots.length}`);
//     return slots;
//   } catch (error) {
//     console.error("❌ Error en getAvailableSlots:", error);
//     return [];
//   }
// }

export async function getAvailableSlots(date: Date, totalDuration: number) {
  console.log("🔍 DEBUG - getAvailableSlots called with:");
  console.log("📅 Input date:", date);
  console.log("📅 Input date ISO:", date.toISOString());
  console.log("📅 Input date UTC:", date.toUTCString());
  console.log("⏰ Total duration:", totalDuration);
  console.log("🌍 Server time:", new Date().toISOString());
  
  try {
    // Normalizar la fecha a las 9:00 AM UTC
    const normalizedDate = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      9, 0, 0, 0 // 9:00 AM UTC
    ));
    
    console.log("🕘 Fecha normalizada a 9:00 AM UTC:", normalizedDate.toISOString());

    const businessConfig = await getBusinessConfig();
    if (!businessConfig) return [];

    const dayOfWeek = normalizedDate.getUTCDay();
    const dateStr = normalizedDate.toISOString().split("T")[0];

    const specialDateConfig = businessConfig.specificDateOverrides.find(
      (d) => d.date === dateStr
    );

    const dayConfig = specialDateConfig || businessConfig.weekAvailability[dayOfWeek];

    if (!dayConfig?.available) return [];
    if (!dayConfig?.hours) return [];

    const workingHours = dayConfig.hours;

    const startOfDay = new Date(normalizedDate);
    const endOfDay = new Date(normalizedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    console.log("📅 Fecha normalizada:", normalizedDate.toISOString());
    console.log("🕒 Inicio del día:", startOfDay.toISOString());
    console.log("🕒 Fin del día:", endOfDay.toISOString());

    const existingAppointments = (await prisma.appointment.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ["PENDING"],
        },
      },
      include: {
        services: {
          include: {
            service: {
              select: {
                duration: true,
              },
            },
          },
        },
      },
    })) as AppointmentWithServices[];

    console.log("📅 Citas existentes:", existingAppointments.length);

    const breakTimes: BreakTime[] = [];

    const slots = generateTimeSlots(
      workingHours,
      totalDuration,
      existingAppointments,
      breakTimes,
      normalizedDate, // Pasar la fecha normalizada
      businessConfig.minBookingNotice
    );

    console.log(`✅ Slots generados: ${slots.length}`);
    return slots;
  } catch (error) {
    console.error("❌ Error en getAvailableSlots:", error);
    return [];
  }
}


function generateTimeSlots(
  workingHours: BusinessHours,
  duration: number,
  existingAppointments: AppointmentWithServices[],
  breakTimes: BreakTime[],
  baseDate: Date,
  minBookingNotice: number
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const now = new Date();

  // Validar que la duración cabe en al menos un periodo
  const fitsInMorning = workingHours.morning && 
    timeStringToMinutes(workingHours.morning.end) - timeStringToMinutes(workingHours.morning.start) >= duration;

  const fitsInAfternoon = workingHours.afternoon && 
    timeStringToMinutes(workingHours.afternoon.end) - timeStringToMinutes(workingHours.afternoon.start) >= duration;

  if (!fitsInMorning && !fitsInAfternoon) {
    console.log(`❌ Duración de ${duration}min no cabe en ningún periodo`);
    return [];
  }

  // Generar slots para la mañana
  if (fitsInMorning && workingHours.morning) {
    const morningSlots = generateSlotsForPeriod(
      workingHours.morning.start,
      workingHours.morning.end,
      duration,
      existingAppointments,
      breakTimes,
      baseDate,
      minBookingNotice,
      now
    );
    slots.push(...morningSlots);
  }

  // Generar slots para la tarde
  if (fitsInAfternoon && workingHours.afternoon) {
    const afternoonSlots = generateSlotsForPeriod(
      workingHours.afternoon.start,
      workingHours.afternoon.end,
      duration,
      existingAppointments,
      breakTimes,
      baseDate,
      minBookingNotice,
      now
    );
    slots.push(...afternoonSlots);
  }

  return slots;
}

// function isSlotAvailable(
//   slotStart: Date,
//   slotEnd: Date,
//   existingAppointments: AppointmentWithServices[],
//   breakTimes: BreakTime[],
//   now: Date 
// ): boolean {
//   // 1. Verificar si el slot está en el pasado
//   // const now = new Date();
//   if (slotStart < now) {
//     return false;
//   }

//   // 2. Verificar tiempos de descanso
//   for (const breakTime of breakTimes) {
//     const breakStart = new Date(slotStart);
//     const [breakStartHour, breakStartMinute] = breakTime.startTime.split(":").map(Number);
//     breakStart.setHours(breakStartHour, breakStartMinute, 0, 0);

//     const breakEnd = new Date(slotStart);
//     const [breakEndHour, breakEndMinute] = breakTime.endTime.split(":").map(Number);
//     breakEnd.setHours(breakEndHour, breakEndMinute, 0, 0);

//     if (slotStart < breakEnd && slotEnd > breakStart) {
//       return false;
//     }
//   }

//   // 3. Verificar citas existentes
//   for (const appointment of existingAppointments) {
//     const appointmentStart = new Date(appointment.date);
//     const appointmentEnd = new Date(appointmentStart.getTime() + appointment.duration * 60000);

//     const overlaps =
//       (slotStart >= appointmentStart && slotStart < appointmentEnd) ||
//       (slotEnd > appointmentStart && slotEnd <= appointmentEnd) ||
//       (slotStart <= appointmentStart && slotEnd >= appointmentEnd);

//     if (overlaps) {
//       return false;
//     }
//   }

//   return true;
// }

function isSlotAvailable(
  slotStart: Date,
  slotEnd: Date,
  existingAppointments: AppointmentWithServices[],
  breakTimes: BreakTime[],
  now: Date 
): boolean {
  // 1. Verificar si el slot está en el pasado
  if (slotStart < now) {
    console.log(`   ❌ Slot ${slotStart.toISOString()} en el pasado`);
    return false;
  }

  // 2. Verificar tiempos de descanso
  for (const breakTime of breakTimes) {
    const breakStart = new Date(slotStart);
    const [breakStartHour, breakStartMinute] = breakTime.startTime.split(":").map(Number);
    breakStart.setUTCHours(breakStartHour, breakStartMinute, 0, 0);

    const breakEnd = new Date(slotStart);
    const [breakEndHour, breakEndMinute] = breakTime.endTime.split(":").map(Number);
    breakEnd.setUTCHours(breakEndHour, breakEndMinute, 0, 0);

    if (slotStart < breakEnd && slotEnd > breakStart) {
      console.log(`   ❌ Slot ${slotStart.toISOString()} en tiempo de descanso`);
      return false;
    }
  }

  // 3. Verificar citas existentes
  for (const appointment of existingAppointments) {
    // const appointmentStart = new Date(appointment.date);
    // const appointmentEnd = new Date(appointmentStart.getTime() + appointment.duration * 60000);
    const appointmentStart = appointment.date;
    const appointmentEnd = appointment.endDate;

    const overlaps =
      (slotStart >= appointmentStart && slotStart < appointmentEnd) ||
      (slotEnd > appointmentStart && slotEnd <= appointmentEnd) ||
      (slotStart <= appointmentStart && slotEnd >= appointmentEnd);

    if (overlaps) {
      console.log(`   ❌ Slot ${slotStart.toISOString()} se superpone con cita existente`);
      return false;
    }
  }

  console.log(`   ✅ Slot ${slotStart.toISOString()} disponible`);
  return true;
}

// function formatTime(date: Date): string {
//   const hours = date.getHours().toString().padStart(2, "0");
//   const minutes = date.getMinutes().toString().padStart(2, "0");
//   return `${hours}:${minutes}`;
// }

function formatTime(date: Date): string {
  const hours = date.getUTCHours().toString().padStart(2, "0"); // Usar getUTCHours()
  const minutes = date.getUTCMinutes().toString().padStart(2, "0"); // Usar getUTCMinutes()
  return `${hours}:${minutes}`;
}



// function generateSlotsForPeriod(
//   startTime: string,
//   endTime: string,
//   duration: number,
//   existingAppointments: AppointmentWithServices[],
//   breakTimes: BreakTime[],
//   baseDate: Date,
//   minBookingNotice: number,
//   now: Date
// ): TimeSlot[] {

//   const slots: TimeSlot[] = [];
//   const [startHour, startMinute] = startTime.split(":").map(Number);
//   const [endHour, endMinute] = endTime.split(":").map(Number);

//   // const baseStartTime = new Date(baseDate);
//   // baseStartTime.setHours(startHour, startMinute, 0, 0);

//   // const baseEndTime = new Date(baseDate);
//   // baseEndTime.setHours(endHour, endMinute, 0, 0);

//     // Usar UTC consistentemente
//   const baseStartTime = new Date(baseDate);
//   baseStartTime.setUTCHours(startHour, startMinute, 0, 0);

//   const baseEndTime = new Date(baseDate);
//   baseEndTime.setUTCHours(endHour, endMinute, 0, 0);

//   let currentTime = new Date(baseStartTime);

//   while (currentTime < baseEndTime) {
//     const slotEnd = new Date(currentTime.getTime() + duration * 60000);

//     if (slotEnd > baseEndTime) {
//       break;
//     }

//     const minBookingTime = new Date(now.getTime() + minBookingNotice * 60 * 60000);

    
//     if (currentTime < minBookingTime) {
//       currentTime = new Date(currentTime.getTime() + 15 * 60000);
//       continue;
//     }

//     const isAvailable = isSlotAvailable(
//       new Date(currentTime),
//       new Date(slotEnd),
//       existingAppointments,
//       breakTimes,
//       now
//     );

//     slots.push({
//       time: formatTime(currentTime),
//       available: isAvailable,
//       startDateTime: new Date(currentTime),
//       endDateTime: new Date(slotEnd),
//     });

//     currentTime = new Date(currentTime.getTime() + 15 * 60000);
//   }

//   return slots;
// }

// function generateSlotsForPeriod(
//   startTime: string,
//   endTime: string,
//   duration: number,
//   existingAppointments: AppointmentWithServices[],
//   breakTimes: BreakTime[],
//   baseDate: Date, // Esta fecha ya está normalizada a 9:00 AM UTC
//   minBookingNotice: number,
//   now: Date
// ): TimeSlot[] {
//   const slots: TimeSlot[] = [];
//   const [startHour, startMinute] = startTime.split(":").map(Number);
//   const [endHour, endMinute] = endTime.split(":").map(Number);

//   // Crear fechas base usando UTC
//   const baseStartTime = new Date(baseDate);
//   baseStartTime.setUTCHours(startHour, startMinute, 0, 0);

//   const baseEndTime = new Date(baseDate);
//   baseEndTime.setUTCHours(endHour, endMinute, 0, 0);

//   console.log(`⏰ Generando slots para periodo ${startTime}-${endTime}:`);
//   console.log("   Base Start:", baseStartTime.toISOString());
//   console.log("   Base End:", baseEndTime.toISOString());

//   let currentTime = new Date(baseStartTime);

//   while (currentTime < baseEndTime) {
//     const slotEnd = new Date(currentTime.getTime() + duration * 60000);

//     if (slotEnd > baseEndTime) {
//       break;
//     }

//     const minBookingTime = new Date(now.getTime() + minBookingNotice * 60 * 60000);
    
//     if (currentTime < minBookingTime) {
//       currentTime = new Date(currentTime.getTime() + 15 * 60000);
//       continue;
//     }

//     const isAvailable = isSlotAvailable(
//       new Date(currentTime),
//       new Date(slotEnd),
//       existingAppointments,
//       breakTimes,
//       now
//     );

    

//     slots.push({
//       time: formatTime(currentTime),
//       available: isAvailable,
//       startDateTime: new Date(currentTime),
//       endDateTime: new Date(slotEnd),
//     });

//     currentTime = new Date(currentTime.getTime() + 15 * 60000);
//   }

//   console.log(`   📋 ${slots.length} slots generados para este periodo`);
//   return slots;
// }

function generateSlotsForPeriod(
  startTime: string,
  endTime: string,
  duration: number,
  existingAppointments: AppointmentWithServices[],
  breakTimes: BreakTime[],
  baseDate: Date,
  minBookingNotice: number,
  now: Date
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  // Crear fechas base usando UTC
  const baseStartTime = new Date(baseDate);
  baseStartTime.setUTCHours(startHour, startMinute, 0, 0);

  const baseEndTime = new Date(baseDate);
  baseEndTime.setUTCHours(endHour, endMinute, 0, 0);

  console.log(`⏰ Generando slots para periodo ${startTime}-${endTime}:`);
  console.log("   Base Start:", baseStartTime.toISOString());
  console.log("   Base End:", baseEndTime.toISOString());
  console.log("   Duration:",duration);

  let currentTime = new Date(baseStartTime);

  while (currentTime < baseEndTime) {
    const slotEnd = new Date(currentTime.getTime() + duration * 60000);


    // Si el slot termina después del horario laboral, no generarlo
    if (slotEnd > baseEndTime) {
      console.log(`   ⏹️  Slot ${formatTime(currentTime)} no cabe en el periodo (termina a las ${formatTime(slotEnd)})`);
      break;
    }

    const minBookingTime = new Date(now.getTime() + minBookingNotice * 60 * 60000);
    
    // Verificar tiempo mínimo de reserva
    if (currentTime < minBookingTime) {
      console.log(`   ⏰ Slot ${formatTime(currentTime)} no disponible (tiempo mínimo de reserva)`);
      currentTime = new Date(currentTime.getTime() + 15 * 60000);
      continue;
    }

    const isAvailable = isSlotAvailable(
      new Date(currentTime),
      new Date(slotEnd),
      existingAppointments,
      breakTimes,
      now
    );

    slots.push({
      time: formatTime(currentTime),
      available: isAvailable,
      startDateTime: new Date(currentTime),
      endDateTime: new Date(slotEnd),
    });

    console.log(`   ${isAvailable ? '✅' : '❌'} Slot ${formatTime(currentTime)} ${isAvailable ? 'disponible' : 'no disponible'}`);

    // Avanzar al siguiente slot (siempre 15 minutos, independientemente de la disponibilidad)
    currentTime = new Date(currentTime.getTime() + 15 * 60000);
  }

  console.log(`   📋 ${slots.length} slots generados para este periodo`);
  
  // Debug: mostrar todos los slots generados
  console.log(`   🕒 Slots generados:`);
  slots.forEach(slot => {
    console.log(`      ${slot.time} - ${slot.available ? 'Disponible' : 'No disponible'}`);
  });
  
  return slots;
}

export async function checkServiceFitsInDay(
  date: Date,
  totalDuration: number
): Promise<boolean> {
  try {
    const businessConfig = await getBusinessConfig();
    if (!businessConfig) return false;

    const dayOfWeek = date.getDay();
    const dateStr = date.toISOString().split("T")[0];

    const specialDateConfig = businessConfig.specificDateOverrides.find(
      (d) => d.date === dateStr
    );

    const dayConfig = specialDateConfig || businessConfig.weekAvailability[dayOfWeek];

    if (!dayConfig?.available || !dayConfig.hours) return false;

    const longestAvailablePeriod = calculateLongestAvailablePeriod(dayConfig.hours);
    return totalDuration <= longestAvailablePeriod;
  } catch (error) {
    console.error("Error checking service fit:", error);
    return false;
  }
}

// CORRECCIÓN: Usar BusinessHours en lugar del tipo personalizado
function calculateLongestAvailablePeriod(workingHours: BusinessHours): number {
  let longestPeriod = 0;

  if (workingHours.morning) {
    const morningStart = timeStringToMinutes(workingHours.morning.start);
    const morningEnd = timeStringToMinutes(workingHours.morning.end);
    const morningDuration = morningEnd - morningStart;
    longestPeriod = Math.max(longestPeriod, morningDuration);
  }

  if (workingHours.afternoon) {
    const afternoonStart = timeStringToMinutes(workingHours.afternoon.start);
    const afternoonEnd = timeStringToMinutes(workingHours.afternoon.end);
    const afternoonDuration = afternoonEnd - afternoonStart;
    longestPeriod = Math.max(longestPeriod, afternoonDuration);
  }

  return longestPeriod;
}

function timeStringToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
}

export interface AvailableSlotsResponse {
  date: string;
  slots: TimeSlot[];
}

export interface SlotAvailabilityCheck {
  startDateTime: Date;
  endDateTime: Date;
  isAvailable: boolean;
  reason?: string;
}