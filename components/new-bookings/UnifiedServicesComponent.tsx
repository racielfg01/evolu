"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Clock,
  DollarSign,
  Search,
  ArrowLeft,
  Check,
  Eye,
  //   Calendar,
  //   User,
} from "lucide-react";
import Image from "next/image";
import { ServiceWithRelations } from "@/lib/actions/services.actions";
import { useEnhancedBooking } from "@/components/new-bookings/enhanced-booking-context";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

interface UnifiedServicesComponentProps {
  mode: "catalog" | "selection";
  onServiceSelect?: (service: ServiceWithRelations) => void;
  onBookNow?: () => void;
  services: ServiceWithRelations[];
  isLoadingService: boolean;
  errorServices: Error | null;
  categories: { name: string; id: string }[]|null;
  isLoadingCategories?: boolean;
  errorCategories?: Error | null;
  title?: string;
  description?: string;
  showFilters?: boolean;
  showSearch?: boolean;
}

export function UnifiedServicesComponent({
  mode,
  onServiceSelect,
  onBookNow,
  services,
  isLoadingService,
  errorServices,
  categories,
  isLoadingCategories,
  errorCategories,

  showFilters = true,
  showSearch = true,
}: UnifiedServicesComponentProps) {
  const { push } = useRouter();
  const { state, dispatch } = useEnhancedBooking();
  const [selectedCategory, setSelectedCategory] = useState({
    id: "todos",
    name: "Todos",
  });
  const [usdValue, setUsdValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [detailService, setDetailService] =
    useState<ServiceWithRelations | null>(null);

  useEffect(() => {
    setUsdValue(430);
  }, []);

  // Efectos para calcular duración y precio total (solo en modo selección)
  useEffect(() => {
    if (mode === "selection") {
      const totalDuration =
        state.selectedServices.reduce(
          (total, service) => total + service.duration,
          0
        ) + 20; // Añadir 20 minutos extra

      dispatch({ type: "SET_TOTAL_DURATION", payload: totalDuration });
    }
  }, [state.selectedServices, dispatch, mode]);

  useEffect(() => {
    if (mode === "selection") {
      const totalPrice = state.selectedServices.reduce(
        (total, service) => total + service.price,
        0
      );

      dispatch({ type: "SET_TOTAL_PRICE", payload: totalPrice });
    }
  }, [state.selectedServices, dispatch, mode]);

  // Manejar selección de servicios según el modo
  const handleServiceAction = (service: ServiceWithRelations) => {
    if (!state.userInfo.id) {
      push("/login");
    } else {
      if (mode === "selection") {
        const isSelected = state.selectedServices.some(
          (s) => s.id === service.id
        );

        if (isSelected) {
          dispatch({ type: "REMOVE_SERVICE", payload: service.id });
        } else {
          dispatch({ type: "ADD_SERVICE", payload: service });
        }
      } else if (mode === "catalog" && onServiceSelect) {
        onServiceSelect(service);
        if (onBookNow) onBookNow();
      }
    }
  };

  // Navegar al siguiente paso (solo en modo selección)
  const handleNext = () => {
    if (mode === "selection" && state.selectedServices.length > 0) {
      dispatch({ type: "SET_STEP", payload: 2 });
    }
  };

  // Filtrar servicios
  const filteredServices = services
    .filter((s) => s.isActive)
    .filter(
      (s) =>
        selectedCategory.name === "Todos" ||
        s.category_id === selectedCategory.id
    )
    .filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Mostrar estados de carga
  if (isLoadingService ) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando servicios...</p>
        </div>
      </div>
    );
  }
    console.log('services',services,isLoadingService)
    console.log('categories',categories,isLoadingCategories,)
  if ( isLoadingCategories ) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando categorias...</p>
        </div>
      </div>
    );
  }

  // Mostrar errores
  if (errorServices || errorCategories) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Error al cargar los servicios. Por favor, intenta nuevamente.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </Button>
      </div>
    );
  }

  // Vista detallada de un servicio
  if (detailService) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mt-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDetailService(null)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {mode === "selection" ? "Volver" : "Volver al Catálogo"}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Columna izquierda - Imágenes e información básica */}
          <div className="space-y-4">
            {/* Carousel de imágenes */}
            {detailService.images && detailService.images.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {detailService.images.map((image, index) => (
                    <CarouselItem key={image.id || index}>
                      <div className="p-1">
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={`${detailService.name} - Imagen ${index + 1}`}
                          width={400}
                          height={256}
                          className="w-full h-48 sm:h-64 object-cover rounded-lg"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Mostrar controles solo si hay múltiples imágenes */}
                {detailService.images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-2 h-8 w-8 sm:h-10 sm:w-10" />
                    <CarouselNext className="right-2 h-8 w-8 sm:h-10 sm:w-10" />
                  </>
                )}

                {/* Indicadores de posición */}
                {detailService.images.length > 1 && (
                  <div className="flex justify-center gap-1 mt-2">
                    {detailService.images.map((_, index) => (
                      <div
                        key={index}
                        className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30"
                      />
                    ))}
                  </div>
                )}
              </Carousel>
            ) : (
              // Placeholder cuando no hay imágenes
              <div className="w-full h-48 sm:h-64 bg-muted rounded-lg flex items-center justify-center">
                <Image
                  src="/placeholder.svg"
                  alt="Sin imágenes"
                  width={200}
                  height={150}
                  className="opacity-50"
                />
              </div>
            )}

            {/* Información del servicio */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                {detailService.name}
              </h2>

              <div className="flex sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{detailService.duration} min</span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="font-semibold">
                    {detailService.price} USD
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="font-semibold">
                    {detailService.price * usdValue} cup
                  </span>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs sm:text-sm w-fit">
                {categories?.find((c) => c.id === detailService.category_id)
                  ?.name || detailService.category_id}
              </Badge>
            </div>
          </div>

          {/* Columna derecha - Detalles y acción */}
          <div className="space-y-4 sm:space-y-6">
            {/* Descripción */}
            <div>
              <h3 className="text-lg font-semibold mb-2 sm:mb-3">
                Descripción
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {detailService.detailedDescription || detailService.description}
              </p>
            </div>

            {/* Beneficios */}
            {detailService.benefits && detailService.benefits.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 sm:mb-3">
                  Beneficios
                </h3>
                <ul className="space-y-2">
                  {detailService.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preparación */}
            {detailService.preparation &&
              detailService.preparation.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 sm:mb-3">
                    Preparación
                  </h3>
                  <ul className="space-y-2">
                    {detailService.preparation.map((prep, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-muted-foreground">
                          {prep}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Botón de acción */}
            <Button
              onClick={() => {
                handleServiceAction(detailService);
                setDetailService(null);
              }}
              className={`w-full text-sm sm:text-base py-3 sm:py-4 ${
                mode === "selection" &&
                state.selectedServices.some((s) => s.id === detailService.id)
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-sage-600 hover:bg-sage-700"
              } text-white rounded-md transition-colors font-medium`}
              size="lg"
            >
              {mode === "selection"
                ? state.selectedServices.some((s) => s.id === detailService.id)
                  ? "Quitar del Carrito"
                  : "Agregar al Carrito"
                : "Reservar Este Servicio"}
            </Button>
          </div>
        </div>
      </div>
    );
  }


  // Vista principal de lista de servicios
  return (
    <div className="relative space-y-6 mt-10">
      {/* Búsqueda y Filtros */}
      {(showSearch || showFilters) && (
        <div className="space-y-4">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar servicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
          )}

          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-2 p-1">
              {showFilters && (
                <>
                  <Button
                    className={
                      selectedCategory.name === "Todos"
                        ? "bg-sage-600 hover:bg-sage-700 text-white px-5 py-2 rounded-md transition-colors flex-shrink-0"
                        : "bg-white hover:bg-slate-50 text-black px-5 py-2 rounded-md transition-colors flex-shrink-0"
                    }
                    key="todos"
                    variant={
                      selectedCategory.name === "Todos" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setSelectedCategory({ id: "todos", name: "Todos" })
                    }
                  >
                    Todos
                  </Button>
                  {categories?.map((category) => (
                    <Button
                      key={category.id}
                      className={
                        selectedCategory.id === category.id
                          ? "bg-sage-600 hover:bg-sage-700 text-white px-5 py-2 rounded-md transition-colors flex-shrink-0"
                          : "bg-white hover:bg-slate-50 text-black px-5 py-2 rounded-md transition-colors flex-shrink-0"
                      }
                      variant={
                        selectedCategory.id === category.id
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </>
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}

      {/* Grid de Servicios */}
      <div className="grid gap-2 lg:gap-4 grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => {
          const isSelected =
            mode === "selection"
              ? state.selectedServices.some((s) => s.id === service.id)
              : false;

          return (
            <Card
              key={service.id}
              className={`transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-primary bg-primary/5" : ""
              } w-full max-w-sm mx-auto`} // Added responsive width constraints
            >
              <div className="relative">
                <Image
                  src={service.images?.[0]?.url || "/placeholder.svg"}
                  alt={service.name}
                  width={280} // Reduced for mobile
                  height={160} // Reduced height for mobile
                  className="w-full h-40 sm:h-48 object-cover rounded-t-lg" // Responsive height
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4" />{" "}
                    {/* Responsive icon size */}
                  </div>
                )}
                <Badge
                  className="absolute top-2 left-2 text-xs"
                  variant="secondary"
                >
                  {" "}
                  {categories?.find((c) => c.id === service.category_id)?.name ||
                    service.category_id}
                </Badge>
              </div>

              <CardHeader className="pb-2 px-4 sm:px-6">
                {" "}
                {/* Reduced padding for mobile */}
                <CardTitle className="text-base sm:text-lg leading-tight">
                  {" "}
                  {/* Responsive text */}
                  {service.name}
                </CardTitle>
                <CardDescription className="hidden md:flex md:text-xs  md:line-clamp-2 md:mt-1">
                  {" "}
                  {/* Smaller text */}
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 space-y-3 px-4 sm:px-6 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5 text-xs sm:text-sm">
                    {/* Precio CUP (destacado) */}
                    <div className="flex items-center gap-1 bg-gray-400 text-white px-2 py-1.5 rounded-lg">
                      <DollarSign className="h-3 w-3 flex-shrink-0" />
                      <span className="font-semibold">
                        {(service.price * usdValue).toLocaleString()} CUP
                      </span>
                    </div>

                    {/* Precio USD */}
                    <div className="flex items-center gap-1 bg-muted/40 px-1 py-1.5 rounded-lg">
                      <DollarSign className="h-3 w-3 flex-shrink-0" />
                      <span>{service.price} USD</span>
                    </div>

                    {/* Duración */}
                    <div className="hidden md:flex items-center gap-1 bg-muted/40 px-2 py-1.5 rounded-lg">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <span>{service.duration} min</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  {" "}
                  {/* Stack vertically on mobile */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDetailService(service)}
                    className="flex-1 text-xs sm:text-sm py-1.5" // Smaller padding and text
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Ver Detalles
                  </Button>
                  <Button
                    variant={isSelected ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleServiceAction(service)}
                    className={`text-xs sm:text-sm py-1.5 ${
                      isSelected
                        ? "bg-red-500 hover:bg-red-400"
                        : "bg-sage-600 hover:bg-sage-500"
                    } text-white`}
                  >
                    {isSelected
                      ? "Quitar"
                      : mode === "selection"
                        ? "Agregar"
                        : "Reservar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No se encontraron servicios que coincidan con tu búsqueda.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory({ id: "todos", name: "Todos" });
            }}
            className="mt-4"
          >
            Limpiar Filtros
          </Button>
        </div>
      )}

      {/* Resumen de servicios seleccionados (solo en modo selección) */}
      {mode === "selection" && state.selectedServices.length > 0 && (
        <Card className=" bottom-0 z-10 fixed">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Servicios Seleccionados</h3>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {state.selectedServices.map((service) => (
                    <Badge key={service.id} variant="secondary">
                      {service.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">
                  Duración Total: {state.totalDuration} min
                </div>
                <div className="flex text-sm font-semibold">
                  Total: $ {state.totalPrice} USD - $
                  {state.totalPrice * usdValue} cup
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {/* Botón de acción (solo en modo selección) */}
            {mode === "selection" && (
              <div className="flex justify-end">
                <Button
                  className="bg-sage-600 hover:bg-sage-500 text-white px-5 py-2 rounded-md transition-colors"
                  onClick={handleNext}
                  disabled={state.selectedServices.length === 0}
                  size="lg"
                >
                  Continuar a Fecha y Hora
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
