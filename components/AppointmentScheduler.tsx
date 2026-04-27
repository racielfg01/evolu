// 'use client'

// import { useState } from 'react'
// import { format } from 'date-fns'
// import { Calendar } from '@/components/ui/calendar'
// import { Button } from '@/components/ui/button'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Input } from '@/components/ui/input'
// import { TimeSlot, DaySchedule, Service } from '@/types/appointment'

// type AppointmentSchedulerProps = {
//   daySchedules: DaySchedule[];
//   services: Service[];
//   onScheduleAppointment: (appointment: { date: string; timeSlot: TimeSlot; service: Service; customerName: string }) => void;
// };

// export function AppointmentScheduler({ daySchedules, services, onScheduleAppointment }: AppointmentSchedulerProps) {
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | undefined>(undefined);
//   const [selectedService, setSelectedService] = useState<Service | undefined>(undefined);
//   const [customerName, setCustomerName] = useState('');

//   const availableTimeSlots = selectedDate
//     ? daySchedules.find((schedule) => schedule.date === format(selectedDate, 'yyyy-MM-dd'))?.timeSlots || []
//     : [];

//   const handleScheduleAppointment = () => {
//     if (selectedDate && selectedTimeSlot && selectedService) {
//       onScheduleAppointment({
//         date: format(selectedDate, 'yyyy-MM-dd'),
//         timeSlot: selectedTimeSlot,
//         service: selectedService,
//         customerName,
//       });
//       // Reset form
//       setSelectedDate(undefined);
//       setSelectedTimeSlot(undefined);
//       setSelectedService(undefined);
//       setCustomerName('');
//     }
//   };

//   return (
//     <div className="space-y-4 flex flex-col justify-center">

//       <Calendar
//         mode="single"
//         selected={selectedDate}
//         onSelect={setSelectedDate}
//         className="flex justify-center"
//       />
//       <Select
//         value={selectedTimeSlot?.id}
//         onValueChange={(value) => setSelectedTimeSlot(availableTimeSlots.find((slot) => slot.id === value))}
//       >
//         <SelectTrigger>
//           <SelectValue placeholder="Select time slot" />
//         </SelectTrigger>
//         <SelectContent>
//           {availableTimeSlots.map((slot) => (
//             <SelectItem key={slot.id} value={slot.id}>
//               {slot.startTime} - {slot.endTime}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//       <Select
//         value={selectedService?.id}
//         onValueChange={(value) => setSelectedService(services.find((service) => service.id === value))}
//       >
//         <SelectTrigger>
//           <SelectValue placeholder="Select service" />
//         </SelectTrigger>
//         <SelectContent>
//           {services.map((service) => (
//             <SelectItem key={service.id} value={service.id}>
//               {service.name} - ${service.price.toFixed(2)}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//       <Input
//         placeholder="Customer name"
//         value={customerName}
//         onChange={(e) => setCustomerName(e.target.value)}
//       />
//       <Button onClick={handleScheduleAppointment} disabled={!selectedDate || !selectedTimeSlot || !selectedService || !customerName}>
//         Schedule Appointment
//       </Button>
//     </div>
//   );
// }


// "use client"

// import { useState } from "react"
// import { format, addMinutes, parse, isValid, isBefore, isAfter } from "date-fns"
// import { Calendar } from "@/components/ui/calendar"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Input } from "@/components/ui/input"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import type { TimeSlot, DaySchedule, Service } from "@/types/appointment"

// type AppointmentSchedulerProps = {
//   daySchedules: DaySchedule[]
//   services: Service[]
//   onScheduleAppointment: (appointment: {
//     date: string
//     timeSlot: TimeSlot
//     service: Service
//     customerName: string
//   }) => void
//   onUpdateDaySchedule: (updatedSchedule: DaySchedule) => void
// }

