// "use client"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import Link from "next/link"
// import { useState } from "react"
// import { Eye, EyeOff, Loader2 } from "lucide-react"
// import { FieldValues, useForm } from "react-hook-form"
// import { toast } from "sonner"
// import { resetPassword } from "@/lib/supabase/auth"

// export default function FormularioLogin({
//   handleLogin,
// }: {
//   handleLogin: (formData: FormData) => Promise<void>
// }) {
//   const [isVisible, setIsVisible] = useState(false)
//   const [isForgetPasswd, setIsForgetPasswd] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [isResetLoading, setIsResetLoading] = useState(false)

//   const { register, handleSubmit } = useForm()

//   const onResetPassword = async (data: FieldValues) => {
//     if (!data.email) {
//       toast.error("Error", { description: "Email es requerido" })
//       return
//     }

//     setIsResetLoading(true)
//     try {
//       const result = await resetPassword(data.email)
      
//       if (result.error) {
//         toast.error("Error", { description: result.error })
//       } else {
//         toast.success("Email enviado", {
//           description: "Revisa tu correo para el enlace de restablecimiento",
//         })
//         setIsForgetPasswd(false)
//       }
//     } catch (error) {
//       toast.error("Error", { description: "Ha ocurrido un error inesperado" })
//     } finally {
//       setIsResetLoading(false)
//     }
//   }

//   const handleFormSubmit = async (formData: FormData) => {
//     setIsLoading(true)
//     try {
      
//       await handleLogin(formData)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className={cn("flex flex-col gap-6")}>
//       <Card>
//         <CardHeader>
//           <CardTitle>{isForgetPasswd ? "Recuperar contraseña" : "Inicia sesión en tu cuenta"}</CardTitle>
//           <CardDescription>
//             {isForgetPasswd
//               ? "Ingresa tu email para recuperar a tu cuenta"
//               : "Ingresa tus datos para acceder a tu cuenta"}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {isForgetPasswd ? (
//             <form onSubmit={handleSubmit(onResetPassword)}>
//               <div className="flex flex-col gap-6">
//                 {/* Campo de Email */}
//                 <div className="grid gap-3">
//                   <Label htmlFor="email">Correo Electrónico</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="juana32@gmail.com"
//                     required
//                     {...register("email", { required: true })}
//                     disabled={isResetLoading}
//                   />
//                 </div>

//                 {/* Botones de Acción */}
//                 <div className="flex flex-col gap-3">
//                   <Button 
//                     type="submit" 
//                     className="w-full"
//                     disabled={isResetLoading}
//                   >
//                     {isResetLoading ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Enviando...
//                       </>
//                     ) : (
//                       "Recuperar contraseña"
//                     )}
//                   </Button>
//                   <Button 
//                     variant="outline" 
//                     className="w-full"
//                     type="button"
//                     onClick={() => setIsForgetPasswd(false)}
//                     disabled={isResetLoading}
//                   >
//                     Atrás
//                   </Button>
//                 </div>
//               </div>
//             </form>
//           ) : (
//             <form action={handleFormSubmit}>
//               <div className="flex flex-col gap-6">
//                 {/* Campo de Email */}
//                 <div className="grid gap-3">
//                   <Label htmlFor="email">Correo Electrónico</Label>
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     placeholder="juana32@gmail.com"
//                     required
//                     disabled={isLoading}
//                   />
//                 </div>

//                 {/* Campo de Contraseña */}
//                 <div className="grid gap-3">
//                   <div className="flex items-center">
//                     <Label htmlFor="password">Contraseña</Label>
//                     <Button
//                       variant={"link"}
//                       type="button"
//                       onClick={() => setIsForgetPasswd(true)}
//                       className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
//                       disabled={isLoading}
//                     >
//                       ¿Olvidaste tu contraseña?
//                     </Button>
//                   </div>

//                   <div className="relative">
//                     <Input
//                       id="password"
//                       name="password"
//                       type={isVisible ? "text" : "password"}
//                       required
//                       className="pr-10"
//                       disabled={isLoading}
//                     />
//                     <button
//                       type="button"
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                       onClick={() => setIsVisible(!isVisible)}
//                       disabled={isLoading}
//                     >
//                       {isVisible ? (
//                         <EyeOff className="h-4 w-4" />
//                       ) : (
//                         <Eye className="h-4 w-4" />
//                       )}
//                       <span className="sr-only">
//                         {isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
//                       </span>
//                     </button>
//                   </div>
//                 </div>

//                 {/* Botones de Acción */}
//                 <div className="flex flex-col gap-3">
//                   <Button 
//                     type="submit" 
//                     className="w-full"
//                     disabled={isLoading}
//                   >
//                     {isLoading ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Iniciando sesión...
//                       </>
//                     ) : (
//                       "Iniciar Sesión"
//                     )}
//                   </Button>
//                   <Button 
//                     variant="outline" 
//                     className="w-full"
//                     type="button"
//                     disabled={isLoading}
//                   >
//                     Continuar con Google
//                   </Button>
//                 </div>
//               </div>

