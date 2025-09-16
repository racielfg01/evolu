"use server"

import AppointmentList from "@/components/booking/appointment-list";
import { getCurrentUser } from "@/lib/supabase/auth";

export default async function Home() {
const user =await getCurrentUser()
console.log({user})



  return (
    <>
  <AppointmentList/>
    </>
  );
}
