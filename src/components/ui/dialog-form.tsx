import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { ElementType } from "react";

type DialogFormType = {
  buttonTitle: string;
  title: string;
  subTitle: string;
  Form: ElementType;
  row?: any;
  notButton?: boolean;
  open: boolean;
  setOpen: any;
  maxWidth?: string;
};

export const DialogComponent: React.FC<DialogFormType> = ({
  buttonTitle,
  subTitle,
  title,
  Form,
  notButton,
  open,
  setOpen,
  maxWidth,
  row,
}) => {
  const Content = Form;

  function closeDialog() {
    setOpen((prev: any) => !prev);
  }

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      {!notButton && (
        <DialogTrigger asChild>
          <Button size={"sm"} className="cursor-pointer" onClick={(state) => setOpen(!state)}>
            {buttonTitle}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className={`${maxWidth} max-h-[80vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{subTitle}</DialogDescription>
        </DialogHeader>
        {row ? <Content setOpen={setOpen} row={row} /> : <Content setOpen={setOpen} />}
      </DialogContent>
    </Dialog>
  );
};
