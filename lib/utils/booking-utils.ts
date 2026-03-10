// lib/utils/booking-utils.ts
import { ServiceWithRelations } from "@/lib/actions/services.actions";

export const BUFFER_TIME = 20; // 20 minutos de buffer entre servicios

export function calculateTotalDuration(services: ServiceWithRelations[]): number {
  if (!services || services.length === 0) return 0;
  
  const servicesDuration = services.reduce(
    (total, service) => total + service.duration, 
    0
  );
  
  // Solo agregar buffer si hay al menos un servicio
  return servicesDuration + BUFFER_TIME;
}

export function calculateEndDateTime(startDateTime: Date, services: ServiceWithRelations[]): Date {
  const totalDuration = calculateTotalDuration(services);
  return new Date(startDateTime.getTime() + totalDuration * 60000);
}