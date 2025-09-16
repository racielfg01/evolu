// "use client";

// import type React from "react";

// import { useState } from "react";


// import { ColumnDef as TanstackColumnDef } from "@tanstack/react-table";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "../ui/tooltip";
// import {

//   useGetAllAppointments,
// } from "@/lib/hooks/appointment.hooks";

// import { Appointment } from "@prisma/client";
// import { Skeleton } from "../ui/skeleton";
// import { ReusableDataTable } from "../comun/ReusableDataTable";
// import { FullAppointment } from "@/lib/actions/appointment.actions";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import { Badge } from "../ui/badge";
// import AppointmentDetailsModal from "./AppointmentDetailsModal";
// import { File } from "lucide-react";

// export function ApoimentsManagment() {
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);


//   const handleClose = () => {
//     setIsAddModalOpen(false);
//     setSelectedAppointment(null);
//   };

//   // Obtener todos los Sexs
//   const { data: apoiments, isLoading, error } = useGetAllAppointments();

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

  

//   const appointmentColumns: TanstackColumnDef<FullAppointment>[] = [
//   {
//     id: "client",
//     header: "Cliente",
//     cell: ({ row }) => {
//       return <div className="flex items-center gap-2">
//         <Avatar className="h-8 w-8 rounded-lg grayscale">
//                 <AvatarImage src={row.original.user.image} alt={row.original.user.name as string} />
//                 <AvatarFallback className="rounded-lg">{row.original.user.name?.charAt(0) }</AvatarFallback>
//               </Avatar>
//         <p>{row.original.user.name}</p>
//       </div> 
//     },
//   },
//   {
//     id: "services",
//     header: "Servicios",
//     cell: ({ row }) => {
//       return (
//         <div className="flex flex-col gap-1">
//           {row.original.services.map((appointmentService) => (
//             <div key={appointmentService.id} className="flex items-center gap-2">
//               <Badge variant="outline" className="text-xs font-normal">
//                               {appointmentService.service.name}
//                             </Badge>
//               {/* <span>{appointmentService.service.name}</span> */}
//               {appointmentService.quantity > 1 && (
//                 <span className="text-sm text-muted-foreground">
//                   (x{appointmentService.quantity})
//                 </span>
//               )}
//             </div>
//           ))}
//         </div>
//       );
//     },
//   },
//   {
//     id: "date",
//     header: "Fecha",
//     cell: ({ row }) => {
//       return <p>{new Date(row.original.date).toLocaleDateString()}</p>;
//     },
//   },
//   {
//     id: "status",
//     header: "Estado",
//     cell: ({ row }) => {
//       const statusMap = {
//         PENDING: { text: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
//         CONFIRMED: { text: "Confirmada", color: "bg-blue-100 text-blue-800" },
//         COMPLETED: { text: "Completada", color: "bg-green-100 text-green-800" },
//         CANCELLED: { text: "Cancelada", color: "bg-red-100 text-red-800" },
//         NO_SHOW: { text: "No asistió", color: "bg-gray-100 text-gray-800" },
//       };
      
//       const statusInfo = statusMap[row.original.status] || 
//                        { text: row.original.status, color: "bg-gray-100 text-gray-800" };
      
//       return (
//         <span className={`px-2 py-1 rounded-full text-xs ${statusInfo.color}`}>
//           {statusInfo.text}
//         </span>
//       );
//     },
//   },
//   {
//     id: "duration",
//     header: "Duración",
//     cell: ({ row }) => {
//       return <p>{row.original.duration} min</p>;
//     },
//   },
//   {
//     id: "total_price",
//     header: "Precio Total",
//     cell: ({ row }) => {
//       return <p>${row.original.total_price.toFixed(2)}</p>;
//     },
//   },
//   {
//     id: "actions",
//     header: "Acciones",
//     cell: ({ row }) => {
//       const appointment = row.original;
//       return (
//         <TooltipProvider>
//           <div className="flex space-x-2 gap-4">
//             <Tooltip>
//               <TooltipTrigger
//                 onClick={() => {
//                   setSelectedAppointment(appointment);
//                   setIsAddModalOpen(true);
//                 }}
//               >
//                 <File className="h-4 w-4" />
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>Detalles</p>
//               </TooltipContent>
//             </Tooltip>

