// "use client";

// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import Link from "next/link";

// export default function LoginPage() {
//   const router = useRouter();
//   const [error, setError] = useState<string | null>(null);

//   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//     try {
//       event.preventDefault();
//       const formData = new FormData(event.currentTarget);
//       const response = await signIn("credentials", {
//         ...Object.fromEntries(formData),
//         redirect: false,
//       });

//       if (response?.error) {
//         setError("Invalid credentials");
//         return;
//       }

//       router.push("/");
//       router.refresh();
//     } catch {
//       setError("An error occurred during login");
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Sign in to your account
//           </h2>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <label htmlFor="email" className="sr-only">
//                 Email address
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Email address"
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Password"
//               />
//             </div>
//           </div>

//           {error && (
//             <div className="text-red-500 text-sm text-center">{error}</div>
//           )}

//           <div>
//             <button
//               type="submit"
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               Sign in
//             </button>
//           </div>
//         </form>
//         <div className="text-center">
//           <Link href="/register" className="text-blue-600 hover:underline">
//             No account? Register.
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }


// import { signInWithEmail } from '@/lib/auth/auth'
// import { redirect } from 'next/navigation'
// import LoginForm from '@/components/login-form'
// import { GalleryVerticalEnd } from 'lucide-react'
// import Image from 'next/image'

// export default function LoginPage() {
//    const  handleLogin=async(formData)=> {
//     console.log({formData})
//     // 'use server'
//     try {
//       await signInWithEmail({
//         email: formData.get('email'),
//         password: formData.get('password')
//       })
//       redirect('/')
//     } catch (error) {
//       console.error(error)
     
//     }
//   }

//   return (
//       <div className="grid min-h-svh lg:grid-cols-2">
//       <div className="flex flex-col gap-4 p-6 md:p-10">
//         <div className="flex justify-center gap-2 md:justify-start">
//           <a href="#" className="flex items-center gap-2 font-medium">
//             <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
//               <GalleryVerticalEnd className="size-4" />
//             </div>
//             Evolu
//           </a>
//         </div>
//         <div className="flex flex-1 items-center justify-center">
//           <div className="w-full max-w-xs">
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
//        />
//       </div>
//     </div>
     
    
   
//   )
// }

// import { signInWithEmail } from '@/lib/supabase/auth'
import { redirect } from 'next/navigation'
import LoginForm from '@/components/login-form'
import Image from 'next/image'
// import Link from 'next/link'
import Logo from '@/components/new-bookings/Logo'
import { login } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'

export default async function LoginPage() {
  // Server Action marcada correctamente
  async function handleLogin(formData: FormData) {
    'use server'
    console.log(formData);
    try {
    
      const result = await login(formData)
            if (result?.error) {
             // Handle error (you might want to display it to the user)
              console.error(result.error)
              return}

      redirect('/')
    } catch (error) {
      console.error(error)
      // Puedes manejar el error aquí o lanzarlo para mostrarlo en el cliente
      throw error
    }
  }

   const supabase = await createClient()   
    const {        data: { user },    } = await supabase.auth.getUser()

    console.log({user},'login')

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
         <Logo/>
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
  )
}