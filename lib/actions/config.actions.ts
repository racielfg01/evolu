// lib/actions/config.actions.ts
"use server";

// import { BusinessConfiguration, WeekAvailability } from '@/components/booking/availability-configurator';
// import prisma from '@/lib/prisma';

// export async function saveBusinessConfig(config:BusinessConfiguration
// //      {
// //   weekAvailability: any;
// //   specificDateOverrides: any[];
// //   minBookingNotice: number;
// // }
// ) {
//   try {
//     // Guardar configuración general
//     await prisma.businessConfig.upsert({
//       where: { id: '1' },
//       update: { minBookingNotice: config.minBookingNotice },
//       create: { id: '1', minBookingNotice: config.minBookingNotice },
//     });

//     // Guardar disponibilidad por día
//     for (const [dayOfWeek, availability] of Object.entries(config.weekAvailability)) {
//       await prisma.dayAvailability.upsert({
//         where: { dayOfWeek: parseInt(dayOfWeek) },
//         update: {
//           available: availability.available,
//           morningStart: availability.hours.morning?.start,
//           morningEnd: availability.hours.morning?.end,
//           afternoonStart: availability.hours.afternoon?.start,
//           afternoonEnd: availability.hours.afternoon?.end,
//         },
//         create: {
//           dayOfWeek: parseInt(dayOfWeek),
//           available: availability.available,
//           morningStart: availability.hours.morning?.start,
//           morningEnd: availability.hours.morning?.end,
//           afternoonStart: availability.hours.afternoon?.start,
//           afternoonEnd: availability.hours.afternoon?.end,
//         },
//       });
//     }

//     // Guardar días especiales
//     await prisma.specialDate.deleteMany({});
//     if(config.specificDateOverrides)
//     for (const override of config.specificDateOverrides) {
//       await prisma.specialDate.create({
//         data: {
//           date: new Date(override.date),
//           available: override.available,
//           morningStart: override.hours?.morning?.start,
//           morningEnd: override.hours?.morning?.end,
//           afternoonStart: override.hours?.afternoon?.start,
//           afternoonEnd: override.hours?.afternoon?.end,
//         },
//       });
//     }

//     return { success: true };
//   } catch (error) {
//     console.error('Error saving business config:', error);
//     return { success: false, error: 'Error al guardar la configuración' };
//   }
// }

// export async function getBusinessConfig() {
//   try {
//     const [config, dayAvailability, specialDates] = await Promise.all([
//       prisma.businessConfig.findFirst(),
//       prisma.dayAvailability.findMany(),
//       prisma.specialDate.findMany(),
//     ]);

//     const weekAvailability:WeekAvailability = {};
//     dayAvailability.forEach(day => {
//       weekAvailability[day.dayOfWeek] = {
//         available: day.available,
//         hours: {
//           morning: day.morningStart && day.morningEnd ? 
//             { start: day.morningStart, end: day.morningEnd } : null,
//           afternoon: day.afternoonStart && day.afternoonEnd ? 
//             { start: day.afternoonStart, end: day.afternoonEnd } : null,
//         },
//       };
//     });

//     return {
//       weekAvailability,
//       specificDateOverrides: specialDates.map(date => ({
//         date: date.date.toISOString().split('T')[0],
//         available: date.available,
//         hours: {
//           morning: date.morningStart && date.morningEnd ? 
//             { start: date.morningStart, end: date.morningEnd } : null,
//           afternoon: date.afternoonStart && date.afternoonEnd ? 
//             { start: date.afternoonStart, end: date.afternoonEnd } : null,
//         },
//       })),
//       minBookingNotice: config?.minBookingNotice || 24,
//     };
//   } catch (error) {
//     console.error('Error getting business config:', error);
//     return null;
//   }
// }

// lib/actions/config.actions.ts
"use server";

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface BusinessConfiguration {
  weekAvailability: {
    [key: string]: {
      available: boolean;
      hours: {
        morning: { start: string; end: string } | null;
        afternoon: { start: string; end: string } | null;
      };
    };
  };
  specificDateOverrides: Array<{
    date: string;
    available: boolean;
    hours?: {
      morning: { start: string; end: string } | null;
      afternoon: { start: string; end: string } | null;
    };
  }>;
  minBookingNotice: number;
}