//           </div>
//         </TooltipProvider>
//       );
//     },
//   },
// ];

//   return (
//      <div className="flex flex-1 flex-col">
//       <div className="@container/main flex flex-1 flex-col gap-2 mx-4 my-4">
//     <div className="flex flex-col gap-2 py-4 md:gap-4 md:py-6">
//       <div className="flex justify-between mx-8">
//         <div className="flex flex-col">
//           <h2 className="text-md font-bold">Mis citas</h2>
//           <p className="text-muted-foreground text-sm">
//             Gestiona tus citas
//           </p>
//         </div>
//       </div>
//       <ReusableDataTable<FullAppointment>
//         data={apoiments as FullAppointment[]}
//         columns={appointmentColumns}
//         onDataChange={() => {}}
//         renderSubComponent={(row) => (
//           <div>Detalles para {row.original.user.name}</div>
//         )}

//       />

//       {isAddModalOpen && (
//         // <GenericModal<FullAppointment>
//         <AppointmentDetailsModal
//           isOpen={isAddModalOpen}
//           onClose={handleClose}
//           appointment={selectedAppointment}
         
//         />
//       )}
  
//     </div>
//     </div>
//     </div>
//   );
// }


 "use client";

import { useState } from "react";
import { ColumnDef as TanstackColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useGetAllAppointments } from "@/lib/hooks/appointment.hooks";
import { Skeleton } from "../ui/skeleton";
import { ReusableDataTable } from "../comun/ReusableDataTable";
import { FullAppointment } from "@/lib/actions/appointment.actions";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import { File, Calendar, Clock, DollarSign } from "lucide-react";
// import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { useIsMobile } from "@/hooks/use-mobile";

