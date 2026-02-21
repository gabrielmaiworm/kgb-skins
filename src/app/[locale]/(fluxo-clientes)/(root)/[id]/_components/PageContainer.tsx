"use client";

import { useState, useMemo, startTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Aurora from "@/components/ui/aurora";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useCampaingByIdQuery, useCampaignOrdersQuery } from "@/querys/campaings";
import {
  LoadingState,
  NotFoundState,
  CampaignHeader,
  ImageGallery,
  CampaignInfoCard,
  WhatsAppInfoCard,
  QuotasHeader,
  QuotasGrid,
  CheckoutCard,
  PaymentCard,
} from ".";
import { InviteCodeCard } from "@/components/ui/invite-code-card";
import { ReferrerCodeCard } from "@/components/ui/referrer-code-card";
import { buyTicketsManualAction } from "@/app/actions/campaings/buy-tickets";
import { BuyTicketsManualResponse } from "@/@types/campaings";
import { useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { buildAuthRedirectUrl } from "@/utils/invite-url";

export const PageContainer = () => {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedQuotas, setSelectedQuotas] = useState<number[]>([]);
  const [mostrarTodos, setMostrarTodos] = useState<boolean>(false);
  const campaignId = params.id as string;
  const { data: campaign, isLoading: isLoadingCampaign } = useCampaingByIdQuery(campaignId);
  const { data: ordersData, isLoading: isLoadingOrders } = useCampaignOrdersQuery(campaignId);
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);
  const [exibeCheckout, setExibeCheckout] = useState<boolean>(false);
  const [checkoutData, setCheckoutData] = useState<BuyTicketsManualResponse | null>(null);
  const { data: session } = useSession();
  const showInviteCard = !!session?.user?.inviteCode;
  const showReferrerCard = !!session?.user && !session?.user?.hasReferredByInviteCode;
  const showInviteSection = showInviteCard || showReferrerCard;

  const quotas = useMemo(() => {
    if (!campaign) return [];

    const totalTickets = campaign.totalTickets;
    const orders = ordersData?.orders || [];

    // Criar map de números ocupados
    const occupiedNumbers = new Map<number, "RESERVED" | "PAID">();
    orders.forEach((order) => {
      occupiedNumbers.set(order.number, order.status);
    });

    // Gerar array de cotas
    const quotasArray: { numero: number; status: "livre" | "reservado" | "pago" }[] = [];
    for (let i = 1; i <= totalTickets; i++) {
      const orderStatus = occupiedNumbers.get(i);
      if (orderStatus === "PAID") {
        quotasArray.push({ numero: i, status: "pago" });
      } else if (orderStatus === "RESERVED") {
        quotasArray.push({ numero: i, status: "reservado" });
      } else {
        quotasArray.push({ numero: i, status: "livre" });
      }
    }

    return quotasArray;
  }, [campaign, ordersData]);

  const isLoading = isLoadingCampaign || isLoadingOrders;

  // Estados e handlers
  const livres = quotas.filter((q) => q.status === "livre").length;
  const reservados = quotas.filter((q) => q.status === "reservado").length;
  const pagos = quotas.filter((q) => q.status === "pago").length;

  // Filtrar quotas para exibir apenas disponíveis por padrão
  const quotasExibidas = mostrarTodos ? quotas : quotas.filter((q) => q.status === "livre");

  const toggleQuota = (numero: number) => {
    setSelectedQuotas((prev) => (prev.includes(numero) ? prev.filter((n) => n !== numero) : [...prev, numero]));
  };

  const handleCheckout = async () => {
    setPaymentProcessing(true);
    try {
      if (!session?.user) {
        toast.info("Você precisa estar logado para continuar.");

        setTimeout(() => {
          window.location.href = buildAuthRedirectUrl(
            "/login",
            { callbackUrl: pathname || `/${campaignId}` },
            searchParams
          );
        }, 2000);

        return;
      }

      const result = await buyTicketsManualAction({
        companyId: campaignId,
        numbers: selectedQuotas,
      });

      if (result && result.success && result.responseData) {
        // Se for campanha grátis, exibir toast e redirecionar
        if (campaign?.isFree) {
          toast.success("Número reservado com sucesso! Redirecionando...");
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          // Se for campanha paga, exibir card de pagamento
          setExibeCheckout(true);
          setCheckoutData(result.responseData);
        }
      } else {
        setTimeout(() => {
          toast.error(result ? result.message : "Erro ao processar pagamento");
        }, 1000);
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Estados de loading e erro
  if (isLoading) return <LoadingState />;
  if (!campaign) return <NotFoundState onBack={() => router.back()} />;

  // Preparar dados
  const totalCompra = selectedQuotas.length * campaign.pricePerTicket;
  const images =
    campaign.gallery.length > 0
      ? campaign.gallery
      : campaign.coverImage
        ? [campaign.coverImage, ...campaign.gallery]
        : [];

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <Aurora colorStops={["#E60000", "#FFD700", "#8B0000"]} />
      </div>

      <div className="relative pt-28 pb-8 sm:pb-12 px-3 sm:px-4">
        <div className="mx-auto max-w-7xl">
          <CampaignHeader title={campaign.title} subtitle={campaign.subtitle} />

          {!exibeCheckout ? (
            <>
              <div className="flex flex-col lg:grid lg:grid-cols-7 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
                <div className="space-y-4 lg:col-span-3 lg:row-start-1 order-1">
                  <ImageGallery images={images} title={campaign.title} />
                  <CampaignInfoCard
                    itemCondition={campaign.itemCondition}
                    itemFloat={campaign.itemFloat}
                    pricePerTicket={campaign.pricePerTicket}
                    totalTickets={campaign.totalTickets}
                    isFree={campaign.isFree}
                  />
                </div>

                <div className="space-y-6 lg:col-span-4 lg:col-start-4 lg:row-start-1 lg:row-span-2 order-2">
                  <QuotasHeader
                    livres={livres}
                    reservados={reservados}
                    pagos={pagos}
                    mostrarTodos={mostrarTodos}
                    onMostrarTodosChange={setMostrarTodos}
                    isFree={campaign.isFree}
                  />
                  <QuotasGrid
                    quotas={quotasExibidas}
                    selectedQuotas={selectedQuotas}
                    onToggleQuota={toggleQuota}
                    isFree={campaign.isFree}
                  />
                  <CheckoutCard
                    selectedCount={selectedQuotas.length}
                    totalAmount={totalCompra}
                    onCheckout={handleCheckout}
                    loading={paymentProcessing}
                    isFree={campaign.isFree}
                  />
                </div>

                <div className="lg:col-span-3 lg:row-start-2 order-3">
                  <WhatsAppInfoCard />
                </div>
              </div>

              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-6 text-foreground text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para rifas
              </Button>

              {showInviteSection && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
                  {showInviteCard && (
                    <div className="w-full sm:min-w-[300px] sm:max-w-[340px]">
                      <InviteCodeCard />
                    </div>
                  )}
                  {showReferrerCard && (
                    <div className="w-full sm:min-w-[300px] sm:max-w-[340px]">
                      <ReferrerCodeCard />
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              {checkoutData && (
                <PaymentCard
                  paymentData={checkoutData}
                  onPaymentConfirmed={() => {
                    window.location.href = "/";
                  }}
                />
              )}
              {showInviteSection && (
                <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center sm:justify-start">
                  {showInviteCard && (
                    <div className="w-full sm:min-w-[300px] sm:max-w-[340px]">
                      <InviteCodeCard />
                    </div>
                  )}
                  {showReferrerCard && (
                    <div className="w-full sm:min-w-[300px] sm:max-w-[340px]">
                      <ReferrerCodeCard />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
