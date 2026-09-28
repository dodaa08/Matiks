"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

export function AppSidebar() {
   const router = useRouter();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex -col justify-center text-center py-2">
          <button onClick={()=>router.push("/")} className="cursor-pointer text-3xl font-serif text-sidebar-foreground">
            Matiks
          </button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}