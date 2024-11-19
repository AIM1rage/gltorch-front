import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SearchSidebar } from "./sidebar";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SearchSidebar />
      <SidebarInset>
        <main className="w-full">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