// export function AppointmentScheduler({ daySchedules, services, onScheduleAppointment, onUpdateDaySchedule }: AppointmentSchedulerProps) {
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
//   const [selectedService, setSelectedService] = useState<Service | undefined>(undefined)
//   const [customerName, setCustomerName] = useState("")
//   const [generatedTimeSlot, setGeneratedTimeSlot] = useState<TimeSlot | undefined>(undefined)
//   const [availabilityError, setAvailabilityError] = useState<string | undefined>(undefined)

//   const handleServiceSelection = (serviceId: string) => {
//     const service = services.find((s) => s.id === serviceId)
//     setSelectedService(service)
//     setAvailabilityError(undefined) // Limpiar el mensaje de error al seleccionar un nuevo servicio

//     if (selectedDate && service) {
//       const dateKey = format(selectedDate, "yyyy-MM-dd")
//       const existingSchedule = daySchedules.find((schedule) => schedule.date === dateKey)
//       const existingTimeSlots = existingSchedule?.timeSlots || []

//       const startTime = "09:00" // Hora de inicio predeterminada
//       try {
//         // Combinar la fecha seleccionada con la hora de inicio
//         const start = parse(startTime, "HH:mm", selectedDate)

//         // Verificar que la fecha generada sea válida
//         if (!isValid(start)) {
//           throw new Error("Invalid start time")
//         }

//         // Calcular la hora de finalización sumando la duración del servicio
//         const end = addMinutes(start, service.duration)

//         // Verificar que la fecha de finalización sea válida
//         if (!isValid(end)) {
//           throw new Error("Invalid end time")
//         }

//         // Verificar disponibilidad
//         const isSlotAvailable = !existingTimeSlots.some((slot) => {
//           const slotStart = parse(slot.startTime, "HH:mm", selectedDate)
//           const slotEnd = parse(slot.endTime, "HH:mm", selectedDate)
//           return (
//             (isAfter(start, slotStart) && isBefore(start, slotEnd)) || // El nuevo slot comienza dentro de un slot existente
//             (isAfter(end, slotStart) && isBefore(end, slotEnd)) || // El nuevo slot termina dentro de un slot existente
//             (isBefore(start, slotStart) && isAfter(end, slotEnd)) // El nuevo slot cubre completamente un slot existente
//         )})

//         if (!isSlotAvailable) {
//           setAvailabilityError("No hay disponibilidad para este servicio en el día seleccionado.")
//           setGeneratedTimeSlot(undefined)
//           return
//         }

//         // Crear el nuevo time slot
//         const newTimeSlot: TimeSlot = {
//           id: `generated-${Date.now()}`,
//           startTime: format(start, "HH:mm"),
//           endTime: format(end, "HH:mm"),
//           serviceId: service.id,
//         }

//         setGeneratedTimeSlot(newTimeSlot)
//         setAvailabilityError(undefined)
//       } catch (error) {
//         console.error("Error generating time slot:", error)
//         setGeneratedTimeSlot(undefined)
//       }
//     } else {
//       setGeneratedTimeSlot(undefined)
//     }
//   }

//   const handleScheduleAppointment = () => {
//     if (selectedDate && generatedTimeSlot && selectedService && customerName) {
//       const dateKey = format(selectedDate, "yyyy-MM-dd")
//       const existingSchedule = daySchedules.find((schedule) => schedule.date === dateKey)
//       const updatedTimeSlots = existingSchedule ? [...existingSchedule.timeSlots, generatedTimeSlot] : [generatedTimeSlot]

//       const updatedSchedule: DaySchedule = {
//         date: dateKey,
//         timeSlots: updatedTimeSlots,
//       }

//       // Actualizar el horario del día
//       onUpdateDaySchedule(updatedSchedule)

//       // Programar la cita
//       onScheduleAppointment({
//         date: dateKey,
//         timeSlot: generatedTimeSlot,
//         service: selectedService,
//         customerName,
//       })

