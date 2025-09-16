// export type TimeSlot = {
//   id: string;
//   startTime: string;
//   endTime: string;
//   serviceId:string
// };

// export type Service = {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   imageUrl: string;
//   duration:number
// };

// export type Appointment = {
//   id: string;
//   date: string;
//   timeSlot: TimeSlot;
//   service: Service;
//   customerName: string;
// };

// export type DaySchedule = {
//   date: string;
//   timeSlots: TimeSlot[];
// };

// types.ts

// Enum de roles para usuarios
export enum Role {
  SUPER_ADMIN ,
  ADMIN,
  USER 
}
export enum Sex {
  Male,
  Female 
}

// Tipo base para el modelo User
export interface User {
  id: string; // ID único (cuid())
  name?: string; // Nombre opcional
  email: string; // Email único
  password: string; // Contraseña (no se expone en respuestas)
  role: Role; // Rol del usuario (SUPER_ADMIN, ADMIN, USER)
  sex: Sex; // Sex del usuario (Male, Female)

}

// Tipo base para el modelo TimeSlot
export interface TimeSlot {
  id: string; // ID único (cuid())
  startTime: string; // Hora de inicio (ISO string)
  endTime: string; // Hora de fin (ISO string)
  serviceId: string; // ID del servicio asociado
  dayScheduleDate?: string; // Fecha opcional de la agenda
}

// Tipo base para el modelo Service
export interface Service {
  id: string; // ID único (cuid())
  name: string; // Nombre del servicio
  description: string; // Descripción del servicio
  price: number; // Precio (float en Prisma)
  images: string[]; // URL de la imagen
  duration: number; // Duración en minutos
}

// Tipo base para el modelo Appointment
export interface Appointment {
  id: string; // ID único (cuid())
  date: string; // Fecha de la cita (ISO string)
  timeSlotId: string; // ID del horario asociado
  serviceId: string; // ID del servicio asociado
  userId: string; // ID del usuario (customerName en tu ejemplo)
}

// Tipo base para el modelo DaySchedule
export type DaySchedule = {
  date: string; // Fecha única (ID del día en formato ISO string)
}

// Tipos extendidos con relaciones (opcional para consultas)
export type AppointmentWithRelations = Appointment & {
  user: User;
  timeSlot: TimeSlot;
  service: Service;
}

export type TimeSlotWithRelations = TimeSlot & {
  service: Service;
  appointments: Appointment[];
  daySchedule?: DaySchedule;
}

export type UserWithRelations = User & {
  appointments: Appointment[];
}