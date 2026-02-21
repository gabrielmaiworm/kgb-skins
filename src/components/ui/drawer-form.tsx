"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import React, { ElementType } from "react";

type DrawerFormType = {
  title: string;
  subTitle: string;
  Form: ElementType;
  row?: any;
  open: boolean;
  setOpen: (open: boolean) => void;
  maxWidth?: string;
};

export const DrawerFormComponent: React.FC<DrawerFormType> = ({
  subTitle,
  title,
  Form,
  open,
  setOpen,
  maxWidth = "max-w-md",
  row,
}) => {
  const Content = Form;

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerContent
        className={`h-full w-full overflow-y-auto [&[data-vaul-drawer-direction=right]]:!w-[min(100%,42rem)] [&[data-vaul-drawer-direction=right]]:!max-w-[42rem] ${maxWidth}`}
      >
        <div className="flex flex-col h-full overflow-y-auto w-full">
          <DrawerHeader className="border-b shrink-0">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{subTitle}</DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 p-6 overflow-y-auto w-full min-w-0">
            {row ? <Content setOpen={setOpen} row={row} /> : <Content setOpen={setOpen} />}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
