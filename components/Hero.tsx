import Image from "next/image";
import React from "react";
import img1 from "@/assest/INjLRUqf.png";
// import Link from "next/link";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
// import { Calendar, Sparkles } from "lucide-react";

interface HeroProps {
  // onBookNow: () => void;
  onViewServices: () => void;
}

export default function Hero({  onViewServices }: HeroProps) {
  return (
    <section className=" relative bg-sage-100 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <svg
          className="h-full w-full"
          viewBox="0 0 800 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#6B8E6B"
            d="M435.5,262Q417,324,376,370.5Q335,417,272.5,434.5Q210,452,166,396Q122,340,101.5,270Q81,200,136.5,146.5Q192,93,262,91.5Q332,90,386,130Q440,170,447,235Q454,300,435.5,262Z"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10 mt-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
              <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-sage-400 to-sage-800 bg-clip-text text-transparent ">
            Evolu
          </h1>
           <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-sage-900 leading-tight">
             Centro de Bienestar Integral Holístico
        
            </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {/* Experimenta la belleza y el bienestar en su máxima expresión. Nuestros tratamientos profesionales te
            ayudarán a lucir y sentirte increíble. */}
            El lugar donde siempre querrás regresar, porque siempre regresas donde fuiste feliz.
          </p>
        </div>
        
           

            <div className="flex flex-col sm:flex-row gap-2 justify-start">
              {/* <Button
                size="lg"
                onClick={onBookNow}
                className="text-lg px-6 bg-sage-600 hover:bg-sage-700 text-white py-3 rounded-md transition-colors font-medium"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Reservar Cita
              </Button> */}
              <Button
                size="lg"
                // variant="outline"
                onClick={onViewServices}
                             className="text-lg px-6 bg-sage-600 hover:bg-sage-700 text-white py-3 rounded-md transition-colors font-medium"

              >
                <Sparkles className="mr-2 h-5 w-5" />
                Ver Servicios
              </Button>
            </div>
          </div>
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full bg-sage-500 overflow-hidden"
              style={{ clipPath: "circle(70% at 70% 90%)" }}
            ></div>
            <Image
              src={img1 ? img1 : "/placeholder.svg?height=600&width=600"}
              width={600}
              height={600}
              alt="Woman in spa robe relaxing"
              className="relative z-10 mx-auto "
              style={{ clipPath: "circle(50% at 50% 50%)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
