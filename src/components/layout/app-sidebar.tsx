"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@ui/sidebar";
import { adminNavItems } from "@/constants/data";
import { ChevronRight, ChevronsUpDown, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { Icons } from "../icons";
import { toast } from "sonner";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const company = {
  name: "KGB",
  plan: "Dashboard",
};

export default function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { toggleSidebar, state } = useSidebar();
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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

  const navItemsToExibe = adminNavItems();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex gap-2 py-2 text-sidebar-accent-foreground ">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            {mounted && (
              <Image
                src={"/image-removebg-preview (1).png"}
                alt="Logo"
                width={100}
                height={100}
                className="w-20 h-auto"
              />
            )}
          </div>
          <div className="grid flex-1 text-left paragraph_01 leading-tight">
            <span className="truncate font-semibold">{company.name}</span>
            <span className="truncate paragraph-card">{company.plan}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Visão geral</SidebarGroupLabel>
          <SidebarMenu>
            {navItemsToExibe.map((item) => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo;
              const isAnySubItemActive = item.items?.some((subItem: any) => pathname === subItem.url) || false;
              const isParentActive = pathname === item.url || isAnySubItemActive;
              const activeButtonClasses = buttonVariants({ variant: "default", size: "full" });
              return item?.items && item?.items?.length > 0 ? (
                <Collapsible key={item.title} asChild defaultOpen={isParentActive} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger
                      asChild
                      onClick={() => {
                        if (!item?.items?.length) return;
                        if (state === "collapsed" && window.innerWidth >= 764) {
                          toggleSidebar();
                        }
                      }}
                    >
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isParentActive}
                        className={isParentActive ? `${activeButtonClasses} justify-start text-start` : "justify-start"}
                      >
                        {item.icon && (
                          <Icon
                            className={cn(
                              "transition-colors",
                              isParentActive ? "text-primary-foreground" : "text-sidebar-foreground"
                            )}
                          />
                        )}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem: any, idx: number) => (
                          <SidebarMenuSubItem key={subItem.key || `${subItem.title}-${subItem.url}-${idx}`}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                              className={
                                pathname === subItem.url
                                  ? `${activeButtonClasses} justify-start text-start`
                                  : "justify-start"
                              }
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                    className={
                      pathname === item.url ? `${activeButtonClasses} justify-start text-start` : "justify-start"
                    }
                  >
                    <Link href={item.url} className="justify-start">
                      <Icon
                        className={cn(
                          "transition-colors ",
                          pathname === item.url ? "text-primary-foreground" : "text-sidebar-foreground"
                        )}
                      />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    {/* <AvatarImage src={ ""} alt={session?.user?.name || ""} /> */}
                    <AvatarFallback className="rounded-lg">
                      {/* {session?.user?.name?.slice(0, 2)?.toUpperCase() || "CN"} */}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left paragraph_01 leading-tight">
                    {/* <span className="truncate font-semibold">{session?.user?.name || ""}</span>
                    <span className="truncate paragraph-card">{session?.user?.email || ""}</span> */}
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left paragraph_01">
                    <Avatar className="h-8 w-8 rounded-lg">
                      {/* <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} /> */}
                      <AvatarFallback className="rounded-lg">
                        {/* {session?.user?.name?.slice(0, 2)?.toUpperCase() || "CN"} */}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left paragraph_01 leading-tight">
                      {/* <span className="truncate font-semibold">{session?.user?.name || ""}</span> */}
                      {/* <span className="truncate paragraph-card"> {session?.user?.email || ""}</span> */}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  <LogOut />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
