"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface FinalCtaProps {
  onViewServices: () => void;
}

export default function FinalCta({ onViewServices }: FinalCtaProps) {
  return (
    <section className="py-20 md:py-28 bg-sage-600">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Tu próxima cita empieza aquí
        </h2>
        <p className="text-sage-100 mb-8">
          Elige el tratamiento, la fecha y la hora. Nosotros nos encargamos del
          resto.
        </p>
        <Button
          size="lg"
          onClick={onViewServices}
          className="bg-white text-sage-800 hover:bg-sage-100 text-lg px-8 py-3"
        >
          <Calendar className="mr-2 h-5 w-5" />
          Reservar cita
        </Button>
      </div>
    </section>
  );
}
