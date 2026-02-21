interface FloatBarProps {
  floatValue: string;
  condition: string;
}

export const FloatBar = ({ floatValue, condition }: FloatBarProps) => {
  const float = parseFloat(floatValue);
  const percentage = float * 100; // Converter 0.00-1.00 para 0-100%

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="body-caption text-text-muted">Float Value</span>
        <span className="body-caption-bold text-foreground font-mono">{float.toFixed(4)}</span>
      </div>

      {/* Barra de Float com divisórias */}
      <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
        {/* Gradiente de fundo com divisões */}
        <div className="absolute inset-0 flex">
          {/* Factory New: 0-7% */}
          <div className="bg-emerald-500 opacity-60" style={{ width: "7%" }} />
          {/* Minimal Wear: 7-15% */}
          <div className="bg-green-500 opacity-60" style={{ width: "8%" }} />
          {/* Field-Tested: 15-38% */}
          <div className="bg-yellow-500 opacity-60" style={{ width: "23%" }} />
          {/* Well-Worn: 38-45% */}
          <div className="bg-orange-500 opacity-60" style={{ width: "7%" }} />
          {/* Battle-Scarred: 45-100% */}
          <div className="bg-red-500 opacity-60" style={{ width: "55%" }} />
        </div>

        {/* Linhas divisórias */}
        <div className="absolute inset-0">
          <div className="absolute h-full w-px bg-white/30" style={{ left: "7%" }} />
          <div className="absolute h-full w-px bg-white/30" style={{ left: "15%" }} />
          <div className="absolute h-full w-px bg-white/30" style={{ left: "38%" }} />
          <div className="absolute h-full w-px bg-white/30" style={{ left: "45%" }} />
        </div>

        {/* Indicador de posição do float */}
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 z-20"
          style={{ left: `${percentage}%` }}
        >
          <div className="relative -translate-x-1/2">
            <div className="w-1 h-4 bg-foreground rounded-full shadow-lg" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-pink-500 rounded-full shadow-lg" />
          </div>
        </div>
      </div>

      {/* Legendas da barra */}
      <div className="flex justify-between body-caption text-text-muted">
        <span>0.00</span>
        <span className="text-center text-foreground body-caption-bold">{condition}</span>
        <span>1.00</span>
      </div>
    </div>
  );
};
