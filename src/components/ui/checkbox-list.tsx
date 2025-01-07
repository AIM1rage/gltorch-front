"use client";

import React, { useState, useCallback, useRef, useEffect, memo } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useDebounce } from "@/hooks/use-debounce";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

interface CheckboxListItemProps {
  id: string;
  label: string;
  checked: boolean;
  onToggleAction: (id: string, checked: boolean) => Promise<void>;
}

const CheckboxListItem = memo(
  ({ id, label, checked, onToggleAction }: CheckboxListItemProps) => {
    return (
      <div className="flex items-center space-x-2 py-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={async (isChecked) => {
            await onToggleAction(id, isChecked as boolean);
          }}
        />
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      </div>
    );
  },
);

CheckboxListItem.displayName = "CheckboxListItem";

interface CheckboxListProps {
  items: CheckboxListItemProps[];
  onToggleAction: (id: string, checked: boolean) => Promise<void>;
  onLoadMore: () => void;
  hasNextPage: boolean;
}

const CheckboxList: React.FC<CheckboxListProps> = ({
  items,
  onToggleAction,
  onLoadMore,
  hasNextPage,
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<HTMLDivElement>(null);

  const entry = useIntersectionObserver(lastItemRef, { threshold: 1 });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      onLoadMore();
    }
  }, [entry, hasNextPage, onLoadMore]);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollAreaRef.current,
    estimateSize: () => 40,
    overscan: 5,
  });

  return (
    <ScrollArea ref={scrollAreaRef} className="h-[300px]">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const item = items[virtualItem.index];
          return (
            <div
              key={item.id}
              ref={virtualItem.index === items.length - 1 ? lastItemRef : null}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <CheckboxListItem
                id={item.id}
                label={item.label}
                checked={item.checked}
                onToggleAction={onToggleAction}
              />
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

interface SearchableCheckboxListProps {
  items: CheckboxListItemProps[];
  onToggleAction: (id: string, checked: boolean) => Promise<void>;
  onLoadMore: (search: string) => Promise<void>;
  hasNextPage: boolean;
}

export function SearchableCheckboxList({
  items,
  onToggleAction,
  onLoadMore,
  hasNextPage,
}: SearchableCheckboxListProps) {
  const [search, setSearch] = useState("");
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (scrollAreaRef.current) {
      setShowScrollToTop(scrollAreaRef.current.scrollTop > 500);
    }
  }, []);

  const scrollToTop = () => {
    scrollAreaRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    onLoadMore(debouncedSearch);
  }, [debouncedSearch, onLoadMore]);

  return (
    <div
      ref={scrollAreaRef}
      className="h-full flex flex-col"
      onScroll={handleScroll}
    >
      <Input
        type="search"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-2"
      />
      <CheckboxList
        items={items}
        onToggleAction={onToggleAction}
        onLoadMore={() => onLoadMore(debouncedSearch)}
        hasNextPage={hasNextPage}
      />
      {showScrollToTop && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4"
          onClick={scrollToTop}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
