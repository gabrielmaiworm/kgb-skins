"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMyOrdersQuery } from "@/querys/campaings/my-orders";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Calendar, Package, CheckCircle, Clock, CreditCard } from "lucide-react";
import { FreeBadge, PaymentCard } from "../../(root)/[id]/_components";
import { BuyTicketsManualResponse } from "@/@types/campaings";
import { useSession } from "next-auth/react";

export default function MeusNumerosGrid() {
  const router = useRouter();
  const { data, isLoading } = useMyOrdersQuery();
  const [selectedPaymentOrder, setSelectedPaymentOrder] = useState<string | null>(null);
  const { data: session } = useSession();

  const orders = data?.orders ?? [];
  const tickets = data?.tickets ?? [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="w-4 h-4" />;
      case "RESERVED":
        return <Clock className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="mx-auto ">
      {/* Header */}
      <div className="mb-12 text-center space-y-4">
        <h1 className="heading-02-bold md:heading-01 text-foreground">
          Meus <span className="text-kgb-gold">Números</span>
        </h1>
        <p className="body-title text-text-subtle max-w-2xl mx-auto">
          Acompanhe todos os seus números reservados e pagos nas rifas
        </p>
      </div>

      {/* Grid de Cards */}
      {isLoading ? (
        <div className="body-title text-text-muted mt-8 text-center">Carregando seus números...</div>
      ) : (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto">
          {/* Pedidos Reservados (Aguardando Pagamento) */}
          {orders.length > 0 && (
            <div className="space-y-4">
              <h2 className="heading-04-bold text-foreground">
                Pedidos <span className="text-quota-reservado-text">Reservados</span>
              </h2>
              {orders.map((order) => {
                const isPaymentSelected = selectedPaymentOrder === order.paymentId;
                const paymentData: BuyTicketsManualResponse = {
                  tickets: order.numbers.map((num) => ({
                    id: `${order.paymentId}-${num}`,
                    number: num,
                    userId: order.payment ? order.payment.userId : session?.user?.id || "",
                    status: order.status,
                    campaignId: order.campaign.id,
                    reservationExpiresAt: order.payment ? order.payment.expiresAt : "",
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt,
                  })),
                  payment: order.payment ? order.payment : undefined,
                };

                return (
                  <div key={order.paymentId}>
                    {!isPaymentSelected ? (
                      <div className="glass-card cursor-pointer" onClick={() => router.push(`/${order.campaign.id}`)}>
                        <div className="glass-bg" />
                        <div className="glass-blur" />
                        <div className="glass-border" />

                        <div className="relative z-10 p-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden shrink-0">
                              {order.campaign.coverImage ? (
                                <Image
                                  src={order.campaign.coverImage}
                                  alt={order.campaign.title}
                                  width={192}
                                  height={192}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-kgb-red/20 flex items-center justify-center">
                                  <Package className="w-12 h-12 text-kgb-gold" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 space-y-4">
                              <div>
                                <h3 className="heading-04-bold text-foreground mb-1">{order.campaign.title}</h3>
                                <p className="body-paragraph text-text-subtle">{order.campaign.subtitle}</p>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                  <p className="body-caption text-text-muted mb-1">Números ({order.numbers.length})</p>
                                  <div className="flex flex-wrap gap-1">
                                    {order.numbers.slice(0, 5).map((num) => (
                                      <span
                                        key={num}
                                        className="body-callout-bold text-kgb-gold px-2 py-1 bg-kgb-gold/10 rounded"
                                      >
                                        {String(num).padStart(3, "0")}
                                      </span>
                                    ))}
                                    {order.numbers.length > 5 && (
                                      <span className="body-callout text-text-muted px-2 py-1">
                                        +{order.numbers.length - 5}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <p className="body-caption text-text-muted mb-1">Status</p>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-quota-reservado-text" />
                                    <span className="body-callout-bold text-quota-reservado-text">Reservado</span>
                                  </div>
                                </div>
                                <div>
                                  {order.campaign.isFree ? (
                                    <FreeBadge />
                                  ) : order.payment ? (
                                    <>
                                      <p className="body-caption text-text-muted mb-1">Valor Total</p>
                                      <p className="body-paragraph-bold text-foreground">
                                        R${" "}
                                        {order.payment.amount.toLocaleString("pt-BR", {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        })}
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <p className="body-caption text-text-muted mb-1">Valor Total</p>
                                      <p className="body-paragraph text-text-muted">—</p>
                                    </>
                                  )}
                                </div>
                              </div>

                              {!order.campaign.isFree && (
                                <div className="bg-quota-reservado-bg rounded-lg p-3">
                                  {order.payment ? (
                                    <>
                                      <p className="body-callout mb-2">
                                        ⏳ Pagamento pendente - Expira em:{" "}
                                        {new Date(order.payment.expiresAt).toLocaleString("pt-BR", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </p>
                                      <Button
                                        variant="default"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedPaymentOrder(order.paymentId);
                                        }}
                                      >
                                        <CreditCard className="w-4 h-4" />
                                        Pagar Agora
                                      </Button>
                                    </>
                                  ) : (
                                    <p className="body-callout text-text-muted">
                                      ⏳ Aguardando informações de pagamento...
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Button variant="ghost" onClick={() => setSelectedPaymentOrder(null)} className="mb-2">
                          ← Voltar para meus números
                        </Button>
                        <PaymentCard
                          paymentData={paymentData}
                          onPaymentConfirmed={() => {
                            setSelectedPaymentOrder(null);
                            window.location.href = "/";
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Tickets Pagos */}
          {tickets.length > 0 && (
            <div className="space-y-4">
              <h2 className="heading-04-bold text-foreground">
                Números <span className="text-quota-pago-text">Pagos</span>
              </h2>
              {tickets.map((ticket) => (
                <div
                  key={ticket.paymentId}
                  className="glass-card cursor-pointer"
                  onClick={() => router.push(`/${ticket.campaign.id}`)}
                >
                  <div className="glass-bg" />
                  <div className="glass-blur" />
                  <div className="glass-border" />

                  <div className="relative z-10 p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Imagem da campanha */}
                      <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden shrink-0">
                        {ticket.campaign.coverImage ? (
                          <Image
                            src={ticket.campaign.coverImage}
                            alt={ticket.campaign.title}
                            width={192}
                            height={192}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-kgb-red/20 flex items-center justify-center">
                            <Package className="w-12 h-12 text-kgb-gold" />
                          </div>
                        )}
                      </div>

                      {/* Informações */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="heading-04-bold text-foreground mb-1">{ticket.campaign.title}</h3>
                          <p className="body-paragraph text-text-subtle">{ticket.campaign.subtitle}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <p className="body-caption text-text-muted mb-1">Números ({ticket.numbers.length})</p>
                            <div className="flex flex-wrap gap-1">
                              {ticket.numbers.map((num) => (
                                <span
                                  key={num}
                                  className="body-callout-bold text-kgb-gold px-2 py-1 bg-kgb-gold/10 rounded"
                                >
                                  {String(num).padStart(3, "0")}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="body-caption text-text-muted mb-1">Status</p>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-quota-pago-text" />
                              <span className="body-callout-bold text-quota-pago-text">Pago</span>
                            </div>
                          </div>
                          <div>
                            {ticket.campaign.isFree ? (
                              <FreeBadge />
                            ) : (
                              <>
                                <p className="body-caption text-text-muted mb-1">Valor Total</p>
                                <p className="body-paragraph-bold text-foreground">
                                  R${" "}
                                  {ticket.payment.amount.toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </p>
                              </>
                            )}
                          </div>
                        </div>

                        {!ticket.campaign.isFree &&
                          String(ticket.payment.status) === "PAID" &&
                          ticket.payment.paidAt && (
                            <p className="body-callout text-kgb-gold">
                              ✓ Pagamento confirmado em:{" "}
                              {new Date(ticket.payment.paidAt).toLocaleString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {orders.length === 0 && tickets.length === 0 && (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <p className="body-title text-text-muted">Nenhum número encontrado.</p>
              <p className="body-paragraph text-text-subtle mt-2">
                Participe de uma rifa para começar a colecionar seus números da sorte!
              </p>
              <Button variant="gold" className="mt-6" onClick={() => router.push("/")}>
                Ver Rifas Disponíveis
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
