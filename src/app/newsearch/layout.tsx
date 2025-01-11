import { NamespacesFilter } from "@/components/filter-exp/namespaces";
import { ProjectsFilter } from "@/components/filter-exp/projects";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ui/theme-provider";
import { UserDropdown } from "@/components/user/user-dropdown";
import { AppRoute } from "@/constants/approute";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <Sidebar variant="inset">
        <SidebarContent>
          <SidebarGroup className="w-full mt-6 ml-4">
            <Link href={AppRoute.Home}>
              <h1 className="text-4xl font-black font-mono tracking-tight">
                gltorch
              </h1>
            </Link>
          </SidebarGroup>
          <SidebarGroup className="">
            <SidebarGroupLabel>
              <Label htmlFor="nsFilter">Filter by namespaces</Label>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <NamespacesFilter />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup className="">
            <SidebarGroupLabel>
              <Label htmlFor="pFilter">Filter by projects</Label>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <ProjectsFilter />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <div className="absolute bottom-4 left-4 flex flex-row gap-2">
            <ModeToggle />
            <UserDropdown />
          </div>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main className="w-full">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
