// lib/hooks/category.hooks.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions
} from '@tanstack/react-query';
import {
  fetchAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '@/lib/actions/category.actions';
import { toast } from 'sonner';

export const getAllCategorys = queryOptions({
    queryKey: ['categories'],
    queryFn: fetchAllCategories
  }) 
  


export const useGetAllCategorys = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchAllCategories
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast("Categorías creada", {
        description: "La categoría ha sido creada",
      });
    },
    onError: (error) => {
      toast.error("Error al eliminar la categoría", {
        description: error.message || "Intente nuevamente",
      });
    }
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => 
      updateCategory(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast("Categorías actualizada", {
        description: "La categoría ha sido actualizada",
      });
    },
    onError: (error) => {
      toast.error("Error al eliminar la categoría ", {
        description: error.message || "Intente nuevamente",
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
     onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast("Categorías eliminada", {
        description: "La categoría ha sido eliminada",
      });
    },
    onError: (error) => {
      toast.error("Error al eliminar la categoría ", {
        description: error.message || "Intente nuevamente",
      });
    },
  });
};