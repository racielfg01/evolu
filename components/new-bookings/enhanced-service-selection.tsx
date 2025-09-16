// "use client";
// import { useEffect, useState } from "react";
// import { Check, Clock, DollarSign, Eye, ArrowLeft } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { useEnhancedBooking } from "./enhanced-booking-context";
// // import { mockServices } from "@/lib/mock-data";
// import type { Service } from "@/lib/types";
// import Image from "next/image";
// import { ServiceWithRelations } from "@/lib/actions/services.actions";
// import { Category } from "@prisma/client";

// interface EnhancedServiceSelectionProps {
//   onServiceSelect?: (service: Service) => void;
//   onBookNow?: () => void;
//   services: ServiceWithRelations[];
//   isLoadingService: boolean;
//   errorServices: Error | null;
//   categories: {
//     name: string;
//     id: string;
//   }[];
//   isLoadingCategories: boolean;
//   errorCategories: Error | null;
// }

// export function EnhancedServiceSelection({
//   services,
//   isLoadingService,
//   errorServices,
//   categories,
//   isLoadingCategories,
//   errorCategories,
// }: EnhancedServiceSelectionProps) {
//   const { state, dispatch } = useEnhancedBooking();

//   const [selectedCategory, setSelectedCategory] = useState<
//     Category | { id: string; name: string }
//   >({
//     id: "todos",
//     name: "Todos",
//   });
//   const [detailService, setDetailService] =
//     useState<ServiceWithRelations | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");


//   useEffect(() => {
//     const totalDuration = state.selectedServices.reduce(
//       (total, service) => total + service.duration,
//       0
//     ) + 20; // Añadir 20 minutos extra
    
//     dispatch({ type: "SET_TOTAL_DURATION", payload: totalDuration });
//   }, [state.selectedServices, dispatch]); 
  
//   useEffect(() => {
//     const totalPrice =  state.selectedServices.reduce(
//       (total, service) => total + service.price,
//       0
//     );
    
//     dispatch({ type: "SET_TOTAL_PRICE", payload: totalPrice });
//   }, [state.selectedServices, dispatch]);

//   // const categories = ["Todos", ...Array.from(new Set(mockServices.map((s) => s.category)))]

//   // const filteredServices =
//   //   selectedCategory === "Todos"
//   //     ? mockServices.filter((s) => s.isActive)
//   //     : mockServices.filter((s) => s.category === selectedCategory && s.isActive)

//   // Mostrar estados de carga correctamente
//   if (isLoadingService || isLoadingCategories) {
//     return <div className="text-center py-8">Cargando servicios...</div>;
//   }

//   // Mostrar errores si existen
//   if (errorServices || errorCategories) {
//     return (
//       <div className="text-center py-8 text-red-500">
//         Error al cargar los servicios. Por favor, intenta nuevamente.
//       </div>
//     );
//   }

//   const filteredServices = services
//     .filter((s: ServiceWithRelations) => s.isActive)
//     .filter(
//       (s: ServiceWithRelations) =>
//         selectedCategory.name === "Todos" ||
//         s.category_id === selectedCategory.id
//     )
//     .filter(
//       (s: ServiceWithRelations) =>
//         s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         s.description.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//   const handleServiceToggle = (service: ServiceWithRelations) => {
//     const isSelected = state.selectedServices.some((s) => s.id === service.id);

//     if (isSelected) {
//       dispatch({ type: "REMOVE_SERVICE", payload: service.id });
//     } else {
//       dispatch({ type: "ADD_SERVICE", payload: service });
//     }
//   };

//   // const getTotalDuration = () => {
//   //   const result= state.selectedServices.reduce(
//   //     (total, service) => total + service.duration,
//   //     0
//   //   );
     
//   //   return result
//   // };

//   // const getTotalPrice = () => {
//   //   const res= state.selectedServices.reduce(
//   //     (total, service) => total + service.price,
//   //     0
//   //   );
//   //   // dispatch({ type: "SET_TOTAL_DURATION", payload: res });
//   //   return res

//   // };

//   const handleNext = () => {
//     if (state.selectedServices.length > 0) {
//       dispatch({ type: "SET_STEP", payload: 2 });
//     }
//   };

//   if (detailService) {
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center gap-4">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setDetailService(null)}
//             className="flex items-center gap-2"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Volver
//           </Button>
//           <h2 className="text-2xl font-bold">{detailService.name}</h2>
//         </div>

