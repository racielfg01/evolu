"use client"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { MailCheck } from "lucide-react" // Importamos un icono relevante

export default function EmailConfirmationAlert() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast(
          <div className="flex items-center gap-2 bg-sage-300">
            <MailCheck className="h-4 w-4 accent-sage-600" />
            <span>Revisa tu correo electrónico</span>
          </div>, 
          {
            description: "Hemos enviado un enlace de confirmación a tu email. Por favor, revisa tu bandeja de entrada (y la carpeta de spam).",
            action: {
              label: "Entendido",
              onClick: () => console.log("Usuario confirmó entender"),
            },
            duration: 10000, // 10 segundos
            style: {
              backgroundColor: "#f4f7f4",
              borderColor: "#d1dfd1",
              color: "#1a211a",
            }
          }
        )
      }
    >
      ¿No has recibido el correo?
    </Button>
  )
}