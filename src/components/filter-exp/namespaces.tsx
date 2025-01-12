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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function NamespacesFilter({ className }: { className?: string }) {
  const [search, setSearch] = React.useState("");
  const { namespaces, toggleNamespace } = useFilterStore();

  const { data, fetchNextPage, hasNextPage, isError, isFetching } =
    useInfiniteQuery({
      queryKey: ["namespaces", search],
      staleTime: 2000,
      queryFn: ({ pageParam }) =>
        API.namespaces({
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
        placeholder="Search namespaces..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        {namespaces.map((ns) => {
          const id = (ns.group && ns.group.id) || "@" + ns.user?.id;
          const label = (ns.group && ns.group.path) || "@" + ns.user?.username;
          return (
            <Badge
              key={id}
              variant="secondary"
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => toggleNamespace(ns)}
            >
              {label}
              <X className="h-3 w-3" />
            </Badge>
          );
        })}
      </div>
      <ScrollArea className="flex flex-col gap-2 h-[300px] px-2">
        {items.map((item) => {
          const id = (item.group && item.group.id) || "@" + item.user?.id;
          const label =
            (item.group && item.group.path) || "@" + item.user?.username;
          return (
            <div key={id} className="flex items-center space-x-2 py-2">
              <Checkbox
                id={`checkbox-${id}`}
                checked={!!namespaces.find((ns) => nsEqual(ns, item))}
                onCheckedChange={() => toggleNamespace(item)}
              />
              <Label
                htmlFor={`checkbox-${id}`}
                className="text-sm font-medium leading-none cursor-pointer select-none truncate max-w-[calc(100%-6rem)]"
                title={label}
              >
                {label}
              </Label>
            </div>
          );
        })}
        {hasNextPage && !isFetching && (
          <Button className="my-2 w-9/12" onClick={() => fetchNextPage()}>
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
            Error loading namespaces
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
