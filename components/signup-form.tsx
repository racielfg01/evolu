"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Eye, EyeOff, MailCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/supabase/auth";
import { toast } from "sonner";
import EmailConfirmationAlert from "./comun/EmailConfirmationAlert";
import { useEnhancedBooking } from "./new-bookings/enhanced-booking-context";

export default function SignUpForm({
  sexos,
}: {
  // handleSignUp: (formData: FormData)=> Promise<void>
  sexos: {
    id: string;
    name: string;
  }[];
}) {
  const { dispatch } = useEnhancedBooking();
  const [isVisible, setIsVisible] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showConfirmationAlert, setShowConfirmationAlert] = useState(false);
  const router = useRouter();

  async function handleSignUp(formData: FormData) {
    startTransition(async () => {
      try {
        const result = await signUp(formData);

        if (result?.error) {
          toast.error("Error en el registro", {
            description: result.error  || "Por favor intenta nuevamente",
          });
          return;
        }

        if (result?.success) {

          // toast.success("¡Registro exitoso!", {
          //   description: "Por favor revisa tu correo para confirmar tu cuenta",
          // });
          dispatch({ type: "SET_USER_INFO", payload: null })
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
              backgroundColor: "#afc7af",
              // borderColor: "#d1dfd1",
              // color: "#11111",
            }
          },

        )
          // Mostrar el componente de alerta
          setShowConfirmationAlert(true);

          // Opcional: redirigir después de cierto tiempo
          setTimeout(() => router.push('/'), 5000);
        }
      } catch (error) {
        toast.error("Error en el registro", {
          description:
            "Ocurrió un error inesperado. Por favor intenta nuevamente.",
        });
        console.error("Signup failed:", error);
      }
    });
  }

  return (
    <>
      {showConfirmationAlert && <EmailConfirmationAlert />}
      <div className={cn("flex flex-col gap-6")}>
        <Card>
          <CardHeader>
            <CardTitle>Crea tu cuenta</CardTitle>
            <CardDescription>
              Ingresa tus datos para crear a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSignUp}>
              <div className="flex flex-col gap-4">
                {/* Campo de Email */}
                <div className="grid gap-3">
                  <Label htmlFor="email">Nombre y Apellidos</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Juana Peréz Ponz"
                    required
                  />
                </div>{" "}
                {/* Campo de Email */}
                <div className="grid gap-3">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="ejemplo@dominio.com"
                    required
                  />
                </div>
                {/* Campo de Teléfono */}
                <div className="grid gap-3">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+53 52014876"
                    required
                    pattern="^[\d+\-\s\(\)]{8,10}$" // 10-15 dígitos con caracteres de teléfono
                    title="Ingresa un número de teléfono válido (8-10 dígitos)"
                  />
                </div>
                {/* Campo de Sexo/Género */}
                <div className="grid gap-3">
                  <Label htmlFor="sexo">Género</Label>
                  <Select name="sexo" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu género" />
                    </SelectTrigger>
                    <SelectContent>
                      {sexos.map((item, key) => (
                        <SelectItem key={key} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Campo de Contraseña */}
                <div className="grid gap-3">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={isVisible ? "text" : "password"}
                      required
                      className="pr-10" //
                      placeholder="ContraseñaSegura124*"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setIsVisible(!isVisible)}
                    >
                      {isVisible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {isVisible
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"}
                      </span>
                    </button>
                  </div>
                </div>
                {/* Botones de Acción */}
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full" disabled={isPending}>
                    Crear cuenta
                  </Button>
                  <Button variant="outline" className="w-full">
                    Continuar con Google
                  </Button>
                </div>
              </div>

              {/* Enlace a Registro */}
              <div className="mt-4 text-center text-sm">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Entrar
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
