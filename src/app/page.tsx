"use client";

import { redirect } from "next/navigation";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProjectFilter } from "@/components/filter/projects";
import { NamespacesFilter } from "@/components/filter/namespaces";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  search: z.string().min(3, {
    message: "Search must be at least 3 characters.",
  }),
});

export default function Home() {
  const { search, setSearch } = useSearchStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: search,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSearch(values.search);
    redirect("/search");
  }

  return (
    <div className="flex flex-row w-screen h-screen items-center justify-center px-24">
      <div className="flex flex-col gap-4 max-w-[600px] w-full min-w-[300px]">
        <h1 className="text-center w-full text-4xl font-black font-mono tracking-tight">
          gltorch
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center space-x-2"
          >
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Search className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground text-base" />
                      <Input
                        placeholder="Search..."
                        className="pl-8 text-base"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Label
              htmlFor="pFilter"
              className="font-medium flex flex-col gap-[6px] "
            >
              Filter by projects
              <ProjectFilter inputID="pFilter" />
            </Label>
            <Label
              htmlFor="nsFilter"
              className="font-medium flex flex-col gap-[6px]"
            >
              Filter by namespaces
              <NamespacesFilter inputID="nsFilter" />
            </Label>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
