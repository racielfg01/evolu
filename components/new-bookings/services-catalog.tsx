// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Clock, DollarSign, Search, ArrowLeft, Check } from "lucide-react";
// // import { mockServices } from "@/lib/mock-data";
// import type { Service } from "@/lib/types";
// import Image from "next/image";
// import { useGetAllCategorys } from "@/lib/hooks/category.hooks";
// import { Category } from "@prisma/client";
// import { useGetAllServices } from "@/lib/hooks/service.hooks";

// interface ServicesCatalogProps {
//   onServiceSelect?: (service: Service) => void;
//   onBookNow?: () => void;
// }

// export function ServicesCatalog({
//   onServiceSelect,
//   onBookNow,
// }: ServicesCatalogProps) {
//   const [selectedCategory, setSelectedCategory] = useState<Category>({
//     id: "todos",
//     name: "Todos",
//   });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [detailService, setDetailService] = useState<Service | null>(null);

//   // const categories = ["Todos", ...Array.from(new Set(mockServices.map((s) => s.category)))]
//   const {
//     data: services,
//     isLoading: isLoadingService,
//     error: errorServices,
//   } = useGetAllServices();

//   const {
//     data: categories,
//     isLoading: isLoadingCategories,
//     error: errorCategories,
//   } = useGetAllCategorys();

//   if (!isLoadingCategories) return;
//   if (!isLoadingService) return;

//   const filteredServices = services
//     .filter((s) => s.isActive)
//     .filter(
//       (s) =>
//         selectedCategory.name === "Todos" ||
//         s.category === selectedCategory.name
//     )
//     .filter(
//       (s) =>
//         s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         s.description.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//   if (detailService) {
//     return (
//       <div className="space-y-6 ">
//         <div className="flex items-center gap-4">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setDetailService(null)}
//             className="flex items-center gap-2"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Volver al Catálogo
//           </Button>
//           <h2 className="text-2xl font-bold">{detailService.name}</h2>
//         </div>

//         <div className="grid gap-6 lg:grid-cols-2">
//           <div className="space-y-4">
//             <Image
//               src={detailService.image || "/placeholder.svg"}
//               alt={detailService.name}
//               className="w-full h-64 object-cover rounded-lg"
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
//               <Badge variant="secondary">{detailService.category}</Badge>
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

//             <div className="space-y-2">
//               <Button
//                 onClick={() => {
//                   if (onServiceSelect) onServiceSelect(detailService);
//                   if (onBookNow) onBookNow();
//                 }}
//                 className="w-full"
//                 size="lg"
//               >
//                 Reservar Este Servicio
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={() => setDetailService(null)}
//                 className="w-full"
//               >
//                 Seguir Explorando
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 bg-sage-50">
//       <div className="text-center">
//         <h2 className="text-2xl font-bold mb-2">Nuestros Servicios</h2>
//         <p className="text-muted-foreground">
//           Descubre nuestra amplia gama de servicios de belleza y bienestar
//         </p>
//       </div>

//       {/* Search and Filter */}
//       <div className="space-y-4">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Buscar servicios..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10"
//           />
//         </div>

//         <div className="flex flex-wrap gap-2 justify-center">
//           {isLoadingCategories ? (
//             <h5>Cargando</h5>
//           ) : (
//             categories?.map((category, index) => (
//               <Button
//                 key={index}
//                 variant={
//                   selectedCategory.name === category.name
//                     ? "default"
//                     : "outline"
//                 }
//                 size="sm"
//                 onClick={() => setSelectedCategory(category)}
//               >
//                 {category.name}
//               </Button>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Services Grid */}
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {/* {filteredServices.map((service) => ( */}
//         {services.map((service) => (
//           <Card
//             key={service.id}
//             className="overflow-hidden hover:shadow-lg transition-shadow"
//           >
//             <div className="relative">
//               <Image
//                 src={service.image || "/placeholder.svg"}
//                 alt={service.name}
//                 className="w-full h-48 object-cover"
//               />
//               <Badge className="absolute top-2 right-2" variant="secondary">
//                 {service.category}
//               </Badge>
//             </div>

//             <CardHeader className="pb-3">
//               <CardTitle className="text-lg">{service.name}</CardTitle>
//               <p className="text-sm text-muted-foreground line-clamp-2">
//                 {service.description}
//               </p>
//             </CardHeader>

