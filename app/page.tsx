

import  { BookingContent } from "@/components/new-bookings/enhanced-beauty-booking";
import { getCurrentUser } from "@/lib/supabase/auth";

export default async function Home() {
const user =await getCurrentUser()
// console.log("/",{user})



  return (
    <>
     <BookingContent user={user}/>
     {/* <EnhancedBeautyBooking/> */}
     {/*  <About/>
      <Services/>
      
      <Testimonials/>
      <Booking/>
      <Footer/>
    */}
    </>
  );
}
