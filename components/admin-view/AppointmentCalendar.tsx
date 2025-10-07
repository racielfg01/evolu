

"use client";

import { useState, useMemo, useEffect } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  isToday,
  // parseISO,
  isSameMonth,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Phone,
  Mail,
  // MoreVertical,
  Filter,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FullAppointment } from "@/lib/actions/appointment.actions";
import { AppointmentStatus } from "@prisma/client";
import { normalizeToLocal } from "./ApoimentsManagment";
import { AppointmentSearch } from "./SearchAppointments";

export type ViewMode = "day" | "week" | "month" | "agenda" | "search";

interface AppointmentCalendarProps {
  appointments: FullAppointment[] | undefined;
  onAppointmentClick: (appointment: FullAppointment) => void;
}

export function AppointmentCalendar({
  appointments,
  onAppointmentClick,
}: AppointmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">(
    "all"
  );

  // Filter appointments based on search and status - CORREGIDO
  // const filteredAppointments = useMemo(() => {
  //   if (!appointments) return [];

  //   return appointments.filter((apt) => {
  //     setViewMode("search")
  //     // Filtro por estado
  //     const matchesStatus =
  //       statusFilter === "all" || apt.status === statusFilter;

  //     // Si no hay búsqueda y coincide el estado, mostrar
  //     if (searchQuery.trim() === "") {
  //       return matchesStatus;
  //     }

  //     // Filtro por búsqueda - BUSCA EN MÚLTIPLES CAMPOS
  //     const query = searchQuery.toLowerCase().trim();
  //     const matchesSearch =
  //       apt.user.name.toLowerCase().includes(query) ||
  //       apt.user.email?.toLowerCase().includes(query) ||
  //       apt.user.phone?.toLowerCase().includes(query) ||
  //       apt.services.some((serviceAppointment) =>
  //         serviceAppointment.service.name.toLowerCase().includes(query)
  //       ) ||
  //       apt.id.toLowerCase().includes(query) ||
  //       apt.cuid.toLowerCase().includes(query);

  //     return matchesSearch && matchesStatus;
  //   });
  // }, [appointments, searchQuery, statusFilter]);
  const filteredAppointments = useMemo(() => {
  if (!appointments) return [];

  return appointments.filter((apt) => {
    // ELIMINAR ESTA LÍNEA: setViewMode("search")
    
    // Filtro por estado
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;

    // Si no hay búsqueda y coincide el estado, mostrar
    if (searchQuery.trim() === "") {
      return matchesStatus;
    }

    // Filtro por búsqueda - BUSCA EN MÚLTIPLES CAMPOS
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      apt.user.name.toLowerCase().includes(query) ||
      apt.user.email?.toLowerCase().includes(query) ||
      apt.user.phone?.toLowerCase().includes(query) ||
      apt.services.some((serviceAppointment) =>
        serviceAppointment.service.name.toLowerCase().includes(query)
      ) ||
      apt.id.toLowerCase().includes(query) ||
      apt.cuid.toLowerCase().includes(query);

    return matchesSearch && matchesStatus;
  });
}, [appointments, searchQuery, statusFilter]);

