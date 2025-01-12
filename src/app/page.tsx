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
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { AlertOctagon, CheckCircle, Loader2, PanelLeft } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Notice } from "@/components/ui/notice";
import { motion } from "framer-motion";
import { redirect, useSearchParams } from "next/navigation";
import { OAuthApi } from "@/api/oauthApi";
import useAuthStore from "@/store/auth";

const Notices = dynamic(() => import("@/components/notices/notices"), {
  ssr: false,
});

export default function Page() {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const [isSearching, setSearching] = useState(false);

  const queryParams = useSearchParams();

  const { token, refreshToken, setTokens } = useAuthStore();


  const mutation = useMutation({
    mutationFn: (code: string) => OAuthApi.changeCode(code).then( (res) => setTokens(res.access_token, res.refresh_token)),
    retry: 0,
  })

  console.log(process.env.NEXT_PUBLIC_OAUTH_URL)
  console.log(refreshToken);


  if (queryParams.get("code") !== undefined && !mutation.isError && !mutation.isPending){
    mutation.mutate(queryParams.get("code")!);
  }
  
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
        <SearchBar className="w-full" isSearching={isSearching} />
      </div>
      <div className="pr-8 pl-6 py-6 flex flex-col gap-8">
        <Notices />
        <SRMemo setSearching={setSearching} />
      </div>
    </div>
  );
}

const SRMemo = React.memo(SearchResults, () => true);

function SearchResults({
  setSearching,
}: {
  setSearching: (b: boolean) => void;
}) {
  const { search } = useSearchStore();
  const { namespaces, projects } = useFilterStore();

  const projectNames = projects.map((p) => p.pathWithNamespace);

  const groups = namespaces.map((ns) => ns.group).filter((g) => g) as Group[];
  const users = namespaces.map((ns) => ns.user).filter((u) => u) as User[];

  const groupNames = groups.map((g) => g.path);
  const userNames = users.map((u) => u.username);

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    isError,
    error,
    fetchNextPage,
  } = useInfiniteQuery({
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
    staleTime: 20000,
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

  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetching, isLoading],
  );

  useEffect(() => {
    setSearching(isFetching || isFetchingNextPage);
  });

  if (isError) {
    return (
      <ErrorLoadingDataNotice
        errorMessage={error.message}
        errorName={error.name}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      {data &&
        data.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group &&
              group.values.map((result, gi) => (
                <div ref={lastElementRef} key={result.id + gi + i}>
                  <SearchResult {...result} searchFor={search} />
                </div>
              ))}
          </React.Fragment>
        ))}
      {(isFetchingNextPage || isFetching) && <LoadingMoreDataNotice />}
      {!isFetchingNextPage && !hasNextPage && !isFetching && (
        <AllResultsLoadedNotice />
      )}
    </div>
  );
}

function LoadingMoreDataNotice() {
  return (
    <Notice
      level="tip"
      icon={
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-5 w-5" />
        </motion.div>
      }
    >
      <div className="space-y-2">
        <p className="font-semibold">Loading More Data</p>
        <motion.p
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        >
          Please wait while we fetch more results for you...
        </motion.p>
      </div>
    </Notice>
  );
}

function AllResultsLoadedNotice() {
  return (
    <Notice level="tip" icon={<CheckCircle className="h-5 w-5" />}>
      <div className="space-y-2">
        <p className="font-semibold">All Results Loaded</p>
        <p>
          You&apos;ve reached the end of the list. All available results have
          been displayed.
        </p>
      </div>
    </Notice>
  );
}

function ErrorLoadingDataNotice({
  errorMessage,
  errorName,
}: {
  errorMessage: string;
  errorName: string;
}) {
  return (
    <Notice level="error" icon={<AlertOctagon className="h-5 w-5" />}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
      >
        <p className="font-semibold">Error Loading Data: {errorName}</p>
        <p>
          An error occurred while fetching the data. Please try again later.
        </p>
        <p className="text-sm italic">Error details: {errorMessage}</p>
      </motion.div>
    </Notice>
  );
}
