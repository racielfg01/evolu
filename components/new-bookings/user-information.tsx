"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, MessageSquare } from "lucide-react"
// import { useBooking } from "./booking-context"
import { useEnhancedBooking } from "./enhanced-booking-context"

interface ValidationErrors {
  name?: string
  email?: string
  phone?: string
}

export function UserInformation() {
  const { state, dispatch } = useEnhancedBooking()
  const [errors, setErrors] = useState<ValidationErrors>({})

  // const validateForm = (): boolean => {
  //   const newErrors: ValidationErrors = {}

  //   if (!state.userInfo.name.trim()) {
  //     newErrors.name = "El nombre es requerido"
  //   }

  //   if (!state.userInfo.email.trim()) {
  //     newErrors.email = "El correo electrónico es requerido"
  //   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.userInfo.email)) {
  //     newErrors.email = "Por favor ingresa un correo electrónico válido"
  //   }

  //   if (!state.userInfo.phone.trim()) {
  //     newErrors.phone = "El número de teléfono es requerido"
  //   } else if (!/^[+]?[1-9][\d]{0,15}$/.test(state.userInfo.phone.replace(/[\s\-()]/g, ""))) {
  //     newErrors.phone = "Por favor ingresa un número de teléfono válido"
  //   }

  //   setErrors(newErrors)
  //   return Object.keys(newErrors).length === 0
  // }

  const handleInputChange = (field: keyof typeof state.userInfo, value: string) => {
    dispatch({ type: "SET_USER_INFO", payload: { [field]: value } })

    // Limpiar error para este campo cuando el usuario empiece a escribir
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleNext = () => {
    dispatch({ type: "SET_STEP", payload: 4 })
    // if (validateForm()) {
    // }
  }

  const handleBack = () => {
    dispatch({ type: "SET_STEP", payload: 2 })
  }




  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Tu Información</h2>
        <p className="text-muted-foreground">Por favor proporciona tus datos de contacto para la cita</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Información de Contacto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
         {/*   <div className="grid gap-4 md:grid-cols-2">
           <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo *</Label>
              <Input
                id="name"
                placeholder="Ingresa tu nombre completo"
                value={state.userInfo.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={state.userInfo.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Número de Teléfono *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Ingresa tu número de teléfono"
              value={state.userInfo.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="notes">Solicitudes Especiales o Notas</Label>
            <Textarea
              id="notes"
              placeholder="Cualquier alergia, preferencia o solicitud especial..."
              value={state.userInfo.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={4}
            />
            <p className="text-sm text-muted-foreground">
              Opcional: Déjanos saber sobre cualquier alergia, sensibilidad de la piel o preferencias especiales
            </p>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <MessageSquare className="h-4 w-4" />
        <AlertDescription>
          Te enviaremos un correo de confirmación y un recordatorio por SMS 24 horas antes de tu cita.
        </AlertDescription>
      </Alert>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Volver a Fecha y Hora
        </Button>
        <Button onClick={handleNext}>Revisar Reserva</Button>
      </div>
    </div>
  )
}
