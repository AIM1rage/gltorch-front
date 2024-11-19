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
import { Group } from "@/types/group";
import { User } from "@/types/user";

export function ProjectFilter({ inputID }: { inputID: string }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  inputRef.current?.setAttribute("id", inputID);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [input, setInput] = React.useState("");
  const { projects, toggleProject, namespaces } = useFilterStore();

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (projects?.length > 0 && input.value === "") {
            toggleProject(projects[projects.length - 1]);
          }
        }
        if (e.key === "Escape") {
          input.blur();
          setInput("");
        }
      }
    },
    [projects, toggleProject],
  );

  const { data, isFetching, isError, isFetched } = useQuery({
    queryKey: ["projects", search],
    queryFn: () => {
      if (search.length < 3) {
        return Promise.resolve([]);
      }

      const groups = namespaces
        .map((ns) => ns.group)
        .filter((g) => g) as Group[];
      const users = namespaces.map((ns) => ns.user).filter((u) => u) as User[];

      return MOCK_API.getProjects(
        search,
        groups.map((g) => g.id),
        users.map((u) => u.id),
      );
    },
  });

  const debouncedSearch = React.useCallback((value: string) => {
    if (value.length >= 3) {
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
          <div className="flex flex-wrap gap-[6px] flex-1 max-w-full">
            {projects.map((project) => {
              return (
                <Badge
                  key={project.id}
                  variant="btn_secondary"
                  className="leading-6 flex items-center justify-center max-w-full"
                >
                  <span
                    className="truncate min-w-0 max-w-full"
                    title={project.pathWithNamespace}
                  >
                    {project.pathWithNamespace}
                  </span>

                  <button
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        toggleProject(project);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => toggleProject(project)}
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
              placeholder="Add a project"
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
                <CommandEmpty>No projects found.</CommandEmpty>
              )}
              {isFetched && search.length < 3 && (
                <CommandEmpty>
                  Type at least three characters to search...
                </CommandEmpty>
              )}
              <CommandGroup>
                {isFetched &&
                  data?.map((project) => (
                    <CommandItem
                      key={project.id}
                      onSelect={() => {
                        toggleProject(project);
                        setOpen(false);
                        setSearch("");
                        setInput("");
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          projects.some((p) => p.id === project.id)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {project.pathWithNamespace}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </div>
    </Command>
  );
}
