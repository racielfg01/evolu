// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
// import { Appointment } from '@/types/types'

// type AppointmentListProps = {
//   appointments: Appointment[];
// };

// export function AppointmentList({ appointments }: AppointmentListProps) {
//   return (
//     <Table>
//       <TableHeader>
//         <TableRow>
//           <TableHead>Cliente</TableHead>
//           <TableHead>Servicio</TableHead>
//           <TableHead>Precio</TableHead>
//           <TableHead>Tiempo</TableHead>
//           <TableHead>Fecha</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {appointments.map((appointment) => (
//           <TableRow key={appointment.id}>
//             <TableCell>{appointment.customerName}</TableCell>
//             <TableCell>{appointment.service.name}</TableCell>
//             <TableCell>${appointment.service.price.toFixed(2)}</TableCell>
//             <TableCell>{appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}</TableCell>
//             <TableCell>{appointment.date}</TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// }

// components/AppointmentList.tsx
// 'use client'

// import { useGetAllAppointments } from '@/lib/hooks/appointment.hooks';
// import { useDeleteAppointment } from '@/lib/hooks/appointment.hooks';


// //   (alias) type FullAppointment = {
// //     id: string;
// //     cuid: string;
// //     date: Date;
// //     endDate: Date;
// //     user_id: string;
// //     duration: number;
// //     total_price: number;
// //     status: $Enums.AppointmentStatus;
// //     createdAt: Date;
// //     updatedAt: Date;
// // } & {
// //     user: User;
// //     services: (AppointmentService & {
// //         service: Service;
// //     })[];
// // }

// export function AppointmentList() {
//   // const { data: appointments, isLoading, error } = useAppointments();
//   const { data: appointments, isLoading, error } = useGetAllAppointments();
//   const deleteMutation = useDeleteAppointment();

//   if (isLoading) return <div>Loading appointments...</div>;
//   if (error) return <div>Error: {error.message}</div>;



//   return (
//     <div className="space-y-4">
//       {appointments?.map(appointment => (
//         <div key={appointment.id} className="border p-4 rounded-lg">
//           <div className="flex justify-between items-start">
//             <div>
//               <h3 className="font-bold">{appointment.services.name}</h3>
//               <p>Client: {appointment.user.name}</p>
//               <p>Date: {appointment.date}</p>
//               <p>Time: {appointment.timeSlot.start_time} - {appointment.timeSlot.end_time}</p>
//             </div>
//             <button
//               onClick={() => deleteMutation.mutate(appointment.id)}
//               disabled={deleteMutation.isLoading}
//               className="text-red-500"
//             >
//               {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }