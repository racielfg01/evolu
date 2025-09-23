

import  { BookingContent } from "@/components/new-bookings/enhanced-beauty-booking";
import { getCurrentUser } from "@/lib/supabase/auth";

export default async function Home() {
const user =await getCurrentUser()



  return (
    <>
     <BookingContent user={user}/>
  
    </>
  );
}
