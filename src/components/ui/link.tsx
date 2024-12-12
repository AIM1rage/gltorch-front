"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import NextLink from "next/link";
import { cn } from "@/lib/utils";

const linkVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "text-primary-foreground underline-offset-4 hover:underline",
        button: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "text-destructive hover:text-destructive/90",
        prominent:
          "text-blue-600 underline underline-offset-4 hover:text-blue-800",
      },
      size: {
        default: "h-10",
        sm: "h-9",
        lg: "h-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  href: string;
  external?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    { className, children, href, variant, size, external = false, ...props },
    ref,
  ) => {
    const Comp = external ? "a" : NextLink;
    const externalProps = external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};

    return (
      <Comp
        href={href}
        className={cn(linkVariants({ variant, size, className }))}
        ref={ref}
        {...externalProps}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
Link.displayName = "Link";

export { Link, linkVariants };
