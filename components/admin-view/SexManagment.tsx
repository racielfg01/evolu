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
  useDeleteSex,
  useUpdateSex,
  useCreateSex,
  useGetAllSexs,
} from "@/lib/hooks/sex.hooks";
import { IconPlus } from "@tabler/icons-react";
import DeleteConfirmationModal from "../comun/DeleteConfirmationModal";
import { Sex } from "@prisma/client";
import { Skeleton } from "../ui/skeleton";
import GenericModal from "../comun/AddGenericModal";
import { ReusableDataTable } from "../comun/ReusableDataTable";

export function SexManagment() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSex, setSelectedSex] = useState<Sex | null>(null);

  // Crear un nuevo rol
  const { mutate: createSex } = useCreateSex();

  // Actualizar rol existente
  const { mutate: updateSex } = useUpdateSex();
  const handleUpdate = (data: Partial<{ name: string; id: string }>) => {
    updateSex({ id: data.id as string, name: data.name as string });
    setSelectedSex(null);
  };

  // Eliminar rol
  const { mutate: deleteSex } = useDeleteSex();
  const handleDelete = () => {
    deleteSex(selectedSex?.id as string);
    setIsDeleteModalOpen(false);
  };

  const handleClose = () => {
    setIsAddModalOpen(false);
    setSelectedSex(null);
  };

  // Obtener todos los Sexs
  const { data: Sexs, isLoading, error } = useGetAllSexs();

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

  const rolColumns: TanstackColumnDef<Sex>[] = [
    { id: "name", accessorKey: "name", header: "Nombre" },
    {
      id: "actions",
      accessorKey: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const Sex = row.original as Sex;
        return (
          <TooltipProvider>
            <div className="flex space-x-2 gap-4">
              <Tooltip>
                <TooltipTrigger
                  onClick={() => {
                    setSelectedSex(Sex);
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
                    setSelectedSex(Sex);
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
          <h2 className="text-md font-bold">Sexos</h2>
          <p className="text-muted-foreground text-sm">Gestiona sexos</p>
        </div>
      </div>
      <ReusableDataTable<Sex>
        data={Sexs as Sex[]}
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
            <span className="hidden lg:inline">Agregar Sexo</span>
          </Button>
        }
      />

      {isAddModalOpen && (
        <GenericModal<Sex>
          isOpen={isAddModalOpen}
          onClose={handleClose}
          selectedItem={selectedSex}
          onSubmit={(data) => createSex(data.name)}
          onSubmitEdit={(data) => handleUpdate(data)}
          title="Sexo"
          description="un sexo del sistema"
          label="Nombre del sexo"
          placeholder="Ej: Femenino"
        />
      )}
      {isDeleteModalOpen && selectedSex && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setSelectedSex(null);
            setIsDeleteModalOpen(false);
          }}
          onConfirm={() => handleDelete()}
          workerName={`el rol ${selectedSex.name}`}
        />
      )}
    </div>
  );
}
