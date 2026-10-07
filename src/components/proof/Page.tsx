import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Page({ children, className, narrow }: { children: ReactNode; className?: string; narrow?: boolean }) {
  return <div className={cn("mx-auto w-full px-5 py-10 sm:px-10 sm:py-14", narrow ? "max-w-3xl" : "max-w-5xl", className)}>{children}</div>;
}
