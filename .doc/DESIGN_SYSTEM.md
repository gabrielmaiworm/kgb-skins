# KGB Skins - Design System

## 🎨 Sistema de Cores

### Cores da Marca (KGB Brand)

```tsx
// Tailwind classes
bg-kgb-red         // #E60000 - Vermelho principal
bg-kgb-red-dark    // #8B0000 - Vermelho escuro
bg-kgb-gold        // #FFD700 - Dourado principal
bg-kgb-gold-dark   // #B8860B - Dourado escuro
bg-kgb-black       // #1a1a1a - Preto KGB

// CSS Variables
hsl(var(--kgb-red))
hsl(var(--kgb-gold))
```

### Glass Morphism (Efeito Vidro)

```tsx
// Componente completo
<div className="glass-card">
  <div className="glass-bg" />
  <div className="glass-blur" />
  <div className="glass-border" />
  <div className="relative z-10 p-6">{/* Conteúdo aqui */}</div>
</div>;

// Cores individuais
bg - glass - bg - from; // Gradiente início
bg - glass - bg - via; // Gradiente meio
bg - glass - bg - to; // Gradiente fim
bg - glass - blur; // Fundo blur
border - glass - border; // Borda sutil
```

### Sistema de Status (Quotas)

#### Livre (Disponível)

```tsx
bg - quota - livre - bg; // Fundo verde claro
border - quota - livre - border; // Borda verde
text - quota - livre - text; // Texto verde
hover: bg - quota - livre - hover; // Hover verde
```

#### Reservado

```tsx
bg - quota - reservado - bg; // Fundo ciano claro
border - quota - reservado - border; // Borda ciano
text - quota - reservado - text; // Texto ciano
```

#### Pago

```tsx
bg - quota - pago - bg; // Fundo vermelho claro
border - quota - pago - border; // Borda vermelho
text - quota - pago - text; // Texto vermelho
```

#### Selecionado

```tsx
bg - quota - selected - bg; // Fundo dourado
border - quota - selected - border; // Borda dourada
text - quota - selected - text; // Texto preto
```

### Textos

```tsx
text - foreground; // Branco (#fff)
text - text - muted; // Branco 60% opacidade
text - text - subtle; // Branco 70% opacidade
text - text - secondary; // Branco 80% opacidade
```

## � Sistema de Tipografia

### Headings (Títulos)

```tsx
// Display (Maiores)
.display-01         // 4.5rem (72px) - Bold
.display-02         // 4rem (64px) - Bold

// Headings
.heading-01         // 3.5rem (56px) - Bold
.heading-02-bold    // 3rem (48px) - Bold
.heading-02-medium  // 3rem (48px) - Medium
.heading-02         // 3rem (48px) - Regular
.heading-02-light   // 3rem (48px) - Light
.heading-03-bold    // 2rem (32px) - Bold
.heading-03-medium  // 2rem (32px) - Medium
.heading-03         // 2rem (32px) - Regular
.heading-04-bold    // 1.75rem (28px) - Bold
.heading-04-medium  // 1.75rem (28px) - Medium
.heading-04         // 1.75rem (28px) - Regular
.heading-04-light   // 1.75rem (28px) - Light
.heading-05-bold    // 1.5rem (24px) - Bold
.heading-05-medium  // 1.5rem (24px) - Medium
.heading-05         // 1.5rem (24px) - Regular
.heading-05-light   // 1.5rem (24px) - Light
```

### Body (Corpo de texto)

```tsx
// Body Title
.body-title-bold    // 1.25rem (20px) - Bold
.body-title-medium  // 1.25rem (20px) - Medium
.body-title         // 1.25rem (20px) - Regular
.body-title-light   // 1.25rem (20px) - Light

// Body Paragraph
.body-paragraph-bold   // 1rem (16px) - Bold
.body-paragraph-medium // 1rem (16px) - Medium
.body-paragraph        // 1rem (16px) - Regular
.body-paragraph-light  // 1rem (16px) - Light

// Body Callout
.body-callout-bold    // 0.875rem (14px) - Bold
.body-callout-medium  // 0.875rem (14px) - Medium
.body-callout         // 0.875rem (14px) - Regular
.body-callout-light   // 0.875rem (14px) - Light

// Body Caption
.body-caption-bold    // 0.75rem (12px) - Bold
.body-caption-medium  // 0.75rem (12px) - Medium
.body-caption         // 0.75rem (12px) - Regular
.body-caption-light   // 0.75rem (12px) - Light
```

### Hierarquia de Uso

