"use client";

import { useSession } from "next-auth/react";
import { Copy, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getInviteRegistrationUrl } from "@/utils/invite-url";

export const InviteCodeCard = () => {
  const { data: session } = useSession();
  const inviteCode = session?.user?.inviteCode;

  if (!session?.user || !inviteCode) return null;

  const handleCopy = async () => {
    try {
      const url = getInviteRegistrationUrl(inviteCode);
      await navigator.clipboard.writeText(url);
      toast.success("Link de cadastro copiado!");
    } catch {
      toast.error("Erro ao copiar link");
    }
  };

  return (
    <div className="glass-card">
      <div className="glass-bg" />
      <div className="glass-blur" />
      <div className="glass-border" />

      <div className="relative z-10 p-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-kgb-gold/20 border border-kgb-gold/30">
            <Gift className="w-5 h-5 text-kgb-gold" />
          </div>
          <div>
            <p className="body-caption text-text-muted">Seu código de indicação</p>
            <p className="body-title-bold text-foreground">Compartilhe e ganhe!</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 body-paragraph-bold font-mono px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-kgb-gold truncate">
            {inviteCode}
          </code>
          <Button variant="outline" size="icon" onClick={handleCopy} className="shrink-0" aria-label="Copiar código">
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
