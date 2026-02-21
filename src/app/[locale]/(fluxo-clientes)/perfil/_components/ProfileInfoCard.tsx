"use client";

import { useSession } from "next-auth/react";
import { Mail, Phone, Gift, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getInviteRegistrationUrl } from "@/utils/invite-url";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const ProfileInfoCard = () => {
  const { data: session } = useSession();

  const displayName = session?.user?.name ?? "—";
  const displayEmail = session?.user?.email ?? "—";
  const displayPhone = session?.user?.phone ?? "—";
  const inviteCode = session?.user?.inviteCode ?? "—";

  const handleCopyCode = async () => {
    if (!inviteCode || inviteCode === "—") return;
    try {
      const url = getInviteRegistrationUrl(inviteCode);
      await navigator.clipboard.writeText(url);
      toast.success("Link de cadastro copiado!");
    } catch {
      toast.error("Erro ao copiar link");
    }
  };

  if (!session?.user) return null;

  return (
    <div className="glass-card">
      <div className="glass-bg" />
      <div className="glass-blur" />
      <div className="glass-border" />

      <div className="relative z-10 p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex items-center justify-center md:justify-start">
            <Avatar className="h-24 w-24 border-2 border-kgb-gold/30">
              <AvatarFallback className="bg-kgb-gold/20 text-kgb-gold body-title-bold">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="heading-04-bold text-foreground">{displayName}</h2>
              <p className="body-callout text-text-muted">Conta verificada</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-kgb-gold/10">
                  <Mail className="size-4 text-kgb-gold" />
                </div>
                <div>
                  <p className="body-caption text-text-muted">E-mail</p>
                  <p className="body-paragraph text-foreground truncate">{displayEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-kgb-gold/10">
                  <Phone className="size-4 text-kgb-gold" />
                </div>
                <div>
                  <p className="body-caption text-text-muted">Telefone</p>
                  <p className="body-paragraph text-foreground">{displayPhone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-kgb-gold/10">
                  <Gift className="size-4 text-kgb-gold" />
                </div>
                <div>
                  <p className="body-caption text-text-muted">Código de indicação</p>
                  <div className="flex items-center gap-2">
                    <code className="body-paragraph-bold font-mono text-kgb-gold bg-kgb-gold/10 rounded px-2 py-0.5">
                      {inviteCode}
                    </code>
                    {inviteCode !== "—" && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyCode}>
                        <Copy className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
