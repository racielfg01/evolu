// "use client";

// import type React from "react";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Edit, Trash } from "lucide-react";

// import { ColumnDef as TanstackColumnDef } from "@tanstack/react-table";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "../ui/tooltip";
// import {
//   useDeleteService,
//   useEditService,
//   useAddService,
//   useGetAllServices,
// } from "@/lib/hooks/service.hooks";
// import { IconPlus } from "@tabler/icons-react";
// import DeleteConfirmationModal from "../comun/DeleteConfirmationModal";
// import { Service } from "@prisma/client";
// import { Skeleton } from "../ui/skeleton";
// import { ReusableDataTable } from "../comun/ReusableDataTable";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
// import { RolManagment } from "./RolManagment";
// import { SexManagment } from "./SexManagment";
// import { AddServiceModal } from "../comun/AddServiceModal";
// import {  FullService, ServiceInput } from "@/lib/actions/services.actions";

// export function ServiceManagment(
//   // {services}:{services:FullService[]}
// ) {
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [selectedService, setSelectedService] = useState<Service | null>(null);

//   // Obtener todos los Servicios
//  const { data: services, isLoading, error   } = useGetAllServices();

// //  const [services, setServices] = useState<FullService[]>(dataInit||[]);
//  // const router=useRouter()
//  console.log(services)

//   // Crear un nuevo rol
//   // const { mutate: createService } = useAddService();

//   // const handleCreate = () => {
//   //   console.log("handleCreate")
//   //   // createService();
//   //   setSelectedService(null);
//   // };

//   // Actualizar rol existente
//   const { mutate: updateService } = useEditService();
//   const handleUpdate = (data:Partial<ServiceInput>) => {
//     updateService({data});
//     setSelectedService(null);
//   };

//   // Eliminar
//   const { mutate: deleteService } = useDeleteService();
//   const handleDelete = () => {
//     console.log("Eliminar")
//     deleteService(selectedService?.id as string);

//     // deleteService(selectedService?.id as string)
//     setIsDeleteModalOpen(false);
//      setSelectedService(null);
//   };

//   const handleClose = () => {
//     setIsAddModalOpen(false);
//     setSelectedService(null);
//   };

//  // Función para manejar cambios en los datos
//   // const handleDataChange = (newData: FullService[]) => {
//   //   setServices(newData);
//   // };

//   // if (!services)
//   if (isLoading)
//     return (
//       <div className="flex flex-col justify-centerspace-y-3">
//         <Skeleton className="h-[250px] w-[500px] rounded-xl" />
//         <div className="space-y-2">
//           <Skeleton className="h-4 w-[250px]" />
//           <Skeleton className="h-4 w-[200px]" />
//         </div>
//       </div>
//     );

//   if (error) return <div>Error: {error.message}</div>;

//   const rolColumns: TanstackColumnDef<FullService>[] = [
//     { id: "name", accessorKey: "name", header: "Nombre" },
//     { id: "description", accessorKey: "description", header: "Descripción" },
//     {
//       id: "price",
//       accessorKey: "price",
//       header: "Precio",
//       cell: ({ row }) => {
//         return <p>$ {row.original.price}</p>;
//       },
//     },
//     {
//       id: "duration",
//       accessorKey: "duration",
//       header: "Duración",
//       cell: ({ row }) => {
//         return <p>{row.original.duration} min</p>;
//       },
//     },
//     {
//       id: "actions",
//       accessorKey: "actions",
//       header: "Acciones",
//       cell: ({ row }) => {
//         const Service = row.original as Service;
//         return (
//           <TooltipProvider>
//             <div className="flex space-x-2 gap-4">
//               <Tooltip>
//                 <TooltipTrigger
//                   onClick={() => {
//                     setSelectedService(Service);
//                     setIsAddModalOpen(true);
//                   }}
//                 >
//                   <Edit className="h-4 w-4" />
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p>Editar</p>
//                 </TooltipContent>
//               </Tooltip>

