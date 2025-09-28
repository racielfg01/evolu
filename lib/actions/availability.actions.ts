"use server";

// lib/actions/availability.actions.ts
import {  type Appointment, type BreakTime } from "@prisma/client";
import prisma from '@/lib/prisma';
import { getBusinessConfig } from './config.actions';
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

export async function getAvailableSlots(
  date: Date,
  totalDuration: number
){
  try {


     const businessConfig = await getBusinessConfig();
    if (!businessConfig) return [];

    const dayOfWeek = date.getDay();
    const dateStr = date.toISOString().split('T')[0];
    
    // Buscar configuración para día especial
    const specialDateConfig = businessConfig.specificDateOverrides.find(
      d => d.date === dateStr
    );

    const dayConfig = specialDateConfig || businessConfig.weekAvailability[dayOfWeek];
    
    if (!dayConfig?.available) return [];

    // Obtener horarios laborales desde la configuración
        if (!dayConfig?.hours) return [];
    const workingHours = {
      morning: dayConfig.hours.morning ,
      afternoon: dayConfig.hours.afternoon,
    };

    // 2. Obtener citas existentes para esa fecha
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    console.log("startOfDay", startOfDay);
    console.log("endOfDay", endOfDay);

    const existingAppointments = (await prisma.appointment.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ["PENDING", "CONFIRMED"],
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

    console.log("existingAppointments", existingAppointments);

    // 3. Obtener tiempos de descanso
    // const breakTimes = await prisma.breakTime.findMany({
    //   where: { working_hours_id: workingHours.id },
    // });
    const breakTimes:BreakTime[] = []

    // 4. Generar slots disponibles
    // const slots = generateTimeSlots(
    //   workingHours.startTime,
    //   workingHours.endTime,
    //   totalDuration,
    //   existingAppointments,
    //   breakTimes,
    //   date
    // );

     const slots = generateTimeSlots(
      workingHours,
      totalDuration,
      existingAppointments,
      breakTimes,
      date,
      businessConfig.minBookingNotice
    );
    
      return slots;
    // return [];
  } catch (error) {
    console.log(error);
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

  // Generar slots para la mañana
  if (workingHours.morning) {
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
  if (workingHours.afternoon) {
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



function isSlotAvailable(
  slotStart: Date,
  slotEnd: Date,
  existingAppointments: AppointmentWithServices[],
  breakTimes: BreakTime[]
): boolean {
  // 1. Verificar si el slot coincide con algún tiempo de descanso
  for (const breakTime of breakTimes) {
    const [breakStartHour, breakStartMinute] = breakTime.startTime
      .split(":")
      .map(Number);
    const [breakEndHour, breakEndMinute] = breakTime.endTime
      .split(":")
      .map(Number);

    const breakStart = new Date(slotStart);
    breakStart.setHours(breakStartHour, breakStartMinute, 0, 0);

    const breakEnd = new Date(slotStart);
    breakEnd.setHours(breakEndHour, breakEndMinute, 0, 0);

    // Si el slot se superpone con el tiempo de descanso, no está disponible
    if (slotStart < breakEnd && slotEnd > breakStart) {
      return false;
    }
  }

  // 2. Verificar si el slot se superpone con citas existentes
  for (const appointment of existingAppointments) {
    const appointmentEnd = new Date(
      appointment.date.getTime() + appointment.duration * 60000
    );

    // Si el slot se superpone con una cita existente, no está disponible
    if (slotStart < appointmentEnd && slotEnd > appointment.date) {
      return false;
    }
  }

  // 3. Verificar que el slot no esté en el pasado
  const now = new Date();
  if (slotStart < now) {
    return false;
  }

  return true;
}

function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

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

  const baseStartTime = new Date(baseDate);
  baseStartTime.setHours(startHour, startMinute, 0, 0);

  const baseEndTime = new Date(baseDate);
  baseEndTime.setHours(endHour, endMinute, 0, 0);

  let currentTime = new Date(baseStartTime);

  while (currentTime < baseEndTime) {
    const slotEnd = new Date(currentTime.getTime() + duration * 60000);

    if (slotEnd > baseEndTime) {
      currentTime = new Date(currentTime.getTime() + 15 * 60000);
      continue;
    }

    // Verificar tiempo mínimo de reserva
    const minBookingTime = new Date(now.getTime() + minBookingNotice * 60 * 60000);
    if (currentTime < minBookingTime) {
      currentTime = new Date(currentTime.getTime() + 15 * 60000);
      continue;
    }

    const isAvailable = isSlotAvailable(
      currentTime,
      slotEnd,
      existingAppointments,
      breakTimes
    );

    slots.push({
      time: formatTime(currentTime),
      available: isAvailable,
      startDateTime: new Date(currentTime),
      endDateTime: new Date(slotEnd),
    });

    currentTime = new Date(currentTime.getTime() + 15 * 60000);
  }

  return slots;
}

// // Función auxiliar para convertir string time a Date
// function timeStringToDate(baseDate: Date, timeString: string): Date {
//   const [hours, minutes] = timeString.split(":").map(Number);
//   const date = new Date(baseDate);
//   date.setHours(hours, minutes, 0, 0);
//   return date;
// }

// Tipos para las respuestas
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
