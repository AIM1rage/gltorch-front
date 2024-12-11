"use client";
import dynamic from "next/dynamic";
import { API } from "@/api/api";
import SearchBar from "@/components/search/search_bar";
import { SearchResult } from "@/components/search/search_result";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useFilterStore } from "@/store/filters";
import { useSearchStore } from "@/store/search";
import { Group } from "@/types/group";
import { User } from "@/types/user";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PanelLeft } from "lucide-react";
import React from "react";

const Notices = dynamic(() => import("@/components/notices/notices"), {
  ssr: false,
});

export default function Page() {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-row w-full flex-1 gap-4 py-6 px-6 border-b border-border justify-center">
        <Button
          className={cn(!isMobile && "hidden")}
          variant="outline"
          onClick={toggleSidebar}
        >
          <PanelLeft />
        </Button>
        <SearchBar className="w-full" />
      </div>
      <div className="pr-8 pl-6 py-6">
        <Notices />
        <SearchResults />
      </div>
    </div>
  );
}

function SearchResults() {
  const { search } = useSearchStore();
  const { namespaces, projects } = useFilterStore();

  const projectNames = projects.map((p) => p.pathWithNamespace);

  const groups = namespaces.map((ns) => ns.group).filter((g) => g) as Group[];
  const users = namespaces.map((ns) => ns.user).filter((u) => u) as User[];

  const groupNames = groups.map((g) => g.path);
  const userNames = users.map((u) => u.username);

  const { status, data } = useInfiniteQuery({
    queryKey: [
      "search",
      search,
      "projects",
      ...projectNames,
      "groups",
      ...groupNames,
      "users",
      ...userNames,
    ],
    queryFn: ({ pageParam }) =>
      API.search({
        search,
        namespaces,
        projects,
        take: 20,
        nextToken: pageParam,
      }),
    initialPageParam: "" as string | null,
    getNextPageParam: (lastPage) => lastPage.nextToken,
    enabled: search.length >= 3,
  });
  if (status === "pending") {
    return <span>Loading...</span>;
  }

  if (status === "error") {
    return <span>Loading...</span>;
  }
  return (
    <div className="flex flex-col gap-8 w-full">
      {data &&
        data.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group &&
              group.values.map((result) => (
                <SearchResult key={result.id} {...result} searchFor={search} />
              ))}
          </React.Fragment>
        ))}
    </div>
  );
}
