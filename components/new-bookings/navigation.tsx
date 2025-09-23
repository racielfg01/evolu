"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useEnhancedBooking } from "./enhanced-booking-context";
import Link from "next/link";
// import { signOut, useSession } from "next-auth/react";
import Logo from "./Logo";

import { createClient } from "@/lib/supabase/client";

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isAdmin: boolean;
}

export function Navigation({ currentView, onViewChange,isAdmin }: NavigationProps) {
  const { state, dispatch } = useEnhancedBooking();
  const { userInfo } = state;

  // const { data: session } = useSession();
  // console.log("nav", { userInfo });

  
  const handleSignOut = async () => {
    try {
      // 1. Limpiar el estado local
      dispatch({ type: "SET_USER_INFO", payload: null });

      // 2. Cerrar sesión en Supabase usando el cliente del lado del cliente
      const supabase = createClient();
      await supabase.auth.signOut();

      // 3. Forzar recarga completa de la página
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  // console.error("isAdmin", isAdmin);

  return (
    <nav className="fixed w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-20">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
         
              <Button
                variant={"ghost"}
                onClick={() => onViewChange("home")}
                className={`flex items-center space-x-2  text-md `}
              >
                <Logo />
              
              </Button>
            
            <div className="hidden md:flex space-x-2">
              <Button
                variant={currentView === "services" ? "default" : "ghost"}
                onClick={() => onViewChange("services")}
                className={`flex items-center space-x-2  text-md  ${currentView === "services" ? "bg-sage-600 hover:bg-sage-700 text-white" : "text-sage-700 hover:text-sage-900 font-medium"} `}
              >
                <span>Servicios</span>
              </Button>

              <Link href="/#about">
                <Button
                  variant={currentView === "home-about" ? "default" : "ghost"}
                  onClick={() => onViewChange("home-about")}
                  className={`flex items-center space-x-2  text-md ${currentView === "home-about" ? "bg-sage-600 hover:bg-sage-700 text-white" : "text-sage-700 hover:text-sage-900 font-medium"} `}
                >
                  {/* <Home className="h-4 w-4" /> */}
                  <span>Sobre Nosotros</span>
                </Button>
              </Link>

              <Link href="/#testimonials">
                <Button
                  variant={currentView === "home-reviews" ? "default" : "ghost"}
                  onClick={() => onViewChange("home-reviews")}
                  className={`flex items-center space-x-2  text-md ${currentView === "home-reviews" ? "bg-sage-600 hover:bg-sage-700 text-white" : "text-sage-700 hover:text-sage-900 font-medium"} `}
                >
                  {/* <Home className="h-4 w-4" /> */}
                  <span>Reseñas</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {userInfo.id != "" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                      <AvatarFallback className="bg-sage-300">
                        {userInfo.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userInfo.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userInfo.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* <Link href={"/profile"}> */}
                  <DropdownMenuItem onClick={() => onViewChange("profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi Perfil</span>
                  </DropdownMenuItem>
                  {/* </Link> */}
                  {/* <Link href={"/bookings"}> */}
                  <DropdownMenuItem onClick={() => onViewChange("bookings")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Mis Reservas</span>
                  </DropdownMenuItem>
                  {/* </Link> */}

                  {isAdmin ? (
                    <Link href={"/admin"}>
                      <DropdownMenuItem
                      //  onClick={() => onViewChange("admin")}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Administración</span>
                      </DropdownMenuItem>
                    </Link>
                  ) : (
                    ""
                  )}
                  <DropdownMenuSeparator />
                  {/* <Link href={"/auth/signout"}> */}
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                  {/* </Link> */}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button className=" bg-sage-600 hover:bg-sage-700 text-white px-5 py-2 rounded-md transition-colors">
                  Comenzar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