| Elemento            | Classe Recomendada  | Exemplo                             |
| ------------------- | ------------------- | ----------------------------------- |
| Título Principal    | `heading-01`        | Título da página de campanha        |
| Subtítulo Principal | `heading-02-medium` | Nome da skin                        |
| Seção               | `heading-03-bold`   | "Escolha sua sorte"                 |
| Card Title          | `heading-04-bold`   | Título do card de rifa              |
| Destaque            | `body-title-bold`   | Preço, valores importantes          |
| Texto normal        | `body-paragraph`    | Descrições, parágrafos              |
| Labels              | `body-callout`      | "Valor por número", labels de input |
| Legendas            | `body-caption`      | Datas, informações secundárias      |

## �📦 Componentes Reutilizáveis

### Glass Card

```tsx
import { cn } from "@/lib/utils";

<div className="glass-card">
  <div className="glass-bg" />
  <div className="glass-blur" />
  <div className="glass-border" />
  <div className="relative z-10 p-6">{/* Seu conteúdo */}</div>
</div>;
```

### Quota Button

```tsx
<button
  className={cn(
    "aspect-square rounded-lg font-bold text-sm transition-all",
    isLivre &&
      !isSelected &&
      "bg-quota-livre-bg border border-quota-livre-border text-quota-livre-text hover:bg-quota-livre-hover",
    isLivre && isSelected && "bg-quota-selected-bg border-2 border-quota-selected-border text-quota-selected-text",
    isReservado && "bg-quota-reservado-bg border border-quota-reservado-border text-quota-reservado-text opacity-50",
    isPago && "bg-quota-pago-bg border border-quota-pago-border text-quota-pago-text opacity-50"
  )}
>
  001
</button>
```

## 🎯 Uso Prático

### Exemplo: Card de Informações

```tsx
export const InfoCard = ({ title, value }: Props) => (
  <div className="glass-card">
    <div className="glass-bg" />
    <div className="glass-blur" />
    <div className="glass-border" />

    <div className="relative z-10 p-6">
      <p className="body-caption text-text-muted mb-1">{title}</p>
      <p className="body-title-bold text-foreground">{value}</p>
  reservado: "bg-quota-reservado-bg border-quota-reservado-border text-quota-reservado-text",
  pago: "bg-quota-pago-bg border-quota-pago-border text-quota-pago-text",
};

<span className={cn("px-3 py-1 rounded-full border text-xs font-bold", statusClasses[status])}>
  {status.toUpperCase()}
</span>;
```

## 🔧 Customização

### Alterar cores globalmente

Edite as variáveis em `src/app/[locale]/globals.css`:

```css
:root {
  /* Mudar cor dourada */
  --kgb-gold: 45 100% 55%; /* HSL */

  /* Mudar status livre */
  --quota-livre-bg: 142 71% 45% / 0.2;
  --quota-livre-text: 142 76% 36%;
}
```

### Modo Dark

As cores são automáticas! O `.dark` já está configurado em `globals.css`.

## 📋 Checklist de Uso

- ✅ Sempre use `glass-card` para cards com efeito vidro
- ✅ Use classes de tipografia componentizadas (`heading-*`, `body-*`) em vez de Tailwind direto
- ✅ Use `text-text-muted` para labels secundários (combine com `body-caption`)
- ✅ Use `text-foreground` para textos principais
- ✅ Use sistema de quota (livre/reservado/pago/selected) para status
- ✅ Use `text-kgb-gold` para destaques importantes
- ✅ Mantenha consistência: não misture cores/fontes hardcoded com o sistema

## 🚫 Evitar

- ❌ Cores hardcoded: `bg-green-500/20`, `text-white/60`
- ❌ RGB direto: `rgb(255 0 0 / 0.5)`
- ❌ Hex direto: `#E60000`
- ❌ Tamanhos de fonte diretos: `text-xl`, `text-2xl`, `font-bold` (use as classes componentizadas)
- ❌ Valores inline: `fontSize: '24px'`, `fontWeight: 700`
- ❌ Misturar gradientes customizados com glass system

## 🎨 Paleta de Cores Completa

| Nome            | Variável CSS             | Tailwind Class              | Valor HSL         |
| --------------- | ------------------------ | --------------------------- | ----------------- |
| KGB Red         | `--kgb-red`              | `bg-kgb-red`                | `0 100% 45%`      |
| KGB Gold        | `--kgb-gold`             | `bg-kgb-gold`               | `51 100% 50%`     |
| Glass Border    | `--glass-border`         | `border-glass-border`       | `0 0% 100% / 0.1` |
| Quota Livre     | `--quota-livre-text`     | `text-quota-livre-text`     | `142 76% 36%`     |
| Quota Reservado | `--quota-reservado-text` | `text-quota-reservado-text` | `186 94% 47%`     |
| Quota Pago      | `--quota-pago-text`      | `text-quota-pago-text`      | `0 91% 71%`       |
| Text Muted      | `--text-muted`           | `text-text-muted`           | `0 0% 100% / 0.6` |
