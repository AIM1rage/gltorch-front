"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSearchStore } from "@/store/search";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  search: z.string().min(3, {
    message: "Search must be at least 3 characters.",
  }),
});

export default function SearchBar({ className }: { className?: string }) {
  const { search, setSearch } = useSearchStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: search,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSearch(values.search);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex items-center space-x-2", className)}
      >
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="relative w-full">
                  <Search className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground text-base" />
                  <Input placeholder="Search..." className="pl-8" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
