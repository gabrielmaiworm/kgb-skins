/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { adminNavItems } from "@/constants/data";
import { KBarAnimator, KBarPortal, KBarPositioner, KBarProvider, KBarSearch } from "kbar";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import RenderResults from "./render-result";
import useThemeSwitching from "./use-theme-switching";
import { useSession } from "next-auth/react";

export default function KBar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session } = useSession();
  const navigateTo = (url: string) => {
    router.push(url);
  };

  const navItemsToExibe = adminNavItems();

  const actions = useMemo(
    () =>
      navItemsToExibe?.flatMap((navItem) => {
        const baseAction =
          navItem.url !== "#"
            ? {
                id: `${navItem.title.toLowerCase()}Action`,
                name: navItem.title,
                shortcut: navItem.shortcut,
                keywords: navItem.title.toLowerCase(),
                section: "Navigation",
                subtitle: `Ir para ${navItem.title}`,
                perform: () => navigateTo(navItem.url),
              }
            : null;

        const childActions =
          navItem.items?.map((childItem: any) => ({
            id: `${childItem.title.toLowerCase()}Action`,
            name: childItem.title,
            shortcut: childItem.shortcut,
            keywords: childItem.title.toLowerCase(),
            section: navItem.title,
            subtitle: `Ir para ${childItem.title}`,
            perform: () => navigateTo(childItem.url),
          })) ?? [];

        return baseAction ? [baseAction, ...childActions] : childActions;
      }),
    []
  );

  return (
    <KBarProvider actions={actions}>
      <KBarComponent>{children}</KBarComponent>
    </KBarProvider>
  );
}
const KBarComponent = ({ children }: { children: React.ReactNode }) => {
  useThemeSwitching();

  return (
    <>
      <KBarPortal>
        <KBarPositioner className="scrollbar-hide fixed inset-0 z-[99999] bg-black/80  !p-0 backdrop-blur-sm">
          <KBarAnimator className="glass-card relative !mt-64 w-full max-w-[600px] !-translate-y-12 overflow-hidden rounded-lg text-foreground shadow-lg">
            <div className="glass-bg" />
            <div className="glass-blur" />
            <div className="glass-border" />
            <div className="relative z-10">
              <div className="border-x-0 border-b-2 border-border">
                <KBarSearch className="w-full border-none bg-background px-6 py-4 text-lg outline-none focus:outline-none focus:ring-0 focus:ring-offset-0" />
              </div>
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </>
  );
};
