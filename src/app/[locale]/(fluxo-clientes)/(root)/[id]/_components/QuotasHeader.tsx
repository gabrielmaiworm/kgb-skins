import { Switch } from "@/components/ui/switch";

interface QuotasHeaderProps {
  livres: number;
  reservados: number;
  pagos: number;
  mostrarTodos: boolean;
  onMostrarTodosChange: (checked: boolean) => void;
  isFree?: boolean;
}

export const QuotasHeader = ({
  livres,
  reservados,
  pagos,
  mostrarTodos,
  onMostrarTodosChange,
  isFree = false,
}: QuotasHeaderProps) => {
  return (
    <div className="glass-card">
      <div className="glass-bg" />
      <div className="glass-blur" />
      <div className="glass-border" />

      <div className="relative z-10 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-foreground">Escolha sua sorte</h2>
        <p className="text-sm sm:text-base text-text-subtle mb-3">
          {isFree
            ? "Selecione apenas UM número para participar gratuitamente"
            : "Selecione as cotas que deseja participar"}
        </p>

        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          <Switch checked={mostrarTodos} onCheckedChange={onMostrarTodosChange} />
          <label
            className="text-sm sm:text-base text-foreground cursor-pointer"
            onClick={() => onMostrarTodosChange(!mostrarTodos)}
          >
            Visualizar todos os números
          </label>
        </div>

        {/* Status Legend */}
        <div className="flex flex-wrap gap-4 sm:grid sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded shrink-0 bg-quota-livre-bg border border-quota-livre-border" />
            <div>
              <p className="body-caption text-text-muted">Livres</p>
              <p className="body-callout-bold sm:body-paragraph-bold text-foreground">{livres}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded shrink-0 bg-quota-reservado-bg border border-quota-reservado-border" />
            <div>
              <p className="body-caption text-text-muted">Reservados</p>
              <p className="body-callout-bold sm:body-paragraph-bold text-foreground">{reservados}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded shrink-0 bg-quota-pago-bg border border-quota-pago-border" />
            <div>
              <p className="body-caption text-text-muted">Pagos</p>
              <p className="body-callout-bold sm:body-paragraph-bold text-foreground">{pagos}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
