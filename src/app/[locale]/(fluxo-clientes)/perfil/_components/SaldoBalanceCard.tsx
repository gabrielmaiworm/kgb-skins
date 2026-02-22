"use client";

import { useBalanceQuery } from "@/querys/balance";
import { Wallet } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export const SaldoBalanceCard = () => {
  const { data, isLoading } = useBalanceQuery(true);

  if (isLoading) {
    return (
      <div className="glass-card">
        <div className="glass-bg" />
        <div className="glass-blur" />
        <div className="glass-border" />
        <div className="relative z-10 p-6">
          <p className="body-caption text-text-muted">Carregando saldo...</p>
        </div>
      </div>
    );
  }

  const { availableBalance, pendingBalance, pendingBalanceExpiresAt } = data ?? {
    availableBalance: 0,
    pendingBalance: 0,
    pendingBalanceExpiresAt: null,
  };

  return (
    <div className="glass-card">
      <div className="glass-bg" />
      <div className="glass-blur" />
      <div className="glass-border" />
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-kgb-gold/10">
            <Wallet className="size-5 text-kgb-gold" />
          </div>
          <h2 className="heading-04-bold text-foreground">Meu Saldo</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="body-caption text-text-muted mb-1">Saldo disponível</p>
            <p className="heading-04-bold text-kgb-gold">{formatBRL(availableBalance)}</p>
          </div>
          <div>
            <p className="body-caption text-text-muted mb-1">Saldo pendente</p>
            <p className="heading-04-bold text-text-subtle">{formatBRL(pendingBalance)}</p>
            {pendingBalanceExpiresAt && (
              <p className="body-caption text-text-muted mt-1">
                Liberado em {format(new Date(pendingBalanceExpiresAt), "dd/MM/yyyy", { locale: ptBR })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
