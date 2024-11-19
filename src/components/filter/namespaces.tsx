"use client";

import * as React from "react";
import { Check, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { useFilterStore } from "@/store/filters";
import { useQuery } from "@tanstack/react-query";
import { MOCK_API } from "@/api/api";
import { cn } from "@/lib/utils";

export function NamespacesFilter({ inputID }: { inputID: string }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  inputRef.current?.setAttribute("id", inputID);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [input, setInput] = React.useState("");
  const { toggleNamespace, namespaces } = useFilterStore();

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (namespaces?.length > 0 && input.value === "") {
            toggleNamespace(namespaces[namespaces.length - 1]);
          }
        }
        if (e.key === "Escape") {
          input.blur();
          setInput("");
        }
      }
    },
    [namespaces, toggleNamespace],
  );

  const { data, isFetching, isError, isFetched } = useQuery({
    queryKey: ["namespaces", search],
    queryFn: () => {
      if (search.length < 1) {
        return Promise.resolve([]);
      }

      return MOCK_API.getNamespaces(search);
    },
  });

  const debouncedSearch = React.useCallback((value: string) => {
    if (value.length >= 1) {
      setSearch(value);
    } else {
      setSearch("");
    }
  }, []);

  return (
    // TODO a lot of unnecessary flex here. Refactor
    <Command onKeyDown={handleKeyDown} shouldFilter={false} className="w-full">
      <div className="flex flex-col flex-1 group rounded-md border border-input p-2 w-full min-h-12 justify-center">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-wrap gap-[6px] flex-1">
            {namespaces.map((ns) => {
              return (
                <Badge
                  key={ns.group?.id || ns.user?.id}
                  variant="btn_secondary"
                  className="leading-6 flex justify-center items-center"
                >
                  <span
                    className="truncate min-w-0 max-w-full"
                    title={ns.group?.path || "@" + ns.user?.username}
                  >
                    {ns.group?.path || "@" + ns.user?.username}
                  </span>
                  <button
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        toggleNamespace(ns);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => toggleNamespace(ns)}
                  >
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              );
            })}
            <CommandPrimitive.Input
              ref={inputRef}
              value={input}
              onValueChange={(value) => {
                setOpen(true);
                debouncedSearch(value);
                setInput(value);
              }}
              onBlur={() => {
                setOpen(false);
                setInput("");
              }}
              placeholder="Add a namespace"
              className="ml-2 flex-1 truncate text-ellipsis bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
          {/*  TODO add hotkeys and uncomment this */}
          {/* <span className="text-muted-foreground">⌘P</span> */}
        </div>
      </div>
      <div className={cn(!open && "hidden", "relative mt-2")}>
        <CommandList className="border border-border">
          {open && (
            <>
              {isFetching && <CommandEmpty>Loading...</CommandEmpty>}
              {isFetched && !isError && (
                <CommandEmpty>No namespaces found.</CommandEmpty>
              )}
              {isFetched && search.length < 1 && (
                <CommandEmpty>Start typing to search...</CommandEmpty>
              )}
              {isFetched && data?.some((ns) => ns.group) && (
                <CommandGroup
                  heading="Groups"
                  hidden={!isFetched || !data?.some((ns) => ns.group)}
                >
                  {isFetched &&
                    data
                      ?.filter((ns) => ns?.group)
                      .map((ns) => (
                        <CommandItem
                          key={ns.group!.id}
                          onSelect={() => {
                            toggleNamespace(ns);
                            setOpen(false);
                            setSearch("");
                            setInput("");
                          }}
                          className="truncate text-ellipsis"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              namespaces.some(
                                (n) => n.group?.id === ns.group?.id,
                              )
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {ns.group!.path}
                        </CommandItem>
                      ))}
                </CommandGroup>
              )}
              {isFetched && data?.some((ns) => ns.user) && (
                <CommandGroup heading="Users">
                  {isFetched &&
                    data
                      ?.filter((ns) => ns?.user)
                      .map((ns) => (
                        <CommandItem
                          key={ns.user!.id}
                          onSelect={() => {
                            toggleNamespace(ns);
                            setOpen(false);
                            setSearch("");
                            setInput("");
                          }}
                          className="truncate text-ellipsis"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              namespaces.some((n) => n.user?.id === ns.user?.id)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {"@" + ns.user!.username}
                        </CommandItem>
                      ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </div>
    </Command>
  );
}
