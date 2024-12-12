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
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";

const formSchema = z.object({
  search: z.string().min(3, {
    message: "Search must be at least 3 characters long.",
  }),
});

export default function SearchBar({
  onSubmit,
  className,
  isSearching = false,
}: {
  onSubmit?: () => never;
  className?: string;
  isSearching?: boolean;
}) {
  const { search, setSearch } = useSearchStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: search,
    },
  });

  function onSub(values: z.infer<typeof formSchema>) {
    setSearch(values.search);

    if (onSubmit) {
      onSubmit();
    }
  }

  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -5 },
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSub)}
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
                  <Input
                    placeholder="Search..."
                    className="pl-8 pr-24"
                    autoComplete="off"
                    {...field}
                  />
                  <div className="absolute right-1 top-1">
                    <Button
                      type="submit"
                      size="sm"
                      className="h-8 min-w-[80px]"
                      disabled={isSearching}
                    >
                      <span className="relative">
                        <AnimatePresence mode="wait" initial={false}>
                          {isSearching ? (
                            <motion.span
                              key="dots"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <motion.span
                                variants={dotVariants}
                                initial="initial"
                                animate="animate"
                                transition={{
                                  repeat: Infinity,
                                  duration: 0.6,
                                  repeatType: "reverse",
                                }}
                              >
                                •
                              </motion.span>
                              <motion.span
                                variants={dotVariants}
                                initial="initial"
                                animate="animate"
                                transition={{
                                  repeat: Infinity,
                                  duration: 0.6,
                                  delay: 0.2,
                                  repeatType: "reverse",
                                }}
                              >
                                •
                              </motion.span>
                              <motion.span
                                variants={dotVariants}
                                initial="initial"
                                animate="animate"
                                transition={{
                                  repeat: Infinity,
                                  duration: 0.6,
                                  delay: 0.4,
                                  repeatType: "reverse",
                                }}
                              >
                                •
                              </motion.span>
                            </motion.span>
                          ) : (
                            <motion.span
                              key="search"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              Search
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </Button>
                  </div>
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
