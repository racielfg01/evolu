"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Save,
  X,
  Loader2,
  // Eye,
  CreditCard,
} from "lucide-react";
import { useEnhancedBooking } from "./enhanced-booking-context";
import { UserInfo } from "@/lib/types";
import { useUserAppointments } from "@/lib/hooks/appointment.hooks";
import { BookingDetailsDialog } from "../booking/booking-details-dialog";

export function UserProfile({ initTag = "profile" }: { initTag?: string }) {
  const { state, dispatch } = useEnhancedBooking();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserInfo>(
    state.userInfo || {
      name: "",
      email: "",
      phone: "",
      notes: "",
    }
  );

  const {
    data: userBookings,
    isLoading: isUserBookings,
    // error: errorUserBookings,
  } = useUserAppointments(state.userInfo.id);

  const handleSave = () => {
    dispatch({ type: "SET_USER_INFO", payload: editedUser });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(
      state.userInfo || { name: "", email: "", phone: "", notes: "" }
    );
    setIsEditing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "PENDING":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Confirmada";
      case "COMPLETED":
        return "Completada";
      case "PENDING":
        return "Pendiente";
      case "CANCELLED":
        return "Cancelada";
      default:
        return status;
    }
  };

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "CONFIRMED":
        return "default";
      case "COMPLETED":
        return "secondary";
      case "PENDING":
        return "outline";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (!state?.userInfo) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Por favor inicia sesión para ver tu perfil
        </p>
      </div>
    );
  }


  return (
    <div className="flex flex-col mt-10 space-y-6 place-content-center max-w-screen-xl">
      {/* <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Mi Perfil</h2>
        <p className="text-muted-foreground">
          Gestiona tu información personal y revisa tus reservas
        </p>
      </div> */}

      <Tabs defaultValue={initTag} className="mt-10">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Información Personal</TabsTrigger>
          <TabsTrigger value="bookings">Mis Reservas</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    isEditing ? handleCancel() : setIsEditing(true)
                  }
                >
                  {isEditing ? (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      Cancelar
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={state.userInfo.avatar || "/placeholder.svg"}
                    alt={state.userInfo.name}
                  />
                  <AvatarFallback className="text-lg">
                    {state.userInfo.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    Cambiar Foto
                  </Button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedUser.name}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, name: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{state.userInfo.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedUser.email}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, email: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{state.userInfo.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editedUser.phone}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, phone: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{state.userInfo.phone}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas Adicionales</Label>
                {isEditing ? (
                  <Textarea
                    id="notes"
                    value={editedUser.notes}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, notes: e.target.value })
                    }
                    placeholder="Alergias, preferencias, etc."
                  />
                ) : (
                  <div className="p-2 bg-muted rounded min-h-[60px]">
                    <span className="text-muted-foreground">
                      {state.userInfo.notes || "Sin notas adicionales"}
                    </span>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" />
                    Guardar Cambios
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Mis Reservas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isUserBookings ? (
                <div className="text-center py-8">
                  <Loader2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
                  <p className="text-muted-foreground">Cargando ...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userBookings?.length == 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No tienes reservas aún
                      </p>
                      <Button className="mt-4">Reservar Primera Cita</Button>
                    </div>
                  ) : (
                    userBookings
                      ?.sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime()
                      )
                      .map((booking) => (
                        // <Card key={booking.id} className="border-l-4 border-l-primary">
                        //   <CardContent className="p-4">
                        //     <div className="flex items-start justify-between">
                        //       <div className="space-y-2">

                        //         <div className="flex items-center gap-4 text-sm">
                        //            <Badge variant={getStatusVariant(booking.status)}>
                        //             {getStatusIcon(booking.status)}
                        //             <span className="ml-1 ">{getStatusText(booking.status)}</span>
                        //           </Badge>
                        //           <div className="flex items-center gap-1">
                        //             <Calendar className="h-4 w-4 text-muted-foreground" />
                        //             <span className="font-semibold">{booking.date.toLocaleDateString("es-ES")}</span>
                        //           </div>

                        //         </div>

                        //         <div className="flex items-center gap-2">
                        //       <p className="text-sm text-muted-foreground">${booking.total_price}</p>

                        //         </div>

                        //         <Button size={"sm"} className="gap-2">
                        //           Ver detalles
                        //         </Button>

                        //       </div>

                        //       <div className="text-right">

                        //         {booking.status === "CONFIRMED" && (
                        //           <div className="mt-2 flex flex-col gap-2">
                        //             <Button variant="outline" size="sm" className="w-auto">
                        //               Reprogramar
                        //             </Button>
                        //             <Button variant="destructive" size="sm" className="w-auto">
                        //               Cancelar
                        //             </Button>
                        //           </div>
                        //         )}
                        //       </div>
                        //     </div>
                        //   </CardContent>
                        // </Card>
                        <Card
                          key={booking.id}
                          className="border-l-4 border-l-primary transition-all duration-200 hover:shadow-md"
                         
                        >
                          <CardContent className="p-5">
                            <div className="  flex flex-col sm:flex-row items-start justify-between gap-4">
                              <div className="absolute w-[280px] flex justify-end">

                                 <Badge
                                    variant={getStatusVariant(booking.status)}
                                    className=" relative top-0 right-5 flex items-center gap-1 py-1 px-3 font-medium"
                                    >
                                    {getStatusIcon(booking.status)}
                                    <span className="ml-1">
                                      {getStatusText(booking.status)}
                                    </span>
                                  </Badge>
                                    </div>
                              {/* Información principal */}
                              <div className="space-y-2 flex-1">
                                <div className="flex gap-2 ">
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span className="font-medium text-foreground text-sm">
                                      {booking.date.toLocaleDateString(
                                        "es-ES",
                                        {
                                          weekday: "short",
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                        }
                                      )}
                                    </span>
                                  </div>
                               

                                </div>

                               

                                {/* Precio y duración (si está disponible) */}
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1 font-semibold text-primary">
                                    <CreditCard className="h-4 w-4" />
                                    <span>${booking.total_price}</span>
                                  </div>

                                  {booking.duration && (
                                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                                      <Clock className="h-4 w-4" />
                                      <span>{booking.duration} min</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Acciones */}
                              <div className="flex flex-col gap-2 w-full sm:w-auto">
                                <div className="flex sm:flex-col gap-2">
                                  <BookingDetailsDialog booking={booking}>
 
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 sm:flex-none gap-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Lógica para ver detalles
                                    }}
                                    >
                                    {/* <Eye className="h-4 w-4" /> */}
                                    Detalles
                                  </Button>
                                    </BookingDetailsDialog>

                                  {/* {booking.status === "CONFIRMED" && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1 sm:flex-none gap-2"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                        }}
                                      >
                                        Reprogramar
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        className="flex-1 sm:flex-none gap-2"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                        }}
                                      >
                                        Cancelar
                                      </Button>
                                    </>
                                  )} */}
                                </div>

                                {/* Información adicional si es necesario */}
                                {/* {booking.upcoming && ( */}
                                   {/*  <div className="text-xs text-muted-foreground text-center sm:text-right mt-1">
                                  Próxima reserva en
                              {booking.upcoming} 
                                </div>*/}
                                {/* )} */}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
