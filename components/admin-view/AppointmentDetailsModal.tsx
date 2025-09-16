import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Calendar, Clock, User, Mail, Phone, CreditCard, Scissors } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FullAppointment } from "@/lib/actions/appointment.actions";
// import type { FullAppointment } from "@/lib/types"; // Asegúrate de importar el tipo correcto

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: FullAppointment | null;
}

const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  isOpen,
  onClose,
  appointment,
}) => {
  if (!appointment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      case "NO_SHOW":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
  };

  const formatTime = (date: Date) => {
    return format(date, "HH:mm", { locale: es });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalles de la Cita</span>
            <Badge className={getStatusColor(appointment.status)}>
              {appointment.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Información completa de la reserva #{appointment.cuid}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Información del Horario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fecha y Hora
              </h3>
              <div className="text-sm">
                <p className="font-medium">{formatDate(appointment.date)}</p>
                <p className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatTime(appointment.date)} - {formatTime(appointment.endDate)}
                </p>
                <p className="text-muted-foreground">
                  Duración: {appointment.duration} minutos
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Información de Pago
              </h3>
              <div className="text-sm">
                <p className="font-medium">{formatCurrency(appointment.total_price)}</p>
                <p className="text-muted-foreground">
                  {appointment.services.length} servicio(s)
                </p>
              </div>
            </div>
          </div>

          {/* Información del Cliente */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Información del Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">{appointment.user.name}</p>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {appointment.user.email}
                </p>
              </div>
              {appointment.user.phone && (
                <div>
                  <p className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {appointment.user.phone}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Servicios */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Scissors className="h-4 w-4" />
              Servicios Contratados
            </h3>
            <div className="space-y-3">
              {appointment.services.map((appointmentService) => (
                <div
                  key={appointmentService.id}
                  className="flex justify-between items-start p-3 bg-white rounded border"
                >
                  <div className="flex-1">
                    <p className="font-medium">{appointmentService.service.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Duración: {appointmentService.service.duration} min
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Cantidad: {appointmentService.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(appointmentService.service.price)}
                    </p>
                    {appointmentService.quantity > 1 && (
                      <p className="text-sm text-muted-foreground">
                        Total: {formatCurrency(appointmentService.service.price * appointmentService.quantity)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Información Adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="space-y-2">
              <h3 className="font-semibold">Información de la Reserva</h3>
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">Creada:</span>{" "}
                  {format(appointment.createdAt, "dd/MM/yyyy HH:mm", { locale: es })}
                </p>
                <p>
                  <span className="font-medium">Actualizada:</span>{" "}
                  {format(appointment.updatedAt, "dd/MM/yyyy HH:mm", { locale: es })}
                </p>
                <p>
                  <span className="font-medium">ID:</span> {appointment.id}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Resumen</h3>
              <div className="text-sm space-y-1">
                <p className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(appointment.total_price)}</span>
                </p>
                <p className="flex justify-between font-semibold border-t pt-1">
                  <span>Total:</span>
                  <span>{formatCurrency(appointment.total_price)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          {appointment.status === "PENDING" && (
            <Button variant="default">Confirmar Cita</Button>
          )}
          {appointment.status === "CONFIRMED" && (
            <Button variant="secondary">Marcar como Completada</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetailsModal;