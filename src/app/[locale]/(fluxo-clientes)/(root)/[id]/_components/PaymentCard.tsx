import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, QrCode } from "lucide-react";
import { BuyTicketsManualResponse } from "@/@types/campaings";
import Image from "next/image";

interface PaymentCardProps {
  paymentData: BuyTicketsManualResponse;
  onPaymentConfirmed: () => void;
}

export const PaymentCard = ({ paymentData, onPaymentConfirmed }: PaymentCardProps) => {
  const [copied, setCopied] = useState(false);
  const { payment, tickets } = paymentData;

  const handleCopyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(payment?.pixCopyPaste || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar código PIX:", error);
    }
  };

  const formatExpirationDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card mb-6">
        <div className="glass-bg" />
        <div className="glass-blur" />
        <div className="glass-border" />

        <div className="relative z-10 p-4 sm:p-6 md:p-8">
          <div className="text-center mb-4 sm:mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-kgb-gold/20 mb-3 sm:mb-4">
              <QrCode className="w-6 h-6 sm:w-8 sm:h-8 text-kgb-gold" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">Escaneie o QR Code para pagar</h2>
            <p className="text-sm sm:text-base text-text-muted">
              Use o aplicativo do seu banco para escanear o código ou copie o código PIX
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl">
              <Image
                src={`data:image/png;base64,${payment?.qrCode || ""}`}
                alt="QR Code PIX"
                width={250}
                height={250}
                className="w-full max-w-[200px] sm:max-w-[250px]"
              />
            </div>
          </div>

          {/* Informações do Pagamento */}
          <div className="space-y-4 mb-4">
            <div className="glass-card">
              <div className="glass-bg" />
              <div className="glass-blur" />
              <div className="glass-border" />

              <div className="relative z-10 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="body-caption text-text-muted mb-1">Valor a pagar</p>
                    <p className="text-base sm:text-lg font-bold text-kgb-gold">R$ {payment?.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="body-caption text-text-muted mb-1">Números selecionados</p>
                    <p className="body-paragraph-bold text-foreground">{tickets.length} cotas</p>
                  </div>
                  <div className="col-span-2">
                    <p className="body-caption text-text-muted mb-1">Validade</p>
                    <p className="body-callout text-foreground">{formatExpirationDate(payment?.expiresAt || "")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Código PIX Copia e Cola */}
            <div>
              <p className="body-callout-bold text-foreground mb-2">Código PIX Copia e Cola</p>
              <div className="flex gap-2 items-center">
                <div className="flex-1 bg-black/40 border border-glass-border rounded-lg p-3 overflow-hidden">
                  <p className="body-callout text-text-secondary font-mono truncate">{payment?.pixCopyPaste || ""}</p>
                </div>
                <Button
                  onClick={handleCopyPixCode}
                  variant="outline"
                  size="icon"
                  className="shrink-0 border-glass-border hover:bg-kgb-gold/10 hover:border-kgb-gold/50"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Números Reservados */}
          <div className="mb-6">
            <p className="body-callout-bold text-foreground mb-3">Seus números reservados:</p>
            <div className="flex flex-wrap gap-2">
              {tickets.map((ticket) => (
                <span
                  key={ticket.id}
                  className="w-20 text-center px-3 py-1 bg-quota-reservado-bg border border-quota-reservado-border text-quota-reservado-text rounded-lg body-callout-bold"
                >
                  {String(ticket.number).padStart(3, "0")}
                </span>
              ))}
            </div>
          </div>

          {/* Botão de Confirmação */}
          <Button onClick={onPaymentConfirmed} variant="default" size="full">
            <Check className="w-5 h-5" />
            Já realizei o pagamento
          </Button>

          <p className="body-caption text-text-muted text-center mt-4">
            Após a confirmação do pagamento, seus números serão liberados automaticamente
          </p>
        </div>
      </div>
    </div>
  );
};
