"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DashboardMetricsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const DashboardMetricsCard = ({
  title,
  value,
  description,
  icon,
  className,
}: DashboardMetricsCardProps) => {
  return (
    <div
      className={cn(
        "glass-card relative overflow-hidden border-l-4 border-l-kgb-red",
        className
      )}
    >
      <div className="glass-bg" />
      <div className="glass-blur" />
      <div className="glass-border" />
      <div className="relative z-10 p-5 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <p className="body-caption text-text-muted">{title}</p>
          {icon && (
            <span className="text-kgb-red shrink-0 [&>svg]:size-4">
              {icon}
            </span>
          )}
        </div>
        <p className="body-title-bold text-foreground">{value}</p>
        {description && (
          <p className="body-caption text-text-muted">{description}</p>
        )}
      </div>
    </div>
  );
};