//         <div className="grid gap-6 lg:grid-cols-2">
//           <div className="space-y-4">
//             <Image
//               src={detailService.images?.[0]?.url || "/placeholder.svg"}
//               alt={detailService.name}
//               className="w-full h-64 object-cover rounded-lg"
//               width={400}
//               height={256}
//             />
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <Clock className="h-4 w-4 text-muted-foreground" />
//                 <span>{detailService.duration} min</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <DollarSign className="h-4 w-4 text-muted-foreground" />
//                 <span className="text-lg font-semibold">
//                   ${detailService.price}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-6">
//             <div>
//               <h3 className="text-lg font-semibold mb-2">Descripción</h3>
//               <p className="text-muted-foreground">
//                 {detailService.detailedDescription}
//               </p>
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold mb-2">Beneficios</h3>
//               <ul className="space-y-1">
//                 {detailService.benefits.map((benefit, index) => (
//                   <li key={index} className="flex items-center gap-2">
//                     <Check className="h-4 w-4 text-green-600" />
//                     <span className="text-sm">{benefit}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold mb-2">Preparación</h3>
//               <ul className="space-y-1">
//                 {detailService.preparation.map((prep, index) => (
//                   <li key={index} className="flex items-start gap-2">
//                     <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
//                     <span className="text-sm text-muted-foreground">
//                       {prep}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <Button
//               onClick={() => {
//                 handleServiceToggle(detailService);
//                 setDetailService(null);
//               }}
//               className="w-full  bg-sage-600 hover:bg-sage-700 text-white px-5 py-2 rounded-md transition-colors"
//               size="lg"
//             >
//               {state.selectedServices.some((s) => s.id === detailService.id)
//                 ? "Quitar del Carrito"
//                 : "Agregar al Carrito"}
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="text-center">
//         <h2 className="text-2xl font-bold mb-2">Selecciona Tus Servicios</h2>
//         <p className="text-muted-foreground">
//           Elige uno o más servicios de belleza para tu cita
//         </p>
//       </div>

//       {/* Category Filter */}
//       <div className="flex flex-wrap gap-2 justify-center">
//         <Button
//           className={
//             selectedCategory.name === "Todos"
//               ? " bg-sage-600 hover:bg-sage-700 text-white px-5 py-2 rounded-md transition-colors"
//               : " bg-white hover:bg-slate-50 text-black px-5 py-2 rounded-md transition-colors"
//           }
//           key="todos"
//           variant={selectedCategory.name === "Todos" ? "default" : "outline"}
//           size="sm"
//           onClick={() => setSelectedCategory({ id: "todos", name: "Todos" })}
//         >
//           Todos
//         </Button>
//         {categories.map((category, index) => (
//           <Button
//             key={index}
//             className={
//               selectedCategory.id === category.id
//                 ? " bg-sage-600 hover:bg-sage-700 text-white px-5 py-2 rounded-md transition-colors"
//                 : " bg-white hover:bg-slate-50 text-black px-5 py-2 rounded-md transition-colors"
//             }
//             variant={selectedCategory === category ? "default" : "outline"}
//             size="sm"
//             onClick={() => setSelectedCategory(category)}
//           >
//             {category.name}
//           </Button>
//         ))}
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {filteredServices.map((service) => {
//           const isSelected = state.selectedServices.some(
//             (s) => s.id === service.id
//           );

//           return (
//             <Card
//               key={service.id}
//               className={`transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary bg-primary/5" : ""}`}
//             >
//               <div className="relative">
//                 <Image
//                   src={service.images?.[0]?.url? service.images?.[0]?.url: "/placeholder.svg"}
//                   alt={service.name}
//                   className="w-full h-48 object-cover rounded-t-lg"
//                   width={400}
//                   height={256}
//                 />
//                 {isSelected && (
//                   <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
//                     <Check className="h-4 w-4" />
//                   </div>
//                 )}
//               </div>

//               <CardHeader className="pb-3">
//                 <div className="flex items-start justify-between">
//                   <CardTitle className="text-lg">{service.name}</CardTitle>
//                 </div>
//                 <CardDescription className="text-sm line-clamp-2">
//                   {service.description}
//                 </CardDescription>
//               </CardHeader>

//               <CardContent className="pt-0 space-y-3">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                     <div className="flex items-center gap-1">
//                       <Clock className="h-4 w-4" />
//                       <span>{service.duration} min</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <DollarSign className="h-4 w-4" />
//                       <span>${service.price}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex gap-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setDetailService(service)}
//                     className="flex-1"
//                   >
//                     <Eye className="h-4 w-4 mr-1" />
//                     Ver Detalles
//                   </Button>
//                   <Button
//                     variant={isSelected ? "destructive" : "default"}
//                     size="sm"
//                     onClick={() => handleServiceToggle(service)}
//                     className={`flex px-5 py-2 rounded-md transition-colors ${isSelected ? " bg-red-500 hover:bg-red-400" : " bg-sage-600 hover:bg-sage-500"} text-white`}
//                   >
//                     {isSelected ? "Quitar" : "Agregar"}
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       {state.selectedServices.length > 0 && (
//         <Card className="bg-muted/50">
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="font-semibold">Servicios Seleccionados</h3>
//                 <div className="flex gap-2 mt-2 flex-wrap">
//                   {state.selectedServices.map((service) => (
//                     <Badge key={service.id} variant="secondary">
//                       {service.name}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//               <div className="text-right">
//                 <div className="text-sm text-muted-foreground">
//                   Duración Total: {state.totalDuration} min
//                 </div>
//                 <div className="text-lg font-semibold">
//                   Total: ${state.totalPrice}
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       <div className="flex justify-end">
//         <Button
//          className={`flex px-5 py-2 rounded-md transition-colors bg-sage-600 hover:bg-sage-500 text-white`}
//           onClick={handleNext}
//           disabled={state.selectedServices.length === 0}
//           size="lg"
//         >
//           Continuar a Fecha y Hora
//         </Button>
//       </div>
//     </div>
//   );
// }
