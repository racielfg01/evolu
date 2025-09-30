// lib/services/service.hooks.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions
} from '@tanstack/react-query';
import {
  fetchAllServices,
  fetchServiceById,
  fetchServiceByCategory,
  addService,
  editService,
  deleteService,
  FullService,
  ServiceInput,
  // addServiceFake
} from '@/lib/actions/services.actions';
import { toast } from 'sonner';

export const useGetAllServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: fetchAllServices,
    
  });
};

export const useGetServiceById = (id: string, options?: UseQueryOptions<FullService>) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => fetchServiceById(id),
    enabled: !!id,
    ...options
  });
};

export const useServicesByCategory = (
  categoryId: string | undefined,
  options?: UseQueryOptions<FullService[]>
) => {
  return useQuery({
    queryKey: ['services', 'category', categoryId],
    queryFn: () => categoryId ? fetchServiceByCategory(categoryId) : [],
    enabled: !!categoryId,
    ...options
  });
};

export const useAddService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data}: { data: Omit<ServiceInput,"id"> }) => addService(data),
    // mutationFn:()=> addServiceFake(),
    onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["services"] });
      
    }
  });
};

export const useEditService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data}: { data: Partial<ServiceInput> }) => 
      editService( data),
    onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: ["services"] });
  //  queryClient.invalidateQueries({ queryKey: ["services",data.id] });
    }
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  // return useMutation({
  //   mutationFn: (id: string) => deleteService(id),
  //   onSuccess: () => {
  //  queryClient.invalidateQueries({ queryKey: ["services"] });
  //   toast("Servicio eliminado", {
  //           description: "El servicio ha sido elimiado correctamente",
         
  //         });
  //   },
  //   onError: (error) => {
  //         toast.error("Error al eliminar rol", {
  //           description: error.message || "Intente nuevamente",
  //         });
  //       },

        
  // });

  return useMutation({
    mutationFn: (id: string) => deleteService(id),
    //   onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ['services'] });
    // },
    onSuccess: (result) => {
      if (result.success) {
        // Invalidar y refetch los datos
        toast.success("Servicio eliminado", {
          description: "El servicio ha sido eliminado correctamente",
        });
        
      } else {
        toast.error("Error al eliminar servicio", {
          description: result.message,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (error) => {
      toast.error("Error al eliminar servicio", {
        description: error.message || "Intente nuevamente",
      });
    },
  });
};