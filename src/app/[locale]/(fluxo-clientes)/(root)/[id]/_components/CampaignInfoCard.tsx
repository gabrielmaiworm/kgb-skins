import { FreeBadge } from "./FreeBadge";

interface CampaignInfoCardProps {
  itemCondition: string;
  itemFloat: string;
  pricePerTicket: number;
  totalTickets: number;
  isFree: boolean;
}

export const CampaignInfoCard = ({
  itemCondition,
  itemFloat,
  pricePerTicket,
  totalTickets,
  isFree,
}: CampaignInfoCardProps) => {
  return (
    <div className="glass-card">
      <div className="glass-bg" />
      <div className="glass-blur" />
      <div className="glass-border" />

      <div className="relative z-10 p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <p className="body-caption text-text-muted mb-0.5">Condição</p>
            <p className="body-callout-bold sm:body-paragraph-bold text-foreground">{itemCondition}</p>
          </div>
          <div>
            <p className="body-caption text-text-muted mb-0.5">Float</p>
            <p className="body-callout-bold sm:body-paragraph-bold text-foreground font-mono">{parseFloat(itemFloat).toFixed(4)}</p>
          </div>
          <div>
            <p className="body-caption text-text-muted mb-0.5">Valor por número</p>
            {isFree ? (
              <FreeBadge />
            ) : (
              <p className="body-paragraph-bold sm:body-title-bold text-kgb-gold">
                R$ {pricePerTicket.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            )}
          </div>
          <div>
            <p className="body-caption text-text-muted mb-0.5">Total de números</p>
            <p className="body-callout-bold sm:body-paragraph-bold text-foreground">{totalTickets} cotas</p>
          </div>
        </div>
      </div>
    </div>
  );
};
