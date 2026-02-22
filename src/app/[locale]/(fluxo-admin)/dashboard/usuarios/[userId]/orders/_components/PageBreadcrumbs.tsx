import Link from "next/link";

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

export function PageBreadcrumbs({ userId, userName }: { userId: string; userName?: string }) {
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
              <DropdownMenuItem onClick={() => window.open("https://www.instagram.com/biomobguia", "_blank")}>
                Instagram Biomob
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open("https://biomob.org/pt", "_blank")}>
                Website Biomob
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  window.open("https://play.google.com/store/apps/details?id=com.biomobplusmobile", "_blank")
                }
              >
                App Android
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.open("https://apps.apple.com/br/app/biomob/id6739507052", "_blank")}
              >
                App iOS
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/pt/dashboard/campanhas">Início</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/pt/dashboard/usuarios">Usuários</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/pt/dashboard/usuarios/${userId}`}>{userName ?? "Usuário"}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Pedidos</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
