"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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

interface UnifiedServicesComponentProps {
  mode: "catalog" | "selection";
  onServiceSelect?: (service: ServiceWithRelations) => void;
  onBookNow?: () => void;
  services: ServiceWithRelations[];
  isLoadingService: boolean;
  errorServices: Error | null;
  categories: { name: string; id: string }[];
  isLoadingCategories: boolean;
  errorCategories: Error | null;
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
  title,
  description,
  showFilters = true,
  showSearch = true,
}: UnifiedServicesComponentProps) {
  const { push } = useRouter();
  const { state, dispatch } = useEnhancedBooking();
  const [selectedCategory, setSelectedCategory] = useState({
    id: "todos",
    name: "Todos",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [detailService, setDetailService] =
    useState<ServiceWithRelations | null>(null);

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
  if (isLoadingService || isLoadingCategories) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando servicios...</p>
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
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDetailService(null)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {mode === "selection" ? "Volver" : "Volver al Catálogo"}
          </Button>
          <h2 className="text-2xl font-bold">{detailService.name}</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <Image
              src={detailService.images?.[0]?.url || "/placeholder.svg"}
              alt={detailService.name}
              width={400}
              height={256}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{detailService.duration} min</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg font-semibold">
                  ${detailService.price}
                </span>
              </div>
              <Badge variant="secondary">
                {categories.find((c) => c.id === detailService.category_id)
                  ?.name || detailService.category_id}
              </Badge>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Descripción</h3>
              <p className="text-muted-foreground">
                {detailService.detailedDescription || detailService.description}
              </p>
            </div>

            {detailService.benefits && detailService.benefits.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Beneficios</h3>
                <ul className="space-y-1">
                  {detailService.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {detailService.preparation &&
              detailService.preparation.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Preparación</h3>
                  <ul className="space-y-1">
                    {detailService.preparation.map((prep, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {prep}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            <Button
              onClick={() => {
                handleServiceAction(detailService);
                setDetailService(null);
              }}
              className={`w-full ${
                mode === "selection" &&
                state.selectedServices.some((s) => s.id === detailService.id)
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-sage-600 hover:bg-sage-700"
              } text-white px-5 py-2 rounded-md transition-colors`}
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
    <div className="space-y-6 mt-10">
      {(title || description) && (
        <div className="text-center">
          {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}

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

          {showFilters && (
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                className={
                  selectedCategory.name === "Todos"
                    ? "bg-sage-600 hover:bg-sage-700 text-white px-5 py-2 rounded-md transition-colors"
                    : "bg-white hover:bg-slate-50 text-black px-5 py-2 rounded-md transition-colors"
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
              {categories.map((category) => (
                <Button
                  key={category.id}
                  className={
                    selectedCategory.id === category.id
                      ? "bg-sage-600 hover:bg-sage-700 text-white px-5 py-2 rounded-md transition-colors"
                      : "bg-white hover:bg-slate-50 text-black px-5 py-2 rounded-md transition-colors"
                  }
                  variant={
                    selectedCategory.id === category.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Grid de Servicios */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              }`}
            >
              <div className="relative">
                <Image
                  src={service.images?.[0]?.url || "/placeholder.svg"}
                  alt={service.name}
                  width={300}
                  height={192}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <Badge className="absolute top-2 left-2" variant="secondary">
                  {categories.find((c) => c.id === service.category_id)?.name ||
                    service.category_id}
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${service.price}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDetailService(service)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Detalles
                  </Button>
                  <Button
                    variant={isSelected ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleServiceAction(service)}
                    className={`flex px-5 py-2 rounded-md transition-colors ${
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
        <Card className="bg-muted/50">
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
                <div className="text-sm text-muted-foreground">
                  Duración Total: {state.totalDuration} min
                </div>
                <div className="text-lg font-semibold">
                  Total: ${state.totalPrice}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
    </div>
  );
}
