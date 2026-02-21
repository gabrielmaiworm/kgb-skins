"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateReferrerAction } from "@/app/actions/users/update-referrer";

export const ReferrerCodeCard = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const hasReferredByInviteCode = session?.user?.hasReferredByInviteCode ?? false;
  const showCard = session?.user && !hasReferredByInviteCode && !submitted;

  // Pré-preenche com código da URL (?referrerInviteCode=XXX)
  useEffect(() => {
    const codeFromUrl = searchParams.get("referrerInviteCode");
    if (codeFromUrl?.trim()) {
      setInviteCode(codeFromUrl.trim().toUpperCase());
    }
  }, [searchParams]);

  if (!showCard) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      toast.error("Digite o código de quem te indicou");
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateReferrerAction({ inviteCode: inviteCode.trim() });

      if (result.success) {
        setSubmitted(true);
        toast.success(result.message, {
          description: "Faça logout e login novamente para confirmar.",
        });
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Erro ao vincular indicador");
    } finally {
      setIsLoading(false);
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
            <UserPlus className="w-5 h-5 text-kgb-gold" />
          </div>
          <div>
            <p className="body-caption text-text-muted">Foi indicado por alguém?</p>
            <p className="body-title-bold text-foreground">Informe o código</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="text"
            placeholder="Código do indicador"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            disabled={isLoading}
            className="font-mono uppercase"
            maxLength={20}
          />
          <Button type="submit" variant="gold" size="sm" disabled={isLoading}>
            {isLoading ? "Vinculando..." : "Vincular indicador"}
          </Button>
        </form>
      </div>
    </div>
  );
};
