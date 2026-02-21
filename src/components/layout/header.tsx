"use client";
import React from "react";
import { SidebarTrigger } from "@ui/sidebar";
import { Separator } from "@ui/separator";
import { DashboardBreadcrumbs } from "./dashboard-breadcrumbs";
import { Skeleton } from "../ui/skeleton";

export const AcessibilityBar = ({ className }: { className: string }) => {
  return (
    <div
      className={` max-h-12 overflow-y-hidden relative justify-center 
        md:justify-start gap-4 items-center 
         w-full backdrop-blur-lg 
        px-4 py-1 my-0 mx-auto print:hidden
        ${className}`}
    >
      <div className="flex gap-4 items-center justify-center max-md:mx-auto mr-auto "></div>
    </div>
  );
};

export default function Header() {
  const [isMounted, setIsMounted] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Skeleton className="w-100 mx-4 mt-2 h-10" />;
  }

  return (
    <header className="glass-card border-b grid grid-cols-2 max-md:px-4 md:flex md:h-16 max-md:py-2 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 print:hidden">
      <div className="glass-bg" />
      <div className="glass-blur" />
      <div className="glass-border" />

      <AcessibilityBar className={"max-md:flex hidden col-span-3 relative z-10"} />

      <div className="flex items-center gap-2 px-4 relative z-10 w-full">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <DashboardBreadcrumbs />
      </div>

      <AcessibilityBar className={"max-md:hidden flex relative z-10"} />
    </header>
  );
}
