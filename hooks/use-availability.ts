// hooks/use-availability.ts

import { useQuery } from "@tanstack/react-query";
import { getAvailableSlots, checkServiceFitsInDay } from "@/lib/actions/availability.actions";
import { ServiceWithRelations } from "@/lib/actions/services.actions";
import { BUFFER_TIME } from "@/lib/utils/booking-utils";



// export function useAvailableSlots(selectedServices: ServiceWithRelations[], selectedDate: Date | null) {
//   return useQuery({
//     queryKey: ["availableSlots", selectedDate?.toISOString(), selectedServices.map(s => s.id)],
//     queryFn: async () => {
//       if (!selectedDate || selectedServices.length === 0) return [];
      
//       // Normalizar fecha a las 9:00 AM
//       // const normalizedDate = new Date(selectedDate);
//       // normalizedDate.setHours(9, 0, 0, 0); // 9:00 AM local
      
//       // console.log("🕘 Hook - Fecha normalizada a 9:00 AM:", normalizedDate.toString());
      
//       const totalDuration = selectedServices.reduce((total, service) => total + service.duration, 0);
      
//       const fitsInDay = await checkServiceFitsInDay(selectedDate, totalDuration);
//       if (!fitsInDay) {
//         throw new Error(`La duración total de ${totalDuration} minutos no cabe en los horarios disponibles de este día`);
//       }
      
//       return getAvailableSlots(selectedDate, totalDuration);
//     },
//     enabled: !!selectedDate && selectedServices.length > 0,
//     retry: false,
//     staleTime: 0,
//   });
// }

export function useAvailableSlots(selectedServices: ServiceWithRelations[], selectedDate: Date | undefined| null) {
  return useQuery({
    queryKey: ["availableSlots", selectedDate?.toISOString(), selectedServices.map(s => s.id)],
    queryFn: async () => {
      if (!selectedDate || selectedServices.length === 0) return [];
      
      // Calcular duración total de los servicios
      const servicesDuration = selectedServices.reduce((total, service) => total + service.duration, 0);
      
      // Añadir los 20 minutos de buffer
      const totalDurationWithBuffer = servicesDuration + BUFFER_TIME;
      
      console.log(`⏱️ Duración calculada: ${servicesDuration} minutos (servicios) + ${BUFFER_TIME} minutos (buffer) = ${totalDurationWithBuffer} minutos totales`);
      
      // Verificar si la duración total (con buffer) cabe en el día
      const fitsInDay = await checkServiceFitsInDay(selectedDate, totalDurationWithBuffer);
      if (!fitsInDay) {
        throw new Error(`La duración total de ${servicesDuration} minutos más ${BUFFER_TIME} minutos de preparación (${totalDurationWithBuffer} min) no cabe en los horarios disponibles de este día`);
      }
      
      // Obtener slots disponibles considerando la duración total con buffer
      return getAvailableSlots(selectedDate, totalDurationWithBuffer);
    },
    enabled: !!selectedDate && selectedServices.length > 0,
    retry: false,
    staleTime: 0,
  });
}