// hooks/use-availability.ts
import { useQuery } from "@tanstack/react-query";
import { getAvailableSlots, checkServiceFitsInDay } from "@/lib/actions/availability.actions";
import { ServiceWithRelations } from "@/lib/actions/services.actions";

// export function useAvailableSlots(selectedServices: ServiceWithRelations[], selectedDate: Date | null) {
//   return useQuery({
//     queryKey: ["availableSlots", selectedDate, selectedServices.map(s => s.id)],
//     queryFn: () => {
//       if (!selectedDate || selectedServices.length === 0) return [];
//       const totalDuration = selectedServices.reduce((total, service) => total + service.duration, 0);
//       return getAvailableSlots(selectedDate, totalDuration);
//     },
//     enabled: !!selectedDate && selectedServices.length > 0,
//   });
// }



export function useAvailableSlots(selectedServices: ServiceWithRelations[], selectedDate: Date | null) {
  return useQuery({
    queryKey: ["availableSlots", selectedDate, selectedServices.map(s => s.id)],
    queryFn: async () => {
      if (!selectedDate || selectedServices.length === 0) return [];
      
      const totalDuration = selectedServices.reduce((total, service) => total + service.duration, 0);
      
      // Validar si el servicio cabe en algún periodo del día
      const fitsInDay = await checkServiceFitsInDay(selectedDate, totalDuration);
      if (!fitsInDay) {
        throw new Error(`La duración total de ${totalDuration} minutos no cabe en los horarios disponibles de este día`);
      }
      
      return getAvailableSlots(selectedDate, totalDuration);
    },
    enabled: !!selectedDate && selectedServices.length > 0,
    retry: false
  });
}