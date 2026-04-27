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
  useDeleteService,
  useEditService,
  // useAddService,
  useGetAllServices,
} from "@/lib/hooks/service.hooks";
import { IconPlus } from "@tabler/icons-react";
import DeleteConfirmationModal from "../comun/DeleteConfirmationModal";
import { Service } from "@prisma/client";
import { Skeleton } from "../ui/skeleton";
import { ReusableDataTable } from "../comun/ReusableDataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AddServiceModal, UploadedImage } from "../comun/AddServiceModal";
import { ServiceWithRelations } from "@/lib/actions/services.actions";
import { useQueryClient } from "@tanstack/react-query";
import { AvailabilityConfigurator } from "../booking/availability-configurator";
import { BusinessConfiguration } from "@/lib/actions/config.actions";

// Configuración por defecto (debería venir de un contexto o API)
const defaultBusinessConfig: BusinessConfiguration = {
  weekAvailability: {
    "1": {
      available: true,
      hours: {
        morning: { start: "09:00", end: "12:00" },
        afternoon: { start: "13:00", end: "17:00" },
      },
    }, // Lunes
    "2": {
      available: true,
      hours: {
         morning: { start: "09:00", end: "12:00" },
        afternoon: { start: "13:00", end: "17:00" },
      },
    }, // Martes
    "3": {
      available: true,
      hours: {
            morning: { start: "09:00", end: "12:00" },
        afternoon: { start: "13:00", end: "17:00" },
      },
    }, // Miércoles
    "4": {
      available: true,
      hours: {
         morning: { start: "09:00", end: "12:00" },
        afternoon: { start: "13:00", end: "17:00" },
      },
    }, // Jueves
    "5": {
      available: true,
      hours: {
           morning: { start: "09:00", end: "12:00" },
        afternoon: { start: "13:00", end: "17:00" },
      },
    }, // Viernes
    "6": {
      available: true,
        hours: {
           morning: { start: "09:00", end: "12:00" },
        afternoon: { start: "13:00", end: "17:00" },
      },
    }, // Sábado
    "0": { available: false, hours: { morning: null, afternoon: null } }, // Domingo
  },
  specificDateOverrides: [
    { date: "2024-12-25", available: false },
    {
      date: "2024-12-24",
      available: true,
      hours: { morning: { start: "09:00", end: "13:00" }, afternoon: null },
    },
  ],
  minBookingNotice: 24,
};

export interface ServiceForm {
  id: string;
  name: string;
  description: string;
  cuid: string;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  detailedDescription: string;
  price: number;
  benefits: string[];
  preparation: string[];
  category_id: string;

  images?: UploadedImage[];
  imagesToDelete?: string[];
}

export function ServiceManagment() {
  const queryClient = useQueryClient();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [businessConfig, setBusinessConfig] = useState<BusinessConfiguration>(
    defaultBusinessConfig
  );

  // Obtener todos los Servicios
  const { data: services, isLoading, error } = useGetAllServices();

  const handleCreate = () => {
    console.log("handleCreate");
    handleClose();
  };

  // Actualizar rol existente
  const { mutate: updateService } = useEditService();

  const handleUpdate = (data: Partial<ServiceForm>) => {
    updateService({ data });
    handleClose();
  };

  // Eliminar
  const { mutate: deleteService } = useDeleteService();
  const handleDelete = () => {
    deleteService(selectedService?.id as string);
    setIsDeleteModalOpen(false);
    setSelectedService(null);
  };

  const handleClose = () => {
    queryClient.invalidateQueries({ queryKey: ["services"] });
    setIsAddModalOpen(false);
    setSelectedService(null);
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

  const rolColumns: TanstackColumnDef<ServiceWithRelations>[] = [
    { id: "name", accessorKey: "name", header: "Nombre" },
    { id: "description", accessorKey: "description", header: "Descripción" },
    {
      id: "price",
      accessorKey: "price",
      header: "Precio",
      cell: ({ row }) => {
        return <p>$ {row.original.price}</p>;
      },
    },
    {
      id: "duration",
      accessorKey: "duration",
      header: "Duración",
      cell: ({ row }) => {
        return <p>{row.original.duration} min</p>;
      },
    },
    {
      id: "isActive",
      accessorKey: "isActive",
      header: "Habilitado",
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        return (
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                isActive ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                isActive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isActive ? "Sí" : "No"}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      accessorKey: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const Service = row.original as Service;
        return (
          <TooltipProvider>
            <div className="flex space-x-2 gap-4">
              <Tooltip>
                <TooltipTrigger
                  onClick={() => {
                    setSelectedService(Service);
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
                    setSelectedService(Service);
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
    <>
      <div className="flex flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2 mx-1 md:mx-4 my-4">
          <Tabs defaultValue="servicios" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="servicios" className="text-xs sm:text-sm">
                Servicios
              </TabsTrigger>
              <TabsTrigger value="time_slot" className="text-xs sm:text-sm">
                Horarios
              </TabsTrigger>
            </TabsList>
            <TabsContent value="servicios" className="space-y-6">
              <div className="flex flex-col">
                {/* Header with Add Button */}
                <div className="flex justify-around lg:justify-between gap-4 mx-4 lg:mx-6 mb-4">
                  <div className="flex flex-col">
                    <h2 className="text-md font-bold">Mis servicios</h2>
                    <p className="text-muted-foreground text-sm">
                      Gestiona tus servicios
                    </p>
                  </div>

                  {/* Add Service Button - Responsive */}
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddModalOpen(true)}
                      className="mt-2 sm:mt-0"
                    >
                      <IconPlus className="h-4 w-4" />
                      <span className="ml-1 hidden sm:inline">
                        Agregar Servicio
                      </span>
                      <span className="ml-1 sm:hidden">Agregar</span>
                    </Button>
                  </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                  <ReusableDataTable<ServiceWithRelations>
                    data={services || []}
                    columns={rolColumns}
                    renderSubComponent={(row) => (
                      <div className="p-3 text-sm bg-muted/50 rounded-md">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <strong>Descripción:</strong>
                            <p className="truncate">
                              {row.original.description}
                            </p>
                          </div>
                          <div>
                            <strong>Precio:</strong>
                            <p>${row.original.price}</p>
                          </div>
                          <div>
                            <strong>Duración:</strong>
                            <p>{row.original.duration} minutos</p>
                          </div>
                          <div>
                            <strong>Estado:</strong>
                            <p
                              className={`font-medium ${
                                row.original.isActive
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {row.original.isActive ? "Activo" : "Inactivo"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="time_slot" className="space-y-4">
              <div className="p-2 sm:p-4">
                <AvailabilityConfigurator
                  onConfigChange={setBusinessConfig}
                  initialConfig={businessConfig}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <AddServiceModal
          isOpen={isAddModalOpen}
          onClose={handleClose}
          service={selectedService}
          onSubmitEdit={(data) => handleUpdate(data)}
          onSubmit={() => handleCreate()}
        />
      )}
      {isDeleteModalOpen && selectedService && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setSelectedService(null);
            setIsDeleteModalOpen(false);
          }}
          onConfirm={() => handleDelete()}
          workerName={`el servicio ${selectedService.name}`}
        />
      )}

      <div className="flex flex-1 flex-col"></div>
    </>
  );
}