//       // Reset form
//       setSelectedDate(undefined)
//       setSelectedService(undefined)
//       setCustomerName("")
//       setGeneratedTimeSlot(undefined)
//       setAvailabilityError(undefined)
//     }
//   }

//   return (
//     <div className="space-y-4 flex flex-col justify-center">
//       <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="flex justify-center" />
//       <Select
//         value={selectedService?.id}
//         onValueChange={handleServiceSelection}
//       >
//         <SelectTrigger>
//           <SelectValue placeholder="Select service" />
//         </SelectTrigger>
//         <SelectContent>
//           {services.map((service) => (
//             <SelectItem key={service.id} value={service.id}>
//               {service.name} - ${service.price.toFixed(2)} (Duration: {service.duration} mins)
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//       {availabilityError && (
//         <Alert variant="destructive">
//           <AlertDescription>{availabilityError}</AlertDescription>
//         </Alert>
//       )}
//       {generatedTimeSlot && (
//         <div className="space-y-2">
//           <label className="text-sm font-medium">Generated Time Slot</label>
//           <div className="flex items-center justify-center px-3 py-1.5 rounded-full bg-primary text-primary-foreground">
//             {generatedTimeSlot.startTime} - {generatedTimeSlot.endTime}
//           </div>
//         </div>
//       )}
//       <Input placeholder="Customer name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
//       <Button
//         onClick={handleScheduleAppointment}
//         disabled={!selectedDate || !generatedTimeSlot || !selectedService || !customerName}
//       >
//         Schedule Appointment
//       </Button>
//     </div>
//   )
// }


// "use client"

// import { useState } from "react"
// import { format, addMinutes, parse, isValid,  isAfter } from "date-fns"
// import { Calendar } from "@/components/ui/calendar"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Input } from "@/components/ui/input"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import type { TimeSlot, DaySchedule, Service } from "@/types/types"

// type AppointmentSchedulerProps = {
//   daySchedules: DaySchedule[]
//   services: Service[]
//   onScheduleAppointment: (appointment: {
//     date: string
//     timeSlot: TimeSlot
//     service: Service
//     customerName: string
//   }) => void
//   onUpdateDaySchedule: (updatedSchedule: DaySchedule) => void
//   defaultStartTime?: string // Hora de inicio predeterminada (opcional)
//   defaultEndTime?: string // Hora de fin predeterminada (opcional)
// }

// export function AppointmentScheduler({
//   daySchedules,
//   services,
//   onScheduleAppointment,
//   onUpdateDaySchedule,
//   defaultStartTime = "09:00", // Hora de inicio predeterminada
//   defaultEndTime = "17:00", // Hora de fin predeterminada
// }: AppointmentSchedulerProps) {
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
//   const [selectedService, setSelectedService] = useState<Service | undefined>(undefined)
//   const [customerName, setCustomerName] = useState("")
//   const [generatedTimeSlot, setGeneratedTimeSlot] = useState<TimeSlot | undefined>(undefined)
//   const [availabilityError, setAvailabilityError] = useState<string | undefined>(undefined)

//   const handleServiceSelection = (serviceId: string) => {
//     const service = services.find((s) => s.id === serviceId)
//     setSelectedService(service)
//     setAvailabilityError(undefined) // Limpiar el mensaje de error al seleccionar un nuevo servicio

//     if (selectedDate && service) {
//       const dateKey = format(selectedDate, "yyyy-MM-dd")
//       const existingSchedule = daySchedules.find((schedule) => schedule.date === dateKey)
//       const existingTimeSlots = existingSchedule?.timeSlots || []

//       try {
//         // Obtener la hora de inicio del último time slot existente
//         const lastTimeSlot = existingTimeSlots[existingTimeSlots.length - 1]
//         const start = lastTimeSlot
//           ? parse(lastTimeSlot.endTime, "HH:mm", selectedDate) // Iniciar después del último time slot
//           : parse(defaultStartTime, "HH:mm", selectedDate) // Usar la hora de inicio predeterminada

