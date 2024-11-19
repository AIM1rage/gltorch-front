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

export function SearchSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarContent>
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
      </SidebarContent>
    </Sidebar>
  );
}