export function ApoimentsManagment() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<FullAppointment | null>(null);
  // const isMobile = useMediaQuery("(max-width: 768px)");

   const isMobile = useIsMobile()

  const handleClose = () => {
    setIsAddModalOpen(false);
    setSelectedAppointment(null);
  };

  // Obtener todas las citas
  const { data: appointments, isLoading, error } = useGetAllAppointments();

  if (isLoading)
    return (
      <div className="flex flex-col justify-center space-y-3 p-4">
        <Skeleton className="h-[250px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );

  if (error) return <div className="p-4">Error: {error.message}</div>;

  // Componente para mostrar cada cita en vista móvil
  const AppointmentCard = ({ appointment }: { appointment: FullAppointment }) => {
    const statusMap = {
      PENDING: { text: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
      CONFIRMED: { text: "Confirmada", color: "bg-blue-100 text-blue-800" },
      COMPLETED: { text: "Completada", color: "bg-green-100 text-green-800" },
      CANCELLED: { text: "Cancelada", color: "bg-red-100 text-red-800" },
      NO_SHOW: { text: "No asistió", color: "bg-gray-100 text-gray-800" },
    };

    const statusInfo = statusMap[appointment.status] || 
                     { text: appointment.status, color: "bg-gray-100 text-gray-800" };

    return (
      <div 
        className="bg-white border rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => {
          setSelectedAppointment(appointment);
          setIsAddModalOpen(true);
        }}
      >
        {/* Header con cliente y estado */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10 rounded-lg">
              <AvatarImage src={appointment.user.image} alt={appointment.user.name as string} />
              <AvatarFallback className="rounded-lg">
                {appointment.user.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{appointment.user.name}</p>
              <p className="text-xs text-muted-foreground">{appointment.user.phone}</p>
            </div>
          </div>
          <Badge className={`px-2 py-1 text-xs ${statusInfo.color}`}>
            {statusInfo.text}
          </Badge>
        </div>

        {/* Información de la cita */}
        <div className="flex gap-3 mb-3 ">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {new Date(appointment.date).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{appointment.duration} min</span>
          </div>
          
          <div className="flex items-center gap-2 col-span-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {appointment.total_price.toFixed(2)}
            </span>
          </div>

     
        </div>

        {/* Servicios */}
        {/* <div className="mb-3">
          <p className="text-xs font-medium text-muted-foreground mb-1">Servicios:</p>
          <div className="flex flex-wrap gap-1">
            {appointment.services.slice(0, 2).map((appointmentService) => (
              <Badge 
                key={appointmentService.id} 
                variant="outline" 
                className="text-xs font-normal"
              >
                {appointmentService.service.name}
                {appointmentService.quantity > 1 && ` (x${appointmentService.quantity})`}
              </Badge>
            ))}
            {appointment.services.length > 2 && (
              <Badge variant="outline" className="text-xs font-normal">
                +{appointment.services.length - 2} más
              </Badge>
            )}
          </div>
        </div> */}

             {/* Botón de acción */}
        <div className="flex justify-end">
          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
            <File className="h-3 w-3" />
            Ver detalles
          </button>
        </div>
      </div>
    );
  };

  const appointmentColumns: TanstackColumnDef<FullAppointment>[] = [
    {
      id: "client",
      header: "Cliente",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={row.original.user.image} alt={row.original.user.name as string} />
              <AvatarFallback className="rounded-lg">
                {row.original.user.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <p>{row.original.user.name}</p>
          </div>
        );
      },
    },
    {
      id: "services",
      header: "Servicios",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-1">
            {row.original.services.map((appointmentService) => (
              <div key={appointmentService.id} className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-normal">
                  {appointmentService.service.name}
                </Badge>
                {appointmentService.quantity > 1 && (
                  <span className="text-sm text-muted-foreground">
                    (x{appointmentService.quantity})
                  </span>
                )}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      id: "date",
      header: "Fecha",
      cell: ({ row }) => {
        return <p>{new Date(row.original.date).toLocaleDateString()}</p>;
      },
    },
    {
      id: "status",
      header: "Estado",
      cell: ({ row }) => {
        const statusMap = {
          PENDING: { text: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
          CONFIRMED: { text: "Confirmada", color: "bg-blue-100 text-blue-800" },
          COMPLETED: { text: "Completada", color: "bg-green-100 text-green-800" },
          CANCELLED: { text: "Cancelada", color: "bg-red-100 text-red-800" },
          NO_SHOW: { text: "No asistió", color: "bg-gray-100 text-gray-800" },
        };
        
        const statusInfo = statusMap[row.original.status] || 
                         { text: row.original.status, color: "bg-gray-100 text-gray-800" };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${statusInfo.color}`}>
            {statusInfo.text}
          </span>
        );
      },
    },
    {
      id: "duration",
      header: "Duración",
      cell: ({ row }) => {
        return <p>{row.original.duration} min</p>;
      },
    },
    {
      id: "total_price",
      header: "Precio Total",
      cell: ({ row }) => {
        return <p>${row.original.total_price.toFixed(2)}</p>;
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const appointment = row.original;
        return (
          <TooltipProvider>
            <div className="flex space-x-2 gap-4">
              <Tooltip>
                <TooltipTrigger
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setIsAddModalOpen(true);
                  }}
                >
                  <File className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Detalles</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        );
      },
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 mx-4 my-4">
        <div className="flex flex-col gap-2 py-4 md:gap-4 md:py-6">
          <div className="flex justify-between mx-4 md:mx-8">
            <div className="flex flex-col">
              <h2 className="text-lg md:text-xl font-bold">Mis citas</h2>
              <p className="text-muted-foreground text-sm">
                Gestiona tus citas
              </p>
            </div>
          </div>

          {/* Vista móvil - Lista de cards */}
          {isMobile ? (
            <div className="space-y-3">
              {appointments?.map((appointment) => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                />
              ))}
              {(!appointments || appointments.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  No hay citas programadas
                </div>
              )}
            </div>
          ) : (
            // Vista desktop - Tabla
            <ReusableDataTable<FullAppointment>
              data={appointments as FullAppointment[]}
              columns={appointmentColumns}
              onDataChange={() => {}}
              renderSubComponent={(row) => (
                <div>Detalles para {row.original.user.name}</div>
              )}
            />
          )}

          {isAddModalOpen && (
            <AppointmentDetailsModal
              isOpen={isAddModalOpen}
              onClose={handleClose}
              appointment={selectedAppointment}
            />
          )}
        </div>
      </div>
    </div>
  );
}