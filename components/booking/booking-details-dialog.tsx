
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FullAppointment } from "@/lib/actions/appointment.actions";
import { ReactElement } from "react";
import { normalizeToLocal } from "../admin-view/ApoimentsManagment";

interface BookingDetailsDialogPros{
    booking:FullAppointment,
    children:ReactElement
}

export function BookingDetailsDialog({ booking, children }:BookingDetailsDialogPros) {
  // Función para formatear fechas
  const formatDate = (dateString:Date) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

 

  // Determinar variante y icono según estado
  const getStatusDetails = (status:string) => {
    switch (status) {
      case "CONFIRMED":
        return { 
          variant: "default" as const, 
          icon: <CheckCircle className="h-4 w-4" />, 
          text: "Confirmada" 
        };
      case "CANCELLED":
        return { 
          variant: "destructive" as const, 
          icon: <XCircle className="h-4 w-4" />, 
          text: "Cancelada" 
        };
      case "PENDING":
        return { 
          variant: "secondary" as const, 
          icon: <AlertCircle className="h-4 w-4" />, 
          text: "Pendiente" 
        };
      case "COMPLETED":
        return { 
          variant: "default" as const, 
          icon: <CheckCircle className="h-4 w-4" />, 
          text: "Completada" 
        };
      case "NO_SHOW":
        return { 
          variant: "destructive" as const, 
          icon: <XCircle className="h-4 w-4" />, 
          text: "No asistió" 
        };
      default:
        return { 
          variant: "secondary" as const, 
          icon: null, 
          text: status 
        };
    }
  };

  const statusDetails = getStatusDetails(booking.status);

   const formatTime = (date: Date) => {
   const formatDate= normalizeToLocal(date).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })
              
    return formatDate
  };
  

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detalles de la reserva
            <Badge variant={statusDetails.variant} className="flex items-center gap-1">
              {statusDetails.icon}
              {statusDetails.text}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Información completa de la reserva #{booking.id.slice(-6).toUpperCase()}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Sección de información principal */}
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Información de la cita
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Fecha</p>
                  <p className="font-medium">{formatDate(booking.date)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Horario</p>
                  <p className="font-medium">
                    {formatTime(booking.date)} - {formatTime(booking.endDate)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Duración</p>
                  <p className="font-medium">{booking.duration} minutos</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Precio total</p>
                  <p className="font-medium">${booking.total_price}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Sección de servicios */}
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold">Servicios contratados</h3>
            
            {booking.services.map((service) => (
              <div key={service.id} className="rounded-lg border p-4">
                <h4 className="font-semibold">{service.service.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {service.service.description}
                </p>
                
                <div className="flex justify-between items-center mt-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Precio: </span>
                    <span className="font-medium">${service.service.price}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Duración: </span>
                    <span className="font-medium">{service.service.duration} min</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Cantidad: </span>
                    <span className="font-medium">{service.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Sección de información del cliente */}
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del cliente
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="font-medium">{booking.user.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{booking.user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p className="font-medium">{booking.user.phone}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información adicional */}
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold">Información adicional</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Reserva creada</p>
                <p className="font-medium">{formatDate(booking.createdAt)}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Última actualización</p>
                <p className="font-medium">{formatDate(booking.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones según el estado de la reserva */}
        {/* <div className="flex flex-col sm:flex-row gap-3 justify-end mt-4">
          {booking.status === "CONFIRMED" && (
            <>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                Reprogramar
              </Button>
              <Button variant="destructive" className="gap-2">
                <XCircle className="h-4 w-4" />
                Cancelar reserva
              </Button>
            </>
          )}
          <Button variant="default" className="gap-2">
            <Mail className="h-4 w-4" />
            Enviar recordatorio
          </Button>
        </div> */}
      </DialogContent>
    </Dialog>
  );
}