"use client";

import React, { useMemo, useState } from "react";
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
} from "lucide-react";
import sanitizeHtml from "sanitize-html";

interface SearchResultProps {
  data: string;
  startLine: number;
  searchFor: string;
  filename: string;
  projectPath: string;
  path: string;
}

export function SearchResult({
  data,
  startLine,
  searchFor,
  filename,
  projectPath,
  path,
}: SearchResultProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { highlightedLines, totalLines } = useMemo(() => {
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

    const highlighted = lines.map((line, index) => {
      const lineNumber = startLine + index;
      const highlightedLine = line.replace(
        searchRegex,
        '<mark class="bg-primary/20 text-primary font-medium">$1</mark>',
      );

      return (
        <div key={lineNumber} className="flex">
          <span className="w-12 text-right pr-4 select-none text-muted-foreground">
            {lineNumber}
          </span>
          <pre className="flex-1 overflow-x-auto text-wrap">
            <code
              dangerouslySetInnerHTML={{
                __html: highlightedLine,
              }}
            />
          </pre>
        </div>
      );
    });

    return { highlightedLines: highlighted, totalLines: lines.length };
  }, [data, startLine, searchFor]);

  const visibleLines = isOpen ? highlightedLines : highlightedLines.slice(0, 5);
  const hasMoreLines = totalLines > 5;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(path).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex-1 w-full border rounded-md overflow-hidden bg-background">
      <div className="px-4 py-3 border-b flex items-center">
        <div className="flex flex-row items-center space-x-4 font-mono">
          <GitGraph className="h-4 w-4 text-muted-foreground" />
          <span className="truncate text-ellipsis">{projectPath}</span>
          <File className="h-4 w-4 text-muted-foreground" />
          <span>{filename}</span>
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="p-4">
          <div className="space-y-1">{visibleLines}</div>
        </div>
        {hasMoreLines && (
          <CollapsibleContent>
            <div className="space-y-1 p-4 pt-0">
              {highlightedLines.slice(5)}
            </div>
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
      </Collapsible>
    </div>
  );
}