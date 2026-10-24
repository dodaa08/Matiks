"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { LogOutIcon } from "lucide-react";

export function AppSidebar() {
   const router = useRouter();
   const {resolvedTheme}  = useTheme();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col justify-center text-center py-2 border-b border-sidebar-border p-0">
          <button onClick={()=>router.push("/")} className="cursor-pointer text-3xl font-serif text-sidebar-foreground">
            Matiks
          </button>
        </div>
      </SidebarHeader>
      <SidebarContent>
  <div className="flex h-full flex-col items-center justify-center gap-2 px-4">
    <Button className="w-full">Explore</Button>
    <Button className="w-full">Friends</Button>
    <Button className="w-full">Profile</Button>
    <Button className="w-full">Exit</Button>
  </div>
</SidebarContent>
      <SidebarFooter>
         <div className="flex flex-row justify-center py-2 space-x-2 border-t border-sidebar-border p-0">
          <h1 className="cursor-pointer text-2xl font-serif text-sidebar-foreground">
            kartik
          </h1>
          <div className="py-2">
          <LogOutIcon className="size-4" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}