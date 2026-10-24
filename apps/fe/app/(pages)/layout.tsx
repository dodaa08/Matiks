import { ThemeProvider } from "@/components/theme-provider";
import { GameSocket } from "@/components/game-socket";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <main className="flex-1">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <GameSocket />
        {children}
        </ThemeProvider>
      </main>
  );
}