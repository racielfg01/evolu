"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Search, Calendar, Clock, User, Phone, Mail, Filter } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { FullAppointment } from "@/lib/actions/appointment.actions"
import { AppointmentStatus } from "@prisma/client"
import { normalizeToLocal } from "./ApoimentsManagment"

interface SearchResultsViewProps {
  appointments: FullAppointment[]
  onAppointmentClick: (appointment: FullAppointment) => void
  onBackToCalendar?: () => void
  getStatusColor: (status: AppointmentStatus) => string
  getStatusLabel: (status: AppointmentStatus) => string
}

export function SearchResultsView({
  appointments,
  onAppointmentClick,
  onBackToCalendar,
  getStatusColor,
  getStatusLabel,
}: SearchResultsViewProps) {
  const [sortBy, setSortBy] = useState<"date" | "name" | "status">("date")
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus | "all">("all")

  const formatDate = (date: Date) => {
    const normalizedDate = normalizeToLocal(date);
    return format(normalizedDate, "EEE, d 'de' MMM", { locale: es });
  };

  const formatTime = (date: Date) => {
    const normalizedDate = normalizeToLocal(date);
    return normalizedDate.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CU", {
      style: "currency",
      currency: "CUP",
    }).format(amount);
  };

  const filteredAndSortedAppointments = appointments
    .filter(apt => selectedStatus === "all" || apt.status === selectedStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return a.date.getTime() - b.date.getTime();
        case "name":
          return a.user.name.localeCompare(b.user.name);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-4 p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl font-bold truncate">Resultados de Búsqueda</h1>
          <p className="text-muted-foreground text-sm">
            {filteredAndSortedAppointments.length} citas encontradas
          </p>
        </div>
        
        {onBackToCalendar && (
          <Button variant="outline" size="sm" onClick={onBackToCalendar} className="text-xs h-8">
            Volver
          </Button>
        )}
      </div>

      {/* Filtros y ordenamiento */}
      <Card className="p-3">
        <div className="flex flex-col xs:flex-row gap-3">
          <div className="flex-1">
            <label className="text-xs font-medium mb-1 block">Ordenar por</label>
            <Select value={sortBy} onValueChange={(value: "date" | "name" | "status") => setSortBy(value)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date" className="text-xs">Fecha y Hora</SelectItem>
                <SelectItem value="name" className="text-xs">Nombre</SelectItem>
                <SelectItem value="status" className="text-xs">Estado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <label className="text-xs font-medium mb-1 block">Filtrar estado</label>
            <Select value={selectedStatus} onValueChange={(value: AppointmentStatus | "all") => setSelectedStatus(value)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
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
        </div>
      </Card>

      {/* Lista de resultados */}
      <div className="space-y-3">
        {filteredAndSortedAppointments.map((apt) => {
          const normalizedStart = normalizeToLocal(apt.date);
          const normalizedEnd = normalizeToLocal(apt.endDate);
          
          return (
            <Card 
              key={apt.id}
              className="p-3 sm:p-4 hover:shadow-md transition-all duration-200 cursor-pointer border-l-4"
              style={{ borderLeftColor: "var(--color-primary)" }}
              onClick={() => onAppointmentClick(apt)}
            >
              <div className="flex flex-col gap-3">
                {/* Header con nombre y estado */}
                <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-primary flex-shrink-0" />
                      <h3 className="font-semibold text-sm truncate">{apt.user.name}</h3>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getStatusColor(apt.status))}
                    >
                      {getStatusLabel(apt.status)}
                    </Badge>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">
                      {formatCurrency(apt.total_price)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {apt.duration} min
                    </p>
                  </div>
                </div>

                {/* Fecha y hora */}
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span>{formatDate(apt.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span>
                      {formatTime(apt.date)} - {formatTime(apt.endDate)}
                    </span>
                  </div>
                </div>

                {/* Servicios */}
                <div>
                  <h4 className="font-medium text-xs mb-1">Servicios:</h4>
                  <div className="flex flex-wrap gap-1">
                    {apt.services.slice(0, 2).map((serviceAppointment, index) => (
                      <Badge key={index} variant="secondary" className="text-xs py-0">
                        {serviceAppointment.service.name} 
                        {serviceAppointment.quantity > 1 && ` (x${serviceAppointment.quantity})`}
                      </Badge>
                    ))}
                    {apt.services.length > 2 && (
                      <Badge variant="secondary" className="text-xs py-0">
                        +{apt.services.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Información de contacto */}
                <div className="flex flex-col gap-1 text-xs">
                  {apt.user.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{apt.user.email}</span>
                    </div>
                  )}
                  {apt.user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span>{apt.user.phone}</span>
                    </div>
                  )}
                </div>

                {/* Botón de acción */}
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Estado vacío */}
      {filteredAndSortedAppointments.length === 0 && (
        <Card className="p-6 text-center">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">
            {selectedStatus === "all" ? "No se encontraron citas" : "No hay citas con este estado"}
          </h3>
          <p className="text-muted-foreground mb-4 text-sm">
            {selectedStatus === "all" 
              ? "Intenta ajustar los criterios de búsqueda" 
              : "No hay citas con el estado seleccionado"
            }
          </p>
          {selectedStatus !== "all" && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedStatus("all")}
            >
              Mostrar todos
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}

// Componente principal que integra la búsqueda
interface AppointmentSearchProps {
  appointments: FullAppointment[]
  onAppointmentClick: (appointment: FullAppointment) => void
  onBackToCalendar?: () => void
  getStatusColor: (status: AppointmentStatus) => string
  getStatusLabel: (status: AppointmentStatus) => string
  initialSearchQuery?: string
  initialStatusFilter?: AppointmentStatus | "all"
}

export function AppointmentSearch({
  appointments,
  onAppointmentClick,
  onBackToCalendar,
  getStatusColor,
  getStatusLabel,
  initialSearchQuery = "",
  initialStatusFilter = "all",
}: AppointmentSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">(initialStatusFilter)

  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter
    
    if (searchQuery.trim() === "") {
      return matchesStatus;
    }

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      apt.user.name.toLowerCase().includes(query) ||
      apt.user.email?.toLowerCase().includes(query) ||
      apt.user.phone?.toLowerCase().includes(query) ||
      apt.services.some(serviceAppointment => 
        serviceAppointment.service.name.toLowerCase().includes(query)
      ) ||
      apt.id.toLowerCase().includes(query) ||
      apt.cuid.toLowerCase().includes(query) ||
      format(normalizeToLocal(apt.date), "EEEE, d 'de' MMMM", { locale: es }).toLowerCase().includes(query);

    return matchesSearch && matchesStatus;
  })

  return (
    <div className="space-y-4 p-2 sm:p-4">
      {/* Barra de búsqueda */}
      <div className="space-y-3">
        <div className="flex flex-col xs:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente, email, teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 text-sm h-9"
            />
          </div>
          
          <Select value={statusFilter} 
            onValueChange={(value: AppointmentStatus | "all") => setStatusFilter(value)}
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

        {/* Contadores y feedback */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {filteredAppointments.length} de {appointments.length} citas
          </div>
          
          {(searchQuery || statusFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="h-7 text-xs"
            >
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Resultados */}
      <SearchResultsView
        appointments={filteredAppointments}
        onAppointmentClick={onAppointmentClick}
        onBackToCalendar={onBackToCalendar}
        getStatusColor={getStatusColor}
        getStatusLabel={getStatusLabel}
      />
    </div>
  );
}