//             <CardContent className="pt-0 space-y-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                   <div className="flex items-center gap-1">
//                     <Clock className="h-4 w-4" />
//                     <span>{service.duration} min</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <DollarSign className="h-4 w-4" />
//                     <span className="font-semibold text-foreground">
//                       ${service.price}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setDetailService(service)}
//                   className="flex-1"
//                 >
//                   Ver Detalles
//                 </Button>
//                 <Button
//                   size="sm"
//                   onClick={() => {
//                     if (onServiceSelect) onServiceSelect(service);
//                     if (onBookNow) onBookNow();
//                   }}
//                   className="flex-1"
//                 >
//                   Reservar
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {filteredServices.length === 0 && (
//         <div className="text-center py-8">
//           <p className="text-muted-foreground">
//             No se encontraron servicios que coincidan con tu búsqueda.
//           </p>
//           <Button
//             variant="outline"
//             onClick={() => {
//               setSearchTerm("");
//               setSelectedCategory({ id: "todos", name: "Todos" });
//             }}
//             className="mt-4"
//           >
//             Limpiar Filtros
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }



// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Clock, DollarSign, Search, ArrowLeft, Check } from "lucide-react";
// import Image from "next/image";
// import { Category, Service as PrismaService } from "@prisma/client";
// // import { useGetAllCategorys } from "@/lib/hooks/category.hooks";
// // import { useGetAllServices } from "@/lib/hooks/service.hooks";
// import { ServiceWithRelations } from "@/lib/actions/services.actions";

// // Definir el tipo Service basado en Prisma pero con los campos necesarios
// interface Service extends Omit<PrismaService, "benefits" | "preparation"> {
//   benefits: string[];
//   preparation: string[];
//   image?: string;
// }

// interface ServicesCatalogProps {
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

// export function ServicesCatalog({
//   onServiceSelect,
//   onBookNow,
//   services,
//   isLoadingService,
//   errorServices,
//   categories,
//   isLoadingCategories,
//   errorCategories
// }: ServicesCatalogProps) {
//   const [selectedCategory, setSelectedCategory] = useState<
//     Category | { id: string; name: string }
//   >({
//     id: "todos",
//     name: "Todos",
//   });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [detailService, setDetailService] =
//     useState<ServiceWithRelations | null>(null);

//   // const {
//   //   data: services = [],
//   //   isLoading: isLoadingService,
//   //   error: errorServices,
//   // } = useGetAllServices();

//   // const {
//   //   data: categories = [],
//   //   isLoading: isLoadingCategories,
//   //   error: errorCategories,
//   // } = useGetAllCategorys();

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
//     .filter((s: Service) => s.isActive)
//     .filter(
//       (s: Service) =>
//         selectedCategory.name === "Todos" ||
//         s.category_id === selectedCategory.id
//     )
//     .filter(
//       (s: Service) =>
//         s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         s.description.toLowerCase().includes(searchTerm.toLowerCase())
//     );

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
//             Volver al Catálogo
//           </Button>
//           <h2 className="text-2xl font-bold">{detailService.name}</h2>
//         </div>

//         <div className="grid gap-6 lg:grid-cols-2">
//           <div className="space-y-4">
//             <Image
//               src={detailService.images?.[0]?.url || "/placeholder.svg"}
//               // src={ "/placeholder.svg"}
//               alt={detailService.name}
//               width={400}
//               height={256}
//               className="w-full h-64 object-cover rounded-lg"
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
//               <Badge variant="secondary">
//                 {categories.find((c) => c.id === detailService.category_id)
//                   ?.name || detailService.category_id}
//               </Badge>
//             </div>
//           </div>

//           <div className="space-y-6">
//             <div>
//               <h3 className="text-lg font-semibold mb-2">Descripción</h3>
//               <p className="text-muted-foreground">
//                 {detailService.detailedDescription || detailService.description}
//               </p>
//             </div>

//             {detailService.benefits && detailService.benefits.length > 0 && (
//               <div>
//                 <h3 className="text-lg font-semibold mb-2">Beneficios</h3>
//                 <ul className="space-y-1">
//                   {detailService.benefits.map((benefit, index) => (
//                     <li key={index} className="flex items-center gap-2">
//                       <Check className="h-4 w-4 text-green-600" />
//                       <span className="text-sm">{benefit}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {detailService.preparation &&
//               detailService.preparation.length > 0 && (
//                 <div>
//                   <h3 className="text-lg font-semibold mb-2">Preparación</h3>
//                   <ul className="space-y-1">
//                     {detailService.preparation.map((prep, index) => (
//                       <li key={index} className="flex items-start gap-2">
//                         <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
//                         <span className="text-sm text-muted-foreground">
//                           {prep}
//                         </span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//             <div className="space-y-2">
//               <Button
//                 onClick={() => {
//                   if (onServiceSelect) onServiceSelect(detailService);
//                   if (onBookNow) onBookNow();
//                 }}
//                 className="w-full  bg-sage-600 hover:bg-sage-700 text-white px-5 py-2 rounded-md transition-colors"
//                 size="lg"
//               >
//                 Reservar Este Servicio
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={() => setDetailService(null)}
//                 className="w-full"
//               >
//                 Seguir Explorando
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="text-center">
//         <h2 className="text-2xl font-bold mb-2">Nuestros Servicios</h2>
//         <p className="text-muted-foreground">
//           Descubre nuestra amplia gama de servicios de belleza y bienestar
//         </p>
//       </div>

//       {/* Search and Filter */}
//       <div className="space-y-4">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Buscar servicios..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10 bg-white"
//           />
//         </div>

//         <div className="flex flex-wrap gap-2 justify-center">
//           <Button
//             className={
//               selectedCategory.name === "Todos"
//                 ? " bg-sage-600 hover:bg-sage-700 text-white px-5 py-2 rounded-md transition-colors"
//                 : " bg-white hover:bg-slate-50 text-black px-5 py-2 rounded-md transition-colors"
//             }
//             key="todos"
//             variant={selectedCategory.name === "Todos" ? "default" : "outline"}
//             size="sm"
//             onClick={() => setSelectedCategory({ id: "todos", name: "Todos" })}
//           >
//             Todos
//           </Button>
//           {categories.map((category) => (
//             <Button
//               key={category.id}
//               className={
//                 selectedCategory.id === category.id
//                   ? " bg-sage-600 hover:bg-sage-700 text-white px-5 py-2 rounded-md transition-colors"
//                   : " bg-white hover:bg-slate-50 text-black px-5 py-2 rounded-md transition-colors"
//               }
//               variant={
//                 selectedCategory.id === category.id ? "default" : "outline"
//               }
//               size="sm"
//               onClick={() => setSelectedCategory(category)}
//             >
//               {category.name}
//             </Button>
//           ))}
//         </div>
//       </div>

//       {/* Services Grid */}
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {filteredServices.map((service: ServiceWithRelations) => (
//           <Card
//             key={service.id}
//             className="overflow-hidden hover:shadow-lg transition-shadow"
//           >
//             <div className="relative">
//               <Image
//                 src={service.images?.[0]?.url || "/placeholder.svg"}
//                 // src={ "/placeholder.svg"}
//                 alt={service.name}
//                 width={300}
//                 height={192}
//                 className="w-full h-48 object-cover"
//               />
//               <Badge className="absolute top-2 right-2" variant="secondary">
//                 {categories.find((c) => c.id === service.category_id)?.name ||
//                   service.category_id}
//               </Badge>
//             </div>

//             <CardHeader className="pb-3">
//               <CardTitle className="text-lg">{service.name}</CardTitle>
//               <p className="text-sm text-muted-foreground line-clamp-2">
//                 {service.description}
//               </p>
//             </CardHeader>

//             <CardContent className="pt-0 space-y-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                   <div className="flex items-center gap-1">
//                     <Clock className="h-4 w-4" />
//                     <span>{service.duration} min</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <DollarSign className="h-4 w-4" />
//                     <span className="font-semibold text-foreground">
//                       ${service.price}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setDetailService(service)}
//                   className="flex-1"
//                 >
//                   Ver Detalles
//                 </Button>
//                 <Button
//                   size="sm"
//                   onClick={() => {
//                     if (onServiceSelect) onServiceSelect(service);
//                     if (onBookNow) onBookNow();
//                   }}
//                   className="flex-1 bg-sage-600 hover:bg-sage-700 text-white px-5 py-2 rounded-md transition-colors"
//                 >
//                   Reservar
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {filteredServices.length === 0 && (
//         <div className="text-center py-8">
//           <p className="text-muted-foreground">
//             No se encontraron servicios que coincidan con tu búsqueda.
//           </p>
//           <Button
//             variant="outline"
//             onClick={() => {
//               setSearchTerm("");
//               setSelectedCategory({ id: "todos", name: "Todos" });
//             }}
//             className="mt-4"
//           >
//             Limpiar Filtros
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }
