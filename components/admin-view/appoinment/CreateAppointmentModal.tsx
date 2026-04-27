// // CreateAppointmentModal.tsx (con UI mejorada de fecha/hora)
// "use client";

// import React, { useState, useEffect, useMemo } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "../../ui/dialog";
// import { Button } from "../../ui/button";
// // import { Input } from "../../ui/input";
// import { Label } from "../../ui/label";
// import { Calendar } from "../../ui/calendar";
// import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
// import { Badge } from "../../ui/badge";
// import {
//   CalendarIcon,
//   Clock,
//   Loader2,
//   // AlertCircle,
//   Search,
//   X,
//   Info,
// } from "lucide-react";
// import {  startOfToday, isBefore, addMinutes } from "date-fns";
// import { es } from "date-fns/locale";
// // import { cn } from "@/lib/utils";
// import { useGetClients } from "@/lib/hooks/user.hooks";
// import { useGetAllServices } from "@/lib/hooks/service.hooks";
// import { useAddAppointment } from "@/lib/hooks/appointment.hooks";
// import { useAvailableSlots } from "@/hooks/use-availability";
// import { getDayAvailablePeriods } from "@/lib/actions/availability.actions";
// import { toast } from "sonner";
// import { ScrollArea } from "../../ui/scroll-area";
// // import { Alert, AlertDescription } from "../../ui/alert";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "../../ui/command";
// import { BUFFER_TIME, calculateTotalDuration } from "@/lib/utils/booking-utils";
// import { ServiceWithRelations } from "@/lib/actions/services.actions";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { normalizeToUTC } from "@/components/new-bookings/confirmation";

// interface CreateAppointmentModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// export interface SelectedService {
//   id: string;
//   name: string;
//   duration: number;
//   price: number;
//   quantity: number;
// }

// export function CreateAppointmentModal({
//   isOpen,
//   onClose,
//   onSuccess,
// }: CreateAppointmentModalProps) {
//   // Estados del formulario
//  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
//   const [selectedTime, setSelectedTime] = useState("");
//   const [selectedUserId, setSelectedUserId] = useState("");
//  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
//   const [note, setNote] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [availabilityError, setAvailabilityError] = useState("");
//   const [availablePeriods, setAvailablePeriods] = useState("");

//   // Estados de búsqueda
//   const [clientSearch, setClientSearch] = useState("");
//   const [serviceSearch, setServiceSearch] = useState("");
//   const [isClientOpen, setIsClientOpen] = useState(false);
//   const [isServiceOpen, setIsServiceOpen] = useState(false);

//   // Hooks de datos
//   const { data: clientsData = [], isLoading: usersLoading, error: usersError } = useGetClients();
//   const { data: services, isLoading: servicesLoading } = useGetAllServices();
//   const createAppointment = useAddAppointment();

//   // Duración total (servicios + buffer)
//   const totalDuration = calculateTotalDuration(selectedServices);
// const servicesDuration = selectedServices.reduce((sum, s) => sum + s.duration * s.quantity, 0);

//   // Transformar selectedServices al tipo que espera useAvailableSlots
//   const servicesForAvailability = useMemo<ServiceWithRelations[]>(() => {
//     return selectedServices.map((s) => ({
//       id: s.id,
//       name: s.name,
//       duration: s.duration,
//       price: s.price,
//       cuid: `temp-${s.id}`,
//       description: "",
//       detailedDescription: "",
//       benefits: [],
//       preparation: [],
//       category_id: "",
//       category: null,
//       isActive: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       images: [],
//     }));
//   }, [selectedServices]);

//   // Obtener slots disponibles según fecha y servicios
//   const {
//     data: availableSlots,
//     isLoading: slotsLoading,
//     error: slotsError,
//   } = useAvailableSlots(servicesForAvailability, selectedDate);

//   // Obtener periodos del día para mostrar info
//   useEffect(() => {
//     if (selectedDate) {
//       getDayAvailablePeriods(selectedDate)
//         .then(setAvailablePeriods)
//         .catch(() => setAvailablePeriods("Error"));
//     } else {
//       setAvailablePeriods("");
//     }
//   }, [selectedDate]);

//   // Filtrar clientes por búsqueda
//   const filteredClients = useMemo(() => {
//     const clients = Array.isArray(clientsData) ? clientsData : [];
//     if (!clientSearch.trim()) return clients;
//     const searchLower = clientSearch.toLowerCase().trim();
//     return clients.filter((client) => {
//       const name = (client.name || "").toLowerCase();
//       const email = (client.email || "").toLowerCase();
//       const phone = (client.phone || "").toLowerCase();
//       return (
//         name.includes(searchLower) ||
//         email.includes(searchLower) ||
//         phone.includes(searchLower)
//       );
//     });
//   }, [clientsData, clientSearch]);

//   // Filtrar servicios por búsqueda
//   const filteredServices = useMemo(() => {
//     if (!services) return [];
//     if (!serviceSearch.trim()) return services;
//     const searchLower = serviceSearch.toLowerCase().trim();
//     return services.filter(
//       (service) =>
//         service.name.toLowerCase().includes(searchLower) ||
//         service.description?.toLowerCase().includes(searchLower)
//     );
//   }, [services, serviceSearch]);

//   // Verificar disponibilidad del slot seleccionado
//   const isSelectedSlotAvailable = useMemo(() => {
//     if (!selectedTime || !availableSlots) return false;
//     const slot = availableSlots.find((s) => s.time === selectedTime);
//     return slot?.available ?? false;
//   }, [selectedTime, availableSlots]);

//   // Handlers
//   const handleDateSelect = (date: Date | undefined) => {
//     if (date) {
//       setSelectedDate(date);
//       setSelectedTime("");
//       setAvailabilityError("");
//     }
//   };

//   const handleTimeSelect = (time: string) => {
//     const slot = availableSlots?.find((s) => s.time === time);
//     if (slot?.available) {
//       setSelectedTime(time);
//       setAvailabilityError("");
//     } else {
//       toast.error("Este horario no está disponible");
//     }
//   };

// const handleAddService = (service: ServiceWithRelations) => {
//   if (!selectedServices.find((s) => s.id === service.id)) {
//     setSelectedServices([
//       ...selectedServices,
//       {
//         id: service.id,
//         name: service.name,
//         duration: service.duration,
//         price: service.price,
//         quantity: 1,
//       },
//     ]);
//     setServiceSearch("");
//     setIsServiceOpen(false);
//     setSelectedTime("");
//   } else {
//     toast.warning("Este servicio ya ha sido agregado");
//   }
// };

//   const handleRemoveService = (serviceId: string) => {
//     setSelectedServices(selectedServices.filter((s) => s.id !== serviceId));
//     setSelectedTime("");
//   };

//   const handleUpdateQuantity = (serviceId: string, quantity: number) => {
//     setSelectedServices(
//       selectedServices.map((s) =>
//         s.id === serviceId ? { ...s, quantity: Math.max(1, quantity) } : s
//       )
//     );
//     setSelectedTime("");
//   };

//   const handleSelectClient = (userId: string, userName: string) => {
//     setSelectedUserId(userId);
//     setClientSearch(userName);
//     setIsClientOpen(false);
//   };

//   // Función para deshabilitar fines de semana (sábado y domingo) y fechas pasadas
//   const isDateDisabled = (date: Date) => {
//     const today = startOfToday();
//     if (isBefore(date, today)) return true;
//     const day = date.getDay();
//     // 0 = domingo, 6 = sábado
//     return day === 0 || day === 6;
//   };

//   const formatTimeToAMPM = (time24: string): string => {
//     const [hours, minutes] = time24.split(":").map(Number);
//     const period = hours >= 12 ? "PM" : "AM";
//     const hours12 = hours % 12 || 12;
//     return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
//   };

//   const formatDate = (date: Date) => {
//     return date.toLocaleDateString("es-ES", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const formatDateTime = (date: Date) => {
//     return date.toLocaleTimeString("es-ES", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   // Fechas para el resumen (cuando se selecciona hora)
//   const selectedStartDateTime = useMemo(() => {
//     if (!selectedDate || !selectedTime) return null;
//     const [hours, minutes] = selectedTime.split(":").map(Number);
//     const start = new Date(selectedDate);
//     start.setHours(hours, minutes, 0, 0);
//     return start;
//   }, [selectedDate, selectedTime]);

//   const selectedEndDateTime = useMemo(() => {
//     if (!selectedStartDateTime) return null;
//     return addMinutes(selectedStartDateTime, totalDuration);
//   }, [selectedStartDateTime, totalDuration]);

//   // Envío del formulario
// const handleSubmit = async () => {
//   if (!selectedUserId) {
//     toast.error("Por favor selecciona un cliente");
//     return;
//   }
//   if (selectedServices.length === 0) {
//     toast.error("Por favor selecciona al menos un servicio");
//     return;
//   }
//   if (!selectedDate) {
//     toast.error("Por favor selecciona una fecha");
//     return;
//   }
//   if (!selectedTime) {
//     toast.error("Por favor selecciona una hora");
//     return;
//   }
//   if (!isSelectedSlotAvailable) {
//     toast.error("El horario seleccionado ya no está disponible");
//     return;
//   }

//   const [hours, minutes] = selectedTime.split(":").map(Number);
//   const startDate = new Date(selectedDate);
//   startDate.setHours(hours, minutes, 0, 0);
//   const endDate = addMinutes(startDate, totalDuration);

//   if (isBefore(startDate, new Date())) {
//     toast.error("No se pueden crear citas en fechas/horas pasadas");
//     return;
//   }

//   const totalPrice = selectedServices.reduce(
//     (sum, s) => sum + s.price ,
//     0
//   );

