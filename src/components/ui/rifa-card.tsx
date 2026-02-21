"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, Trophy, Lock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CampaignListItem } from "@/@types/campaings";
import { FloatBar } from "./float-bar";
import { useSession } from "next-auth/react";

interface RifaCardProps {
  campaign: CampaignListItem;
}

export default function RifaCard({ campaign }: RifaCardProps) {
  const {
    id,
    title,
    subtitle,
    itemCondition,
    itemFloat,
    pricePerTicket,
    totalTickets,
    status,
    createdAt,
    coverImage,
    gallery,
    winnerTicket,
    winner,
    paidTicketsCount,
  } = campaign;

  // TODO: A API precisa retornar soldTickets no CampaignListItem
  // Por enquanto, mostrar 0 ao invés de simulação falsa
  const rifasVendidas = status === "COMPLETED" ? totalTickets : paidTicketsCount;
  const rifasDisponiveis = totalTickets - rifasVendidas;

  const estaEncerrada = status !== "ACTIVE" || rifasDisponiveis === 0;
  const disponivel = status === "ACTIVE" && rifasDisponiveis > 0;

  const imagem = coverImage || gallery[0] || "/img/placeholder.png";

  const ganhador = status === "COMPLETED" ? `${winner?.name} - ${winner?.phone}` : null;
  const bilhetePremiado = status === "COMPLETED" ? `Bilhete premiado: ${winnerTicket}` : null;
  const dataSorteio = status === "COMPLETED" ? new Date().toISOString() : null;
  const drawDate = campaign.drawDate;

  return (
    <div className="group relative w-full">
      <div className="glass-card">
        <div className="glass-bg" />
        <div className="glass-blur" />
        <div className="glass-border" />

        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-kgb-red via-kgb-gold to-kgb-red bg-size-200 animate-gradient-x blur-xl" />
        </div>

        <div className="relative z-10 p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            {estaEncerrada ? (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-quota-pago-bg backdrop-blur-sm border border-quota-pago-border">
                <Lock className="w-4 h-4 text-quota-pago-text" />
                <span className="body-caption-bold text-quota-pago-text">ENCERRADA</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-quota-livre-bg backdrop-blur-sm border border-quota-livre-border">
                <TrendingUp className="w-4 h-4 text-quota-livre-text" />
                <span className="body-caption-bold text-quota-livre-text">ATIVA</span>
              </div>
            )}

            {ganhador && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-kgb-gold/20 backdrop-blur-sm border border-kgb-gold/30">
                <Trophy className="w-4 h-4 text-kgb-gold" />
                <span className="body-caption-bold text-kgb-gold">SORTEADA</span>
              </div>
            )}
          </div>

          <Link
            href={`/${id}`}
            className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-black/60 to-black/40 border border-white/10"
          >
            <Image
              src={imagem}
              alt={title}
              fill
              quality={100}
              className="object-cover transition-transform group-hover:scale-110 duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </Link>

          <div className="space-y-2">
            <h3 className="heading-04-bold text-foreground">{title}</h3>
            <p className="body-title text-kgb-gold">{subtitle}</p>

            <div className="flex items-center justify-between">
              <span className="body-callout text-text-subtle">{itemCondition}</span>
            </div>
          </div>

          {!ganhador && !dataSorteio && (
            <>
              <FloatBar floatValue={itemFloat} condition={itemCondition} />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-text-muted">
                  <span className="body-caption">Progresso</span>
                  <span className="body-caption-bold">
                    {rifasVendidas} / {totalTickets}
                  </span>
                </div>

                <div className="relative h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-kgb-red via-kgb-gold to-kgb-red bg-size-200 animate-gradient-x transition-all duration-500"
                    style={{ width: `${(rifasVendidas / totalTickets) * 100}%` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
                </div>

                <div className="flex items-center justify-between text-text-subtle">
                  <span className="body-caption">{((rifasVendidas / totalTickets) * 100).toFixed(1)}% vendidas</span>
                  <span className="body-caption">{rifasDisponiveis} disponíveis</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-1">
                  <p className="body-caption text-text-muted">Valor por número</p>
                  {campaign.isFree ? (
                    <p className="heading-03-bold text-kgb-gold">GRÁTIS</p>
                  ) : (
                    <p className="heading-03-bold text-foreground">
                      R${" "}
                      {pricePerTicket.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-text-muted">
                  <Calendar className="w-4 h-4" />
                  <span className="body-caption">
                    {formatDistanceToNow(new Date(createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
              </div>
            </>
          )}

          {ganhador && dataSorteio && (
            <div className="glass-card mb-2">
              <div className="absolute inset-0 bg-gradient-to-r from-kgb-gold/20 to-kgb-red/20 backdrop-blur-sm" />
              <div className="absolute inset-0 border border-kgb-gold/20 rounded-lg" />

              <div className="relative z-10 p-3 space-y-1">
                <p className="body-caption text-text-muted">Ganhador:</p>
                <p className="body-callout-bold text-kgb-gold">{ganhador}</p>
                <p className="body-callout-bold text-text-muted">{bilhetePremiado}</p>
                <p className="body-caption text-text-subtle">
                  Sorteado{" "}
                  {formatDistanceToNow(new Date(drawDate), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>
          )}

          {disponivel && rifasDisponiveis > 0 ? (
            <Link href={`/${id}`}>
              <Button variant="default" size="full">
                Participar agora
              </Button>
            </Link>
          ) : !ganhador ? (
            <Button variant="outline" size="full" disabled>
              <Lock className="w-4 h-4" />
              Rifa encerrada
            </Button>
          ) : (
            <Link href={`/${id}`}>
              <Button variant="gold" size="full">
                <Trophy className="w-4 h-4" />
                Ver detalhes
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-kgb-red/20 to-kgb-gold/20 blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 translate-y-4" />
    </div>
  );
}
