import { Card } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type NoticeLevel = "tip" | "warning" | "error";

export interface NoticeProps {
  level: NoticeLevel;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  duration?: number; // in milliseconds
  onComplete?: () => void;
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

const timeBarColors: Record<NoticeLevel, string> = {
  tip: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-red-500",
};

export function Notice({
  level,
  children,
  className,
  icon,
  duration,
  onComplete,
}: NoticeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={cn(
          "flex flex-col items-start p-4 border-l-4 overflow-hidden",
          levelStyles[level],
          className,
        )}
      >
        <div className="flex items-start w-full">
          <div className="mr-3 mt-1">{icon || levelIcons[level]}</div>
          <div className="flex-grow">{children}</div>
        </div>
        {duration && (
          <motion.div
            className={cn("h-1 w-full mt-2", timeBarColors[level])}
            initial={{ width: "100%" }}
            animate={{ width: 0 }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            onAnimationComplete={onComplete}
          />
        )}
      </Card>
    </motion.div>
  );
}
