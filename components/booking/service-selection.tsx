"use client"

import { Check, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useBooking, type Service } from "./booking-context"

// Datos simulados para servicios disponibles
const availableServices: Service[] = [
  {
    id: "1",
    name: "Facial Clásico",
    description: "Limpieza profunda facial con extracción y tratamiento hidratante",
    duration: 60,
    price: 85,
  },
  {
    id: "2",
    name: "Facial Hidratante",
    description: "Tratamiento intensivo de hidratación para piel seca y sensible",
    duration: 75,
    price: 95,
  },
  {
    id: "3",
    name: "Facial Anti-Edad",
    description: "Tratamiento avanzado para líneas finas y arrugas",
    duration: 90,
    price: 120,
  },
  {
    id: "4",
    name: "Depilación de Cejas",
    description: "Depilación profesional y diseño de cejas con hilo",
    duration: 30,
    price: 35,
  },
  {
    id: "5",
    name: "Extensiones de Pestañas",
    description: "Set completo de extensiones individuales de pestañas premium",
    duration: 120,
    price: 150,
  },
  {
    id: "6",
    name: "Manicura",
    description: "Cuidado completo de uñas con aplicación de esmalte",
    duration: 45,
    price: 45,
  },
  {
    id: "7",
    name: "Pedicura",
    description: "Tratamiento relajante de pies con cuidado de uñas y masaje",
    duration: 60,
    price: 55,
  },
  {
    id: "8",
    name: "Masaje de Tejido Profundo",
    description: "Masaje terapéutico para tensión muscular y nudos",
    duration: 60,
    price: 90,
  },
]

export function ServiceSelection() {
  const { state, dispatch } = useBooking()

  const handleServiceToggle = (service: Service) => {
    const isSelected = state.selectedServices.some((s) => s.id === service.id)

    if (isSelected) {
      dispatch({ type: "REMOVE_SERVICE", payload: service.id })
    } else {
      dispatch({ type: "ADD_SERVICE", payload: service })
    }
  }

  const getTotalDuration = () => {
    return state.selectedServices.reduce((total, service) => total + service.duration, 0)
  }

  const getTotalPrice = () => {
    return state.selectedServices.reduce((total, service) => total + service.price, 0)
  }

  const handleNext = () => {
    if (state.selectedServices.length > 0) {
      dispatch({ type: "SET_STEP", payload: 2 })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Selecciona Tus Servicios</h2>
        <p className="text-muted-foreground">Elige uno o más servicios de belleza para tu cita</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {availableServices.map((service) => {
          const isSelected = state.selectedServices.some((s) => s.id === service.id)

          return (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-primary bg-primary/5" : ""
              }`}
              onClick={() => handleServiceToggle(service)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  {isSelected && (
                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <CardDescription className="text-sm">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
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
              </CardContent>
            </Card>
          )
        })}
      </div>

      {state.selectedServices.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Servicios Seleccionados</h3>
                <div className="flex gap-2 mt-2">
                  {state.selectedServices.map((service) => (
                    <Badge key={service.id} variant="secondary">
                      {service.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Duración Total: {getTotalDuration()} min</div>
                <div className="text-lg font-semibold">Total: ${getTotalPrice()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={state.selectedServices.length === 0} size="lg">
          Continuar a Fecha y Hora
        </Button>
      </div>
    </div>
  )
}
