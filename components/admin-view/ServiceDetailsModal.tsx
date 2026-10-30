"use client";

// components/admin-view/ServiceDetailsModal.tsx
// Vista de solo lectura con todos los datos e imágenes de un servicio.

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  ImageOff,
  Sparkles,
  Tag,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { ServiceWithRelations } from "@/lib/actions/services.actions";

interface ServiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceWithRelations | null;
  usdRate?: number;
}

export function ServiceDetailsModal({
  isOpen,
  onClose,
  service,
  usdRate = 0,
}: ServiceDetailsModalProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [failedImages, setFailedImages] = useState<string[]>([]);

  // Al abrir un servicio distinto, volver a la primera imagen.
  useEffect(() => {
    if (isOpen) {
      setActiveImage(0);
      setFailedImages([]);
    }
  }, [isOpen, service?.id]);

  const images = useMemo(
    () => (service?.images ?? []).filter((img) => img.url?.length > 0),
    [service]
  );

  if (!service) return null;

  const validImages = images.filter((img) => !failedImages.includes(img.id));
  const current = validImages[activeImage] ?? images[0] ?? null;
  const hasMultiple = validImages.length > 1;

  const markFailed = (id: string) => {
    setFailedImages((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setActiveImage(0);
  };

  const goPrev = () =>
    setActiveImage((prev) => (prev - 1 + validImages.length) % validImages.length);
  const goNext = () => setActiveImage((prev) => (prev + 1) % validImages.length);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2 pr-6">
            {service.name}
            {service.isActive ? (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                Activo
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                Inactivo
              </Badge>
            )}
            {service.category?.name && (
              <Badge variant="secondary" className="gap-1">
                <Tag className="h-3 w-3" />
                {service.category.name}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>{service.description}</DialogDescription>
        </DialogHeader>

        {/* Galería de imágenes */}
        <div className="space-y-2">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            {current ? (
              <>
                <Image
                  key={current.id}
                  src={current.url}
                  alt={`${service.name} - Imagen ${activeImage + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 640px"
                  className="object-contain sm:object-cover"
                  onError={() => markFailed(current.id)}
                />
                {hasMultiple && (
                  <>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={goPrev}
                      className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full opacity-90"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={goNext}
                      className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full opacity-90"
                      aria-label="Imagen siguiente"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
                      {activeImage + 1} / {validImages.length}
                    </span>
                  </>
                )}
              </>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <ImageOff className="h-8 w-8" />
                <span className="text-sm">
                  {images.length > 0
                    ? "No se pudieron cargar las imágenes"
                    : "Este servicio no tiene imágenes"}
                </span>
              </div>
            )}
          </div>

          {validImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {validImages.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition ${
                    index === activeImage
                      ? "border-primary"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`Ver imagen ${index + 1}`}
                >
                  <Image
                    src={image.url}
                    alt={`${service.name} - Miniatura ${index + 1}`}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                    onError={() => markFailed(image.id)}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Datos principales */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Precio</p>
            <p className="text-sm font-semibold">
              ${service.price.toFixed(2)}
              {usdRate > 0 && (
                <span className="block text-xs font-normal text-muted-foreground">
                  {(service.price * usdRate).toLocaleString()} CUP
                </span>
              )}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" /> Duración
            </p>
            <p className="text-sm font-semibold">{service.duration} min</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Tag className="h-3 w-3" /> Categoría
            </p>
            <p className="text-sm font-semibold">
              {service.category?.name || "Sin categoría"}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3" /> Creado
            </p>
            <p className="text-sm font-semibold">
              {format(new Date(service.createdAt), "dd/MM/yyyy", { locale: es })}
            </p>
          </div>
        </div>

        {service.detailedDescription && (
          <section className="space-y-1">
            <h3 className="text-sm font-semibold">Descripción detallada</h3>
            <p className="whitespace-pre-line text-sm text-muted-foreground">
              {service.detailedDescription}
            </p>
          </section>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <section className="space-y-1">
            <h3 className="flex items-center gap-1 text-sm font-semibold">
              <Sparkles className="h-4 w-4" /> Beneficios
            </h3>
            {service.benefits?.length ? (
              <ul className="space-y-1">
                {service.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Sin beneficios registrados</p>
            )}
          </section>

          <section className="space-y-1">
            <h3 className="text-sm font-semibold">Preparación</h3>
            {service.preparation?.length ? (
              <ul className="space-y-1">
                {service.preparation.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Sin indicaciones de preparación
              </p>
            )}
          </section>
        </div>

        <Separator />

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            Actualizado:{" "}
            {format(new Date(service.updatedAt), "dd/MM/yyyy HH:mm", { locale: es })}
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ServiceDetailsModal;
