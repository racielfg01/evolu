"use client";

import { useState } from "react";

import { useGetAllAppointments } from "@/lib/hooks/appointment.hooks";
import { Skeleton } from "../ui/skeleton";

import { FullAppointment } from "@/lib/actions/appointment.actions";

import AppointmentDetailsModal from "./AppointmentDetailsModal";

import { useIsMobile } from "@/hooks/use-mobile";
import { AppointmentCalendar } from "./AppointmentCalendar";

// Función para convertir UTC a fecha local manteniendo los mismos componentes
export function normalizeToLocal(date: Date): Date {
  const localDate = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
  return localDate;
}

export function ApoimentsManagment() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<FullAppointment | null>(null);
  const isMobile = useIsMobile();

  const handleClose = () => {
    setIsAddModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleAppointmentClick = (appointment: FullAppointment) => {
    setSelectedAppointment(appointment);
    setIsAddModalOpen(true);
  };

  // Obtener todas las citas
  const { data: appointments, isLoading, error } = useGetAllAppointments();

  if (isLoading)
    return (
      <div className="flex flex-col justify-center space-y-3 p-2">
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
    );

  if (error) return <div className="p-2 text-sm">Error: {error.message}</div>;


  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 mx-2 my-2 sm:mx-4 sm:my-4">
        <div className="flex flex-col gap-2 py-2 md:gap-4 md:py-6">
          <div className="border-b bg-card">
            <div className="max-w-7xl mx-auto px-2 md:px-6 py-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                Calendario de Citas
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Gestiona y visualiza tus citas de forma intuitiva
              </p>
            </div>
          </div>

          <AppointmentCalendar
            appointments={appointments}
            onAppointmentClick={handleAppointmentClick}
          />

          {isAddModalOpen && (
            <AppointmentDetailsModal
              isOpen={isAddModalOpen}
              onClose={handleClose}
              appointment={selectedAppointment}
            />
          )}
        </div>
      </div>
    </div>
  );
}