//               {/* Enlace a Registro */}
//               <div className="mt-4 text-center text-sm">
//                 ¿No tienes una cuenta?{" "}
//                 <Link 
//                   href="/register" 
//                   className="underline underline-offset-4"
//                   onClick={(e) => isLoading && e.preventDefault()}
//                 >
//                   Regístrate
//                 </Link>
//               </div>
//             </form>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { FieldValues, useForm } from "react-hook-form"
import { toast } from "sonner"
import {  resetPassword } from "@/lib/supabase/auth"
import { useRouter } from "next/navigation"






export default function FormularioLogin({
  handleLogin,
}: {
  handleLogin: (formData: FormData) => Promise<{
    error?: string | undefined;
} | null>
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [isForgetPasswd, setIsForgetPasswd] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isResetLoading, setIsResetLoading] = useState(false)
  const router = useRouter()

  const { register, handleSubmit } = useForm()

  const onResetPassword = async (data: FieldValues) => {
    if (!data.email) {
      toast.error("Error", { description: "Email es requerido" })
      return
    }

    setIsResetLoading(true)
    try {
      const result = await resetPassword(data.email)
      
      if (result.error) {
        toast.error("Error", { description: result.error })
      } else {
        toast.success("Email enviado", {
          description: "Revisa tu correo para el enlace de restablecimiento",
        })
        setIsForgetPasswd(false)
      }
    } catch (error) {
      console.error(error)
      toast.error("Error", { description: "Ha ocurrido un error inesperado" })
    } finally {
      setIsResetLoading(false)
    }
  }


 

  const handleFormSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const result = await handleLogin(formData);
      
      // TypeScript ahora sabe que result puede ser:
      // 1. { error?: string } | null | void
      // 2. undefined (porque puede ser void)
      
      if (result && 'error' in result && result.error) {
        toast.error("Error de inicio de sesión", { 
          description: result.error 
        });
      } else {
        console.log("no hay error");
        // Si no hay error, redirigimos manualmente
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error", { 
        description: "Ha ocurrido un error inesperado"
      });
    } finally {
      setIsLoading(false);
    }
  }

// const handleFormSubmit = async (formData: FormData) => {
//   setIsLoading(true);
//   try {
//     const result = await handleLogin(formData);
    
//     if (result && result.error) {
//       toast.error("Error de inicio de sesión", { 
//         description: result.error 
//       });
//     } else {
//       // Si no hay error, redirigimos desde el cliente
//       toast.success("¡Inicio de sesión exitoso!");
//       router.push("/");
//       router.refresh();
//     }
//   } catch (error) {
//     console.error(error);
//     toast.error("Error", { 
//       description: "Ha ocurrido un error inesperado"
//     });
//   } finally {
//     setIsLoading(false);
//   }
// }

  // const handleFormSubmit = async (formData: FormData) => {
  //   setIsLoading(true)
  //   try {
  //     const result = await handleLogin(formData)
      
  //     // Si hay un error, lo mostramos
  //     if (result!=null) {
  //       toast.error("Error de inicio de sesión", { 
  //         description: result.error 
  //       })
  //     } else {
  //       console.log("no hay error")
  //       // Si no hay error, redirigimos manualmente
  //       router.push("/")
  //       router.refresh() // Para actualizar el estado de autenticación
  //     }
  //   } catch (error) {
  //     console.error(error)
  //     toast.error("Error", { 
  //       description: "Ha ocurrido un error inesperado"
  //     })
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle>{isForgetPasswd ? "Recuperar contraseña" : "Inicia sesión en tu cuenta"}</CardTitle>
          <CardDescription>
            {isForgetPasswd
              ? "Ingresa tu email para recuperar a tu cuenta"
              : "Ingresa tus datos para acceder a tu cuenta"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isForgetPasswd ? (
            <form onSubmit={handleSubmit(onResetPassword)}>
              <div className="flex flex-col gap-6">
                {/* Campo de Email */}
                <div className="grid gap-3">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="juana32@gmail.com"
                    required
                    {...register("email", { required: true })}
                    disabled={isResetLoading}
                  />
                </div>

                {/* Botones de Acción */}
                <div className="flex flex-col gap-3">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isResetLoading}
                  >
                    {isResetLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Recuperar contraseña"
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    type="button"
                    onClick={() => setIsForgetPasswd(false)}
                    disabled={isResetLoading}
                  >
                    Atrás
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <form action={handleFormSubmit}>
              <div className="flex flex-col gap-6">
                {/* Campo de Email */}
                <div className="grid gap-3">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="juana32@gmail.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Campo de Contraseña */}
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Contraseña</Label>
                    <Button
                      variant={"link"}
                      type="button"
                      onClick={() => setIsForgetPasswd(true)}
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      disabled={isLoading}
                    >
                      ¿Olvidaste tu contraseña?
                    </Button>
                  </div>

                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={isVisible ? "text" : "password"}
                      required
                      className="pr-10"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setIsVisible(!isVisible)}
                      disabled={isLoading}
                    >
                      {isVisible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex flex-col gap-3">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Iniciando sesión...
                      </>
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    type="button"
                    disabled={isLoading}
                  >
                    Continuar con Google
                  </Button>
                </div>
              </div>

              {/* Enlace a Registro */}
              <div className="mt-4 text-center text-sm">
                ¿No tienes una cuenta?{" "}
                <Link 
                  href="/register" 
                  className="underline underline-offset-4"
                  onClick={(e) => isLoading && e.preventDefault()}
                >
                  Regístrate
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}