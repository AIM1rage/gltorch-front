import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { ProjectFilter } from "@/components/filter/projects";
import { Label } from "@/components/ui/label";
import { NamespacesFilter } from "@/components/filter/namespaces";
import Link from "next/link";
import { AppRoute } from "@/constants/approute";
import { ModeToggle } from "@/components/ui/theme-provider";

export function SearchSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarContent>
        <SidebarGroup className="w-full mt-6 ml-4">
          <Link href={AppRoute.Home}>
            <h1 className="text-4xl font-black font-mono tracking-tight">
              gltorch
            </h1>
          </Link>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Label htmlFor="pFilter">Filter by projects</Label>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <ProjectFilter inputID="pFilter" />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Label htmlFor="nsFilter">Filter by namespaces</Label>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NamespacesFilter inputID="nsFilter" />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="absolute bottom-4 left-4">
          <ModeToggle />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
