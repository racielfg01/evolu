// components/provider/appointment-list.tsx
"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
import {  AppointmentStatus } from "@prisma/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { fetchAppointmentByRangDay } from "@/lib/actions/appointment.actions";

// const prisma = new PrismaClient();

interface ServiceWithDetails {
  id: string;
  appointment_id: string;
  service_id: string;
  quantity: number;
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
}

interface User {
  id: string;
  name: string | null;
  email: string;
  phone?: string;
  image: string;
}

interface Appointment {
  id: string;
  cuid: string;
  date: Date;
  endDate: Date;
  duration: number;
  total_price: number;
  status: AppointmentStatus;
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
  services: ServiceWithDetails[];
  user: User;
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "NO_SHOW":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            {appointment.user.name || "Cliente"}
          </CardTitle>
          <Badge className={getStatusColor(appointment.status)}>
            {appointment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="font-semibold">Horario:</p>
            <p className="text-sm">
              {format(appointment.date, "HH:mm")} -{" "}
              {format(appointment.endDate, "HH:mm")}
            </p>
          </div>
          
          <div>
            <p className="font-semibold">Servicios:</p>
            <ul className="text-sm">
              {appointment.services.map((service) => (
                <li key={service.id}>
                  {service.service.name} (${service.service.price})
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <p className="font-semibold">Total:</p>
            <p className="text-sm">${appointment.total_price}</p>
          </div>
          
          <div>
            <p className="font-semibold">Contacto:</p>
            <p className="text-sm">{appointment.user.email}</p>
            {appointment.user.phone && (
              <p className="text-sm">{appointment.user.phone}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const loadAppointments = async () => {
      setIsLoading(true);
      try {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        // const data = await prisma.appointment.findMany({
        //   where: {
        //     date: {
        //       gte: startOfDay,
        //       lte: endOfDay
        //     }
        //   },
        //   include: {
        //     user: {
        //       select: {
        //         id: true,
        //         name: true,
        //         email: true,
        //         image: true
        //       }
        //     },
        //     services: {
        //       include: {
        //         service: {
        //           select: {
        //             id: true,
        //             name: true,
        //             duration: true,
        //             price: true
        //           }
        //         }
        //       }
        //     }
        //   },
        //   orderBy: {
        //     date: 'asc'
        //   }
        // });
         const data = await fetchAppointmentByRangDay(startOfDay,endOfDay)
        setAppointments(data as unknown as Appointment[]);
      } catch (error) {
        console.error("Error loading appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAppointments();
  }, [ selectedDate]);
  
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Citas del día</h2>
      
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          locale={es}
          className="rounded-md border"
        />
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Mostrando citas para {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
        </p>
        
        {isLoading ? (
          <div className="text-center py-8">
            <p>Cargando citas...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-8">
            <p>No hay citas programadas para este día</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}