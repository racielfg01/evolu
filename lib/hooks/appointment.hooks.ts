// lib/hooks/appointment.hooks.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions
} from '@tanstack/react-query';
import {
  fetchAllAppointments,
  fetchAppointmentsByUser,
  fetchAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  FullAppointment
} from '@/lib/actions/appointment.actions';

export const useGetAllAppointments = (options?: UseQueryOptions<FullAppointment[]>) => {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: fetchAllAppointments,
    ...options
  });
};

export const useUserAppointments = (
  userId: string | undefined,
  options?: UseQueryOptions<FullAppointment[]>
) => {
  return useQuery({
    queryKey: ['appointments', 'user', userId],
    queryFn: () => userId ? fetchAppointmentsByUser(userId) : [],
    enabled: !!userId,
    ...options
  });
};

export const useAppointmentById = (
  id: string ,
  options?: UseQueryOptions<FullAppointment>
) => {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => fetchAppointmentById(id) ,
    enabled: !!id,
    ...options
  });
};

export const useAddAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
           queryClient.invalidateQueries({ queryKey: ["appointments"] });
  
    }
  });
};

export const useEditAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Parameters<typeof updateAppointment>[1]) =>
      updateAppointment(id, data),
    onSuccess: (data) => {
           queryClient.invalidateQueries({ queryKey: ["appointments",data?.id] });
    }
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
           queryClient.invalidateQueries({ queryKey: ["appointments"] });
    }
  });
};