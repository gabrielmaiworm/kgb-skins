"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Button } from "@ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { useTransition } from "react";
import { toast } from "sonner";
import { signOut, useSession } from "next-auth/react";

export function UserNav() {
  const [isPending, startTransition] = useTransition();
  const { data: session, status } = useSession();

  async function handleLogout() {
    try {
      await signOut({ redirect: false });
      window.location.href = "/login";
    } catch (error) {
      toast(`Erro ao requisitar `, {
        description: `${error}`,
      });
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {/* <AvatarImage
              src={
                `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}${
                  session?.user?.roles.includes("teatcher")
                    ? session?.user.teacherInfos?.profile_image
                    : session?.user?.roles.includes("student") && session?.user.studentInfos?.profile_image
                }` || ""
              }
              alt={session?.user?.name}
            /> */}
            <AvatarFallback>{session?.user.name}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="paragraph_01 font-medium leading-none">{session?.user?.name}</p>
            <p className="paragraph-card leading-none text-muted-foreground lowercase">{session?.user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button
            type="button"
            loading={isPending}
            onClick={() => {
              handleLogout();
            }}
          >
            Sair
          </Button>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
