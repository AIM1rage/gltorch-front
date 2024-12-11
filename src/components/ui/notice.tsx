"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type NoticeLevel = "tip" | "warning" | "error";

interface NoticeProps {
  level: NoticeLevel;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

const levelStyles: Record<NoticeLevel, string> = {
  tip: "bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200",
  warning:
    "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200",
  error:
    "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200",
};

const levelIcons: Record<NoticeLevel, React.ReactNode> = {
  tip: <Info className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  error: <AlertCircle className="h-5 w-5" />,
};

export function Notice({ level, children, className, icon }: NoticeProps) {
  return (
    <Card
      className={cn(
        "flex items-start p-4 border-l-4",
        levelStyles[level],
        className,
      )}
    >
      <div className="mr-3 mt-1">{icon || levelIcons[level]}</div>
      <div>{children}</div>
    </Card>
  );
}
