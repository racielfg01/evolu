import type { Metadata } from "next";
// import { Inter } from "next/font/google";

// import { supabase } from "@/lib/supabase/client";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin-view/app-sidebar";
import { SiteHeader } from "@/components/admin-view/site-header";
// import { SidebarStoreProvider } from "@/lib/providers/store-provider";
import { getCurrentUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import Providers from "@/lib/providers/Provider";

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

const currentUser =await getCurrentUser()

  // Determinar si el usuario tiene permisos
  const hasUserRole = currentUser?.role?.name != "USER";


  // Logs condicionales para desarrollo
  if (process.env.NODE_ENV === 'development') {
    if (!currentUser || !hasUserRole) {
      console.log("Usuario no autenticado o");

      redirect('/')
    
      
    }
  }

  

  return (
    // <SidebarStoreProvider>
    <Providers>

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
          </Providers>
    // </SidebarStoreProvider>
  );
}
