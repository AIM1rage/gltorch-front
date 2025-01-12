"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  File,
  Copy,
  Check,
  GitGraph,
  AlertTriangle,
} from "lucide-react";
import sanitizeHtml from "sanitize-html";
import { Link } from "@/components/ui/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export type SearchResultProps = {
  data: string;
  startline: number;
  searchFor: string;
  fileName: string;
  project: {
    webUrl: string;
    pathWithNamespace: string;
  };
  path: string;
  webUrl: string;
};

const binaryExtensions = [
  "svg",
  "exe",
  "png",
  "jpg",
  "jpeg",
  "gif",
  "bmp",
  "ico",
  "webp",
  "tiff",
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "zip",
  "rar",
  "7z",
  "tar",
  "gz",
  "excalidraw",
];

function FileHeader({
  project,
  fileName,
  webUrl,
  path,
}: Pick<SearchResultProps, "project" | "fileName" | "webUrl" | "path">) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = React.useCallback(() => {
    navigator.clipboard.writeText(path).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [path]);

  return (
    <div className="px-4 py-3 border-b flex">
      <div className="flex flex-row items-center space-x-4 font-mono">
        <Link href={project.webUrl} className="text-foreground">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="truncate text-ellipsis flex flex-row flex-wrap gap-4">
                <GitGraph className="h-4 w-4 text-muted-foreground" />
                {project.pathWithNamespace}
              </TooltipTrigger>
              <TooltipContent>
                <span>Open Project</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Link>
        <Link href={webUrl}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-foreground truncate text-ellipsis flex flex-row gap-4 flex-wrap">
                <File className="h-4 w-4 text-muted-foreground" />
                <span className="max-lg:hidden">{fileName}</span>
              </TooltipTrigger>
              <TooltipContent>
                <span>Open File</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Link>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy Path to File</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

function BinaryFileWarning({ onShowContent }: { onShowContent: () => void }) {
  return (
    <div className="p-4 flex flex-col items-center">
      <AlertTriangle className="h-8 w-8 text-warning mb-2" />
      <p className="text-center mb-4">
        This file may contain binary or non-textual content. Displaying its
        contents might not be meaningful.
      </p>
      <Button onClick={onShowContent}>Show Content Anyway</Button>
    </div>
  );
}

function LongLinesWarning({ onShowContent }: { onShowContent: () => void }) {
  return (
    <Alert variant="destructive" className="p-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription className="truncate flex flex-col gap-4">
        This file contains very long lines (exceeding 500 characters). The
        content may be difficult to read or process.
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={onShowContent}
        >
          Show Content Anyway
        </Button>
      </AlertDescription>
    </Alert>
  );
}

function useFileContent({
  data,
  startline,
  searchFor,
  isBinaryFile,
  showBinaryContent,
}: Pick<SearchResultProps, "data" | "startline" | "searchFor"> & {
  isBinaryFile: boolean;
  showBinaryContent: boolean;
}) {
  return useMemo(() => {
    if (isBinaryFile && !showBinaryContent) {
      return {
        highlightedLines: [],
        totalLines: 0,
        firstLineWithSearch: -1,
        hasLongLines: false,
      };
    }

    const sanSearch = sanitizeHtml(searchFor, {
      allowedTags: [],
      allowedAttributes: {},
    });
    const sanData: string = sanitizeHtml(data, {
      allowedTags: [],
      allowedAttributes: {},
    });

    const lines = sanData.split("\n");
    const searchRegex = new RegExp(`(${sanSearch})`, "gi");

    let longLinesDetected = false;

    const highlighted = lines.map((line, index) => {
      const lineNumber = startline + index;
      const highlightedLine = line.replace(
        searchRegex,
        '<mark class="bg-primary/40 dark:bg-primary/80 text-primary-foreground font-medium">$1</mark>',
      );

      if (line.length > 500) {
        longLinesDetected = true;
      }

      return (
        <div key={lineNumber} className="flex">
          <span className="w-12 text-right pr-4 select-none text-muted-foreground">
            {lineNumber}
          </span>
          <pre className="flex-1 overflow-x-auto text-wrap">
            <code
              className="break-all"
              dangerouslySetInnerHTML={{
                __html: highlightedLine,
              }}
            />
          </pre>
        </div>
      );
    });

    const firstLineWithSearch = lines.findIndex((line) =>
      line.toLowerCase().includes(searchFor.toLowerCase()),
    );

    return {
      highlightedLines: highlighted,
      totalLines: lines.length,
      firstLineWithSearch: firstLineWithSearch,
      hasLongLines: longLinesDetected,
    };
  }, [data, startline, searchFor, isBinaryFile, showBinaryContent]);
}

export function SearchResult({
  data,
  startline,
  searchFor,
  fileName,
  project,
  path,
  webUrl,
}: SearchResultProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showBinaryContent, setShowBinaryContent] = useState(false);
  const [showLongLinesWarning, setShowLongLinesWarning] = useState(false);

  const isBinaryFile = useMemo(() => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    return extension ? binaryExtensions.includes(extension) : false;
  }, [fileName]);

  const { highlightedLines, totalLines, firstLineWithSearch, hasLongLines } =
    useFileContent({
      data,
      startline,
      searchFor,
      isBinaryFile,
      showBinaryContent,
    });

  const visibleLines = useMemo(() => {
    if (firstLineWithSearch >= 0) {
      return isOpen
        ? highlightedLines
        : highlightedLines.slice(
            Math.max(firstLineWithSearch - 2, 0),
            Math.min(firstLineWithSearch + 3, highlightedLines.length),
          );
    } else {
      return highlightedLines.slice(0, Math.min(5, highlightedLines.length));
    }
  }, [highlightedLines, firstLineWithSearch, isOpen]);

  const hasMoreLines = totalLines > visibleLines.length;

  const handleShowBinaryContent = useCallback(
    () => setShowBinaryContent(true),
    [],
  );
  const handleShowLongLinesContent = useCallback(
    () => setShowLongLinesWarning(true),
    [],
  );

  return (
    <div className="flex-1 w-full border rounded-md overflow-hidden bg-background">
      <FileHeader
        project={project}
        fileName={fileName}
        webUrl={webUrl}
        path={path}
      />
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {isBinaryFile && !showBinaryContent ? (
          <BinaryFileWarning onShowContent={handleShowBinaryContent} />
        ) : (
          <>
            {hasLongLines && !showLongLinesWarning ? (
              <LongLinesWarning onShowContent={handleShowLongLinesContent} />
            ) : (
              <>
                {(!hasMoreLines || !isOpen) && (
                  <div className="p-4">
                    <div className="space-y-1">{visibleLines}</div>
                  </div>
                )}
                {hasMoreLines && (
                  <CollapsibleContent>
                    <div className="space-y-1 p-4 pt-0">{highlightedLines}</div>
                  </CollapsibleContent>
                )}
                {hasMoreLines && (
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full border-t rounded-none h-9 hover:bg-muted"
                    >
                      {isOpen ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-2" />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-2" />
                          Show more
                        </>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                )}
              </>
            )}
          </>
        )}
      </Collapsible>
    </div>
  );
}
