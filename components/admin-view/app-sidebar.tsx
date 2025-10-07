// "use client"

// import * as React from "react"
// import {
//   LayoutDashboard,
//   List,
//   BarChart3,
//   Folder,
//   Users,
//   Settings as SettingsIcon,
//   Menu
// } from "lucide-react"

// import { NavMain } from "@/components/admin-view/nav-main"
// import { NavUser } from "@/components/admin-view/nav-user"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"

// const data = {
//   user: {
//     name: "shadcn",
//     email: "m@example.com",
//     avatar: "/avatars/shadcn.jpg",
//   },
//   navMain: [
//     {
//       title: "Panel de Control",
//       url: "#",
//       icon: LayoutDashboard,
//     },
//     {
//       title: "Citas",
//       url: "#",
//       icon: List,
//     },
//     {
//       title: "Servicios",
//       url: "#",
//       icon: BarChart3,
//     },

//     {
//       title: "Clientes",
//       url: "#",
//       icon: Users,
//     },  {
//       title: "Configuración",
//       url: "#",
//       icon: SettingsIcon,
//     },
//   ]
// }

// type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
//   activeView: string;
//   onViewChange: (view: string) => void;
// };

// // export function AppSidebar({ activeView, onViewChange, ...props }: AppSidebarProps) {
// export function AppSidebar({...props}) {


//   return (
//     <Sidebar collapsible="offcanvas" {...props}>
//       <SidebarHeader>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton
//               asChild
//               className="data-[slot=sidebar-menu-button]:!p-1.5"
//             >
//               <a href="#">
//                 <Menu className="!size-5" />
//                 <span className="text-base font-semibold">Evolu</span>
//               </a>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>
//       <SidebarContent>
//         <NavMain
//           items={data.navMain}
//           // activeView={activeView}
//           // onViewChange={onViewChange}
//         />
//         {/* <NavDocuments items={data.documents} /> */}
//         {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
//       </SidebarContent>
//       <SidebarFooter>
//         <NavUser user={data.user} />
//       </SidebarFooter>
//     </Sidebar>
//   )
// }
'use client'

import * as React from "react"
import {
  LayoutDashboard,
  List,
  BarChart3,
  // Folder,
  Users,
  Settings as SettingsIcon,
  Menu,
  Home
} from "lucide-react"

import { NavMain } from "@/components/admin-view/nav-main"
import { NavUser } from "@/components/admin-view/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSidebarStore } from "@/stores/sidebar-store"
import avatar1 from "@/assest/avatars/avatar1.jpeg"
import Link from "next/link"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: avatar1,
  },
  navMain: [
    {
      title: "Inicio",
      url: "/",
      icon: Home,
      id: "home"
    }, {
      title: "Panel de Control",
      url: "/admin",
      icon: LayoutDashboard,
      id: "dashboard"
    },
    {
      title: "Citas",
      url: "/admin/appointments",
      icon: List,
      id: "appointments"
    },
    {
      title: "Servicios",
      url: "/admin/services",
      icon: BarChart3,
      id: "services"
    },
    {
      title: "Clientes",
      url: "/admin/users",
      icon: Users,
      id: "clients"
    },
    {
      title: "Configuración",
      url: "/admin/settings",
      icon: SettingsIcon,
      id: "settings"
    },
  ]
}

export function AppSidebar({...props}) {
  const { 
    isCollapsed, 
    activeView, 
    toggleCollapse, 
    setActiveView 
  } = useSidebarStore()



  return (
    <Sidebar 
      collapsible="offcanvas" 
      // isCollapsed={isCollapsed}
      // onCollapseToggle={toggleCollapse}
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
              onClick={toggleCollapse}
            >
              <div className="cursor-pointer">
                <Menu className="!size-5" />
                <Link href={"/"}>
                {!isCollapsed && (
                  <span className="text-base font-semibold">Evolu</span>
                )}
                </Link>
              </div>
              
            </SidebarMenuButton>
          </SidebarMenuItem>
       

        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain}
          activeView={activeView}
          onViewChange={setActiveView}
        />
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser  /> */}
      </SidebarFooter>
    </Sidebar>
  )
}