//   // 🔧 FORMATO CORRECTO para createAppointment
//   const appointmentData = {
//     cuid: `ADMIN-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
//     note: note || "",
//     // date: startDate,
//     // endDate: endDate,
//       date: normalizeToUTC(startDate),
//       endDate: normalizeToUTC(endDate),
//     duration: totalDuration,
//     total_price: totalPrice,
//     user_id: selectedUserId,
//     services: {
//       create: selectedServices.map((s) => ({
//         service_id: s.id,  // ⚠️ Nota: es "service_id", no "serviceId"
//         quantity:1,
//       })),
//     },
//   };

//   setIsSubmitting(true);
//   try {
    
//     await createAppointment.mutateAsync(appointmentData);
//     toast.success("Cita creada exitosamente");
//     // Limpiar formulario
//     setSelectedUserId("");
//     setSelectedServices([]);
//     setSelectedDate(undefined);
//     setSelectedTime("");
//     setNote("");
//     setClientSearch("");
//     setServiceSearch("");
//     setAvailabilityError("");
//     onSuccess();
//   } catch (error: any) {
//     console.error("Error creating appointment:", error);
//     toast.error(error.message || "Error al crear la cita");
//   } finally {
//     setIsSubmitting(false);
//   }
// };
//   const isLoading = usersLoading || servicesLoading || slotsLoading;