//               <Tooltip>
//                 <TooltipTrigger
//                   onClick={() => {
//                     setSelectedService(Service);
//                     setIsDeleteModalOpen(true);
//                   }}
//                 >
//                   <Trash className="h-4 w-4" />
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p>Eliminar</p>
//                 </TooltipContent>
//               </Tooltip>
//             </div>
//           </TooltipProvider>
//         );
//       },
//     },
//   ];

//   return (
//     <>
//       <div className="flex flex-1 flex-col">
//         <div className="@container/main flex flex-1 flex-col gap-2 mx-4 my-4">
//           <div className="flex flex-col mx-8">
//             <h2 className="text-xl font-bold">Servicios</h2>
//             <p className="text-muted-foreground text-md">
//               Gestiona servicios y horarios
//             </p>
//           </div>

//           <Tabs defaultValue="servicios" className="w-full">
//             <TabsList className="grid w-full grid-cols-3">
//               <TabsTrigger value="servicios">Servicios</TabsTrigger>
//               <TabsTrigger value="time_slot">Rangos horarios</TabsTrigger>
//               <TabsTrigger value="day_schedules">Fechas de Agendar</TabsTrigger>

//             </TabsList>
//             <TabsContent value="servicios" className="space-y-6">
//               <div className="flex flex-1 flex-col">
//                 <div className="@container/main flex flex-1 flex-col gap-2 mx-4 my-4">
//                   <div className="flex flex-col gap-2 py-4 md:gap-4 md:py-6">
//                     <div className="flex justify-between mx-8">
//                       <div className="flex flex-col">
//                         <h2 className="text-md font-bold">Mis servicios</h2>
//                         <p className="text-muted-foreground text-sm">
//                           Gestiona tus servicios
//                         </p>
//                       </div>
//                     </div>
//                     <ReusableDataTable<FullService>
//                       data={services|| []}
//                       columns={rolColumns}
//                       // onDataChange={refre}  // Pasar la función, no los datos
//                       renderSubComponent={(row) => (
//                         <div>Detalles para {row.original.name}</div>
//                       )}
//                       toolbar={
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => setIsAddModalOpen(true)}
//                         >
//                           <IconPlus />
//                           <span className="hidden lg:inline">
//                             Agregar Servicio
//                           </span>
//                         </Button>
//                       }
//                     />

//                     {isAddModalOpen && (
//                       <AddServiceModal
//                         isOpen={isAddModalOpen}
//                         onClose={handleClose}
//                         service={selectedService}
//                         // onSubmit={() => handleCreate()}
//                         onSubmitEdit={(data) => handleUpdate(data)}
//                         // title="Servicio"
//                         // description="un servicio del sistema"
//                         // label="Nombre del servicio"
//                         // placeholder="Ej: Masaje relajante"
//                       />
//                     )}
//                     {isDeleteModalOpen && selectedService && (
//                       <DeleteConfirmationModal
//                         isOpen={isDeleteModalOpen}
//                         onClose={() => {
//                           setSelectedService(null);
//                           setIsDeleteModalOpen(false);
//                         }}
//                         onConfirm={() => handleDelete()}
//                         workerName={`el rol ${selectedService.name}`}
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </TabsContent>

//             <TabsContent value="time_slot" className="space-y-6">
//               {/* <RolManagment /> */}
//             </TabsContent>

//             <TabsContent value="day_schedules" className="space-y-6">
//               {/* <SexManagment /> */}
//             </TabsContent>

//           </Tabs>
//         </div>
//       </div>
//     </>
//   );
// }

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
import {  ServiceWithRelations } from "@/lib/actions/services.actions";
import { useQueryClient } from "@tanstack/react-query";
import { AvailabilityConfigurator } from "../booking/availability-configurator";
import { BusinessConfiguration } from "@/lib/actions/config.actions";

// // Tipos para la configuración de disponibilidad
// interface BusinessHours {
//   morning: { start: string; end: string } | null;
//   afternoon: { start: string; end: string } | null;
// }

