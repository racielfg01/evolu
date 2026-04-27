// lib/hooks/user.hooks.ts
"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllUsers,
  createUser,
  updateUser,
  deleteUser,
  fetchUserByRoleId,
} from "@/lib/actions/user.actions";
import { toast } from "sonner";
import { User } from "@prisma/client";
import { useGetRoleByName } from "./role.hooks";

// Hook para obtener todos los Users
export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["Users"],
    queryFn: fetchAllUsers,
  });
};

// Hook para crear un nuevo usuario
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: Omit<User, "id">) => createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Users"] });
      toast("Usuario creado", {
        description: "El Usuario ha sido creado correctamente",
      });
    },
    onError: (error) => {
      toast.error("Error al crear el usuario", {
        description: error.message || "Intente nuevamente",
      });
    },
  });
};

// Hook para actualizar un usuario existente
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
      toast.error("Error al actualizar el usuario", {
        description: error.message || "Intente nuevamente",
      });
    },
  });
};

// Hook para eliminar un usuario
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Users"] });
      toast("Usuario eliminado", {
        description: "El Usuario ha sido eliminado correctamente",
      });
    },
    onError: (error) => {
      toast.error("Error al eliminar el usuario", {
        description: error.message || "Intente nuevamente",
      });
    },
  });
};

// Hook específico para obtener solo usuarios con rol USER usando React Query
export const useGetUsersByRole = (roleId: string) => {
  return useQuery({
    queryKey: ["users", "role", roleId],
    queryFn: () => fetchUserByRoleId(roleId),
    enabled: !!roleId, // Solo ejecutar si hay un roleId
  });
};

// Hook para obtener solo clientes (rol USER)
export const useGetClients = () => {
  // Obtenemos el rol USER de forma reactiva
  const { data: userRole, isLoading: isRoleLoading } = useGetRoleByName("USER");
  
  const roleId = userRole?.id;

  const { 
    data: clients, 
    isLoading: isClientsLoading, 
    error: clientsError,
    refetch 
  } = useQuery({
    queryKey: ["clients", roleId],
    queryFn: () => {
      if (!roleId) {
        // Si no hay roleId, retornamos array vacío (por ejemplo, si el rol no existe)
        return Promise.resolve([]);
      }
      return fetchUserByRoleId(roleId);
    },
    enabled: !!roleId, // Solo ejecuta cuando tenemos el ID del rol
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
  });

  return {
    data: clients || [], // Siempre retorna un array
    isLoading: isRoleLoading || isClientsLoading,
    error: clientsError,
    refetch,
  };
};