// "use client";

// import { useState } from "react";

// import { AppSidebar } from "@/components/admin-view/app-sidebar";
// import { ChartAreaInteractive } from "@/components//admin-view/chart-area-interactive";
// import { DataTable } from "@/components/admin-view/data-table";
// import { SectionCards } from "@/components/admin-view/section-cards";
// import { SiteHeader } from "@/components/admin-view/site-header";
// import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// import {
//   AdminDashboard,
// } from "@/components/new-bookings/admin-dashboard";

// import data from "./data.json";

// import { Configuration } from "@/components/admin-view/Configuration";

// // import { ClientManagment } from "@/components/admin-view/ClientManagment ";
// import { ApoimentsManagment } from "@/components/admin-view/ApoimentsManagment";

// export default function AdminClientPage() {
//   const [activeView, setActiveView] = useState("dashboard");
  
//   const renderCurrentView = () => {
//     switch (activeView) {
//       case "citas":
//         return (
//           <>
//           <ApoimentsManagment/>
         
//           </>

//         );
//       case "servicios":
//         return (
//           <h3>servicios</h3>
//         );

//       // case "clientes":
//       //   return <ClientManagment/>;
//       case "configuración":
//         return   <Configuration/>     

//       default:
//         return (
//           <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
//             <SectionCards />
//             <div className="px-4 lg:px-6">
//               <ChartAreaInteractive />
//             </div>
//             <DataTable data={data} />
//             <div className="px-4 lg:px-6">
//               <AdminDashboard />
//             </div>
//           </div>
//         );
//     }
//   };


 

//   return (
//       <SidebarProvider>
//         <AppSidebar
//           variant="inset"
//           onViewChange={setActiveView}
//           activeView={activeView}
//         />
//         <SidebarInset>
//           <SiteHeader />
//           <div className="flex flex-1 flex-col">
//             <div className="@container/main flex flex-1 flex-col gap-2">
//               {activeView === "dashboard" ? (
//                 <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
//                   <SectionCards />
//                   <div className="px-4 lg:px-6">
//                     <ChartAreaInteractive />
//                   </div>
//                   <DataTable data={data} />
          
//                 </div>
//               ) : (
            
//                 renderCurrentView()
//               )}
//             </div>
//           </div>
//         </SidebarInset>
//       </SidebarProvider>
//   );
// }

