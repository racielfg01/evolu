// hooks/use-availability.ts
import { useQuery } from "@tanstack/react-query";
import { getAvailableSlots } from "@/lib/actions/availability.actions";
import { ServiceWithRelations } from "@/lib/actions/services.actions";

export function useAvailableSlots(selectedServices: ServiceWithRelations[], selectedDate: Date | null) {
  return useQuery({
    queryKey: ["availableSlots", selectedDate, selectedServices.map(s => s.id)],
    queryFn: () => {
      if (!selectedDate || selectedServices.length === 0) return [];
      const totalDuration = selectedServices.reduce((total, service) => total + service.duration, 0);
      return getAvailableSlots(selectedDate, totalDuration);
    },
    enabled: !!selectedDate && selectedServices.length > 0,
  });
}