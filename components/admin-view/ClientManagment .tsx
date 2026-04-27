"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Download } from "lucide-react";

import { ColumnDef as TanstackColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  useDeleteUser,
  useUpdateUser,
  useGetAllUsers,
} from "@/lib/hooks/user.hooks";
import { IconPlus } from "@tabler/icons-react";
import DeleteConfirmationModal from "../comun/DeleteConfirmationModal";
import { User } from "@prisma/client";
import { Skeleton } from "../ui/skeleton";
import { ReusableDataTable } from "../comun/ReusableDataTable";
import { useGetAllSexs } from "@/lib/hooks/sex.hooks";
import { useGetAllRoles } from "@/lib/hooks/role.hooks";
import EditUserModal from "./UserModal";
import { toast } from "sonner";

export function ClientManagment() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { data: sexos } = useGetAllSexs();
  const { data: roles } = useGetAllRoles();

  // Actualizar rol existente
  const { mutate: updateUser } = useUpdateUser();
  const handleUpdate = (data: Partial<{ name: string; id: string }>) => {
    updateUser({ id: data.id as string, data });
    setSelectedUser(null);
  };

  // Eliminar rol
  const { mutate: deleteSex } = useDeleteUser();
  const handleDelete = () => {
    deleteSex(selectedUser?.id as string);
    setIsDeleteModalOpen(false);
  };

  const handleClose = () => {
    setIsAddModalOpen(false);
    setSelectedUser(null);
  };

  // Obtener todos los usuarios
  const { data: users, isLoading, error } = useGetAllUsers();

  // Función para descargar usuarios como JSON con nombres de rol y sexo
  const handleDownloadJSON = () => {
    if (!users || users.length === 0) {
      toast.error("No hay usuarios para descargar");
      return;
    }

    try {
      // Crear mapas para búsqueda rápida de nombres
      const rolesMap = new Map(roles?.map(role => [role.id, role.name]) || []);
      const sexosMap = new Map(sexos?.map(sexo => [sexo.id, sexo.name]) || []);

      // Crear un objeto con metadata y los datos
      const exportData = {
        exportDate: new Date().toISOString(),
        totalUsers: users.length,
        users: users.map(user => ({
          id: user.id,
          cuid: user.cuid,
          name: user.name,
          email: user.email,
          phone: user.phone || null,
          role: {
            id: user.role_id,
            name: rolesMap.get(user.role_id) || "Desconocido"
          },
          sex: {
            id: user.sex_id,
            name: sexosMap.get(user.sex_id) || "Desconocido"
          },
          image: user.image || null,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })),
      };

      // Convertir a JSON string con formato legible
      const jsonString = JSON.stringify(exportData, null, 2);
      
      // Crear blob y descargar
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Nombre del archivo con fecha
      const date = new Date().toISOString().split('T')[0];
      link.download = `usuarios_${date}.json`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`Descargados ${users.length} usuarios correctamente`);
    } catch (err) {
      console.error('Error al descargar JSON:', err);
      toast.error('Error al generar el archivo JSON');
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col justify-centerspace-y-3">
        <Skeleton className="h-[250px] w-[500px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );

  if (error) return <div>Error: {error.message}</div>;

  const rolColumns: TanstackColumnDef<User>[] = [
    { id: "name", accessorKey: "name", header: "Nombre" },
    { id: "email", accessorKey: "email", header: "Email" },
    {
      id: "phone",
      accessorKey: "phone",
      header: "Teléfono",
      cell: ({ row }) => row.original.phone || "N/A",
    },
    {
      id: "role",
      accessorKey: "role_id",
      header: "Rol",
      cell: ({ row }) => {
        const role = roles?.find(r => r.id === row.original.role_id);
        return role?.name || "N/A";
      },
    },
    {
      id: "sex",
      accessorKey: "sex_id",
      header: "Sexo",
      cell: ({ row }) => {
        const sexo = sexos?.find(s => s.id === row.original.sex_id);
        return sexo?.name || "N/A";
      },
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Creado",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return date.toLocaleDateString("es-ES");
      },
    },
    {
      id: "actions",
      accessorKey: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const User = row.original as User;
        return (
          <TooltipProvider>
            <div className="flex space-x-2 gap-4">
              <Tooltip>
                <TooltipTrigger
                  onClick={() => {
                    setSelectedUser(User);
                    setIsAddModalOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  onClick={() => {
                    setSelectedUser(User);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  <Trash className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Eliminar</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-2 py-4 md:gap-4 md:py-6">
      <div className="flex justify-between mx-8">
        <div className="flex flex-col">
          <h2 className="text-md font-bold">Usuarios</h2>
          <p className="text-muted-foreground text-sm">
            Gestiona todos los usuarios
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadJSON}
          disabled={!users || users.length === 0}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          <span className="hidden lg:inline">Descargar JSON</span>
        </Button>
      </div>
      <ReusableDataTable<User>
        data={users as User[]}
        columns={rolColumns}
        onDataChange={() => {}}
        renderSubComponent={(row) => (
          <div>Detalles para {row.original.name}</div>
        )}
        toolbar={
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
          >
            <IconPlus />
            <span className="hidden lg:inline">Agregar usuario</span>
          </Button>
        }
      />

      {isAddModalOpen && selectedUser && (
        <EditUserModal
          isOpen={isAddModalOpen}
          onClose={handleClose}
          selectedItem={selectedUser}
          onSubmitEdit={(data) => handleUpdate(data)}
          sexOptions={sexos || []}
        />
      )}
      {isDeleteModalOpen && selectedUser && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setSelectedUser(null);
            setIsDeleteModalOpen(false);
          }}
          onConfirm={() => handleDelete()}
          workerName={`el usuario ${selectedUser.name}`}
        />
      )}
    </div>
  );
}