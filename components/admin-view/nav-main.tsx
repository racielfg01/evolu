"use client";

// import {
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"
// import { useState } from "react"

// type NavItem = {
//   title: string
//   url: string
//   icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
// }

// export function NavMain({
//   items,
//   // activeView,
//   // onViewChange
// }: {
//   items: NavItem[]
//   activeView: string
//   onViewChange: (view: string) => void
// }) {

//     const [activeView, setActiveView] = useState("dashboard");
//   return (
//     <SidebarGroup>
//       <SidebarGroupContent className="flex flex-col gap-2">
//         <SidebarMenu>
//           {/* <SidebarMenuItem className="flex items-center gap-2">
//             <SidebarMenuButton
//               tooltip="Quick Create"
//               className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
//             >
//               <IconCirclePlusFilled />
//               <span>Quick Create</span>
//             </SidebarMenuButton>
//             <Button
//               size="icon"
//               className="size-8 group-data-[collapsible=icon]:opacity-0"
//               variant="outline"
//             >
//               <IconMail />
//               <span className="sr-only">Inbox</span>
//             </Button>
//           </SidebarMenuItem> */}
//         </SidebarMenu>
//         <SidebarMenu>
//           {items.map((item) => (
//             <SidebarMenuItem key={item.title}>
//               <SidebarMenuButton
//                 tooltip={item.title}
//                 className={`${activeView === item.title.toLowerCase() ? 'bg-sage-300 text-accent-foreground' : ''}`}
//                 onClick={() => setActiveView(item.title.toLowerCase())}
//               >
//                 {item.icon && <item.icon />}
//                 <span>{item.title}</span>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//           ))}
//         </SidebarMenu>
//       </SidebarGroupContent>
//     </SidebarGroup>
//   )
// }
"use client";

import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { cn } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

interface NavMainItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  id: string;
}

interface NavMainProps {
  items: NavMainItem[];
  activeView: string;
  onViewChange: (view: string) => void;
}

export function NavMain({ items, activeView, onViewChange }: NavMainProps) {
  // const pathname = usePathname();
  // console.log({ pathname, activeView });

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu></SidebarMenu>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`${activeView === item.id ? "bg-sage-300 text-accent-foreground" : ""}`}
                    onClick={() => onViewChange(item.id)}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      {/* <ul className="flex flex-col gap-1">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <li key={item.id} >
            <Link
              href={item.url}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ',
                activeView === item.id && 'bg-sage-300 text-accent-foreground'
              )}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          </li>
        )
      })}
    </ul> */}
    </>
  );
}
