"use client";

import dynamic from "next/dynamic";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProjectFilter } from "@/components/filter/projects";
import { NamespacesFilter } from "@/components/filter/namespaces";
import { Label } from "@/components/ui/label";
import SearchBar from "@/components/search/search_bar";
import { redirect } from "next/navigation";
import { AppRoute } from "@/constants/approute";
import { ModeToggle } from "@/components/ui/theme-provider";

const Notices = dynamic(() => import("@/components/notices/notices"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <div className="fixed top-4 right-4">
        <ModeToggle />
      </div>
      <div className="flex flex-row w-screen h-screen items-center justify-center px-24">
        <div className="flex flex-col gap-4 max-w-[600px] w-full min-w-[300px]">
          <h1 className="text-center w-full text-4xl font-black font-mono tracking-tight">
            gltorch
          </h1>
          <SearchBar
            onSubmit={() => {
              redirect(AppRoute.Search);
            }}
          />
          <Notices />
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
    </>
  );
}
