"use client";

import React from "react";
import Link from "next/link";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import CreateUserForm from "@/app/[locale]/(fluxo-auth)/criar-usuario/_components/create-user-form";

interface CreateUserDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserDrawer({ open, onOpenChange }: CreateUserDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full w-full max-w-md sm:max-w-md [&[data-vaul-drawer-direction=right]]:sm:max-w-md">
        <div className="flex flex-col h-full overflow-y-auto">
          <DrawerHeader className="border-b border-white/10">
            <DrawerTitle className="text-foreground">Criar conta</DrawerTitle>
            <DrawerDescription className="text-text-muted">
              Preencha os dados para criar sua conta
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 p-6">
            <CreateUserForm
              onSuccess={() => onOpenChange(false)}
              onClose={() => onOpenChange(false)}
            />
          </div>

          <div className="p-6 pt-0 border-t border-white/10">
            <p className="body-caption text-text-muted text-center">
              Ao criar sua conta você aceita nossos{" "}
              <Link
                href="/terms"
                className="text-kgb-gold hover:underline underline-offset-4"
              >
                Termos de serviço
              </Link>{" "}
              e{" "}
              <Link
                href="/privacy"
                className="text-kgb-gold hover:underline underline-offset-4"
              >
                Política de privacidade
              </Link>
              .
            </p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