useEffect(() => {
  if (searchQuery.trim() !== "" && viewMode !== "search") {
    setViewMode("search");
  }
}, [searchQuery, viewMode]);

  // Navigation handlers
  const handlePrevious = () => {
    if (viewMode === "day") setCurrentDate(subDays(currentDate, 1));
    else if (viewMode === "week") setCurrentDate(subWeeks(currentDate, 1));
    else if (viewMode === "month") setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNext = () => {
    if (viewMode === "day") setCurrentDate(addDays(currentDate, 1));
    else if (viewMode === "week") setCurrentDate(addWeeks(currentDate, 1));
    else if (viewMode === "month") setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => setCurrentDate(new Date());

  // Get date range based on view mode
  const dateRange = useMemo(() => {
    if (viewMode === "day") {
      return [currentDate];
    } else if (viewMode === "week") {
      return eachDayOfInterval({
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 }),
      });
    } else if (viewMode === "month") {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      return eachDayOfInterval({ start, end });
    }
    return [];
  }, [currentDate, viewMode]);

  const getAppointmentsForDate = (date: Date) => {
    return filteredAppointments
      ?.filter((apt) => isSameDay(apt.date, date))
      .sort((a, b) => a.date.getTime() - b.date.getTime()); // Ordenar por hora correctamente
  };

  // Get status color
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case "NO_SHOW":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: AppointmentStatus) => {
    const labels = {
      CONFIRMED: "Confirmada",
      PENDING: "Pendiente",
      CANCELLED: "Cancelada",
      COMPLETED: "Completada",
      NO_SHOW: "No Presentado",
    };
    return labels[status];
  };

  // Contador de resultados para mostrar feedback al usuario
  const resultsCount = filteredAppointments.length;
  const totalAppointments = appointments?.length || 0;

  return (
    // <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-full mx-auto">
    <div className="flex flex-col gap-3 p-2 sm:p-4 md:p-6 w-full max-w-full mx-auto">
      {/* Header with controls */}
     <div className="flex flex-col gap-3">
    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-card border rounded-lg p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            className="h-7 w-7"
            aria-label="Período anterior"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            onClick={handleToday}
            className="h-7 px-2 text-xs font-medium"
          >
            Hoy
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="h-7 w-7"
            aria-label="Período siguiente"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
        <h2 className="text-sm sm:text-lg md:text-xl font-semibold tracking-tight truncate max-w-[150px] xs:max-w-none">
          {viewMode === "day" &&
            format(currentDate, "d 'de' MMM, yy", { locale: es })}
          {viewMode === "week" &&
            `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "d MMM", { locale: es })} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), "d MMM", { locale: es })}`}
          {viewMode === "month" &&
            format(currentDate, "MMM yyyy", { locale: es })}
          {viewMode === "agenda" && "Agenda"}
        </h2>
      </div>

      {/* View mode selector - más compacto */}
      <div className="flex items-center gap-1 bg-card border rounded-lg p-1">
        {(["day", "week", "month", "agenda", "search"] as ViewMode[]).map(
          (mode) => (
            <Button
              key={mode}
              variant={viewMode === mode ? "default" : "ghost"}
              size="sm"
              onClick={() => {setViewMode(mode);setSearchQuery("");setStatusFilter("all")}}
              className={cn(
                "h-7 px-2 text-xs font-medium transition-all whitespace-nowrap",
                viewMode === mode && "shadow-sm"
              )}
            >
              {mode === "day" && "Día"}
              {mode === "week" && "Sem"}
              {mode === "month" && "Mes"}
              {mode === "agenda" && "Agenda"}
              {mode === "search" && "Buscar"}
            </Button>
          )
        )}
      </div>
    </div>

    {/* Search and filters - más compacto */}
    {viewMode !== "search" && (
      <>
        <div className="flex flex-col xs:flex-row gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente, email, teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 w-full text-sm h-9"
            />
            {searchQuery && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Badge variant="secondary" className="text-xs h-5">
                  {resultsCount}/{totalAppointments}
                </Badge>
              </div>
            )}
          </div>
       
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as AppointmentStatus | "all")
            }
          >
            <SelectTrigger className="w-full xs:w-[140px] h-9 text-sm">
              <Filter className="h-3 w-3 mr-1" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Todos</SelectItem>
              <SelectItem value="CONFIRMED" className="text-xs">Confirmadas</SelectItem>
              <SelectItem value="PENDING" className="text-xs">Pendientes</SelectItem>
              <SelectItem value="CANCELLED" className="text-xs">Canceladas</SelectItem>
              <SelectItem value="COMPLETED" className="text-xs">Completadas</SelectItem>
              <SelectItem value="NO_SHOW" className="text-xs">No Presentado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </>
    )}
  </div>


      {/* Calendar views */}
      <div className="animate-in fade-in duration-300 w-full">
        {viewMode === "day" && (
          <DayView
            date={currentDate}
            appointments={getAppointmentsForDate(currentDate)}
            onAppointmentClick={onAppointmentClick}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
          />
        )}
        {viewMode === "week" && (
          <WeekView
            dates={dateRange}
            appointments={filteredAppointments}
            getAppointmentsForDate={getAppointmentsForDate}
            onAppointmentClick={onAppointmentClick}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
          />
        )}
        {viewMode === "month" && (
          <MonthView
            currentDate={currentDate}
            dates={dateRange}
            appointments={filteredAppointments}
            getAppointmentsForDate={getAppointmentsForDate}
            onAppointmentClick={onAppointmentClick}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
          />
        )}
        {viewMode === "agenda" && (
          <AgendaView
            appointments={filteredAppointments}
            onAppointmentClick={onAppointmentClick}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
          />
        )}
        {viewMode === "search" && (
          <AppointmentSearch
            appointments={appointments || []}
            onAppointmentClick={onAppointmentClick}
            onBackToCalendar={() => {setViewMode("week");setSearchQuery("");setStatusFilter("all")}} // Volver a la vista anterior
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
            initialSearchQuery={searchQuery}
            initialStatusFilter={statusFilter}
          />
        )}
        {/* Estado vacío cuando no hay resultados */}
        {filteredAppointments.length === 0 && (
          <Card className="p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              {appointments?.length === 0
                ? "No hay citas programadas"
                : "No se encontraron citas"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {appointments?.length === 0
                ? "Las citas aparecerán aquí cuando se programen"
                : "Intenta ajustar los filtros de búsqueda o limpiar los filtros actuales"}
            </p>
            {(searchQuery || statusFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

// Day View Component - Ahora ocupa ancho completo en lg
function DayView({
  date,
  appointments,
  onAppointmentClick,
  getStatusColor,
  getStatusLabel,
}: {
  date: Date;
  appointments: FullAppointment[] | undefined;
  onAppointmentClick?: (apt: FullAppointment) => void;
  getStatusColor: (status: AppointmentStatus) => string;
  getStatusLabel: (status: AppointmentStatus) => string;
}) {
  const hours = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9;
    return {
      value: hour,
      label: hour <= 12 ? `${hour} AM` : `${hour - 12} PM`,
    };
  });

  const formatTime = (date: Date) => {
    const normalizedDate = normalizeToLocal(date);
    return normalizedDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Card className="w-full overflow-hidden">
      <div className="grid grid-cols-[80px_1fr] divide-x">
        {/* Time column */}
        <div className="bg-muted/30">
          <div className="h-16 border-b flex items-center justify-center">
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          {hours.map((hourObj) => (
            <div
              key={hourObj.value}
              className="h-20 border-b flex items-start justify-center pt-2"
            >
              <span className="text-xs text-muted-foreground font-medium">
                {hourObj.label}
              </span>
            </div>
          ))}
        </div>

        {/* Appointments column */}
        <div className="relative">
          <div className="h-16 border-b bg-card flex items-center px-4">
            <h3 className="font-semibold">
              {format(date, "EEEE, d 'de' MMMM", { locale: es })}
            </h3>
          </div>
          <div className="relative">
            {hours.map((hourObj) => (
              <div key={hourObj.value} className="h-20 border-b" />
            ))}

            {appointments?.map((apt) => {
              const normalizedStartDate = normalizeToLocal(apt.date);
              const normalizedEndDate = normalizeToLocal(apt.endDate);

              const startHour = normalizedStartDate.getHours();
              const startMinute = normalizedStartDate.getMinutes();
              const endHour = normalizedEndDate.getHours();
              const endMinute = normalizedEndDate.getMinutes();

              if (startHour < 9 || startHour > 17) {
                return null;
              }

              const top = (startHour - 9) * 80 + (startMinute / 60) * 80;
              const durationInMinutes =
                (endHour - startHour) * 60 + (endMinute - startMinute);
              const height = (durationInMinutes / 60) * 80;

              return (
                <button
                  key={apt.id}
                  onClick={() => onAppointmentClick?.(apt)}
                  className="absolute left-2 right-2 rounded-lg p-3 border-l-4 bg-card hover:shadow-md transition-all duration-200 text-left group"
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                    borderLeftColor: "var(--color-primary)",
                  }}
                >
                  <div className="flex flex-col gap-1 h-full">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-sm line-clamp-1">
                        {apt.user.name}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn("text-xs", getStatusColor(apt.status))}
                      >
                        {getStatusLabel(apt.status)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {apt.services[0]?.service?.name ||
                        "Servicio no especificado"}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium mt-auto">
                      {formatTime(apt.date)} - {formatTime(apt.endDate)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}

// Week View Component - Mejorado para móvil
function WeekView({
  dates,
  // appointments,
  getAppointmentsForDate,
  onAppointmentClick,
  getStatusColor,
  getStatusLabel,
}: {
  dates: Date[];
  appointments: FullAppointment[] | undefined;
  onAppointmentClick?: (apt: FullAppointment) => void;
  getAppointmentsForDate: (date: Date) => FullAppointment[] | undefined;
  getStatusColor: (status: AppointmentStatus) => string;
  getStatusLabel: (status: AppointmentStatus) => string;
}) {
  const hours = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9;
    return {
      value: hour,
      label: hour <= 12 ? `${hour} AM` : `${hour - 12} PM`,
    };
  });

  // Función para calcular layout sin solapamientos (versión móvil simplificada)
  const calculateAppointmentLayout = (appointments: FullAppointment[]) => {
    if (!appointments.length) return [];

    const sortedAppointments = [...appointments].sort((a, b) => {
      const aStart = normalizeToLocal(a.date).getTime();
      const bStart = normalizeToLocal(b.date).getTime();
      return aStart - bStart;
    });

    const layout: Array<{
      appointment: FullAppointment;
      top: number;
      height: number;
      left: number;
      width: number;
    }> = [];

    let currentGroup: FullAppointment[] = [];
    let groupEndTime = 0;

    sortedAppointments.forEach((apt, index) => {
      const startTime = normalizeToLocal(apt.date).getTime();
      const endTime = normalizeToLocal(apt.endDate).getTime();

      if (startTime >= groupEndTime) {
        if (currentGroup.length > 0) {
          processGroup(currentGroup, layout);
          currentGroup = [];
        }
        groupEndTime = endTime;
      } else {
        groupEndTime = Math.max(groupEndTime, endTime);
      }

      currentGroup.push(apt);

      if (index === sortedAppointments.length - 1) {
        processGroup(currentGroup, layout);
      }
    });

    return layout;
  };

  interface LayoytProps{
    appointment: FullAppointment;
    top: number;
    height: number;
    left: number;
    width: number;
}

  const processGroup = (group: FullAppointment[], layout: LayoytProps[]) => {
    const columns: FullAppointment[][] = [];

    group.forEach((apt) => {
      let placed = false;

      for (const column of columns) {
        const lastAppointment = column[column.length - 1];
        const lastEndTime = normalizeToLocal(lastAppointment.endDate).getTime();
        const currentStartTime = normalizeToLocal(apt.date).getTime();

        if (currentStartTime >= lastEndTime) {
          column.push(apt);
          placed = true;
          break;
        }
      }

      if (!placed) {
        columns.push([apt]);
      }
    });

    const totalColumns = columns.length;

    columns.forEach((column, columnIndex) => {
      column.forEach((apt) => {
        const normalizedStart = normalizeToLocal(apt.date);
        const normalizedEnd = normalizeToLocal(apt.endDate);

        const startHour = normalizedStart.getHours();
        const startMinute = normalizedStart.getMinutes();
        const endHour = normalizedEnd.getHours();
        const endMinute = normalizedEnd.getMinutes();

        if (startHour < 9 || startHour > 17) return;

        const top = (startHour - 9) * 80 + (startMinute / 60) * 80;
        const durationInMinutes =
          (endHour - startHour) * 60 + (endMinute - startMinute);
        const height = (durationInMinutes / 60) * 80;

        const left = 1 + columnIndex * (98 / totalColumns);
        const width = 98 / totalColumns - 2;

        layout.push({
          appointment: apt,
          top,
          height: Math.max(height, 40),
          left,
          width,
        });
      });
    });
  };

  // Vista móvil simplificada
  const MobileWeekView = () => (
    <div className="block md:hidden space-y-4">
      {dates.map((date) => {
        const dayAppointments = getAppointmentsForDate(date);
        if (!dayAppointments?.length) return null;

        return (
          <Card key={date.toISOString()} className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div
                className={cn(
                  "flex flex-col items-center justify-center w-12 h-12 rounded-lg border",
                  isToday(date)
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-muted/50 border-border"
                )}
              >
                <span className="text-xs font-medium uppercase">
                  {format(date, "MMM", { locale: es })}
                </span>
                <span className="text-lg font-bold">{format(date, "d")}</span>
              </div>
              <div>
                <h3 className="font-semibold capitalize">
                  {format(date, "EEEE", { locale: es })}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {dayAppointments.length}{" "}
                  {dayAppointments.length === 1 ? "cita" : "citas"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {dayAppointments.map((apt) => {
                const normalizedStart = normalizeToLocal(apt.date);
                const normalizedEnd = normalizeToLocal(apt.endDate);

                return (
                  <button
                    key={apt.id}
                    onClick={() => onAppointmentClick?.(apt)}
                    className="w-full text-left p-3 rounded-lg border-l-4 bg-card hover:shadow-md transition-all duration-200"
                    style={{ borderLeftColor: "var(--color-primary)" }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-sm line-clamp-1">
                        {apt.user.name}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn("text-xs", getStatusColor(apt.status))}
                      >
                        {getStatusLabel(apt.status)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {normalizedStart.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}{" "}
                      -{" "}
                      {normalizedEnd.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </p>
                  </button>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Vista móvil */}
      <MobileWeekView />

      {/* Vista desktop */}
      <Card className="hidden md:block overflow-hidden w-full">
        <div className="overflow-x-auto">
          <div className="min-w-[640px] w-full">
            <div className="grid grid-cols-8 divide-x border-b bg-muted/30">
              <div className="p-3 flex items-center justify-center">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              {dates.map((date) => (
                <div key={date.toISOString()} className="p-3 text-center">
                  <p className="text-xs text-muted-foreground font-medium uppercase">
                    {format(date, "EEE", { locale: es })}
                  </p>
                  <p
                    className={cn(
                      "text-lg font-semibold mt-1",
                      isToday(date) && "text-primary"
                    )}
                  >
                    {format(date, "d")}
                  </p>
                  {isToday(date) && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mx-auto mt-1" />
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-8 divide-x">
              <div className="bg-muted/30">
                {hours.map((hourObj) => (
                  <div
                    key={hourObj.value}
                    className="h-20 border-b flex items-start justify-center pt-2"
                  >
                    <span className="text-xs text-muted-foreground font-medium">
                      {hourObj.label}
                    </span>
                  </div>
                ))}
              </div>

              {dates.map((date) => {
                const dayAppointments = getAppointmentsForDate(date);
                const appointmentLayout = calculateAppointmentLayout(
                  dayAppointments || []
                );

                return (
                  <div key={date.toISOString()} className="relative">
                    {hours.map((hourObj) => (
                      <div key={hourObj.value} className="h-20 border-b" />
                    ))}

                    {appointmentLayout.map(
                      ({ appointment: apt, top, height, left, width }) => (
                        <button
                          key={apt.id}
                          onClick={() => onAppointmentClick?.(apt)}
                          className="absolute rounded-md p-2 border-l-2 bg-card hover:shadow-md transition-all duration-200 text-left overflow-hidden group border shadow-sm"
                          style={{
                            top: `${top}px`,
                            height: `${height}px`,
                            left: `${left}%`,
                            width: `${width}%`,
                            borderLeftColor: "var(--color-primary)",
                            zIndex: 10,
                          }}
                        >
                          <div className="flex flex-col gap-1 h-full">
                            <div className="flex items-start justify-between gap-1">
                              <p className="font-semibold text-xs line-clamp-1 flex-1">
                                {apt.user.name}
                              </p>
                            </div>
                          </div>
                        </button>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

// Month View Component - Mejorado para móvil
function MonthView({
  currentDate,
  // dates,
  // appointments,
  getAppointmentsForDate,
  onAppointmentClick,
  getStatusColor,
  // getStatusLabel,
}: {
  currentDate: Date;
  dates: Date[];
  appointments: FullAppointment[] | undefined;
  getAppointmentsForDate: (date: Date) => FullAppointment[] | undefined;
  onAppointmentClick?: (apt: FullAppointment) => void;
  getStatusColor: (status: AppointmentStatus) => string;
  getStatusLabel?: (status: AppointmentStatus) => string;
}) {
  const firstDay = startOfMonth(currentDate);
  const startDay = startOfWeek(firstDay, { weekStartsOn: 1 });
  const endDay = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDay, end: endDay });

  const weeks: Date[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  // Vista móvil simplificada
  const MobileMonthView = () => (
    <div className="block md:hidden space-y-4">
      {weeks.map((week, weekIdx) => (
        <div key={weekIdx} className="space-y-3">
          {week.map((date) => {
            const dayAppointments = getAppointmentsForDate(date) || [];
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isTodayDate = isToday(date);

            if (!isCurrentMonth && dayAppointments.length === 0) return null;

            return (
              <Card key={date.toISOString()} className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center w-10 h-10 rounded-lg border",
                        isTodayDate
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-muted/50 border-border"
                      )}
                    >
                      <span className="text-xs font-medium">
                        {format(date, "MMM", { locale: es })}
                      </span>
                      <span className="text-base font-bold">
                        {format(date, "d")}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm capitalize">
                        {format(date, "EEEE", { locale: es })}
                      </h3>
                      {dayAppointments.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {dayAppointments.length}{" "}
                          {dayAppointments.length === 1 ? "cita" : "citas"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {dayAppointments.length > 0 && (
                  <div className="space-y-2">
                    {dayAppointments.slice(0, 2).map((apt) => (
                      <button
                        key={apt.id}
                        onClick={() => onAppointmentClick?.(apt)}
                        className="w-full text-left p-2 rounded-md border-l-4 bg-card hover:bg-accent/50 text-xs"
                        style={{ borderLeftColor: "var(--color-primary)" }}
                      >
                        <p className="font-medium line-clamp-1">
                          {apt.user.name}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full",
                              getStatusColor(apt.status)
                            )}
                          />
                          <span className="text-muted-foreground text-xs">
                            {normalizeToLocal(apt.date).toLocaleTimeString(
                              "es-ES",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              }
                            )}
                          </span>
                        </div>
                      </button>
                    ))}
                    {dayAppointments.length > 2 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{dayAppointments.length - 2} más
                      </p>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Vista móvil */}
      <MobileMonthView />

      {/* Vista desktop */}
      <Card className="hidden md:block overflow-hidden w-full">
        <div className="grid grid-cols-7 divide-x border-b bg-muted/30">
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
            <div key={day} className="p-3 text-center">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                {day}
              </p>
            </div>
          ))}
        </div>

        <div className="divide-y">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 divide-x">
              {week.map((date) => {
                const dayAppointments = getAppointmentsForDate(date) || [];
                const isCurrentMonth = isSameMonth(date, currentDate);
                const isTodayDate = isToday(date);

                return (
                  <div
                    key={date.toISOString()}
                    className={cn(
                      "min-h-[120px] p-2 bg-card hover:bg-accent/5 transition-colors",
                      !isCurrentMonth && "bg-muted/20 text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={cn(
                          "flex items-center justify-center w-7 h-7 text-sm font-semibold rounded-full transition-colors",
                          isTodayDate && "bg-primary text-primary-foreground",
                          !isCurrentMonth && "text-muted-foreground/60"
                        )}
                      >
                        {format(date, "d")}
                      </span>
                      {dayAppointments.length > 0 && (
                        <span className="text-xs text-muted-foreground font-medium">
                          {dayAppointments.length}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      {dayAppointments.slice(0, 3).map((apt) => (
                        <button
                          key={apt.id}
                          onClick={() => onAppointmentClick?.(apt)}
                          className={cn(
                            "w-full text-left p-2 rounded-md border-l-4",
                            "bg-card hover:bg-accent/50 hover:shadow-sm",
                            "transition-all duration-200 text-xs",
                            "focus:outline-none focus:ring-2 focus:ring-primary/20"
                          )}
                          style={{
                            borderLeftColor: "var(--color-primary)",
                          }}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <p className="font-medium text-xs line-clamp-1 flex-1 text-left">
                              {apt.user.name}
                            </p>
                          </div>
                        </button>
                      ))}

                      {dayAppointments.length > 3 && (
                        <div className="text-center pt-1">
                          <span className="text-xs text-muted-foreground bg-accent/30 px-2 py-1 rounded-full">
                            +{dayAppointments.length - 3} más
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

// Agenda View Component (ya está responsive)
function AgendaView({
  appointments,
  onAppointmentClick,
  getStatusColor,
  getStatusLabel,
}: {
  appointments: FullAppointment[] | undefined;
  onAppointmentClick?: (apt: FullAppointment) => void;
  getStatusColor: (status: AppointmentStatus) => string;
  getStatusLabel: (status: AppointmentStatus) => string;
}) {
  const formatTime = (date: Date) => {
    const normalizedDate = normalizeToLocal(date);
    return normalizedDate.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatFullDate = (date: Date) => {
    const normalizedDate = normalizeToLocal(date);
    return format(normalizedDate, "d 'de' MMMM, yyyy", { locale: es });
  };

  const groupedAppointments = useMemo(() => {
    const groups: { [key: string]: FullAppointment[] } = {};

    appointments
      ?.sort((a, b) => {
        const aTime = normalizeToLocal(a.date).getTime();
        const bTime = normalizeToLocal(b.date).getTime();
        return aTime - bTime;
      })
      .forEach((apt) => {
        const normalizedDate = normalizeToLocal(apt.date);
        const dateKey = normalizedDate.toDateString();

        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(apt);
      });

    return groups;
  }, [appointments]);

  return (
    <div className="space-y-6">
      {Object.entries(groupedAppointments).map(([date, dayAppointments]) => {
        const currentDate = new Date(date);

        return (
          <div key={date} className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 rounded-lg border",
                  isToday(currentDate)
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-muted/50 border-border"
                )}
              >
                <span className="text-xs font-medium uppercase">
                  {format(currentDate, "MMM", { locale: es })}
                </span>
                <span className="text-2xl font-bold">
                  {format(currentDate, "d")}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-lg capitalize">
                  {format(currentDate, "EEEE", { locale: es })}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {dayAppointments.length}{" "}
                  {dayAppointments.length === 1 ? "cita" : "citas"} •{" "}
                  {formatFullDate(currentDate)}
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {dayAppointments.map((apt) => {
                const normalizedStart = normalizeToLocal(apt.date);
                const normalizedEnd = normalizeToLocal(apt.endDate);

                return (
                  <Card
                    key={apt.id}
                    className={cn(
                      "p-4 hover:shadow-md transition-all duration-200 cursor-pointer border-l-4",
                      "hover:border-primary/50 group bg-card"
                    )}
                    style={{ borderLeftColor: "var(--color-primary)" }}
                    onClick={() => onAppointmentClick?.(apt)}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm truncate">
                            {apt.user.name}
                          </p>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs mt-1",
                              getStatusColor(apt.status)
                            )}
                          >
                            {getStatusLabel(apt.status)}
                          </Badge>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-medium whitespace-nowrap">
                          {formatTime(normalizedStart)}
                        </p>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTime(normalizedEnd)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground line-clamp-1">
                          {apt.services[0]?.service?.name ||
                            "Servicio no especificado"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {apt.duration} min
                        </span>
                        {apt.total_price > 0 && (
                          <span className="font-semibold">
                            {new Intl.NumberFormat("es-CU", {
                              style: "currency",
                              currency: "CUP",
                            }).format(apt.total_price)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {apt.user.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{apt.user.phone}</span>
                          </div>
                        )}
                        {apt.user.email && (
                          <div className="flex items-center gap-1 truncate">
                            <Mail className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{apt.user.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      {Object.keys(groupedAppointments).length === 0 && (
        <Card className="p-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">
            No hay citas programadas
          </h3>
          <p className="text-sm text-muted-foreground">
            Las citas aparecerán aquí cuando se programen
          </p>
        </Card>
      )}
    </div>
  );
}
