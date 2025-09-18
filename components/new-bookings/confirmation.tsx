"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, CalendarIcon, Clock, User, Mail, Phone, MessageSquare, Loader2 } from "lucide-react"
// import { useBooking } from "./booking-context"
import { v4 as uuidv4 } from "uuid";
// import prisma from "@/lib/prisma"
import { useEnhancedBooking } from "./enhanced-booking-context"
import { createAppointment } from "@/lib/actions/appointment.actions"


interface ConfirmationProps {
  onViewChange: (view: string) => void;
}


export function Confirmation({onViewChange}:ConfirmationProps) {
  const { state, dispatch } = useEnhancedBooking()
  const [isConfirmed, setIsConfirmed] = useState(false)
  
const handleConfirmBooking = async () => {
  
  dispatch({ type: "SET_LOADING", payload: true });
  
  try {
    // Validaciones previas
    if (!state.selectedDate || !state.selectedTime || !state.userInfo.id) {
      throw new Error("Faltan datos requeridos para la reserva");
    }

    // Calcular fecha y hora final
    const startDateTime = new Date(state.selectedDate);
    const [hours, minutes] = state.selectedTime.split(":").map(Number);
    startDateTime.setHours(hours, minutes, 0, 0);
    
    const totalDuration = state.selectedServices.reduce(
      (total, service) => total + service.duration, 0
    );
    
    const endDateTime = new Date(startDateTime.getTime() + totalDuration * 60000);
    
    // Generar CUID único para la cita
    const appointmentCuid = uuidv4();

    const data = {
        cuid: appointmentCuid,
        date: startDateTime,
        endDate: endDateTime,
        duration: totalDuration,
        total_price: state.selectedServices.reduce(
          (total, service) => total + service.price, 0
        ),
        user_id: state.userInfo.id,
        services: {
          create: state.selectedServices.map(service => ({
            service_id: service.id,
            quantity: 1
          }))
        }
      }

    await createAppointment(data)

    
    
    
    setIsConfirmed(true);
  } catch (error) {
    console.error("Error al confirmar reserva:", error);
    dispatch({ 
      type: "SET_ERROR", 
      payload: error instanceof Error 
        ? error.message 
        : "Error al confirmar la reserva. Por favor intenta de nuevo." 
    });
  } finally {
    dispatch({ type: "SET_LOADING", payload: false });
  }
};

  const handleBack = () => {
    dispatch({ type: "SET_STEP", payload: 3 })
  }

  const handleNewBooking = () => {
    dispatch({ type: "RESET_BOOKING" })
    setIsConfirmed(true)
  }
    const handleMysBookings = () => {
    dispatch({ type: "RESET_BOOKING" })
   onViewChange("bookings")
    setIsConfirmed(true)
  }
  

  if (isConfirmed) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-4">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">¡Reserva Confirmada!</h2>
          <p className="text-muted-foreground">
            Tu cita ha sido reservada exitosamente. Hemos enviado un correo de confirmación a {state.userInfo.email}.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg">Detalles de la Cita</h3>
                <p className="text-sm text-muted-foreground">
                  Referencia de Reserva: #BK{Date.now().toString().slice(-6)}
                </p>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{state.selectedDate?.toLocaleDateString("es-ES")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{state.selectedTime}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    <span>{state.userInfo.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>{state.userInfo.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button onClick={handleNewBooking}>Reservar Otra Cita</Button>
          <Button variant="outline" onClick={handleMysBookings}>Ver Mis Reservas</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Revisar tu Reserva</h2>
        <p className="text-muted-foreground">Por favor revisa todos los detalles antes de confirmar tu cita</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Detalles de la Cita
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Servicios Seleccionados</h4>
                <div className="space-y-2">
                  {state.selectedServices.map((service) => (
                    <div key={service.id} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">{service.duration} min</p>
                      </div>
                      <p className="font-medium">${service.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Fecha y Hora</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">{state.selectedDate?.toLocaleDateString("es-ES")}</Badge>
                    <Badge variant="secondary">{state.selectedTime}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Duración Total</p>
                  <p className="font-medium">{state.totalDuration} min</p>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Monto Total</span>
                <span>${state.totalPrice}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información de Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{state.userInfo.name}</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{state.userInfo.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{state.userInfo.phone}</span>
              </div>

              {state.userInfo.notes && (
                <>
                  <Separator />
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Solicitudes Especiales</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">{state.userInfo.notes}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {state.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Al confirmar esta reserva, aceptas nuestra política de cancelación. Puedes cancelar o reprogramar hasta 24
          horas antes de tu cita.
        </AlertDescription>
      </Alert>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={state.isLoading}>
          Volver a Detalles
        </Button>
        <Button onClick={handleConfirmBooking} disabled={state.isLoading} size="lg"
         className="bg-sage-600 hover:bg-sage-700"
        >
          {state.isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Confirmando...
            </>
          ) : (
            "Confirmar Reserva"
          )}
        </Button>
      </div>
    </div>
  )
}
