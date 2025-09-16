// 'use client'

// import { useState, useEffect } from 'react'
// import { AppointmentScheduler } from './AppointmentScheduler'
// import { TimeSlotManager } from './TimeSlotManager'
// import { AppointmentList } from './AppointmentList'
// import { ServiceManager } from './ServiceManager'
// import { Dashboard } from './Dashboard'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { Appointment, DaySchedule, Service } from '@/types/appointment'

// export function AppointmentManager() {
//   const [daySchedules, setDaySchedules] = useState<DaySchedule[]>([]);
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [services, setServices] = useState<Service[]>([]);

//   useEffect(() => {
//     // Load data from localStorage on component mount
//     const savedAppointments = localStorage.getItem('appointments');
//     const savedServices = localStorage.getItem('services');
//     const savedDaySchedules = localStorage.getItem('daySchedules');

//     if (savedAppointments) setAppointments(JSON.parse(savedAppointments));
//     if (savedServices) setServices(JSON.parse(savedServices));
//     if (savedDaySchedules) setDaySchedules(JSON.parse(savedDaySchedules));
//   }, []);

//   useEffect(() => {
//     // Save data to localStorage whenever it changes
//     localStorage.setItem('appointments', JSON.stringify(appointments));
//     localStorage.setItem('services', JSON.stringify(services));
//     localStorage.setItem('daySchedules', JSON.stringify(daySchedules));
//   }, [appointments, services, daySchedules]);

//   const handleScheduleAppointment = (newAppointment: Omit<Appointment, 'id'>) => {
//     const appointment: Appointment = {
//       ...newAppointment,
//       id: Date.now().toString(),
//     };
//     setAppointments([...appointments, appointment]);

//     // Send a push notification
//     if ('serviceWorker' in navigator && 'PushManager' in window) {
//       navigator.serviceWorker.ready.then((registration) => {
//         registration.showNotification('New Appointment Scheduled', {
//           body: `Appointment for ${newAppointment.service.name} on ${newAppointment.date}`,
//           icon: '/icon-192x192.png',
//           badge: '/icon-192x192.png'
//         });
//       });
//     }
//   };

//   const handleUpdateDaySchedule = (updatedSchedule: DaySchedule) => {
//     const existingIndex = daySchedules.findIndex((schedule) => schedule.date === updatedSchedule.date);
//     if (existingIndex !== -1) {
//       const newSchedules = [...daySchedules];
//       newSchedules[existingIndex] = updatedSchedule;
//       setDaySchedules(newSchedules);
//     } else {
//       setDaySchedules([...daySchedules, updatedSchedule]);
//     }
//   };

//   const handleAddService = (newService: Omit<Service, 'id'>) => {
//     const service: Service = {
//       ...newService,
//       id: Date.now().toString(),
//     };
//     setServices([...services, service]);
//   };

//   const handleUpdateService = (updatedService: Service) => {
//     const newServices = services.map((service) =>
//       service.id === updatedService.id ? updatedService : service
//     );
//     setServices(newServices);
//   };

//   const handleDeleteService = (serviceId: string) => {
//     setServices(services.filter((service) => service.id !== serviceId));
//   };

//   return (
//     <Tabs defaultValue="dashboard">
//       <TabsList>
//         <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
//         <TabsTrigger value="view">Citas</TabsTrigger>
//         <TabsTrigger value="schedule">Schedule</TabsTrigger>
//         <TabsTrigger value="manage-slots">Time Slots</TabsTrigger>
//         <TabsTrigger value="manage-services">Services</TabsTrigger>
//       </TabsList>
//       <TabsContent value="dashboard">
//         <Dashboard appointments={appointments} services={services} />
//       </TabsContent>
//       <TabsContent value="view">
//         <AppointmentList appointments={appointments} />
//       </TabsContent>
//       <TabsContent value="schedule">
//         <AppointmentScheduler
//           daySchedules={daySchedules}
//           services={services}
//           onScheduleAppointment={handleScheduleAppointment}
//         />
//       </TabsContent>
//       <TabsContent value="manage-slots">
//         <TimeSlotManager
//           daySchedules={daySchedules}
//           onUpdateDaySchedule={handleUpdateDaySchedule}
//         />
//       </TabsContent>
//       <TabsContent value="manage-services">
//         <ServiceManager
//           services={services}
//           onAddService={handleAddService}
//           onUpdateService={handleUpdateService}
//           onDeleteService={handleDeleteService}
//         />
//       </TabsContent>
    
