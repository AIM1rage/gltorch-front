"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect } from "react";
import { API } from "@/api/api";
import { Label } from "@/components/ui/label";
import { nsEqual, useFilterStore } from "@/store/filters";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export function ProjectsFilter({ className }: { className?: string }) {
  const [search, setSearch] = React.useState("");
  const { projects, toggleProject, namespaces } = useFilterStore();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    refetch,
    isError,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["projects", search],
    staleTime: 2000,
    queryFn: ({ pageParam }) =>
      API.projects({
        search,
        take: 20,
        nextToken: pageParam,
      }),
    initialPageParam: "" as string | null,
    getNextPageParam: (lastPage) => lastPage.nextToken,
  });

  const items = data ? data.pages.flatMap((page) => page.values) : [];

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      if (scrollHeight - (scrollTop + clientHeight) < 20) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useEffect(() => {
    refetch();
  }, [search, refetch]);

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <Input
        type="text"
        placeholder="Search projects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ScrollArea className="h-[300px] px-2" onScroll={handleScroll}>
        {items.map((item) => {
          const id = "p" + item.id;
          const nsName =
            (item.parent.group && item.parent.group.path) ||
            "@" + item.parent.user?.username;
          const nsSelected = !!namespaces.find((ns) =>
            nsEqual(ns, item.parent),
          );
          return (
            <div key={id} className="flex items-center space-x-2 py-2">
              <Checkbox
                id={`checkbox-${id}`}
                checked={!!projects.find((p) => p.id === item.id)}
                onCheckedChange={() => toggleProject(item)}
              />
              <Label
                htmlFor={`checkbox-${id}`}
                className="text-sm font-medium leading-none cursor-pointer select-none"
              >
                <span className={cn(nsSelected && "text-primary")}>
                  {nsName}
                </span>
                {"/" + item.path}
              </Label>
            </div>
          );
        })}
        {isFetching && (
          <div className="flex justify-center items-center py-2">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        {isError && (
          <div className="text-center text-red-500 py-2">
            Error loading projects
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
