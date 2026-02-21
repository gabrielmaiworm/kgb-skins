import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const WhatsAppInfoCard = () => {
  return (
    <div className="glass-card">
      <div className="glass-bg" />
      <div className="glass-blur" />
      <div className="glass-border" />

      <div className="relative z-10 p-4 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-start gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 rounded-full bg-green-500/20 border border-green-500/30 shrink-0">
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-foreground">Grupo do WhatsApp Obrigatório</h3>
            <p className="text-sm sm:text-base text-text-muted">
              Para receber seu prêmio, é obrigatório estar no grupo do WhatsApp. Todas as informações sobre sorteios e
              entrega de prêmios são divulgadas exclusivamente no grupo.
            </p>
            <Link href="https://chat.whatsapp.com/C9apswXfDeVD1rJW9bbYQp" target="_blank" rel="noopener noreferrer">
              <Button variant="default" size="sm" className="mt-3 sm:mt-4 text-sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Entrar no Grupo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
