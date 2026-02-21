"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import Aurora from "@/components/ui/aurora";

export const PageContainer = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Aurora */}
      <div className="fixed inset-0 -z-10">
        <Aurora colorStops={["#E60000", "#FFD700", "#8B0000"]} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-6 text-center px-4">
        <div className="glass-card max-w-2xl">
          <div className="glass-bg" />
          <div className="glass-blur" />
          <div className="glass-border" />

          <div className="relative z-10 p-12 space-y-6">
            <AlertTriangle className="w-20 h-20 text-kgb-red mx-auto" />
            <h1 className="heading-01 text-foreground">Acesso Negado</h1>
            <p className="body-title text-text-subtle max-w-md mx-auto">
              Você não tem permissão para acessar esta página. Por favor, verifique suas credenciais ou entre em contato
              com o administrador.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button variant="ghost" onClick={() => window.history.back()} className="text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <Link href="/">
                <Button variant="gold">
                  <Home className="w-4 h-4" />
                  Página Inicial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
