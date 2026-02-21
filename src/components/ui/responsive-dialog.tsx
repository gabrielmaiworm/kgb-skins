"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface ResponsiveDialogProps {
  cardTitle?: string;
  cardDescription?: string;
  Form: React.ReactNode;
  triggerButton?: React.ReactNode; // botão externo
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReponsiveDialog({
  cardDescription,
  cardTitle,
  Form,
  triggerButton,
  open,
  onOpenChange,
}: ResponsiveDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Renderiza o botão externo, se fornecido
  // O controle de abrir/fechar é feito pelo pai

  if (isDesktop) {
    return (
      <>
        {triggerButton}
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              {cardTitle && <DialogTitle>{cardTitle}</DialogTitle>}
              {cardDescription && <DialogDescription>{cardDescription}</DialogDescription>}
            </DialogHeader>
            {Form}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      {triggerButton}
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            {cardTitle && <DrawerTitle>{cardTitle}</DrawerTitle>}
            {cardDescription && <DrawerDescription>{cardDescription}</DrawerDescription>}
          </DrawerHeader>
          <div className="mx-auto w-full max-w-[90vw]">{Form}</div>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
