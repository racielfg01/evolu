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
  useDeleteCategory,
  useUpdateCategory,
  useCreateCategory,
  useGetAllCategories,
} from "@/lib/hooks/category.hooks";
import { IconPlus } from "@tabler/icons-react";
import DeleteConfirmationModal from "../comun/DeleteConfirmationModal";
import { Category } from "@prisma/client";
import { Skeleton } from "../ui/skeleton";
import GenericModal from "../comun/AddGenericModal";
import { ReusableDataTable } from "../comun/ReusableDataTable";

export function CategoryManagment() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Crear un nuevo rol
  const { mutate: createCategory } = useCreateCategory();

  // Actualizar rol existente
  const { mutate: updateCategory } = useUpdateCategory();
  const handleUpdate = (data: Partial<{ name: string; id: string }>) => {
    updateCategory({ id: data.id as string, name: data.name as string });
    setSelectedCategory(null);
  };

  // Eliminar rol
  const { mutate: deleteCategory } = useDeleteCategory();
  const handleDelete = () => {
    deleteCategory(selectedCategory?.id as string);
    setIsDeleteModalOpen(false);
      setSelectedCategory(null);
  };

  const handleClose = () => {
    setIsAddModalOpen(false);
    setSelectedCategory(null);
  };

  // Obtener todos los Categorys
  const { data: Categorys, isLoading, error } = useGetAllCategories();

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

  const rolColumns: TanstackColumnDef<Category>[] = [
    { id: "name", accessorKey: "name", header: "Nombre" },
    {
      id: "actions",
      accessorKey: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const Category = row.original as Category;
        return (
          <TooltipProvider>
            <div className="flex space-x-2 gap-4">
              <Tooltip>
                <TooltipTrigger
                  onClick={() => {
                    setSelectedCategory(Category);
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
                    setSelectedCategory(Category);
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
          <h2 className="text-md font-bold">Categorías</h2>
          <p className="text-muted-foreground text-sm">Gestiona tus categorías</p>
        </div>
      {/* </div> */}
      <ReusableDataTable<Category>
        data={Categorys as Category[]}
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
        <GenericModal<Category>
          isOpen={isAddModalOpen}
          onClose={handleClose}
          selectedItem={selectedCategory}
          onSubmit={(data) => createCategory(data.name)}
          onSubmitEdit={(data) => handleUpdate(data)}
          title="Categoría"
          description="una categorías del sistema"
          label="Nombre de la categoría"
          placeholder="Ej: Depilación"
        />
      )}
      {isDeleteModalOpen && selectedCategory && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setSelectedCategory(null);
            setIsDeleteModalOpen(false);
          }}
          onConfirm={() => handleDelete()}
          workerName={`la categoría ${selectedCategory.name}`}
        />
      )}
    </div>
  );
}