//   // Determinar si el botón debe estar habilitado
//   const isButtonDisabled =
//     isSubmitting ||
//     !selectedUserId ||
//     selectedServices.length === 0 ||
//     !selectedDate ||
//     !selectedTime ||
//     !isSelectedSlotAvailable;

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Crear Nueva Cita</DialogTitle>
//           <DialogDescription>
//             Busca un cliente, selecciona los servicios y el horario para la cita
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-6 py-4">
//           {/* --- CLIENTE --- */}
//           <div className="space-y-2">
//             <Label>Cliente *</Label>
//             <div className="relative">
//               {selectedUserId && clientsData.find(c => c.id === selectedUserId) ? (
//                 <div className="flex items-center justify-between p-2 border rounded-lg bg-muted/50">
//                   <div className="flex-1">
//                     <p className="font-medium">
//                       {clientsData.find(c => c.id === selectedUserId)?.name}
//                     </p>
//                     <p className="text-xs text-muted-foreground">
//                       {clientsData.find(c => c.id === selectedUserId)?.email}
//                     </p>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => {
//                       setSelectedUserId("");
//                       setClientSearch("");
//                     }}
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               ) : (
//                 <Popover open={isClientOpen} onOpenChange={setIsClientOpen}>
//                   <PopoverTrigger asChild>
//                     <Button variant="outline" className="w-full justify-between">
//                       {clientSearch || "Buscar cliente..."}
//                       <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-full p-0">
//                     <Command shouldFilter={false}>
//                       <CommandInput
//                         placeholder="Nombre, email o teléfono..."
//                         value={clientSearch}
//                         onValueChange={setClientSearch}
//                       />
//                       <CommandList>
//                         <CommandEmpty>
//                           {usersLoading
//                             ? "Cargando..."
//                             : "No se encontraron clientes"}
//                         </CommandEmpty>
//                         <CommandGroup>
//                           {filteredClients.map((client) => (
//                             <CommandItem
//                               key={client.id}
//                               onSelect={() =>
//                                 handleSelectClient(client.id, client.name)
//                               }
//                               className="flex flex-col items-start"
//                             >
//                               <span className="font-medium">{client.name}</span>
//                               <span className="text-xs text-muted-foreground">
//                                 {client.email}
//                               </span>
//                             </CommandItem>
//                           ))}
//                         </CommandGroup>
//                       </CommandList>
//                     </Command>
//                   </PopoverContent>
//                 </Popover>
//               )}
//             </div>
//             {usersError && (
//               <p className="text-xs text-red-500">
//                 Error al cargar clientes. Recarga la página.
//               </p>
//             )}
//           </div>

//           {/* --- SERVICIOS --- */}
//           <div className="space-y-2">
//             <Label>Servicios *</Label>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Popover open={isServiceOpen} onOpenChange={setIsServiceOpen}>
//                   <PopoverTrigger asChild>
//                     <Button variant="outline" className="w-full justify-between">
//                       {serviceSearch || "Agregar servicio..."}
//                       <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-full p-0">
//                     <Command shouldFilter={false}>
//                       <CommandInput
//                         placeholder="Buscar por nombre o descripción..."
//                         value={serviceSearch}
//                         onValueChange={setServiceSearch}
//                       />
//                       <CommandList>
//                         <CommandEmpty>
//                           {servicesLoading
//                             ? "Cargando..."
//                             : "No se encontraron servicios"}
//                         </CommandEmpty>
//                         <CommandGroup>
//                           {filteredServices.map((service) => (
//                             <CommandItem
//                               key={service.id}
//                               onSelect={() => handleAddService(service)}
//                               disabled={selectedServices.some(
//                                 (s) => s.id === service.id
//                               )}
//                               className="flex flex-col items-start w-72"
//                             >
//                               <div className="flex justify-between w-full">
//                                 <span className="font-medium">
//                                   {service.name}
//                                 </span>
//                                 <span className="text-sm font-semibold text-primary">
//                                   ${service.price} USD
//                                 </span>
//                               </div>
//                               <span className="text-xs text-muted-foreground">
//                                 ⏱️ Duración: {service.duration} min
//                               </span>
//                               {/* {service.description && (
//                                 <span className="text-xs text-muted-foreground line-clamp-1">
//                                   📝 {service.description}
//                                 </span>
//                               )} */}
//                             </CommandItem>
//                           ))}
//                         </CommandGroup>
//                       </CommandList>
//                     </Command>
//                   </PopoverContent>
//                 </Popover>
//               </div>

//               {selectedServices.length > 0 && (
//                 <ScrollArea className="h-auto max-h-[250px]">
//                   <div className="space-y-2">
//                     {selectedServices.map((service) => (
//                       <div
//                         key={service.id}
//                         className="flex flex-col p-2 border rounded-lg"
//                       >
//                         <div className="flex items-start justify-between">
//                           <div className="flex-1">
//                             <p className="font-medium text-sm">
//                               {service.name}
//                             </p>
//                             <p className="text-xs text-muted-foreground">
//                               {service.duration} min - ${service.price}
//                             </p>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <div className="flex items-center gap-1">
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 className="h-7 w-7 p-0"
//                                 onClick={() =>
//                                   handleUpdateQuantity(
//                                     service.id,
//                                     service.quantity - 1
//                                   )
//                                 }
//                                 disabled={service.quantity <= 1}
//                               >
//                                 -
//                               </Button>
//                               <span className="w-8 text-center text-sm">
//                                 {service.quantity}
//                               </span>
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 className="h-7 w-7 p-0"
//                                 onClick={() =>
//                                   handleUpdateQuantity(
//                                     service.id,
//                                     service.quantity + 1
//                                   )
//                                 }
//                               >
//                                 +
//                               </Button>
//                             </div>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => handleRemoveService(service.id)}
//                             >
//                               <X className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </ScrollArea>
//               )}
//             </div>

//             {selectedServices.length > 0 && (
//               <div className="mt-2 p-3 bg-primary/10 rounded-lg">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p className="text-sm text-muted-foreground">
//                       Duración total
//                     </p>
//                     <p className="font-semibold">{totalDuration} minutos</p>
//                     <p className="text-xs text-muted-foreground">
//                       (servicios: {servicesDuration} min + preparación:{" "}
//                       {BUFFER_TIME} min)
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm text-muted-foreground">
//                       Total a pagar
//                     </p>
//                     <p className="text-lg font-bold text-primary">
//                       $
//                       {selectedServices.reduce(
//                         (sum, s) => sum + s.price * s.quantity,
//                         0
//                       )}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* --- FECHA Y HORA (nuevo diseño con tarjetas) --- */}
//           <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
//             {/* Calendario */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <CalendarIcon className="h-5 w-5" />
//                   Seleccionar Fecha
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Calendar
//                   locale={es}
//                   mode="single"
//                   selected={selectedDate}
//                   onSelect={handleDateSelect}
//                   disabled={isDateDisabled}
//                   className="rounded-md border w-full"
//                 />
//                 <div className="mt-4 text-sm text-muted-foreground">
//                   <p>• Citas disponibles de Lunes a Viernes</p>
//                   <p>• Selecciona una fecha para ver los horarios</p>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Horarios disponibles */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Clock className="h-5 w-5" />
//                   Seleccionar Hora
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {!selectedDate ? (
//                   <div className="text-center py-8 text-muted-foreground">
//                     Por favor selecciona una fecha primero
//                   </div>
//                 ) : selectedServices.length === 0 ? (
//                   <div className="text-center py-8 text-muted-foreground">
//                     Primero selecciona al menos un servicio
//                   </div>
//                 ) : slotsLoading ? (
//                   <div className="text-center py-8">
//                     <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
//                     <p className="text-sm text-muted-foreground">
//                       Buscando horarios disponibles...
//                     </p>
//                     {availablePeriods && (
//                       <p className="text-xs text-blue-600 mt-2">
//                         Periodos: {availablePeriods}
//                       </p>
//                     )}
//                   </div>
//                 ) : slotsError ? (
//                   <div className="text-center py-8">
//                     <div className="text-destructive mb-2">
//                       <p className="font-semibold">No hay disponibilidad</p>
//                       <p className="text-sm mt-1">{slotsError.message}</p>
//                     </div>
//                     <div className="text-xs text-muted-foreground mt-4 space-y-2">
//                       <div className="bg-gray-50 p-3 rounded-md">
//                         <strong className="text-gray-700">
//                           Horarios del día:
//                         </strong>
//                         <p className="text-green-600 mt-1">{availablePeriods}</p>
//                       </div>
//                       <p>• Intenta seleccionar otra fecha</p>
//                       <p>• Considera dividir los servicios en múltiples citas</p>
//                     </div>
//                   </div>
//                 ) : availableSlots && availableSlots.filter(s => s.available).length > 0 ? (
//                   <div className="space-y-4">
//                     <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-md">
//                       <div className="flex items-start gap-2">
//                         <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
//                         <div>
//                           <p className="font-medium text-blue-700">
//                             Desglose de tiempo:
//                           </p>
//                           <p>Servicios: {servicesDuration} minutos</p>
//                           <p>
//                             Tiempo de preparación: {BUFFER_TIME} minutos
//                           </p>
//                           <p className="font-semibold mt-1">
//                             Total: {totalDuration} minutos
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
//                       {availableSlots.map((slot) => (
//                         <Button
//                           key={slot.time}
//                           variant={
//                             selectedTime === slot.time ? "default" : "outline"
//                           }
//                           size="sm"
//                           disabled={!slot.available}
//                           onClick={() => handleTimeSelect(slot.time)}
//                           className={`text-xs h-10 ${
//                             selectedTime === slot.time
//                               ? "bg-sage-300 hover:bg-sage-400 text-black"
//                               : slot.available
//                               ? "bg-sage-100 hover:bg-sage-200 text-black"
//                               : "bg-gray-100 text-gray-400"
//                           }`}
//                         >
//                           {formatTimeToAMPM(slot.time)}
//                           {!slot.available && (
//                             <span className="text-xs text-gray-500 ml-1">
//                               ⛔
//                             </span>
//                           )}
//                         </Button>
//                       ))}
//                     </div>
//                     <div className="text-xs text-muted-foreground">
//                       {availableSlots.filter((slot) => slot.available).length}{" "}
//                       horarios disponibles de {availableSlots.length}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="text-center py-8">
//                     <p className="text-muted-foreground mb-2">
//                       No hay horarios disponibles para esta fecha
//                     </p>
//                     <div className="text-xs text-muted-foreground space-y-2 mt-3">
//                       <div className="bg-yellow-50 p-3 rounded-md">
//                         <strong className="text-yellow-700">
//                           Horarios configurados:
//                         </strong>
//                         <p className="text-yellow-600 mt-1">
//                           {availablePeriods}
//                         </p>
//                       </div>
//                       <p>
//                         • La duración de {totalDuration} minutos no cabe en los
//                         horarios disponibles
//                       </p>
//                       <p>
//                         • Intenta seleccionar otra fecha o reducir los servicios
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Tarjeta resumen de la cita seleccionada */}
//           {selectedDate && selectedTime && selectedStartDateTime && selectedEndDateTime && (
//             <Card className="bg-muted/50">
//               <CardContent className="p-4">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                   <div>
//                     <h3 className="font-semibold">Cita Seleccionada</h3>
//                     <div className="space-y-2 mt-2">
//                       <div className="flex gap-2 flex-wrap">
//                         <Badge variant="secondary">
//                           {formatDate(selectedDate)}
//                         </Badge>
//                         <Badge
//                           variant={
//                             isSelectedSlotAvailable ? "default" : "destructive"
//                           }
//                         >
//                           {formatTimeToAMPM(selectedTime)}{" "}
//                           {!isSelectedSlotAvailable && "(No disponible)"}
//                         </Badge>
//                       </div>
//                       <div className="text-sm text-muted-foreground">
//                         <p>Inicio: {formatDateTime(selectedStartDateTime)}</p>
//                         <p>Fin: {formatDateTime(selectedEndDateTime)}</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="text-left sm:text-right">
//                     <div className="text-sm text-muted-foreground">
//                       Duración: {totalDuration} min
//                     </div>
//                     <div className="text-sm font-semibold">
//                       {selectedServices.length} servicio(s)
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Nota adicional */}
//           <div className="space-y-2">
//             <Label htmlFor="note">Nota adicional (opcional)</Label>
//             <textarea
//               id="note"
//               value={note}
//               onChange={(e) => setNote(e.target.value)}
//               className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
//               placeholder="Notas adicionales para la cita..."
//             />
//           </div>
//         </div>

//         <div className="flex justify-end gap-3 pt-4 border-t">
//           <Button variant="outline" onClick={onClose}>
//             Cancelar
//           </Button>
//           <Button onClick={handleSubmit} disabled={isButtonDisabled}>
//             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//             Crear Cita
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// CreateAppointmentModal.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Calendar } from "../../ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import {
  CalendarIcon,
  Clock,
  Loader2,
  Search,
  X,
  Info,
} from "lucide-react";
import { startOfToday, isBefore, addMinutes } from "date-fns";
import { es } from "date-fns/locale";
import { useGetClients } from "@/lib/hooks/user.hooks";
import { useGetAllServices } from "@/lib/hooks/service.hooks";
import { useAddAppointment } from "@/lib/hooks/appointment.hooks";
import { useAvailableSlots } from "@/hooks/use-availability";
import { getDayAvailablePeriods } from "@/lib/actions/availability.actions";
import { toast } from "sonner";
import { ScrollArea } from "../../ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../ui/command";
import { BUFFER_TIME, calculateTotalDuration } from "@/lib/utils/booking-utils";
import { ServiceWithRelations } from "@/lib/actions/services.actions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { normalizeToUTC } from "@/components/new-bookings/confirmation";

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface SelectedService {
  id: string;
  name: string;
  duration: number;
  price: number;
  quantity: number;
}

