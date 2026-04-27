"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import avatar1 from "@/assest/avatars/avatar1.jpeg";
import avatar2 from "@/assest/avatars/av3.jpg";
import avatar4 from "@/assest/avatars/cere.jpeg";

const testimonials = [
  {
    id: 1,
    name: "Julio Robinson",
    role: "Cliente Regular",
    image: avatar1,
    quote:
      "¡Mi sesión de spa del fin de semana fue una delicia absoluta! La atención al detalle y el cuidado personalizado del personal crearon una experiencia verdaderamente rejuvenecedora. Desde el ambiente relajante hasta los terapeutas expertos, todo fue perfecto.",
  },
  {
    id: 2,
    name: "Daniela Fernandez",
    role: "Visitante por Primera Vez",
    image:avatar2,
    quote:
      "Como alguien que rara vez se da el lujo de disfrutar días de spa, quedé impresionado por el nivel de servicio. El terapeuta de masajes escuchó mis preocupaciones y personalizó el tratamiento a la perfección. ¡Definitivamente volveré!",
  },
  {
    id: 3,
    name: "Cerelda Coromidas",
    role: "Miembro Mensual",
    // image: "/placeholder.svg?height=80&width=80",
    image: avatar4,
    quote:
      "He sido miembro durante más de un año, y la calidad del servicio nunca ha disminuido. Los faciales son excepcionales, y siempre salgo sintiéndome renovada y radiante. Este spa se ha convertido en mi ritual esencial de cuidado personal.",
  },
]

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((current + 1) % testimonials.length)
  },[current])

  const prev = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      next()
    }, 8000)

    return () => clearInterval(interval)
  }, [current, next])

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
              <div className="bg-sage-50 rounded-lg p-8 shadow-sm relative">
                <Quote className="absolute top-6 left-6 text-sage-200 w-12 h-12 opacity-30" />
                <div className="text-center space-y-6">
                  <p className="text-sage-700 italic relative z-10 text-lg">&quot;{testimonial.quote}&quot;</p>
                  <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mb-3">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h4 className="font-semibold text-sage-800">{testimonial.name}</h4>
                    <p className="text-sage-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md text-sage-700 hover:text-sage-900 focus:outline-none"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md text-sage-700 hover:text-sage-900 focus:outline-none"
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index === current ? "bg-sage-600" : "bg-sage-300"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

