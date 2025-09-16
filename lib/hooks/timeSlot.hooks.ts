// // lib/hooks/timeSlot.hooks.ts
// import {
//   useQuery,
//   useMutation,
//   useQueryClient
// } from '@tanstack/react-query';
// import {
//   fetchAllTimeSlots,
//   fetchTimeSlotsByService,
//   createTimeSlot,
//   updateTimeSlot,
//   deleteTimeSlot
// } from '@/lib/actions/timeSlot.actions';

// export const useTimeSlots = () => {
//   return useQuery({
//     queryKey: ['timeSlots'],
//     queryFn: fetchAllTimeSlots
//   });
// };

// export const useTimeSlotsByService = (serviceId: string) => {
//   return useQuery({
//     queryKey: ['timeSlots', 'service', serviceId],
//     queryFn: () => fetchTimeSlotsByService(serviceId),
//     enabled: !!serviceId
//   });
// };

// export const useCreateTimeSlot = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: createTimeSlot,
//     onSuccess: () => {
//       queryClient.invalidateQueries(['timeSlots']);
//     }
//   });
// };

// export const useUpdateTimeSlot = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, ...data }: { id: number } & Parameters<typeof updateTimeSlot>[1]) => 
//       updateTimeSlot(id, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['timeSlots']);
//     }
//   });
// };

// export const useDeleteTimeSlot = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: deleteTimeSlot,
//     onSuccess: () => {
//       queryClient.invalidateQueries(['timeSlots']);
//     }
//   });
// };