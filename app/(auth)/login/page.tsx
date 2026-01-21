

// // import { signInWithEmail } from '@/lib/supabase/auth'
// import { redirect } from "next/navigation";
// import LoginForm from "@/components/login-form";
// import Image from "next/image";
// // import Link from 'next/link'
// import Logo from "@/components/new-bookings/Logo";
// import { login } from "@/lib/supabase/auth";
// // import { createClient } from "@/lib/supabase/server";

// export default async function LoginPage() {
  
//   async function handleLogin(formData: FormData) {
//     "use server";
//     // console.log(formData);
//     try {
//       const result = await login(formData);
//       if (result?.error) {
//         // Handle error (you might want to display it to the user)
//         console.error(result.error);
//         return;
//       }

//       redirect("/");
//     } catch (error) {
//       console.error(error);
//       // Puedes manejar el error aquí o lanzarlo para mostrarlo en el cliente
//       throw error;
//     }
//   }



//   return (
//     <div className="grid min-h-svh lg:grid-cols-2">
//       <div className="flex flex-col gap-4 p-6 md:p-10">
//         <div className="flex justify-center gap-2 md:justify-start">
//           <Logo />
//         </div>
//         <div className="flex flex-1 items-center justify-center">
//           <div className="w-full max-w-xs">
//             {/* Pasamos la Server Action al componente LoginForm */}
//             <LoginForm handleLogin={handleLogin} />
//           </div>
//         </div>
//       </div>
//       <div className="bg-muted relative hidden lg:block">
//         <Image
//           src="/signup.png"
//           alt="Image"
//           className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
//           fill
//         />
//       </div>
//     </div>
//   );
// }

// import { signInWithEmail } from '@/lib/supabase/auth'
import { redirect } from "next/navigation";
import LoginForm from "@/components/login-form";
import Image from "next/image";
// import Link from 'next/link'
import Logo from "@/components/new-bookings/Logo";
import { login } from "@/lib/supabase/auth";
// import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  
  async function handleLogin(formData: FormData) {
    "use server";
    
    try {
      const result = await login(formData);
      console.log(result,"re")
      if (result?.error) {
        // Devolvemos el error para que el cliente lo maneje
        return { error: result.error };
      }

      // Si no hay error, redirigimos
      redirect("/");
    } catch (error) {
      console.error(error);
      return { error: "Error interno del servidor" };
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {/* Pasamos la Server Action al componente LoginForm */}
            <LoginForm handleLogin={handleLogin} />
          </div>
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