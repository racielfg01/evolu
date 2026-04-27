"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { mockServices } from "@/lib/mock-data";
import Image from "next/image";

interface ServicesProps {
  // onBookNow: () => void;
  onViewServices: () => void;
}

export default function Services({  onViewServices}: ServicesProps) {


  const featuredServices = mockServices.filter((s) => s.isActive).slice(0, 4);
  return (
    <>
    
      {/* Featured Services */}
      <section className="py-16 md:py-24 bg-sage-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-sage-900 mb-4">
              Los más Pedidos
            </h2>
            <p className="text-sage-700 max-w-2xl mx-auto">
        ¿No sabes por donde empezar?. Entonces prueba los más pedidos de Evolu
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {featuredServices.map((service) => (
              <Card
                key={service.id}
                className="overflow-hidden hover:shadow-lg transition-transform hover:scale-105"
              >
                <div className="relative">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    className="w-full h-48 object-cover"
                    height={300}
                    width={400}
                  />
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    Popular
                  </Badge>
                </div>

                <CardHeader>
                  <CardTitle className="text-lg">{service.name}</CardTitle>

                  <div className="text-sm text-muted-foreground h-[72px]">
                    <p className="line-clamp-3 mb-2">{service.description}</p>
                    {service.description.length > 50 && (
                      <Link
                        href="#"
                        onClick={onViewServices}
                        className="text-sage-600 hover:text-sage-700 text-xs font-medium"
                    
                      >
                        Leer más
                      </Link>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration} min</span>
                    </div>
                    {/* <span className="text-lg font-semibold">
                      ${service.price}
                    </span> */}
                  </div>

                  {/* <Button
                    className="w-full bg-sage-600 hover:bg-sage-700 text-white px-6 py-3 rounded-md transition-colors font-medium"
                    onClick={handleOnBook}
                  >
                    Reservar Ahora
                  </Button> */}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            {/* <Link href={"/services"}> */}
            <Button
              className="bg-sage-500 hover:bg-sage-700 text-white px-6 py-3 rounded-md transition-colors font-medium"
              onClick={onViewServices}
            >
              Ver Todos los Servicios
            </Button>
             {/* </Link> */}
          </div>
        </div>
      </section>
    </>
  );
}
