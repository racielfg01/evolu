"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

import { ColumnDef as TanstackColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  useDeleteRole,
  useUpdateRole,
  useCreateRole,
  useGetAllRoles,
} from "@/lib/hooks/role.hooks";
import { IconPlus } from "@tabler/icons-react";
import DeleteConfirmationModal from "../comun/DeleteConfirmationModal";
import { Role } from "@prisma/client";
import { Skeleton } from "../ui/skeleton";
import GenericModal from "../comun/AddGenericModal";
import { ReusableDataTable } from "../comun/ReusableDataTable";

export function RolManagment() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Crear un nuevo rol
  const { mutate: createRole } = useCreateRole();

  // Actualizar rol existente
  const { mutate: updateRole } = useUpdateRole();
  const handleUpdate = (data: Partial<{ name: string; id: string }>) => {
    updateRole({ id: data.id as string, name: data.name as string });
    setSelectedRole(null);
  };

  // Eliminar rol
  const { mutate: deleteRole } = useDeleteRole();
  const handleDelete = () => {
    deleteRole(selectedRole?.id as string);
    setIsDeleteModalOpen(false);
      setSelectedRole(null);
  };

  const handleClose = () => {
    setIsAddModalOpen(false);
    setSelectedRole(null);
  };

  // Obtener todos los roles
  const { data: roles, isLoading, error } = useGetAllRoles();

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

  const rolColumns: TanstackColumnDef<Role>[] = [
    { id: "name", accessorKey: "name", header: "Nombre" },
    {
      id: "actions",
      accessorKey: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const role = row.original as Role;
        return (
          <TooltipProvider>
            <div className="flex space-x-2 gap-4">
              <Tooltip>
                <TooltipTrigger
                  onClick={() => {
                    setSelectedRole(role);
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
                    setSelectedRole(role);
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
      {/* <div className="flex justify-between mx-8"> */}
        <div className="flex flex-col mx-8">
          <h2 className="text-md font-bold">Roles</h2>
          <p className="text-muted-foreground text-sm">Gestiona roles</p>
        </div>
      {/* </div> */}
      <ReusableDataTable<Role>
        data={roles as Role[]}
        columns={rolColumns}
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
            <span className="hidden lg:inline">Agregar Rol</span>
          </Button>
        }
      />

      {isAddModalOpen && (
        <GenericModal<Role>
          isOpen={isAddModalOpen}
          onClose={handleClose}
          selectedItem={selectedRole}
          onSubmit={(data) => createRole(data.name)}
          onSubmitEdit={(data) => handleUpdate(data)}
          title="Rol"
          description="un rol del sistema"
          label="Nombre del rol"
          placeholder="Ej: Administrador"
        />
      )}
      {isDeleteModalOpen && selectedRole && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setSelectedRole(null);
            setIsDeleteModalOpen(false);
          }}
          onConfirm={() => handleDelete()}
          workerName={`el rol ${selectedRole.name}`}
        />
      )}
    </div>
  );
}