//         // Verificar que la fecha generada sea válida
//         if (!isValid(start)) {
//           throw new Error("Invalid start time")
//         }

//         // Calcular la hora de finalización sumando la duración del servicio
//         const end = addMinutes(start, service.duration)

//         // Verificar que la fecha de finalización sea válida
//         if (!isValid(end)) {
//           throw new Error("Invalid end time")
//         }

//         // Verificar si el nuevo time slot excede la hora de fin predeterminada
//         const endOfDay = parse(defaultEndTime, "HH:mm", selectedDate)
//         if (isAfter(end, endOfDay)) {
//           setAvailabilityError(
//             `No hay disponibilidad para este servicio en el día seleccionado. Por favor, revisa otros días posteriores.`
//           )
//           setGeneratedTimeSlot(undefined)
//           return
//         }

//         // Crear el nuevo time slot
//         const newTimeSlot: TimeSlot = {
//           id: `generated-${Date.now()}`,
//           startTime: format(start, "HH:mm"),
//           endTime: format(end, "HH:mm"),
//           serviceId: service.id,
//         }

//         setGeneratedTimeSlot(newTimeSlot)
//         setAvailabilityError(undefined)
//       } catch (error) {
//         console.error("Error generating time slot:", error)
//         setGeneratedTimeSlot(undefined)
//       }
//     } else {
//       setGeneratedTimeSlot(undefined)
//     }
//   }

//   const handleScheduleAppointment = () => {
//     if (selectedDate && generatedTimeSlot && selectedService && customerName) {
//       const dateKey = format(selectedDate, "yyyy-MM-dd")
//       const existingSchedule = daySchedules.find((schedule) => schedule.date === dateKey)
//       const updatedTimeSlots = existingSchedule ? [...existingSchedule.timeSlots, generatedTimeSlot] : [generatedTimeSlot]

//       const updatedSchedule: DaySchedule = {
//         date: dateKey,
//         timeSlots: updatedTimeSlots,
//       }

//       // Actualizar el horario del día
//       onUpdateDaySchedule(updatedSchedule)

//       // Programar la cita
//       onScheduleAppointment({
//         date: dateKey,
//         timeSlot: generatedTimeSlot,
//         service: selectedService,
//         customerName,
//       })

//       // Reset form
//       setSelectedDate(undefined)
//       setSelectedService(undefined)
//       setCustomerName("")
//       setGeneratedTimeSlot(undefined)
//       setAvailabilityError(undefined)
//     }
//   }

//   return (
//     <div className="space-y-4 flex flex-col justify-center">
//       <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="flex justify-center" />
//       <Select
//         value={selectedService?.id}
//         onValueChange={handleServiceSelection}
//       >
//         <SelectTrigger>
//           <SelectValue placeholder="Select service" />
//         </SelectTrigger>
//         <SelectContent>
//           {services.map((service) => (
//             <SelectItem key={service.id} value={service.id}>
//               {service.name} - ${service.price.toFixed(2)} (Duration: {service.duration} mins)
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//       {availabilityError && (
//         <Alert variant="destructive">
//           <AlertDescription>{availabilityError}</AlertDescription>
//         </Alert>
//       )}
//       {generatedTimeSlot && (
//         <div className="space-y-2">
//           <label className="text-sm font-medium">Turno disponible</label>
//           <div className="flex items-center justify-center px-3 py-1.5 rounded-full bg-primary text-primary-foreground">
//             {generatedTimeSlot.startTime} - {generatedTimeSlot.endTime}
//           </div>
//         </div>
//       )}
//       <Input placeholder="Nombre del cliente" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
//       <Button
//         onClick={handleScheduleAppointment}
//         disabled={!selectedDate || !generatedTimeSlot || !selectedService || !customerName}
//       >
//         Resevar cita
//       </Button>
//     </div>
//   )
// }