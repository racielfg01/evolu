
"use client"

import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, Loader2 } from "lucide-react"
import { useEnhancedBooking } from "./enhanced-booking-context"
import { useAvailableSlots } from "@/hooks/use-availability"
import { useEffect } from "react"

export function DateTimeSelection() {
  const { state, dispatch } = useEnhancedBooking();
  
  const { data: availableSlots, isLoading, error } = useAvailableSlots(
    state.selectedServices, 
    state.selectedDate
  );



  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      dispatch({ type: "SET_DATE", payload: date });
      // Resetear la hora seleccionada y las fechas al cambiar de fecha
      dispatch({ type: "SET_TIME", payload: null });
      dispatch({ type: "SET_START_DATE_TIME", payload: null });
      dispatch({ type: "SET_END_DATE_TIME", payload: null });
    }
  };

  const handleTimeSelect = (time: string) => {
    dispatch({ type: "SET_TIME", payload: time });
  };

  const handleNext = () => {
    if (state.selectedDate && state.selectedTime && state.selectedStartDateTime && state.selectedEndDateTime) {
      dispatch({ type: "SET_STEP", payload: 3 });
    }
  };

  const handleBack = () => {
    dispatch({ type: "SET_STEP", payload: 1 });
  };

  const getTotalDuration = () => {
    return state.selectedServices.reduce((total, service) => total + service.duration, 0);
  };

  // Deshabilitar fechas pasadas y fines de semana
  // const isDateDisabled = (date: Date) => {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);
  //   const dayOfWeek = date.getDay();
  //   return date < today || dayOfWeek === 0 || dayOfWeek === 6;
  // };
     const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calcular inicio de la próxima semana (próximo lunes)
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + ((7 - today.getDay() + 1) % 7 || 7));
    
    // Calcular fin de la próxima semana (próximo domingo)
    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);

    return date < nextMonday || date > nextSunday;
  };

  // Formatear fecha en español
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Formatear hora completa
  const formatDateTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

    // Efecto para calcular las fechas de inicio y fin cuando se selecciona hora
  useEffect(() => {
    if (state.selectedDate && state.selectedTime) {
      // Calcular fecha y hora de inicio
      const startDateTime = new Date(state.selectedDate);
      const [hours, minutes] = state.selectedTime.split(":").map(Number);
      startDateTime.setHours(hours, minutes, 0, 0);
      
      // Calcular fecha y hora de fin
      // const totalDuration = getTotalDuration();
      const endDateTime = new Date(startDateTime.getTime() + state.totalDuration * 60000);
      
      dispatch({ type: "SET_START_DATE_TIME", payload: startDateTime });
      dispatch({ type: "SET_END_DATE_TIME", payload: endDateTime });
    }
  }, [state.selectedDate, state.selectedTime, state.selectedServices, state.totalDuration, dispatch]);




  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Seleccionar Fecha y Hora</h2>
        <p className="text-muted-foreground">Elige tu fecha y hora preferida para la cita</p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Seleccionar Fecha
            </CardTitle>
          </CardHeader>
          <CardContent >
            <Calendar
              mode="single"
              selected={state.selectedDate || undefined}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              className="rounded-md border w-full"
          
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
              <div className="text-center py-8 text-muted-foreground">
                Por favor selecciona una fecha primero
              </div>
            ) : state.selectedServices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Primero selecciona al menos un servicio
              </div>
            ) : isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Buscando horarios disponibles...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">
                <p>Error al cargar horarios disponibles</p>
                <p className="text-sm">{error.message}</p>
              </div>
            ) : availableSlots && availableSlots.length > 0 ? (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Duración estimada: {getTotalDuration()} minutos
                </div>
                <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={state.selectedTime === slot.time ? "default" : "outline"}
                      size="sm"
                      disabled={!slot.available}
                      onClick={() => handleTimeSelect(slot.time)}
                      className={`text-xs text-black h-10 ${state.selectedTime === slot.time ?' bg-sage-300 hover:bg-sage-400':" bg-sage-100 hover:bg-sage-200"}`}
                    >
                      {slot.time}
                    </Button>
                  ))}   
                </div>
                <div className="text-xs text-muted-foreground">
                  {availableSlots.filter(slot => slot.available).length} horarios disponibles de {availableSlots.length}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No hay horarios disponibles para esta fecha
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      

      {state.selectedDate && state.selectedTime && state.selectedStartDateTime && state.selectedEndDateTime && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Cita Seleccionada</h3>
                <div className="space-y-2 mt-2">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">
                      {formatDate(state.selectedDate)}
                    </Badge>
                    <Badge variant="secondary">
                      {state.selectedTime}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Inicio: {formatDateTime(state.selectedStartDateTime)}</p>
                    <p>Fin: {formatDateTime(state.selectedEndDateTime)}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  Duración: {getTotalDuration()} min
                </div>
                <div className="text-sm font-semibold">
                  {state.selectedServices.length} servicio(s)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Volver a Servicios
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={!state.selectedDate || !state.selectedTime || !state.selectedStartDateTime || !state.selectedEndDateTime}
          className="bg-sage-600 hover:bg-sage-700"
        >
          Continuar a Detalles
        </Button>
      </div>
    </div>
  );
}