export async function saveBusinessConfig(config: BusinessConfiguration) {
  try {
    // Validar datos
    if (!config.minBookingNotice || config.minBookingNotice < 0) {
      throw new Error("Tiempo mínimo de reserva inválido");
    }

    // Transacción para asegurar consistencia
     await prisma.$transaction(async (tx) => {
      // 1. Guardar configuración general
      const businessConfig = await tx.businessConfig.upsert({
        where: { id: 'default-config' },
        update: { 
          minBookingNotice: config.minBookingNotice 
        },
        create: { 
          id: 'default-config',
          minBookingNotice: config.minBookingNotice 
        },
      });

      // 2. Guardar disponibilidad por día de la semana
      for (const [dayOfWeek, availability] of Object.entries(config.weekAvailability)) {
        await tx.dayAvailability.upsert({
          where: { dayOfWeek: parseInt(dayOfWeek) },
          update: {
            available: availability.available,
            morningStart: availability.hours.morning?.start || null,
            morningEnd: availability.hours.morning?.end || null,
            afternoonStart: availability.hours.afternoon?.start || null,
            afternoonEnd: availability.hours.afternoon?.end || null,
          },
          create: {
            dayOfWeek: parseInt(dayOfWeek),
            available: availability.available,
            morningStart: availability.hours.morning?.start || null,
            morningEnd: availability.hours.morning?.end || null,
            afternoonStart: availability.hours.afternoon?.start || null,
            afternoonEnd: availability.hours.afternoon?.end || null,
          },
        });
      }

      // 3. Eliminar días especiales existentes y guardar nuevos
      await tx.specialDate.deleteMany({});

      for (const override of config.specificDateOverrides) {
        if (!override.date) continue;

        await tx.specialDate.create({
          data: {
            date: new Date(override.date),
            available: override.available,
            morningStart: override.hours?.morning?.start || null,
            morningEnd: override.hours?.morning?.end || null,
            afternoonStart: override.hours?.afternoon?.start || null,
            afternoonEnd: override.hours?.afternoon?.end || null,
          },
        });
      }

      return businessConfig;
    });

    revalidatePath('/admin/services');
    revalidatePath('/booking');
    
    return { 
      success: true, 
      message: "Configuración guardada exitosamente" 
    };

  } catch (error) {
    console.error('Error saving business config:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al guardar la configuración" 
    };
  }
}

export async function getBusinessConfig(): Promise<BusinessConfiguration | null> {
  try {
    const [config, dayAvailability, specialDates] = await Promise.all([
      prisma.businessConfig.findFirst(),
      prisma.dayAvailability.findMany({ orderBy: { dayOfWeek: 'asc' } }),
      prisma.specialDate.findMany({ orderBy: { date: 'asc' } }),
    ]);

    const weekAvailability: BusinessConfiguration['weekAvailability'] = {};

    // Inicializar todos los días (0-6)
    for (let i = 0; i < 7; i++) {
      weekAvailability[i.toString()] = {
        available: false,
        hours: { morning: null, afternoon: null }
      };
    }

    // Llenar con datos de la base de datos
    dayAvailability.forEach(day => {
      weekAvailability[day.dayOfWeek.toString()] = {
        available: day.available,
        hours: {
          morning: day.morningStart && day.morningEnd ? 
            { start: day.morningStart, end: day.morningEnd } : null,
          afternoon: day.afternoonStart && day.afternoonEnd ? 
            { start: day.afternoonStart, end: day.afternoonEnd } : null,
        },
      };
    });

    const specificDateOverrides = specialDates.map(date => ({
      date: date.date.toISOString().split('T')[0],
      available: date.available,
      hours: {
        morning: date.morningStart && date.morningEnd ? 
          { start: date.morningStart, end: date.morningEnd } : null,
        afternoon: date.afternoonStart && date.afternoonEnd ? 
          { start: date.afternoonStart, end: date.afternoonEnd } : null,
      },
    }));

    return {
      weekAvailability,
      specificDateOverrides,
      minBookingNotice: config?.minBookingNotice || 24,
    };

  } catch (error) {
    console.error('Error getting business config:', error);
    return null;
  }
}

export async function resetToDefaultConfig() {
  try {
    const defaultConfig: BusinessConfiguration = {
      weekAvailability: {
        "1": { available: true, hours: { morning: { start: "09:00", end: "13:00" }, afternoon: { start: "15:00", end: "18:00" } } },
        "2": { available: true, hours: { morning: { start: "09:00", end: "13:00" }, afternoon: { start: "15:00", end: "18:00" } } },
        "3": { available: true, hours: { morning: { start: "09:00", end: "13:00" }, afternoon: { start: "15:00", end: "18:00" } } },
        "4": { available: true, hours: { morning: { start: "09:00", end: "13:00" }, afternoon: { start: "15:00", end: "18:00" } } },
        "5": { available: true, hours: { morning: { start: "09:00", end: "13:00" }, afternoon: { start: "15:00", end: "18:00" } } },
        "6": { available: true, hours: { morning: { start: "10:00", end: "14:00" }, afternoon: null } },
        "0": { available: false, hours: { morning: null, afternoon: null } },
      },
      specificDateOverrides: [],
      minBookingNotice: 24,
    };

    return await saveBusinessConfig(defaultConfig);

  } catch (error) {
    console.error('Error resetting to default config:', error);
    return { success: false, error: "Error al restaurar configuración predeterminada" };
  }
}