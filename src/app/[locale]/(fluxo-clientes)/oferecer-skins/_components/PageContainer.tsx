"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Aurora from "@/components/ui/aurora";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Link2, Clock } from "lucide-react";
import { toast } from "sonner";
import { buildAuthRedirectUrl } from "@/utils/invite-url";
import { createSkinOfferAction } from "@/app/actions/skin-offers/create";
import { useMySkinOffersQuery } from "@/querys/skin-offers/my-offers";
import { SkinOfferStatus } from "@/@types/skin-offers";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusLabels: Record<SkinOfferStatus, string> = {
  AWAITING_RESPONSE: "Aguardando resposta",
  PENDING: "Em análise",
  DENIED: "Negada",
  COMPLETED: "Concluída",
};

export const PageContainer = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [inspectLink, setInspectLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: myOffersData, isLoading: isLoadingOffers, invalidateQuery } = useMySkinOffersQuery(!!session?.user);

  useEffect(() => {
    if (status === "unauthenticated") {
      const loginUrl = buildAuthRedirectUrl("/login", { callbackUrl: pathname || "/oferecer-skins" }, searchParams);
      router.replace(loginUrl);
    }
  }, [status, router, pathname, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectLink.trim()) {
      toast.error("Informe o link de inspecionar arma");
      return;
    }
    try {
      const url = inspectLink.trim();
      const isValid =
        url.startsWith("steam://") ||
        url.startsWith("http://") ||
        url.startsWith("https://");
      if (!isValid) {
        toast.error("Informe o link de inspecionar (ex: steam://rungame/730/...)");
        return;
      }
      setIsSubmitting(true);
      const result = await createSkinOfferAction({ inspectLink: url });
      if (result.success) {
        toast.success(result.message);
        setInspectLink("");
        invalidateQuery();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Erro ao enviar oferta");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || !session?.user) {
    return (
      <div className="relative min-h-screen">
        <div className="fixed inset-0 -z-10">
          <Aurora colorStops={["#E60000", "#FFD700", "#8B0000"]} />
        </div>
        <div className="relative pt-28 pb-12 px-4 flex items-center justify-center min-h-[50vh]">
          <p className="body-title text-text-muted">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen mx-auto">
      <div className="fixed inset-0 -z-10">
        <Aurora colorStops={["#E60000", "#FFD700", "#8B0000"]} />
      </div>

      <div className="relative pt-28 pb-12 px-4">
        <div className="mx-auto max-w-3xl space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-kgb-gold/10 border border-kgb-gold/30 mb-2">
              <Package className="w-10 h-10 text-kgb-gold" />
            </div>
            <h1 className="heading-02-bold md:heading-01 text-foreground">
              Oferecer <span className="text-kgb-gold">Skins</span>
            </h1>
            <p className="body-title text-text-subtle max-w-2xl mx-auto">
              Envie o link de inspecionar arma da sua skin. Após o envio, sua oferta ficará aguardando análise do administrador.
            </p>
          </div>

          {/* Form Card */}
          <div className="glass-card">
            <div className="glass-bg" />
            <div className="glass-blur" />
            <div className="glass-border" />
            <div className="relative z-10 p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="inspectLink" className="body-callout text-text-muted block mb-2">
                    Link de inspecionar arma
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <Input
                      id="inspectLink"
                      type="text"
                      placeholder="steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S..."
                      value={inspectLink}
                      onChange={(e) => setInspectLink(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <p className="body-caption text-text-muted mt-1">
                    Cole o link steam:// que aparece ao clicar em &quot;Inspecionar&quot; no CS2/Steam
                  </p>
                </div>
                <Button type="submit" size="full" loading={isSubmitting} disabled={isSubmitting}>
                  Enviar oferta
                </Button>
              </form>
            </div>
          </div>

          {/* Minhas Ofertas */}
          <section>
            <h2 className="heading-04-bold text-foreground mb-4">Minhas ofertas</h2>
            <div className="glass-card">
              <div className="glass-bg" />
              <div className="glass-blur" />
              <div className="glass-border" />
              <div className="relative z-10 p-6">
                {isLoadingOffers ? (
                  <p className="body-paragraph text-text-muted">Carregando...</p>
                ) : !myOffersData?.items?.length ? (
                  <p className="body-paragraph text-text-muted">
                    Você ainda não enviou nenhuma oferta. Preencha o formulário acima para enviar.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {myOffersData.items.map((offer) => (
                      <div
                        key={offer.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-black/20 border border-white/10"
                      >
                        <div className="min-w-0 flex-1">
                          <a
                            href={offer.inspectLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="body-paragraph text-kgb-gold hover:underline truncate block"
                          >
                            {offer.inspectLink}
                          </a>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`body-caption-bold px-2 py-0.5 rounded-full ${
                                offer.status === "AWAITING_RESPONSE"
                                  ? "bg-quota-reservado-bg border border-quota-reservado-border text-quota-reservado-text"
                                  : offer.status === "COMPLETED"
                                    ? "bg-quota-livre-bg border border-quota-livre-border text-quota-livre-text"
                                    : offer.status === "DENIED"
                                      ? "bg-quota-pago-bg border border-quota-pago-border text-quota-pago-text"
                                      : "bg-white/10 border border-white/20 text-text-subtle"
                              }`}
                            >
                              {statusLabels[offer.status]}
                            </span>
                            <span className="body-caption text-text-muted flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(new Date(offer.createdAt), { addSuffix: true, locale: ptBR })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
