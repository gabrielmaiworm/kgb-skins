"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Aurora from "@/components/ui/aurora";
import { ProfileInfoCard } from "./ProfileInfoCard";
import { InvitedUsersSection } from "./InvitedUsersSection";
import MeusNumerosGrid from "../../meus-numeros/_components/meus-numeros-grid";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { LogOutIcon, User } from "lucide-react";
import { toast } from "sonner";
import deleteAuthCookies from "@/app/actions/auth/delete-cookies";
import { buildAuthRedirectUrl } from "@/utils/invite-url";
import { useSearchParams } from "next/navigation";

export const PageContainer = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status === "unauthenticated") {
      const loginUrl = buildAuthRedirectUrl("/login", { callbackUrl: pathname || "/perfil" }, searchParams);
      router.replace(loginUrl);
    }
  }, [status, router, pathname, searchParams]);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      await deleteAuthCookies();
      window.location.href = buildAuthRedirectUrl("/login");
    } catch {
      console.log("Erro ao sair");
    }
  };

  if (status === "loading" || !session?.user) {
    return (
      <div className="relative min-h-screen">
        <div className="fixed inset-0 -z-10">
          <Aurora colorStops={["#E60000", "#FFD700", "#8B0000"]} />
        </div>
        <div className="relative pt-28 pb-12 px-4 flex items-center justify-center min-h-[50vh]">
          <p className="body-title text-text-muted">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen mx-auto ">
      <div className="fixed inset-0 -z-10">
        <Aurora colorStops={["#E60000", "#FFD700", "#8B0000"]} />
      </div>

      <div className="relative pt-28 pb-12 px-4">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-kgb-gold/10 border border-kgb-gold/30 mb-2">
              <User className="w-10 h-10 text-kgb-gold" />
            </div>
            <h1 className="heading-02-bold md:heading-01 text-foreground">
              Meu <span className="text-kgb-gold">Perfil</span>
            </h1>
            <p className="body-title text-text-subtle max-w-2xl mx-auto">
              Gerencie suas informações, acompanhe seus números e veja quem você convidou
            </p>
          </div>

          {/* Perfil Info */}
          <ProfileInfoCard />

          {/* Meus Números */}
          <section>
            <MeusNumerosGrid />
          </section>

          {/* Usuários Convidados */}
          <section>
            <InvitedUsersSection />
          </section>

          {/* Logout */}
          <div className="flex justify-center pt-8">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOutIcon className="w-5 h-5" />
              Sair da conta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
