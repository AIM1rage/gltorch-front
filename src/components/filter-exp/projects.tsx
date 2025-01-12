"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { API } from "@/api/api";
import { Label } from "@/components/ui/label";
import { nsEqual, useFilterStore } from "@/store/filters";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Loader2, X } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export function ProjectsFilter({ className }: { className?: string }) {
  const [search, setSearch] = React.useState("");
  const { projects, toggleProject, namespaces } = useFilterStore();

  const { data, fetchNextPage, hasNextPage, isError, isFetching } =
    useInfiniteQuery({
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

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <Input
        type="text"
        placeholder="Search projects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        {projects.map((p) => {
          const id = "ptag" + p.id + p.pathWithNamespace;
          const label = p.pathWithNamespace;
          return (
            <Badge
              key={id}
              variant="secondary"
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => toggleProject(p)}
            >
              {label}
              <X className="h-3 w-3" />
            </Badge>
          );
        })}
      </div>
      <ScrollArea className="h-[300px] px-2">
        {items.map((item) => {
          const nsName =
            (item.parent.group && item.parent.group.path) ||
            "@" + item.parent.user?.username;
          const id = "p" + item.id + nsName;
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
                className="text-sm font-medium leading-none cursor-pointer select-none flex-1 truncate"
              >
                <span
                  className={cn(
                    "inline-block max-w-[40%] truncate align-bottom",
                    nsSelected && "text-primary",
                  )}
                >
                  {nsName}
                </span>
                <span className="inline-block max-w-[60%] truncate align-bottom">
                  /{item.path}
                </span>
              </Label>
            </div>
          );
        })}
        {hasNextPage && !isFetching && (
          <Button className="my-2 w-full" onClick={() => fetchNextPage()}>
            Load more
          </Button>
        )}
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
