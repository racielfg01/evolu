// import { redirect } from "next/navigation";
// import AdminClientPage from "./AdminClientPage";
// import { createClient ,getCurrentUser} from "@/lib/supabase/server";
// import { useSession } from "next-auth/react";
import { SectionCards } from "@/components/admin-view/section-cards";
import { ChartAreaInteractive } from "@/components/admin-view/chart-area-interactive";
// import { AdminDashboard } from "@/components/new-bookings/admin-dashboard";
// import { getCurrentUser } from "@/lib/supabase/auth";

export default async function AdminPage() {


  return (
    <>
      {/* <AdminClientPage  /> */}
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
         {/* <AdminDashboard /> */}
      </div>
    </>
  );
}
