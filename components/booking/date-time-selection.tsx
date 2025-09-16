"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock } from "lucide-react"
import { useBooking, type TimeSlot } from "./booking-context"

// Función simulada para generar horarios disponibles para una fecha dada
const getAvailableTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = []
  const startHour = 9
  const endHour = 18
  const slotDuration = 30 // slots de 30 minutos

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      // Simular algunos horarios no disponibles
      const available = Math.random() > 0.3
      slots.push({ time, available })
    }
  }

  return slots
}

export function DateTimeSelection() {
  const { state, dispatch } = useBooking()
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      dispatch({ type: "SET_DATE", payload: date })
      const slots = getAvailableTimeSlots()
      setAvailableSlots(slots)
    }
  }

  const handleTimeSelect = (time: string) => {
    dispatch({ type: "SET_TIME", payload: time })
  }

  const handleNext = () => {
    if (state.selectedDate && state.selectedTime) {
      dispatch({ type: "SET_STEP", payload: 3 })
    }
  }

  const handleBack = () => {
    dispatch({ type: "SET_STEP", payload: 1 })
  }

  const getTotalDuration = () => {
    return state.selectedServices.reduce((total, service) => total + service.duration, 0)
  }

  // Deshabilitar fechas pasadas y fines de semana para la demo
  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dayOfWeek = date.getDay()
    return date < today || dayOfWeek === 0 || dayOfWeek === 6
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Seleccionar Fecha y Hora</h2>
        <p className="text-muted-foreground">Elige tu fecha y hora preferida para la cita</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Seleccionar Fecha
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={state.selectedDate || undefined}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              className="rounded-md border"
            />
            <div className="mt-4 text-sm text-muted-foreground">
              <p>• Citas disponibles de Lunes a Viernes</p>
              <p>• Citas de fin de semana próximamente</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Seleccionar Hora
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!state.selectedDate ? (
              <div className="text-center py-8 text-muted-foreground">Por favor selecciona una fecha primero</div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">Duración estimada: {getTotalDuration()} minutos</div>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={state.selectedTime === slot.time ? "default" : "outline"}
                      size="sm"
                      disabled={!slot.available}
                      onClick={() => handleTimeSelect(slot.time)}
                      className="text-xs"
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">Los horarios grises no están disponibles</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {state.selectedDate && state.selectedTime && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Cita Seleccionada</h3>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">{state.selectedDate.toLocaleDateString("es-ES")}</Badge>
                  <Badge variant="secondary">{state.selectedTime}</Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Duración: {getTotalDuration()} min</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Volver a Servicios
        </Button>
        <Button onClick={handleNext} disabled={!state.selectedDate || !state.selectedTime}>
          Continuar a Detalles
        </Button>
      </div>
    </div>
  )
}
