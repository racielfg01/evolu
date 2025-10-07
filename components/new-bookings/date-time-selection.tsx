"use client"

import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, Loader2 } from "lucide-react"
import { useEnhancedBooking } from "./enhanced-booking-context"
import { useAvailableSlots } from "@/hooks/use-availability"
import { useEffect, useState } from "react"
import { getDayAvailablePeriods } from "@/lib/actions/availability.actions"
import { es } from "date-fns/locale" 

export function DateTimeSelection() {
  const { state, dispatch } = useEnhancedBooking();
  
  const { data: availableSlots, isLoading, error } = useAvailableSlots(
    state.selectedServices, 
    state.selectedDate
  );

  // console.log('availableSlots',availableSlots)

  // CORRECCIÓN: Mejor validación de canProceed
  const isSlotSelected = state.selectedDate && state.selectedTime;
  const selectedSlot = availableSlots?.find(slot => slot.time === state.selectedTime);
  const isSelectedSlotAvailable = selectedSlot?.available || false;
  
  const canProceed = isSlotSelected && 
    state.selectedStartDateTime && 
    state.selectedEndDateTime &&
    isSelectedSlotAvailable;

  const [availablePeriods, setAvailablePeriods] = useState<string>('');

  useEffect(() => {
    if (state.selectedDate) {
      const loadAvailablePeriods = async () => {
        try {
          const periods = await getDayAvailablePeriods(state.selectedDate!);
          setAvailablePeriods(periods);
        } catch (error) {
          console.log(error)
          setAvailablePeriods('Error al cargar horarios');
        }
      };
      loadAvailablePeriods();
    } else {
      setAvailablePeriods('');
    }
  }, [state.selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      dispatch({ type: "SET_DATE", payload: date });
      dispatch({ type: "SET_TIME", payload: null });
      dispatch({ type: "SET_START_DATE_TIME", payload: null });
      dispatch({ type: "SET_END_DATE_TIME", payload: null });
    }
  };

  const handleTimeSelect = (time: string) => {
    dispatch({ type: "SET_TIME", payload: time });
  };

  const handleNext = () => {
    if (canProceed) {
      dispatch({ type: "SET_STEP", payload: 3 });
    }
  };

  const handleBack = () => {
    dispatch({ type: "SET_STEP", payload: 1 });
  };

  const getTotalDuration = () => {
    return state.selectedServices.reduce((total, service) => total + service.duration, 0);
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + ((7 - today.getDay() + 1) % 7 || 7));
    
    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);

    return date < nextMonday || date > nextSunday;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // NUEVA: Función para convertir hora 24h a formato AM/PM
  const formatTimeToAMPM = (time24: string): string => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convierte 0 a 12 para medianoche
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // MODIFICADA: Usar formato AM/PM
  const formatDateTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true // Forzar formato 12 horas
    });
  };

  useEffect(() => {
    if (state.selectedDate && state.selectedTime) {
      const startDateTime = new Date(state.selectedDate);
      const [hours, minutes] = state.selectedTime.split(":").map(Number);
      startDateTime.setHours(hours, minutes, 0, 0);
      
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
          <CardContent>
            <Calendar
              locale={es}
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
                {availablePeriods && (
                  <p className="text-xs text-blue-600 mt-2">
                    Periodos: {availablePeriods}
                  </p>
                )}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-destructive mb-2">
                  <p className="font-semibold">No hay disponibilidad</p>
                  <p className="text-sm mt-1">{error.message}</p>
                </div>
                <div className="text-xs text-muted-foreground mt-4 space-y-2">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <strong className="text-gray-700">Horarios del día:</strong>
                    <p className="text-green-600 mt-1">{availablePeriods}</p>
                  </div>
                  <p>• Intenta seleccionar otra fecha</p>
                  <p>• Considera dividir los servicios en múltiples citas</p>
                </div>
              </div>
            ) : availableSlots && availableSlots.length > 0 ? (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Duración total: {getTotalDuration()} minutos
                  <br />
                  <span className="text-green-600">
                    ✅ {availableSlots.filter(slot => slot.available).length} horarios disponibles
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={state.selectedTime === slot.time ? "default" : "outline"}
                      size="sm"
                      disabled={!slot.available}
                      onClick={() => handleTimeSelect(slot.time)}
                      className={`text-xs h-10 ${
                        state.selectedTime === slot.time 
                          ? 'bg-sage-300 hover:bg-sage-400 text-black' 
                          : slot.available 
                            ? 'bg-sage-100 hover:bg-sage-200 text-black'
                            : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {/* MODIFICADO: Mostrar en formato AM/PM */}
                      {formatTimeToAMPM(slot.time)}
                      {!slot.available && (
                        <span className="text-xs text-gray-500 ml-1">⛔</span>
                      )}
                    </Button>
                  ))}   
                </div>
                <div className="text-xs text-muted-foreground">
                  {availableSlots.filter(slot => slot.available).length} horarios disponibles de {availableSlots.length}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-2">No hay horarios disponibles para esta fecha</p>
                <div className="text-xs text-muted-foreground space-y-2 mt-3">
                  <div className="bg-yellow-50 p-3 rounded-md">
                    <strong className="text-yellow-700">Horarios configurados:</strong>
                    <p className="text-yellow-600 mt-1">{availablePeriods}</p>
                  </div>
                  <p>• La duración de {getTotalDuration()} minutos no cabe en los horarios disponibles</p>
                  <p>• Intenta seleccionar otra fecha o reducir los servicios</p>
                </div>
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
                    {/* MODIFICADO: Mostrar hora seleccionada en formato AM/PM */}
                    <Badge variant={isSelectedSlotAvailable ? "default" : "destructive"}>
                      {formatTimeToAMPM(state.selectedTime)} {!isSelectedSlotAvailable && "(No disponible)"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {/* MODIFICADO: formatDateTime ya usa formato AM/PM */}
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
          disabled={!canProceed}
          className="bg-sage-600 hover:bg-sage-700"
        >
          {!canProceed && !isSelectedSlotAvailable ? "Seleccione una hora" : "Continuar a Detalles"}
        </Button>
      </div>
    </div>
  );
}