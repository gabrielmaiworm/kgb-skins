"use client";
import React from "react";
import PageContainer from "@/components/layout/page-container";
import { TitleIcon } from "@/components/ui/title-icon";

interface LayoutPageContainerProps {
  breadcrumbs?: React.ReactNode;
  titleIcon: {
    icon: React.ElementType;
    variant?: "default" | "warning" | "info" | "destructive";
  };
  title: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export const PageBoxLayout: React.FC<LayoutPageContainerProps> = ({
  breadcrumbs,
  titleIcon,
  title,
  actions,
  children,
}) => {
  return (
    <PageContainer scrolllable>
      <div className="flex flex-col w-full gap-5 min-h-[calc(100vh-260px)] mb-20 ">
        {breadcrumbs ?? null}

        <div className="flex gap-4 flex-wrap items-center justify-between ">
          <div className="flex gap-5 items-center">
            <TitleIcon icon={titleIcon.icon} />
            <h2 className="heading-03-bold flex gap-2">{title}</h2>
          </div>
          {actions && actions}
        </div>
        {children}
      </div>
    </PageContainer>
  );
};
