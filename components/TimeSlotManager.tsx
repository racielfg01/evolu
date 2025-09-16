// 'use client'

// import { useState } from 'react'
// import { format } from 'date-fns'
// import { Calendar } from '@/components/ui/calendar'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { TimeSlot, DaySchedule } from '@/types/appointment'

// type TimeSlotManagerProps = {
//   daySchedules: DaySchedule[];
//   onUpdateDaySchedule: (updatedSchedule: DaySchedule) => void;
// };

// export function TimeSlotManager({ daySchedules, onUpdateDaySchedule }: TimeSlotManagerProps) {
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
//   const [newStartTime, setNewStartTime] = useState('');
//   const [newEndTime, setNewEndTime] = useState('');

//   const selectedSchedule = selectedDate
//     ? daySchedules.find((schedule) => schedule.date === format(selectedDate, 'yyyy-MM-dd'))
//     : undefined;

//   const handleAddTimeSlot = () => {
//     if (selectedDate && newStartTime && newEndTime) {
//       const updatedSchedule: DaySchedule = {
//         date: format(selectedDate, 'yyyy-MM-dd'),
//         timeSlots: [
//           ...(selectedSchedule?.timeSlots || []),
//           {
//             id: Date.now().toString(),
//             startTime: newStartTime,
//             endTime: newEndTime,
//           },
//         ],
//       };
//       onUpdateDaySchedule(updatedSchedule);
//       setNewStartTime('');
//       setNewEndTime('');
//     }
//   };

//   const handleRemoveTimeSlot = (slotId: string) => {
//     if (selectedSchedule) {
//       const updatedSchedule: DaySchedule = {
//         ...selectedSchedule,
//         timeSlots: selectedSchedule.timeSlots.filter((slot) => slot.id !== slotId),
//       };
//       onUpdateDaySchedule(updatedSchedule);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <Calendar
//         mode="single"
//         selected={selectedDate}
//         onSelect={setSelectedDate}
//         className="rounded-md border"
//       />
//       {selectedSchedule && (
//         <div>
//           <h3 className="text-lg font-semibold mb-2">Time Slots for {selectedSchedule.date}</h3>
//           <ul className="space-y-2">
//             {selectedSchedule.timeSlots.map((slot) => (
//               <li key={slot.id} className="flex justify-between items-center">
//                 <span>{slot.startTime} - {slot.endTime}</span>
//                 <Button variant="destructive" size="sm" onClick={() => handleRemoveTimeSlot(slot.id)}>Remove</Button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//       <div className="flex space-x-2">
//         <Input
//           type="time"
//           value={newStartTime}
//           onChange={(e) => setNewStartTime(e.target.value)}
//           placeholder="Start Time"
//         />
//         <Input
//           type="time"
//           value={newEndTime}
//           onChange={(e) => setNewEndTime(e.target.value)}
//           placeholder="End Time"
//         />
//         <Button onClick={handleAddTimeSlot} disabled={!selectedDate || !newStartTime || !newEndTime}>
//           Add Time Slot
//         </Button>
//       </div>
//     </div>
//   );
// }

// "use client"

// import { useState } from "react"
// import { format, addMinutes, parse } from "date-fns"
// import { Calendar } from "@/components/ui/calendar"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import type { TimeSlot, DaySchedule, Service } from "@/types/types"

// type TimeSlotManagerProps = {
//   daySchedules: DaySchedule[]
//   services: Service[]
//   onUpdateDaySchedule: (updatedSchedule: DaySchedule) => void
// }

// export function TimeSlotManager({ daySchedules, services, onUpdateDaySchedule }: TimeSlotManagerProps) {
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
//   const [startTime, setStartTime] = useState("09:00")
//   const [endTime, setEndTime] = useState("17:00")

//   const selectedSchedule = selectedDate
//     ? daySchedules.find((schedule) => schedule.date === format(selectedDate, "yyyy-MM-dd"))
//     : undefined

//   const generateTimeSlots = () => {
//     if (!selectedDate || !services.length) return

//     const date = format(selectedDate, "yyyy-MM-dd")
//     const start = parse(startTime, "HH:mm", new Date())
//     const end = parse(endTime, "HH:mm", new Date())

//     let currentTime = start
//     const timeSlots: TimeSlot[] = []

//     while (currentTime < end) {
//       services.forEach((service) => {
//         const slotEndTime = addMinutes(currentTime, service.duration)
//         if (slotEndTime <= end) {
//           timeSlots.push({
//             id: `${date}-${format(currentTime, "HHmm")}-${service.id}`,
//             startTime: format(currentTime, "HH:mm"),
//             endTime: format(slotEndTime, "HH:mm"),
//             serviceId: service.id,
//           })
//         }
//         currentTime = slotEndTime
//       })
//     }

//     const updatedSchedule: DaySchedule = {
//       date,
//       timeSlots,
//     }
//     onUpdateDaySchedule(updatedSchedule)
//   }

//   return (
//     <div className="space-y-4">
//       <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
//       <div className="flex space-x-2">
//         <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="Start Time" />
//         <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder="End Time" />
//         <Button onClick={generateTimeSlots} disabled={!selectedDate || !services.length}>
//           Generate Time Slots
//         </Button>
//       </div>
//       {selectedSchedule && (
//         <div>
//           <h3 className="text-lg font-semibold mb-2">Time Slots for {selectedSchedule.date}</h3>
//           <ul className="space-y-2">
//             {selectedSchedule.timeSlots.map((slot) => (
//               <li key={slot.id} className="flex justify-between items-center">
//                 <span>
//                   {slot.startTime} - {slot.endTime}
//                 </span>
//                 <span>{services.find((s) => s.id === slot.serviceId)?.name}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   )
// }

