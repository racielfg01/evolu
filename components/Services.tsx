"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import type { ServiceWithRelations } from "@/lib/actions/services.actions";

interface ServicesProps {
  services: ServiceWithRelations[] | null;
  onViewServices: () => void;
}

export default function Services({ services, onViewServices }: ServicesProps) {
  const featuredServices = (services ?? [])
    .filter((service) => service.isActive)
    .slice(0, 4);

  return (
    <section id="servicios" className="py-16 md:py-24 bg-sage-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-sage-900 mb-4">
            Los más Pedidos
          </h2>
          <p className="text-sage-700 max-w-2xl mx-auto">
            ¿No sabes por dónde empezar? Estos son los servicios que más
            eligen nuestros clientes.
          </p>
        </div>

        {featuredServices.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredServices.map((service) => {
              const cover = service.images?.[0]?.url || "/placeholder.svg";

              return (
                <Card
                  key={service.id}
                  className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 w-full bg-muted">
                    <Image
                      src={cover}
                      alt={service.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>

                  <CardHeader className="flex-1">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {service.duration} min
                      </span>
                      <span className="font-semibold text-sage-800">
                        {service.price} USD
                      </span>
                    </div>

                    <Button
                      className="w-full bg-sage-600 hover:bg-sage-700 text-white"
                      onClick={onViewServices}
                    >
                      Reservar
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-sage-700">
            Estamos actualizando el catálogo. Escríbenos por WhatsApp y te
            ayudamos a elegir tu tratamiento.
          </p>
        )}

        <div className="flex justify-center mt-8">
          <Button
            className="bg-sage-500 hover:bg-sage-700 text-white px-6 py-3 rounded-md transition-colors font-medium"
            onClick={onViewServices}
          >
            Ver Todos los Servicios
          </Button>
        </div>
      </div>
    </section>
  );
}