//     </Tabs>
//   );
// }

// 'use client'

// import { useState, useEffect } from 'react'
// import { AppointmentScheduler } from './AppointmentScheduler'
// import { TimeSlotManager } from './TimeSlotManager'
// import { AppointmentList } from './AppointmentList'
// import { ServiceManager } from './ServiceManager'
// import { Dashboard } from './Dashboard'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { Appointment, DaySchedule, Service } from '@/types/appointment'

// export function AppointmentManager() {
//   const [daySchedules, setDaySchedules] = useState<DaySchedule[]>([]);
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [services, setServices] = useState<Service[]>([]);

//   useEffect(() => {
//     // Load data from localStorage on component mount
//     const savedAppointments = localStorage.getItem('appointments');
//     const savedServices = localStorage.getItem('services');
//     const savedDaySchedules = localStorage.getItem('daySchedules');

//     if (savedAppointments) setAppointments(JSON.parse(savedAppointments));
//     if (savedServices) setServices(JSON.parse(savedServices));
//     if (savedDaySchedules) setDaySchedules(JSON.parse(savedDaySchedules));
//   }, []);

//   useEffect(() => {
//     // Save data to localStorage whenever it changes
//     localStorage.setItem('appointments', JSON.stringify(appointments));
//     localStorage.setItem('services', JSON.stringify(services));
//     localStorage.setItem('daySchedules', JSON.stringify(daySchedules));
//   }, [appointments, services, daySchedules]);

//   const handleScheduleAppointment = (newAppointment: Omit<Appointment, 'id'>) => {
//     const appointment: Appointment = {
//       ...newAppointment,
//       id: Date.now().toString(),
//     };
//     setAppointments([...appointments, appointment]);
//   };

//   const handleUpdateDaySchedule = (updatedSchedule: DaySchedule) => {
//     const existingIndex = daySchedules.findIndex((schedule) => schedule.date === updatedSchedule.date);
//     if (existingIndex !== -1) {
//       const newSchedules = [...daySchedules];
//       newSchedules[existingIndex] = updatedSchedule;
//       setDaySchedules(newSchedules);
//     } else {
//       setDaySchedules([...daySchedules, updatedSchedule]);
//     }
//     console.log('daySchedules',daySchedules)
//   };

//   const handleAddService = (newService: Omit<Service, 'id'>) => {
//     const service: Service = {
//       ...newService,
//       id: Date.now().toString(),
//     };
//     setServices([...services, service]);
//   };

//   const handleUpdateService = (updatedService: Service) => {
//     const newServices = services.map((service) =>
//       service.id === updatedService.id ? updatedService : service
//     );
//     setServices(newServices);
//   };

//   const handleDeleteService = (serviceId: string) => {
//     setServices(services.filter((service) => service.id !== serviceId));
//   };

//   return (
//     <Tabs defaultValue="dashboard">
//       <TabsList>
//         <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
//         <TabsTrigger value="view">Citas</TabsTrigger>
//         <TabsTrigger value="schedule">Schedule</TabsTrigger>
//         <TabsTrigger value="manage-slots">Time Slots</TabsTrigger>
//         <TabsTrigger value="manage-services">Services</TabsTrigger>
//       </TabsList>
//       <TabsContent value="dashboard">
//         <Dashboard appointments={appointments} services={services} />
//       </TabsContent>
//       <TabsContent value="view">
//         <AppointmentList appointments={appointments} />
//       </TabsContent>
//       <TabsContent value="schedule">
//         <AppointmentScheduler
//           daySchedules={daySchedules}
//           services={services}
//           onScheduleAppointment={handleScheduleAppointment}
//           onUpdateDaySchedule={handleUpdateDaySchedule} // Pasar la función como prop
//         />
//       </TabsContent>
//       <TabsContent value="manage-slots">
//         <TimeSlotManager
//           daySchedules={daySchedules}
//           services={services}
//           onUpdateDaySchedule={handleUpdateDaySchedule}
//         />
//       </TabsContent>
//       <TabsContent value="manage-services">
//         <ServiceManager
//           services={services}
//           onAddService={handleAddService}
//           onUpdateService={handleUpdateService}
//           onDeleteService={handleDeleteService}
//         />
//       </TabsContent>
//     </Tabs>
//   );
// }



// 'use client'

