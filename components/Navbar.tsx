// "use client";
// import { Leaf } from 'lucide-react'
// import Link from 'next/link'
// import React from 'react'
// import { useSession, signOut } from "next-auth/react";
// import { Button } from './ui/button';

// const Navbar = () => {
//   const { data: session } = useSession();
//   console.log(session);

//   return (
//     <header className="bg-white h-20 py-4 px-4 md:px-6 shadow-sm">
//       <div className="container mx-auto flex items-center justify-between">
//       <Link
//             href="/"
//             className="text-sage-700 hover:text-sage-900 font-medium"
//           >

//         <div className="flex items-center gap-2">
//           <Leaf className="h-6 w-6 text-sage-600" />
//           <span className="text-xl font-semibold text-sage-800">Evolu Spa</span>
//         </div>
                   
//         </Link>
//         <nav className="hidden md:flex items-center space-x-8">
    
//           <Link
//             href="/#about"
//             className="text-sage-700 hover:text-sage-900 font-medium"
//           >
//             Sobre Nosotros
//           </Link>
//           <Link
//             href="/#services"
//             className="text-sage-700 hover:text-sage-900 font-medium"
//           >
//             Servicios
//           </Link>
//           <Link
//             href="/#testimonials"
//             className="text-sage-700 hover:text-sage-900 font-medium"
//           >
//             Reseñas
//           </Link>
//           <Link
//             href="/#contact"
//             className="text-sage-700 hover:text-sage-900 font-medium"
//           >
//             Contacto
//           </Link>
//         </nav>
//         <div className="flex gap-4">
//           <Button className="hidden md:block bg-sage-600 hover:bg-sage-700 text-white px-5 py-2 rounded-md transition-colors">
//             ¡Reserve ya!
//           </Button>
//           {session ? (
//             <>
//               <Link
//                 className="hidden md:block bg-sage-600 hover:bg-sage-700 text-white px-5 py-2 rounded-md transition-colors"
//                 href="/reserva"
//               >
//                 Reservar
//               </Link>
//               <div className="flex items-center space-x-4">
//                 <div className="text-sm text-gray-500">
//                   {session.user?.name && <div>{session.user.name}</div>}
//                   <div>{session.user?.email}</div>
//                 </div>
//                 <button
//                   onClick={() => signOut()}
//                   className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
//                 >
//                   Salir
//                 </button>
//               </div>
//             </>
//           ) : (
//             <Link
//               href="/login"
//               className="hidden md:block bg-sage-600 hover:bg-sage-700 text-white px-5 py-2 rounded-md transition-colors"
//             >
//               Comenzar
//             </Link>
//           )}

//           <button className="md:hidden text-sage-800">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               className="w-6 h-6"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M4 6h16M4 12h16M4 18h16"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Navbar