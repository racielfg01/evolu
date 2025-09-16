"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/lib/actions/user.actions";
import { toast } from "sonner";
import { User } from "@prisma/client";

// Hook para obtener todos los Users
export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["Users"],
    queryFn: fetchAllUsers,
  });
};

// Hook para crear un nuevo rol
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: Omit<User,"id">) => createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Users"] });
      toast("Usuario creado", {
        description: "El Usuario ha sido creado correctamente",
      });
    },
    onError: (error) => {
      toast.error("Error al eliminar el usuario", {
        description: error.message || "Intente nuevamente",
      });
    },
  });
};

// Hook para actualizar un rol existente
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Users"] });
      toast("Usuario actualizado", {
        description: "El Usuario ha sido actualizado correctamente",
      });
    },
    onError: (error) => {
      toast.error("Error al eliminar  el usuario", {
        description: error.message || "Intente nuevamente",
      });
    },
  });
};

// Hook para eliminar un rol
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Users"] });
      toast("Usuario eliminado", {
        description: "El Usuario ha sido eliminado correctamente",
        // action: {
        //   label: "Undo",
        //   onClick: () => console.log("Undo"),
        // },
      });
    },
    onError: (error) => {
      toast.error("Error al eliminar  el usuario", {
        description: error.message || "Intente nuevamente",
      });
    },
  });
};
