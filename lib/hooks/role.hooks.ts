"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllRoles,
  createRole,
  updateRole,
  deleteRole,
} from "@/lib/actions/role.actions";
import { toast } from "sonner";

// Hook para obtener todos los roles
export const useGetAllRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: fetchAllRoles,
  });
};

// Hook para crear un nuevo rol
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createRole(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast("Rol creado", {
        description: "El rol ha sido creado correctamente",
      });
    },
    onError: (error) => {
      toast.error("Error al eliminar rol", {
        description: error.message || "Intente nuevamente",
      });
    },
  });
};

// Hook para actualizar un rol existente
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateRole(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast("Rol actualizado", {
        description: "El rol ha sido actualizado correctamente",
      });
    },
    onError: (error) => {
      toast.error("Error al eliminar rol", {
        description: error.message || "Intente nuevamente",
      });
    },
  });
};

// Hook para eliminar un rol
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast("Rol eliminado", {
        description: "El rol ha sido elimiado correctamente",
     
      });
    },
    onError: (error) => {
      toast.error("Error al eliminar rol", {
        description: error.message || "Intente nuevamente",
      });
    },
  });
};