// interface DayAvailability {
//   available: boolean;
//   hours: BusinessHours;
// }

// interface WeekAvailability {
//   [key: string]: DayAvailability; // key: day of week (0-6 where 0 is Sunday)
// }

// interface SpecificDateOverride {
//   date: string; // YYYY-MM-DD
//   available: boolean;
//   hours?: BusinessHours;
// }

// interface BusinessConfiguration {
//   weekAvailability: WeekAvailability;
//   specificDateOverrides?: SpecificDateOverride[];
//   minBookingNotice?: number; // horas de anticipación mínima para reservar
// }

// Configuración por defecto (debería venir de un contexto o API)
const defaultBusinessConfig: BusinessConfiguration = {
  weekAvailability: {
    "1": {
      available: true,
      hours: {
        morning: { start: "09:00", end: "13:00" },
        afternoon: { start: "15:00", end: "18:00" },
      },
    }, // Lunes
    "2": {
      available: true,
      hours: {
        morning: { start: "09:00", end: "13:00" },
        afternoon: { start: "15:00", end: "18:00" },
      },
    }, // Martes
    "3": {
      available: true,
      hours: {
        morning: { start: "09:00", end: "13:00" },
        afternoon: { start: "15:00", end: "18:00" },
      },
    }, // Miércoles
    "4": {
      available: true,
      hours: {
        morning: { start: "09:00", end: "13:00" },
        afternoon: { start: "15:00", end: "18:00" },
      },
    }, // Jueves
    "5": {
      available: true,
      hours: {
        morning: { start: "09:00", end: "13:00" },
        afternoon: { start: "15:00", end: "18:00" },
      },
    }, // Viernes
    "6": {
      available: true,
      hours: { morning: { start: "10:00", end: "14:00" }, afternoon: null },
    }, // Sábado (solo mañana)
    "0": { available: false, hours: { morning: null, afternoon: null } }, // Domingo
  },
  specificDateOverrides: [
    // Ejemplo: día festivo
    { date: "2024-12-25", available: false },
    // Ejemplo: medio día especial
    {
      date: "2024-12-24",
      available: true,
      hours: { morning: { start: "09:00", end: "13:00" }, afternoon: null },
    },
  ],
  minBookingNotice: 24, // Reservar con 24 horas de anticipación
};

export interface ServiceForm{
   
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

  // Crear un nuevo rol

  const handleCreate = () => {
    console.log("handleCreate");
    // createService({ data });
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
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2 mx-4 my-4">
          <div className="flex flex-col mx-8">
            <h2 className="text-xl font-bold">Servicios</h2>
            <p className="text-muted-foreground text-md">
              Gestiona servicios y horarios
            </p>
          </div>

          <Tabs defaultValue="servicios" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="servicios">Servicios</TabsTrigger>
              <TabsTrigger value="time_slot">Configuración de horarios</TabsTrigger>
              {/* <TabsTrigger value="day_schedules">Fechas de Agendar</TabsTrigger> */}
            </TabsList>
            <TabsContent value="servicios" className="space-y-6">
              <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2 mx-4 my-4">
                  <div className="flex flex-col gap-2 py-4 md:gap-4 md:py-6">
                    <div className="flex justify-between mx-8">
                      <div className="flex flex-col">
                        <h2 className="text-md font-bold">Mis servicios</h2>
                        <p className="text-muted-foreground text-sm">
                          Gestiona tus servicios
                        </p>
                      </div>
                    </div>
                    <ReusableDataTable<ServiceWithRelations>
                      data={services || []}
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
                          <span className="hidden lg:inline">
                            Agregar Servicio
                          </span>
                        </Button>
                      }
                    />

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
                        workerName={`el rol ${selectedService.name}`}
                      />
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="time_slot" className="space-y-6">
              <AvailabilityConfigurator
                onConfigChange={setBusinessConfig}
                initialConfig={businessConfig}
              />
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </>
  );
}