export function CreateAppointmentModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateAppointmentModalProps) {
  // Estados del formulario
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availablePeriods, setAvailablePeriods] = useState("");

  // Estados de búsqueda
  const [clientSearch, setClientSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [isClientOpen, setIsClientOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);

  // Hooks de datos
  const { data: clientsData = [], isLoading: usersLoading, error: usersError } = useGetClients();
  const { data: services, isLoading: servicesLoading } = useGetAllServices();
  const createAppointment = useAddAppointment();

  // Duración total (servicios + buffer)
  const totalDuration = calculateTotalDuration(selectedServices);
  const servicesDuration = selectedServices.reduce((sum, s) => sum + s.duration * s.quantity, 0);

  // Transformar selectedServices al tipo que espera useAvailableSlots
  const servicesForAvailability = useMemo<ServiceWithRelations[]>(() => {
    return selectedServices.map((s) => ({
      id: s.id,
      name: s.name,
      duration: s.duration,
      price: s.price,
      cuid: `temp-${s.id}`,
      description: "",
      detailedDescription: "",
      benefits: [],
      preparation: [],
      category_id: "",
      category: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      images: [],
    }));
  }, [selectedServices]);

  // Obtener slots disponibles según fecha y servicios
  const {
    data: availableSlots,
    isLoading: slotsLoading,
    error: slotsError,
  } = useAvailableSlots(servicesForAvailability, selectedDate);

  // Obtener periodos del día para mostrar info
  useEffect(() => {
    if (selectedDate) {
      getDayAvailablePeriods(selectedDate)
        .then(setAvailablePeriods)
        .catch(() => setAvailablePeriods("Error"));
    } else {
      setAvailablePeriods("");
    }
  }, [selectedDate]);

  // Filtrar clientes por búsqueda
  const filteredClients = useMemo(() => {
    const clients = Array.isArray(clientsData) ? clientsData : [];
    if (!clientSearch.trim()) return clients;
    const searchLower = clientSearch.toLowerCase().trim();
    return clients.filter((client) => {
      const name = (client.name || "").toLowerCase();
      const email = (client.email || "").toLowerCase();
      const phone = (client.phone || "").toLowerCase();
      return (
        name.includes(searchLower) ||
        email.includes(searchLower) ||
        phone.includes(searchLower)
      );
    });
  }, [clientsData, clientSearch]);

  // Filtrar servicios por búsqueda
  const filteredServices = useMemo(() => {
    if (!services) return [];
    if (!serviceSearch.trim()) return services;
    const searchLower = serviceSearch.toLowerCase().trim();
    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(searchLower) ||
        service.description?.toLowerCase().includes(searchLower)
    );
  }, [services, serviceSearch]);

  // Verificar disponibilidad del slot seleccionado
  const isSelectedSlotAvailable = useMemo(() => {
    if (!selectedTime || !availableSlots) return false;
    const slot = availableSlots.find((s) => s.time === selectedTime);
    return slot?.available ?? false;
  }, [selectedTime, availableSlots]);

  // Handlers
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTime("");
    }
  };

  const handleTimeSelect = (time: string) => {
    const slot = availableSlots?.find((s) => s.time === time);
    if (slot?.available) {
      setSelectedTime(time);
    } else {
      toast.error("Este horario no está disponible");
    }
  };

  const handleAddService = (service: ServiceWithRelations) => {
    if (!selectedServices.find((s) => s.id === service.id)) {
      setSelectedServices([
        ...selectedServices,
        {
          id: service.id,
          name: service.name,
          duration: service.duration,
          price: service.price,
          quantity: 1,
        },
      ]);
      setServiceSearch("");
      setIsServiceOpen(false);
      setSelectedTime("");
    } else {
      toast.warning("Este servicio ya ha sido agregado");
    }
  };

  const handleRemoveService = (serviceId: string) => {
    setSelectedServices(selectedServices.filter((s) => s.id !== serviceId));
    setSelectedTime("");
  };

  const handleUpdateQuantity = (serviceId: string, quantity: number) => {
    setSelectedServices(
      selectedServices.map((s) =>
        s.id === serviceId ? { ...s, quantity: Math.max(1, quantity) } : s
      )
    );
    setSelectedTime("");
  };

  const handleSelectClient = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setClientSearch(userName);
    setIsClientOpen(false);
  };

  // Función para deshabilitar fines de semana y fechas pasadas
  const isDateDisabled = (date: Date) => {
    const today = startOfToday();
    if (isBefore(date, today)) return true;
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const formatTimeToAMPM = (time24: string): string => {
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Fechas para el resumen (cuando se selecciona hora)
  const selectedStartDateTime = useMemo(() => {
    if (!selectedDate || !selectedTime) return null;
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const start = new Date(selectedDate);
    start.setHours(hours, minutes, 0, 0);
    return start;
  }, [selectedDate, selectedTime]);

  const selectedEndDateTime = useMemo(() => {
    if (!selectedStartDateTime) return null;
    return addMinutes(selectedStartDateTime, totalDuration);
  }, [selectedStartDateTime, totalDuration]);

  // Envío del formulario
  const handleSubmit = async () => {
    if (!selectedUserId) {
      toast.error("Por favor selecciona un cliente");
      return;
    }
    if (selectedServices.length === 0) {
      toast.error("Por favor selecciona al menos un servicio");
      return;
    }
    if (!selectedDate) {
      toast.error("Por favor selecciona una fecha");
      return;
    }
    if (!selectedTime) {
      toast.error("Por favor selecciona una hora");
      return;
    }
    if (!isSelectedSlotAvailable) {
      toast.error("El horario seleccionado ya no está disponible");
      return;
    }

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const startDate = new Date(selectedDate);
    startDate.setHours(hours, minutes, 0, 0);
    const endDate = addMinutes(startDate, totalDuration);

    if (isBefore(startDate, new Date())) {
      toast.error("No se pueden crear citas en fechas/horas pasadas");
      return;
    }

    const totalPrice = selectedServices.reduce(
      (sum, s) => sum + s.price,
      0
    );

    const appointmentData = {
      cuid: `ADMIN-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      note: note || "",
      date: normalizeToUTC(startDate),
      endDate: normalizeToUTC(endDate),
      duration: totalDuration,
      total_price: totalPrice,
      user_id: selectedUserId,
      services: {
        create: selectedServices.map((s) => ({
          service_id: s.id,
          quantity: 1,
        })),
      },
    };

    setIsSubmitting(true);
    try {
      await createAppointment.mutateAsync(appointmentData);
      toast.success("Cita creada exitosamente");
      // Limpiar formulario
      setSelectedUserId("");
      setSelectedServices([]);
      setSelectedDate(undefined);
      setSelectedTime("");
      setNote("");
      setClientSearch("");
      setServiceSearch("");
      onSuccess();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Error al crear la cita";
      console.error("Error creating appointment:", error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determinar si el botón debe estar habilitado
  const isButtonDisabled =
    isSubmitting ||
    !selectedUserId ||
    selectedServices.length === 0 ||
    !selectedDate ||
    !selectedTime ||
    !isSelectedSlotAvailable;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nueva Cita</DialogTitle>
          <DialogDescription>
            Busca un cliente, selecciona los servicios y el horario para la cita
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* --- CLIENTE --- */}
          <div className="space-y-2">
            <Label>Cliente *</Label>
            <div className="relative">
              {selectedUserId && clientsData.find(c => c.id === selectedUserId) ? (
                <div className="flex items-center justify-between p-2 border rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <p className="font-medium">
                      {clientsData.find(c => c.id === selectedUserId)?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {clientsData.find(c => c.id === selectedUserId)?.email}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedUserId("");
                      setClientSearch("");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Popover open={isClientOpen} onOpenChange={setIsClientOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {clientSearch || "Buscar cliente..."}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Nombre, email o teléfono..."
                        value={clientSearch}
                        onValueChange={setClientSearch}
                      />
                      <CommandList>
                        <CommandEmpty>
                          {usersLoading
                            ? "Cargando..."
                            : "No se encontraron clientes"}
                        </CommandEmpty>
                        <CommandGroup>
                          {filteredClients.map((client) => (
                            <CommandItem
                              key={client.id}
                              onSelect={() =>
                                handleSelectClient(client.id, client.name)
                              }
                              className="flex flex-col items-start"
                            >
                              <span className="font-medium">{client.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {client.email}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            {usersError && (
              <p className="text-xs text-red-500">
                Error al cargar clientes. Recarga la página.
              </p>
            )}
          </div>

          {/* --- SERVICIOS --- */}
          <div className="space-y-2">
            <Label>Servicios *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Popover open={isServiceOpen} onOpenChange={setIsServiceOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {serviceSearch || "Agregar servicio..."}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Buscar por nombre o descripción..."
                        value={serviceSearch}
                        onValueChange={setServiceSearch}
                      />
                      <CommandList>
                        <CommandEmpty>
                          {servicesLoading
                            ? "Cargando..."
                            : "No se encontraron servicios"}
                        </CommandEmpty>
                        <CommandGroup>
                          {filteredServices.map((service) => (
                            <CommandItem
                              key={service.id}
                              onSelect={() => handleAddService(service)}
                              disabled={selectedServices.some(
                                (s) => s.id === service.id
                              )}
                              className="flex flex-col items-start w-72"
                            >
                              <div className="flex justify-between w-full">
                                <span className="font-medium">
                                  {service.name}
                                </span>
                                <span className="text-sm font-semibold text-primary">
                                  ${service.price} USD
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                ⏱️ Duración: {service.duration} min
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {selectedServices.length > 0 && (
                <ScrollArea className="h-auto max-h-[250px]">
                  <div className="space-y-2">
                    {selectedServices.map((service) => (
                      <div
                        key={service.id}
                        className="flex flex-col p-2 border rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {service.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {service.duration} min - ${service.price}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    service.id,
                                    service.quantity - 1
                                  )
                                }
                                disabled={service.quantity <= 1}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center text-sm">
                                {service.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    service.id,
                                    service.quantity + 1
                                  )
                                }
                              >
                                +
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveService(service.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            {selectedServices.length > 0 && (
              <div className="mt-2 p-3 bg-primary/10 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Duración total
                    </p>
                    <p className="font-semibold">{totalDuration} minutos</p>
                    <p className="text-xs text-muted-foreground">
                      (servicios: {servicesDuration} min + preparación:{" "}
                      {BUFFER_TIME} min)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Total a pagar
                    </p>
                    <p className="text-lg font-bold text-primary">
                      $
                      {selectedServices.reduce(
                        (sum, s) => sum + s.price * s.quantity,
                        0
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* --- FECHA Y HORA --- */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Calendario */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Seleccionar Fecha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  locale={es}
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={isDateDisabled}
                  className="rounded-md border w-full"
                />
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>• Citas disponibles de Lunes a Viernes</p>
                  <p>• Selecciona una fecha para ver los horarios</p>
                </div>
              </CardContent>
            </Card>

            {/* Horarios disponibles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Seleccionar Hora
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedDate ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Por favor selecciona una fecha primero
                  </div>
                ) : selectedServices.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Primero selecciona al menos un servicio
                  </div>
                ) : slotsLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Buscando horarios disponibles...
                    </p>
                    {availablePeriods && (
                      <p className="text-xs text-blue-600 mt-2">
                        Periodos: {availablePeriods}
                      </p>
                    )}
                  </div>
                ) : slotsError ? (
                  <div className="text-center py-8">
                    <div className="text-destructive mb-2">
                      <p className="font-semibold">No hay disponibilidad</p>
                      <p className="text-sm mt-1">{slotsError.message}</p>
                    </div>
                    <div className="text-xs text-muted-foreground mt-4 space-y-2">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <strong className="text-gray-700">
                          Horarios del día:
                        </strong>
                        <p className="text-green-600 mt-1">{availablePeriods}</p>
                      </div>
                      <p>• Intenta seleccionar otra fecha</p>
                      <p>• Considera dividir los servicios en múltiples citas</p>
                    </div>
                  </div>
                ) : availableSlots && availableSlots.filter(s => s.available).length > 0 ? (
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-md">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-blue-700">
                            Desglose de tiempo:
                          </p>
                          <p>Servicios: {servicesDuration} minutos</p>
                          <p>
                            Tiempo de preparación: {BUFFER_TIME} minutos
                          </p>
                          <p className="font-semibold mt-1">
                            Total: {totalDuration} minutos
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={
                            selectedTime === slot.time ? "default" : "outline"
                          }
                          size="sm"
                          disabled={!slot.available}
                          onClick={() => handleTimeSelect(slot.time)}
                          className={`text-xs h-10 ${
                            selectedTime === slot.time
                              ? "bg-sage-300 hover:bg-sage-400 text-black"
                              : slot.available
                              ? "bg-sage-100 hover:bg-sage-200 text-black"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {formatTimeToAMPM(slot.time)}
                          {!slot.available && (
                            <span className="text-xs text-gray-500 ml-1">
                              ⛔
                            </span>
                          )}
                        </Button>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {availableSlots.filter((slot) => slot.available).length}{" "}
                      horarios disponibles de {availableSlots.length}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-2">
                      No hay horarios disponibles para esta fecha
                    </p>
                    <div className="text-xs text-muted-foreground space-y-2 mt-3">
                      <div className="bg-yellow-50 p-3 rounded-md">
                        <strong className="text-yellow-700">
                          Horarios configurados:
                        </strong>
                        <p className="text-yellow-600 mt-1">
                          {availablePeriods}
                        </p>
                      </div>
                      <p>
                        • La duración de {totalDuration} minutos no cabe en los
                        horarios disponibles
                      </p>
                      <p>
                        • Intenta seleccionar otra fecha o reducir los servicios
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tarjeta resumen de la cita seleccionada */}
          {selectedDate && selectedTime && selectedStartDateTime && selectedEndDateTime && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">Cita Seleccionada</h3>
                    <div className="space-y-2 mt-2">
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary">
                          {formatDate(selectedDate)}
                        </Badge>
                        <Badge
                          variant={
                            isSelectedSlotAvailable ? "default" : "destructive"
                          }
                        >
                          {formatTimeToAMPM(selectedTime)}{" "}
                          {!isSelectedSlotAvailable && "(No disponible)"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Inicio: {formatDateTime(selectedStartDateTime)}</p>
                        <p>Fin: {formatDateTime(selectedEndDateTime)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-sm text-muted-foreground">
                      Duración: {totalDuration} min
                    </div>
                    <div className="text-sm font-semibold">
                      {selectedServices.length} servicio(s)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Nota adicional */}
          <div className="space-y-2">
            <Label htmlFor="note">Nota adicional (opcional)</Label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Notas adicionales para la cita..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isButtonDisabled}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Crear Cita
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}