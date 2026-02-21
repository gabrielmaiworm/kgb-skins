"use client";
import Link from "next/link";
import Aurora from "@/components/ui/aurora";
import CreateUserForm from "./create-user-form";

export default function CreateUserViewPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="fixed inset-0 -z-10">
        <Aurora colorStops={["#E60000", "#FFD700", "#8B0000"]} />
      </div>

      <div className="relative w-full max-w-md mx-4">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-kgb-red/20 via-kgb-gold/10 to-kgb-red/20" />
          <div className="absolute inset-0 backdrop-blur-xl bg-black/40" />
          <div className="absolute inset-0 border border-white/10 rounded-3xl" />

          <div className="relative z-10 p-8 md:p-12">
            <div className="flex flex-col text-center mb-8 space-y-2">
              <h1 className="text-3xl font-bold text-white tracking-tight">Criar conta</h1>
              <p className="text-white/70">Preencha os dados para criar sua conta</p>
            </div>

            <CreateUserForm />

            <p className="mt-6 text-center text-sm text-white/60">
              Ao criar sua conta você aceita nossos{" "}
              <Link
                href="/terms"
                className="text-kgb-gold hover:text-kgb-gold-hover underline underline-offset-4 transition-colors"
              >
                Termos de serviço
              </Link>{" "}
              e{" "}
              <Link
                href="/privacy"
                className="text-kgb-gold hover:text-kgb-gold-hover underline underline-offset-4 transition-colors"
              >
                Política de privacidade
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
