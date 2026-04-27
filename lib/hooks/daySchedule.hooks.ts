// // lib/hooks/daySchedule.hooks.ts
// import {
//   useQuery,
//   useMutation,
//   useQueryClient
// } from '@tanstack/react-query';
// import {
//   fetchAllDaySchedules,
//   createDaySchedule,
//   deleteDaySchedule
// } from '@/lib/actions/daySchedule.actions';

// export const useDaySchedules = () => {
//   return useQuery({
//     queryKey: ['daySchedules'],
//     queryFn: fetchAllDaySchedules
//   });
// };

// export const useCreateDaySchedule = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: createDaySchedule,
//     onSuccess: () => {
//       queryClient.invalidateQueries(['daySchedules']);
//     }
//   });
// };

// export const useDeleteDaySchedule = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: deleteDaySchedule,
//     onSuccess: () => {
//       queryClient.invalidateQueries(['daySchedules']);
//     }
//   });
// };