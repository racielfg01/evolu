"use client";

import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "¿Cómo reservo una cita?",
    answer:
      "Elige los servicios, la fecha y la hora, y confirma. Si es tu primera vez, creas tu cuenta en el mismo proceso.",
  },
  {
    question: "¿Necesito una cuenta para reservar?",
    answer:
      "Sí. Con tu cuenta reservas y desde Mis citas consultas, cancelas o revisas el estado de tus reservas.",
  },
  {
    question: "¿Puedo cancelar o cambiar mi cita?",
    answer:
      "Puedes cancelar desde Mis citas. Si necesitas mover la fecha o la hora, escríbenos por WhatsApp y lo ajustamos contigo.",
  },
  {
    question: "¿Cuál es el horario de atención?",
    answer:
      "Lunes a viernes de 9:00 a 16:00 y sábados de 8:00 a 12:00.",
  },
  {
    question: "¿Qué incluye cada servicio?",
    answer:
      "Cada ficha muestra la duración, el precio y las recomendaciones de preparación. Si tienes dudas antes de reservar, escríbenos.",
  },
  {
    question: "¿Cómo los contacto?",
    answer: "Por WhatsApp al +53 59088538.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="py-16 md:py-24 bg-sage-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-sage-900 mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-sage-700">
            Lo que más nos preguntan antes de la primera cita.
          </p>
        </div>

        <div className="divide-y rounded-lg border bg-white">
          {faqs.map((faq) => (
            <details key={faq.question} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-sage-900 [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sage-700">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
