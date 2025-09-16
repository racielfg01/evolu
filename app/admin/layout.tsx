import type { Metadata } from "next";
// import { Inter } from "next/font/google";

// import { supabase } from "@/lib/supabase/client";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin-view/app-sidebar";
import { SiteHeader } from "@/components/admin-view/site-header";
// import { SidebarStoreProvider } from "@/lib/providers/store-provider";
import { getCurrentUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Administration panel",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
const user =await getCurrentUser()


if (user && 'role' in user && 'sex' in user) {
  // console.log(user.role.name);   
  // console.log(user.sex.name);    
  
  if (!user || user?.role?.name=="USER") {
    redirect("/");
  }
      
} else if (user && 'error' in user) {
  console.error('Error:', user.message);
} else {
  console.log('Usuario no encontrado');
}


  

  return (
    // <SidebarStoreProvider>
      <SidebarProvider>
        <AppSidebar
          variant="inset"
          //   onViewChange={setActiveView}
          //   activeView={activeView}
        />
        <SidebarInset>
          <SiteHeader />
          <main className="flex-1 ">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    // </SidebarStoreProvider>
  );
}
