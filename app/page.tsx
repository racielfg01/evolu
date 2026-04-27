import { BookingContent } from "@/components/new-bookings/enhanced-beauty-booking";
import { fetchAllCategories } from "@/lib/actions/category.actions";
import { fetchAllServices } from "@/lib/actions/services.actions";
import { getCurrentUser } from "@/lib/supabase/auth";

export default async function Home() {
  const currentUser = await getCurrentUser();

  const fetchCategories = await fetchAllCategories();
  const fetchServices = await fetchAllServices();

  // Determinar si el usuario tiene permisos
  const user = currentUser ? currentUser : null;
  const categories = fetchCategories ? fetchCategories : null;
  const services = fetchServices ? fetchServices : null;

  // Logs condicionales para desarrollo
  if (process.env.NODE_ENV === 'development') {
    if (!currentUser) {
      // console.log("Usuario no autenticado");
  
  }
  }


  return (
    <>
      <BookingContent 
      user={user} 
      categories={categories} 
      services={services}
       />
    </>
  );
}
