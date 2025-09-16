"use client";

import { updatePassword } from "@/lib/supabase/auth";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSearchParams,useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import Logo from "@/components/new-bookings/Logo";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

type FormData = {
  password: string;
  passwordConfirm: string;
};

export default function UpdatePasswordForm() {
  const {push} =useRouter()
  const searchParams = useSearchParams();
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch 
  } = useForm<FormData>();

  const password = watch("password");

  // Verificar si hay token en la URL (manejado automáticamente por Supabase)
  useEffect(() => {
    const token = searchParams.get("code");
    console.log({token})
    if (!token) {
      toast.error("Enlace inválido");
      // Redirigir a página de login
      // push('/')
    }
  }, [searchParams]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {

     if (data.password !== data.passwordConfirm) {
     
        toast.error("Error al actualizar", { 
          description:" Las contraseñas no coinciden"
        });
      return;
    }

    const result = await updatePassword(data.password);

    if (result.error) {
      toast.error("Error", { description: "No se ha podido actualizar la contraseña "});       
    } else {
      toast.success("Contraseña actualizada", {
        description: "Tu contraseña ha sido cambiada exitosamente",
      });
      push("/login")
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Recupere su contraseña</CardTitle>
              <CardDescription>
                Escriba la nueva contraseña
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Contraseña</Label>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      required
                      {...register("password", { required: "La contraseña es obligatoria" })}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="passwordConfirm">Confirmar contraseña</Label>
                    </div>
                    <Input 
                      id="passwordConfirm" 
                      type="password" 
                      required
                      {...register("passwordConfirm", { 
                        required: "Por favor confirme su contraseña",
                        validate: value => 
                          value === password || "Las contraseñas no coinciden"
                      })}
                    />
                    {errors.passwordConfirm && (
                      <p className="text-red-500 text-sm">{errors.passwordConfirm.message}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full mt-4">
                    Actualizar contraseña
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/login">
                      Cancelar
                    </Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/signup.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          fill
        />
      </div>
    </div>
  );
}
