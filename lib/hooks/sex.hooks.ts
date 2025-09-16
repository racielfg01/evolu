"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllSexes,
  createSex,
  updateSex,
  deleteSex,
} from "@/lib/actions/sex.actions";
import { toast } from "sonner";

// Hook para obtener todos los Sexs
export const useGetAllSexs = () => {
  return useQuery({
    queryKey: ["sex"],
    queryFn: fetchAllSexes,
  });
};

// Hook para crear un nuevo rol
export const useCreateSex = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createSex(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sex"] });
      toast("Sexo creado", {
        description: "El Sexo ha sido creado correctamente",
      });
    },
    onError: (error) => {
      toast.error("Error al eliminar Sexo", {
        description: error.message || "Intente nuevamente",
      });
    },
  });
};

// Hook para actualizar un Sexo existente
export const useUpdateSex = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateSex(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sex"] });
      toast("Sexo actualizado", {
        // description: "El Sexo ha sido actualizado correctamente",
      });
    },
    onError: (error) => {
      toast.error("Error al actualizar el Sexo", {
        description: error.message || "Intente nuevamente",
      });
    },
  });
};

// Hook para eliminar un Sexo
export const useDeleteSex = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSex(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sex"] });
      toast("Sexo eliminado", {
        description: "El Sexo ha sido elimiado correctamente",
      
      });
    },
    onError: (error) => {
      toast.error("Error al eliminar Sexo", {
        description: error.message || "Intente nuevamente",
      });
    },
  });
};