// import { useState, useEffect } from 'react'
// import { AppointmentScheduler } from './AppointmentScheduler'
// import { TimeSlotManager } from './TimeSlotManager'
// import { AppointmentList } from './AppointmentList'
// import { ServiceManager } from './ServiceManager'
// import { Dashboard } from './Dashboard'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { Appointment, DaySchedule, Service } from '@/types/types'
// import { createService } from '@/services'

// export function AppointmentManager() {
//   const [daySchedules, setDaySchedules] = useState<DaySchedule[]>([]);
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [services, setServices] = useState<Service[]>([]);

//   useEffect(() => {
//     // Cargar datos desde localStorage al montar el componente
//     const savedAppointments = localStorage.getItem('appointments');
//     const savedServices = localStorage.getItem('services');
//     const savedDaySchedules = localStorage.getItem('daySchedules');

//     if (savedAppointments) setAppointments(JSON.parse(savedAppointments));
//     if (savedServices) setServices(JSON.parse(savedServices));
//     if (savedDaySchedules) setDaySchedules(JSON.parse(savedDaySchedules));
//   }, []);

//   useEffect(() => {
//     // Guardar datos en localStorage cuando cambian
//     localStorage.setItem('appointments', JSON.stringify(appointments));
//     localStorage.setItem('services', JSON.stringify(services));
//     localStorage.setItem('daySchedules', JSON.stringify(daySchedules));
//   }, [appointments, services, daySchedules]);

//   const handleScheduleAppointment = (newAppointment: Omit<Appointment, 'id'>) => {
//     const appointment: Appointment = {
//       ...newAppointment,
//       id: Date.now().toString(),
//     };
//     setAppointments([...appointments, appointment]);
//   };

//   const handleUpdateDaySchedule = (updatedSchedule: DaySchedule) => {
//     const existingIndex = daySchedules.findIndex((schedule) => schedule.date === updatedSchedule.date);
//     if (existingIndex !== -1) {
//       const newSchedules = [...daySchedules];
//       newSchedules[existingIndex] = updatedSchedule;
//       setDaySchedules(newSchedules);
//     } else {
//       setDaySchedules([...daySchedules, updatedSchedule]);
//     }
//   };

//   const handleAddService =async (newService: Omit<Service, 'id'>) => {
//     // const service: Service = {
//     //   ...newService,
//     //   id: Date.now().toString(),
//     // };
//     // setServices([...services, service]);
//     try {
//       console.log({newService})
//     const res= await createService(newService)
//        console.log({res})
//     } catch (error) { 
//       throw new Error("error",error);
      
//     }
//   };

//   const handleUpdateService = (updatedService: Service) => {
//     const newServices = services.map((service) =>
//       service.id === updatedService.id ? updatedService : service
//     );
//     setServices(newServices);
//   };

//   const handleDeleteService = (serviceId: string) => {
//     setServices(services.filter((service) => service.id !== serviceId));
//   };

//   return (
//     <Tabs defaultValue="dashboard">
//       <TabsList>
//         <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
//         <TabsTrigger value="view">Citas</TabsTrigger>
//         <TabsTrigger value="schedule">Reservaciones</TabsTrigger>
//         <TabsTrigger value="manage-slots">Horarios</TabsTrigger>
//         <TabsTrigger value="manage-services">Servicios</TabsTrigger>
//       </TabsList>
//       <TabsContent value="dashboard">
//         <Dashboard appointments={appointments} services={services} />
//       </TabsContent>
//       <TabsContent value="view">
//         <AppointmentList appointments={appointments} />
//       </TabsContent>
//       <TabsContent value="schedule">
//         <AppointmentScheduler
//           daySchedules={daySchedules} // Pasar el estado actualizado
//           services={services}
//           onScheduleAppointment={handleScheduleAppointment}
//           onUpdateDaySchedule={handleUpdateDaySchedule} // Pasar la función de actualización
//         />
//       </TabsContent>
//       <TabsContent value="manage-slots">
//         <TimeSlotManager
//           daySchedules={daySchedules}
//           services={services}
//           onUpdateDaySchedule={handleUpdateDaySchedule}
//         />
//       </TabsContent>
//       <TabsContent value="manage-services">
//         <ServiceManager
//           services={services}
//           onAddService={handleAddService}
//           onUpdateService={handleUpdateService}
//           onDeleteService={handleDeleteService}
//         />
//       </TabsContent>
//     </Tabs>
//   );
// }