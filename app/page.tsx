import { BookingContent } from "@/components/new-bookings/enhanced-beauty-booking";
import { getCurrentUser } from "@/lib/supabase/auth";

export default async function Home() {
  const currentUser = await getCurrentUser();

  // Determinar si el usuario tiene permisos
  const user = currentUser ? currentUser : null;

  // Logs condicionales para desarrollo
  if (process.env.NODE_ENV === 'development') {
    if (!currentUser) {
      // console.log("Usuario no autenticado");
  
  }
  }


  return (
    <>
      <BookingContent user={user} />
    </>
  );
}
