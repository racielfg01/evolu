"use client"

import { Check } from "lucide-react"
import { useBooking } from "./booking-context"

const steps = [
  { number: 1, title: "Servicios", description: "Seleccionar servicios" },
  { number: 2, title: "Fecha y Hora", description: "Elegir cita" },
  { number: 3, title: "Detalles", description: "Tu información" },
  { number: 4, title: "Confirmar", description: "Revisar y confirmar" },
]

export function ProgressIndicator() {
  const { state } = useBooking()

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = state.currentStep > step.number
          const isCurrent = state.currentStep === step.number
          // const isUpcoming = state.currentStep < step.number

          return (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                    ${
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isCurrent
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                          : "bg-muted text-muted-foreground"
                    }
                  `}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : step.number}
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-sm font-medium ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground hidden sm:block">{step.description}</div>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-4 mt-[-20px]
                    ${isCompleted ? "bg-primary" : "bg-muted"}
                  `}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
