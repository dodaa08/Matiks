// app/(pages)/dashboard/layout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <SidebarTrigger />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        </ThemeProvider>
      </main>
    </SidebarProvider>
  );
}