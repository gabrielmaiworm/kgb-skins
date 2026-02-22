"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TicketCheck, Menu, LogIn, MessageCircle, LayoutDashboard, User, History, Package } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "next-auth/react";

export default function RifaHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  const activeHref = pathname.includes("/perfil")
    ? "/perfil"
    : pathname.includes("/meus-numeros")
      ? "/meus-numeros"
      : pathname.includes("/oferecer-skins")
        ? "/oferecer-skins"
        : pathname.includes("/changelog")
          ? "/changelog"
          : "/";
  const { data: session } = useSession();

  const menuItems = [
    { icon: Home, label: "Início", href: "/" },
    { icon: TicketCheck, label: "Meus números", href: "/meus-numeros" },
    { icon: Package, label: "Oferecer Skins", href: "/oferecer-skins" },
    // { icon: History, label: "Changelog", href: "/changelog" },
    {
      icon: MessageCircle,
      label: "Grupo WhatsApp",
      href: "https://chat.whatsapp.com/C9apswXfDeVD1rJW9bbYQp",
      external: true,
    },
    ...(session?.user?.role === "admin"
      ? [{ icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/campanhas" }]
      : []),
  ];

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div className="relative w-full max-w-[calc(100vw-1rem)] mx-auto rounded-2xl overflow-visible pointer-events-auto shadow-xl">
          <div className="relative backdrop-blur-xl bg-gradient-to-r from-kgb-red/20 via-kgb-gold/15 to-kgb-red/20 border border-white/10 rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20 rounded-2xl" />

            <div className="relative flex items-center justify-between px-4">
              <div className="flex items-center gap-6">
                <Link href="/" className="relative z-10">
                  <div className="relative h-14 w-14 transition-transform hover:scale-105">
                    <Image
                      src="/image-removebg-preview (1).png"
                      alt="KGB Skins"
                      fill
                      className="object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                    />
                  </div>
                </Link>
                <nav className="hidden md:flex items-center gap-2">
                  {menuItems.map((item) => {
                    const isActive = item.href === activeHref;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className={
                          "group relative flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white transition-colors rounded-lg" +
                          (isActive ? " font-bold" : "")
                        }
                      >
                        {isActive && (
                          <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 h-2 w-16 rounded-full bg-gradient-to-r from-blue-500/40 via-blue-400/80 to-blue-500/40 blur-md opacity-80 animate-pulse" />
                        )}
                        <item.icon className="w-5 h-5 relative z-10" />
                        <span className="relative z-10 font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="flex items-center gap-4">
                {!session?.user ? (
                  <Link
                    href="/login"
                    className={`${buttonVariants({ variant: "default", size: "default" })} rounded-xl hidden md:flex`}
                  >
                    <LogIn className="w-5 h-5" />
                    Entrar
                  </Link>
                ) : (
                  <Link
                    href="/perfil"
                    className="hidden md:flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white transition-colors rounded-lg"
                  >
                    <User className="w-5 h-5" />
                    Perfil
                  </Link>
                )}

                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon" className="text-white">
                      <Menu className="w-6 h-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-80 bg-gradient-to-b from-kgb-red/30 via-kgb-gold/20 to-kgb-red/30 border-white/10"
                  >
                    <SheetHeader>
                      <SheetTitle className="text-foreground">Menu</SheetTitle>
                    </SheetHeader>

                    <nav className="flex flex-col gap-2 mt-6">
                      {menuItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          onClick={() => setIsMenuOpen(false)}
                          className="group flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-white/10 transition-all"
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      ))}

                      <div className="mt-4 pt-4 border-t border-white/10">
                        {!session?.user ? (
                          <Link
                            href="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className={`${buttonVariants({ variant: "default", size: "full" })} rounded-xl`}
                          >
                            <LogIn className="w-5 h-5" />
                            Entrar
                          </Link>
                        ) : (
                          <Link
                            href="/perfil"
                            onClick={() => setIsMenuOpen(false)}
                            className={`${buttonVariants({ variant: "default", size: "full" })} rounded-xl flex items-center justify-center gap-2`}
                          >
                            <User className="w-5 h-5" />
                            Meu Perfil
                          </Link>
                        )}
                      </div>
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
