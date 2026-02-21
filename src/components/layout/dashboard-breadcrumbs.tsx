"use client";

import React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useCampaingByIdQuery } from "@/querys/campaings";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BIOMOB_LINKS = [
  { label: "Instagram Biomob", url: "https://www.instagram.com/biomobguia" },
  { label: "Website Biomob", url: "https://biomob.org/pt" },
  { label: "App Android", url: "https://play.google.com/store/apps/details?id=com.biomobplusmobile" },
  { label: "App iOS", url: "https://apps.apple.com/br/app/biomob/id6739507052" },
];

export function DashboardBreadcrumbs() {
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as string) ?? "pt";
  const campaignId = params?.campaignId as string | undefined;
  const userId = params?.userId as string | undefined;
  const isOrdersRoute = pathname?.includes("/orders");
  const { data: campaign } = useCampaingByIdQuery(campaignId ?? "");

  const basePath = `/${locale}/dashboard`;

  const getBreadcrumbItems = (): { label: string; href?: string; isLast: boolean }[] => {
    const match = pathname?.match(new RegExp(`^/${locale}/dashboard(.+)?$`));
    if (!match) return [];

    const rest = (match[1] ?? "").replace(/^\//, "");
    const segments = rest ? rest.split("/") : [];

    const items: { label: string; href?: string; isLast: boolean }[] = [
      { label: "Início", href: `${basePath}/campanhas`, isLast: false },
    ];

    if (segments[0] === "campanhas") {
      if (segments[1] && campaignId && isOrdersRoute) {
        items.push({ label: "Campanhas", href: `${basePath}/campanhas`, isLast: false });
        items.push({
          label: campaign?.title ?? "Campanha",
          href: `${basePath}/campanhas`,
          isLast: false,
        });
        items.push({ label: "Pedidos", href: undefined, isLast: true });
      } else {
        items.push({ label: "Campanhas", href: undefined, isLast: true });
      }
    } else if (segments[0] === "usuarios") {
      items.push({ label: "Usuários", href: `${basePath}/usuarios`, isLast: !segments[1] });
      if (userId && segments[2] === "convidados") {
        items.push({ label: "Convidados", href: undefined, isLast: true });
      }
    } else if (segments[0] === "logs") {
      items.push({ label: "Logs", href: undefined, isLast: true });
    } else if (segments[0] === "changelog") {
      items.push({ label: "Changelog", href: undefined, isLast: true });
    }

    return items;
  };

  const items = getBreadcrumbItems();

  if (items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              <BreadcrumbEllipsis className="size-4" />
              <span className="sr-only">Links</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {BIOMOB_LINKS.map((link) => (
                <DropdownMenuItem key={link.url} onClick={() => window.open(link.url, "_blank")}>
                  {link.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        {items.map((item) => (
          <React.Fragment key={item.label}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : item.href ? (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
