# 📋 Plano de Telas e Integrações - KGB Skins

> **Status Atual**: Login integrado ✅ | Listagem de campanhas integrada ✅

---

## 🎯 Resumo Executivo

### Módulos por Status de Integração

| Módulo        | Serviços | UI     | Integração | Prioridade |
| ------------- | -------- | ------ | ---------- | ---------- |
| **Auth**      | 100% ✅  | 70% ⚠️ | 80%        | MÉDIA      |
| **Users**     | 100% ✅  | 0% ❌  | 10%        | ALTA       |
| **Campaigns** | 100% ✅  | 50% ⚠️ | 40%        | CRÍTICA    |
| **Payments**  | 20% ⚠️   | 0% ❌  | 5%         | CRÍTICA    |
| **Logs**      | 100% ✅  | 0% ❌  | 5%         | BAIXA      |

---

## 📦 O que já está pronto

### ✅ Auth (80% completo)

- [x] Services: login, login CPF, refresh token, logout, esqueci/resetar senha
- [x] NextAuth configurado com CredentialsProvider
- [x] Middleware de autenticação
- [x] Interceptor Axios com refresh automático
- [x] Tela de login
- [x] AuthContext

### ✅ Listagem de Campanhas (40% completo)

- [x] Service `listCampaignsService()`
- [x] Action `listCampaingsAction()`
- [x] Hook `useAllCampaingsQuery()` com paginação e busca
- [x] Tipagens completas (`CampaignListItem`, `ListCampaignsResponse`)
- [x] Componente `RifasGrid` integrado com API
- [x] Componente `RifaCard` usando tipagens da API
- [x] Filtros por status
- [x] Cache de 3 minutos (React Query)

### ✅ Services Prontos (mas sem UI)

- [x] Todos os services de `users` (CRUD completo)
- [x] Todos os services de `campaigns` (criar, atualizar, comprar tickets, etc.)
- [x] Service de `logs`
- [x] Webhook de pagamentos EFI

---

## 🚀 Plano de Implementação

---

## FASE 1: FLUXO DE COMPRA (CRÍTICO) 🔥

### 1.1 Detalhes da Campanha com Integração Real

**Arquivo**: `src/app/[locale]/(rifa)/campanhas/[id]/page.tsx`

**O que fazer**:

- [ ] Criar hook `useCampaingByIdQuery(id)` (já existe em `src/querys/campaings/by-id.ts`)
- [ ] Definir `GetCampaignByIdResponse` em `@types/campaings` (atualmente está vazio)
- [ ] Integrar página de detalhes com `useCampaingByIdQuery()`
- [ ] Substituir dados mock por dados reais da API
- [ ] Adicionar loading states
- [ ] Tratar erros (campanha não encontrada)

**Tipos necessários** (adicionar em `@types/campaings/index.ts`):

```typescript
export interface GetCampaignByIdResponse extends CampaignListItem {
  prizeDescription?: string;
  rules?: string;
  featured?: boolean;
  soldTickets?: number; // Quantos tickets já foram vendidos
  availableTickets?: number; // Quantos tickets ainda disponíveis
  reservedTickets?: Ticket[]; // Tickets reservados pelo usuário
  paidTickets?: Ticket[]; // Tickets pagos
}

export interface Ticket {
  id: string;
  number: number;
  userId: string;
  campaignId: string;
  status: "RESERVED" | "PAID";
  reservedAt: string;
  paidAt?: string;
  expiresAt?: string;
}
```

---

### 1.2 Seleção e Compra de Tickets

**Componente**: `src/app/[locale]/(rifa)/campanhas/[id]/_components/ticket-selector.tsx`

**O que fazer**:

- [ ] Criar componente de seleção de tickets (modo MANUAL - escolher números)
- [ ] Criar botão de seleção aleatória (modo RANDOM - quantidade)
- [ ] Integrar com `buyTicketsManualService()` ou `buyTicketsRandomService()`
- [ ] Mostrar números já vendidos/reservados (indisponíveis)
- [ ] Mostrar resumo da compra (quantidade × valor unitário)
- [ ] Validar limites (mín/máx de tickets por compra)

**Action necessária** (criar em `src/app/actions/campaings/posts.ts`):

```typescript
export const buyTicketsManualAction = basePostAction<BuyTicketsManualRequest, BuyTicketsManualResponse>(
  (campaignId: string, data: BuyTicketsManualRequest) => buyTicketsManualService(campaignId, data),
  "Tickets reservados com sucesso!",
  "Erro ao reservar tickets."
);

export const buyTicketsRandomAction = basePostAction<BuyTicketsRandomRequest, BuyTicketsRandomResponse>(
  (campaignId: string, data: BuyTicketsRandomRequest) => buyTicketsRandomService(campaignId, data),
  "Tickets reservados com sucesso!",
  "Erro ao reservar tickets."
);
```

**Tipagens necessárias** (completar em `@types/campaings/index.ts`):

```typescript
export interface BuyTicketsManualResponse {
  tickets: Ticket[];
  totalAmount: number;
  expiresAt: string; // Prazo para pagamento
  pixQrCode?: string; // QR Code PIX (se gerado imediatamente)
  pixCopyPaste?: string; // Código copia-e-cola PIX
}

export interface BuyTicketsRandomResponse extends BuyTicketsManualResponse {}
```

---

### 1.3 Tela de Checkout / Pagamento PIX

**Arquivo**: `src/app/[locale]/(rifa)/campanhas/[id]/checkout/page.tsx`

**O que fazer**:

- [ ] Criar rota `/campanhas/[id]/checkout`
- [ ] Exibir resumo dos tickets reservados
- [ ] Mostrar QR Code PIX (se disponível)
- [ ] Mostrar código copia-e-cola PIX
- [ ] Timer de expiração da reserva (countdown)
- [ ] Polling para verificar status de pagamento (a cada 5s)
- [ ] Redirecionar para `/pagamento/sucesso` quando pago

**Componente QR Code** (criar em `src/components/payment/pix-qr-code.tsx`):

- Usar lib `qrcode.react` ou similar
- Mostrar QR Code + botão copiar código

**Hook de polling** (criar em `src/hooks/usePaymentPolling.ts`):

```typescript
export function usePaymentPolling(ticketIds: string[], onSuccess: () => void) {
  // Verificar status dos tickets a cada 5 segundos
  // Chamar onSuccess() quando status === "PAID"
}
```

---

### 1.4 Confirmação de Pagamento

**Componente**: `src/app/[locale]/(rifa)/pagamento/sucesso/page.tsx`

**O que fazer**:

- [ ] Criar rota `/pagamento/sucesso`
- [ ] Exibir mensagem de sucesso
- [ ] Mostrar números dos tickets comprados
- [ ] Botão para ver "Meus Tickets"
- [ ] Botão para voltar para campanhas
- [ ] Animação de confete/celebração (opcional)

**Rota de erro** (criar em `src/app/[locale]/(rifa)/pagamento/erro/page.tsx`):

- [ ] Criar rota `/pagamento/erro`
- [ ] Exibir mensagem de erro
- [ ] Botão para tentar novamente

---

## FASE 2: ÁREA DO USUÁRIO 👤

### 2.1 Meus Tickets / Histórico de Pedidos

**Arquivo**: `src/app/[locale]/(root)/meus-tickets/page.tsx`

**O que fazer**:

- [ ] Criar rota `/meus-tickets`
- [ ] Criar hook `useMyOrdersQuery()` (baseado em `myOrdersService`)
- [ ] Listar todos os tickets pagos do usuário
- [ ] Agrupar por campanha
- [ ] Filtros: status da campanha, data, etc.
- [ ] Card de ticket com:
  - Nome da campanha
  - Números dos tickets
  - Data de compra
  - Valor pago
  - Status (ATIVO, SORTEADO, GANHADOR)

**Hook** (criar em `src/querys/campaings/my-orders.ts`):

```typescript
export function useMyOrdersQuery() {
  // Similar ao useAllCampaingsQuery
  // Com paginação
}
```

**Action** (criar em `src/app/actions/campaings/gets.ts`):

```typescript
export const myOrdersAction = baseGetAction<MyOrdersRequest, MyOrdersResponse>(
  myOrdersService,
  "Histórico obtido com sucesso.",
  "Erro ao obter histórico."
);
```

**Tipos** (completar em `@types/campaings/index.ts`):

```typescript
export interface MyOrdersResponse {
  items: OrderItem[];
  page: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface OrderItem {
  id: string;
  campaignId: string;
  campaignTitle: string;
  campaignCoverImage?: string;
  campaignStatus: CampaignStatus;
  tickets: Ticket[];
  totalAmount: number;
  paidAt: string;
  isWinner?: boolean; // Se o usuário ganhou nessa campanha
  winningTicketNumber?: number; // Número sorteado (se ganhou)
}
```

---

### 2.2 Perfil do Usuário

**Arquivo**: `src/app/[locale]/(root)/perfil/page.tsx`

**O que fazer**:

- [ ] Criar rota `/perfil`
- [ ] Exibir dados do usuário (nome, email, telefone, documento)
- [ ] Formulário de edição (React Hook Form + Zod)
- [ ] Integrar com `updateUserService()`
- [ ] Validação de campos
- [ ] Toast de sucesso/erro

**Action** (criar em `src/app/actions/users/posts.ts`):

```typescript
export const updateUserAction = basePostAction<UpdateUserRequest, UpdateUserResponse>(
  updateUserService,
  "Perfil atualizado!",
  "Erro ao atualizar perfil."
);
```

**Tipos necessários** (criar em `@types/users/index.ts`):

```typescript
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  password?: string; // Opcional, só se quiser mudar senha
}

export interface UpdateUserResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  role: string;
  isActive: boolean;
}
```

---

### 2.3 Esqueci Minha Senha

**Arquivo**: `src/app/[locale]/(root)/esqueci-senha/page.tsx`

**O que fazer**:

- [ ] Criar rota `/esqueci-senha`
- [ ] Formulário com campo de email
- [ ] Integrar com `forgotPasswordService()`
- [ ] Exibir mensagem: "Email enviado com código de recuperação"
- [ ] Link para `/resetar-senha`

**Action** (já existe em `src/app/actions/auth/*`, verificar se precisa criar):

```typescript
export const forgotPasswordAction = basePostAction<ForgotPasswordRequest, ForgotPasswordResponse>(
  forgotPasswordService,
  "Email enviado!",
  "Erro ao enviar email."
);
```

---

### 2.4 Resetar Senha

**Arquivo**: `src/app/[locale]/(root)/resetar-senha/page.tsx`

**O que fazer**:

- [ ] Criar rota `/resetar-senha`
- [ ] Formulário com: email, código (6 dígitos), nova senha, confirmar senha
- [ ] Integrar com `resetPasswordService()`
- [ ] Validação (senha forte, senhas coincidem)
- [ ] Redirecionar para login após sucesso

---

### 2.5 Cadastro Público

**Arquivo**: `src/app/[locale]/(root)/cadastro/page.tsx`

**O que fazer**:

- [ ] Criar rota `/cadastro`
- [ ] Formulário: nome, email, telefone, CPF
- [ ] Integrar com `createPublicUserService()`
- [ ] Validação de CPF
- [ ] Após sucesso, fazer login automático (login com CPF)

**Action** (criar em `src/app/actions/users/posts.ts`):

```typescript
export const createPublicUserAction = basePostAction<CreatePublicUserRequest, CreatePublicUserResponse>(
  createPublicUserService,
  "Conta criada!",
  "Erro ao criar conta."
);
```

---

## FASE 3: PAINEL ADMINISTRATIVO 🔐

### 3.1 Dashboard Principal

**Arquivo**: `src/app/[locale]/(admin)/admin/page.tsx`

**O que fazer**:

- [ ] Criar layout admin em `src/app/[locale]/(admin)/layout.tsx`
- [ ] Sidebar com navegação (Campanhas, Usuários, Logs)
- [ ] Cards com estatísticas:
  - Total de campanhas (ACTIVE, PENDING, COMPLETED)
  - Total de usuários
  - Total de vendas (R$)
  - Campanhas próximas do sorteio
- [ ] Gráfico de vendas (opcional - usar Recharts)

**Proteção de rota** (atualizar em `src/middleware.ts`):

```typescript
// Verificar se user.role === "admin"
// Se não for admin, redirecionar para /unauthorized
```

---

### 3.2 Gerenciar Campanhas

**Arquivo**: `src/app/[locale]/(admin)/admin/campanhas/page.tsx`

**O que fazer**:

- [ ] Listar todas as campanhas (tabela com DataTable)
- [ ] Filtros: status, data de criação
- [ ] Botão "Nova Campanha" → redireciona para `/admin/campanhas/criar`
- [ ] Ações por linha:
  - Editar → `/admin/campanhas/[id]/editar`
  - Ver Pedidos → `/admin/campanhas/[id]/pedidos`
  - Ativar/Pausar/Cancelar (mudar status)
  - Deletar (com confirmação)

**Hook** (reutilizar `useAllCampaingsQuery()` ou criar versão admin):

```typescript
export function useAllCampaignsAdminQuery() {
  // Permite ver campanhas PENDING, CANCELED, etc.
}
```

---

### 3.3 Criar Campanha

**Arquivo**: `src/app/[locale]/(admin)/admin/campanhas/criar/page.tsx`

**O que fazer**:

- [ ] Formulário completo (React Hook Form + Zod)
- [ ] Campos:
  - Título
  - Subtítulo
  - Descrição
  - Preço do item (`itemPrice`)
  - Preço por ticket (`pricePerTicket`)
  - Preço de manutenção (`maintenancePrice`)
  - Total de tickets (`totalTickets`)
  - Condição do item (`itemCondition`)
  - Float (`itemFloat`)
  - Data do sorteio (`drawDate`)
  - Modo (`mode`: MANUAL ou RANDOM)
  - Status inicial (`status`)
  - Imagem de capa (`coverImage`) - Upload
  - Galeria (`gallery`) - Upload múltiplo
  - Descrição do prêmio (`prizeDescription`)
  - Regras (`rules`)
  - Destaque (`featured`)
- [ ] Upload de imagens (drag & drop) - usar `react-dropzone`
- [ ] Preview das imagens
- [ ] Integrar com `createCampaignService()`
- [ ] Enviar como `FormData` (multipart/form-data)

**Action** (criar em `src/app/actions/campaings/posts.ts`):

```typescript
export const createCampaignAction = basePostAction<FormData, CreateCampaignResponse>(
  createCampaignService,
  "Campanha criada!",
  "Erro ao criar campanha."
);
```

---

### 3.4 Editar Campanha

**Arquivo**: `src/app/[locale]/(admin)/admin/campanhas/[id]/editar/page.tsx`

**O que fazer**:

- [ ] Similar ao "Criar", mas carregar dados existentes
- [ ] Integrar com `getCampaignByIdService()` para preencher form
- [ ] Integrar com `updateCampaignService()` ao salvar
- [ ] Permitir remover imagens da galeria
- [ ] Permitir adicionar novas imagens

---

### 3.5 Pedidos da Campanha (Admin)

**Arquivo**: `src/app/[locale]/(admin)/admin/campanhas/[id]/pedidos/page.tsx`

**O que fazer**:

- [ ] Listar todos os pedidos (tickets) de uma campanha
- [ ] Filtro por status: RESERVED, PAID
- [ ] Tabela com:
  - Usuário (nome, email, CPF)
  - Números dos tickets
  - Status
  - Data de reserva
  - Data de pagamento
  - Valor
- [ ] Exportar para CSV/Excel (opcional)

**Hook** (criar em `src/querys/campaings/campaign-orders.ts`):

```typescript
export function useCampaignOrdersQuery(campaignId: string) {
  // Usar getCampaignOrdersService
}
```

**Action** (criar em `src/app/actions/campaings/gets.ts`):

```typescript
export const getCampaignOrdersAction = baseGetAction<GetCampaignOrdersRequest, GetCampaignOrdersResponse>(
  getCampaignOrdersService,
  "Pedidos obtidos.",
  "Erro ao obter pedidos."
);
```

**Tipos** (completar em `@types/campaings/index.ts`):

```typescript
export interface GetCampaignOrdersResponse {
  items: OrderWithUser[];
  totalAmount: number; // Total vendido nessa campanha
  totalTicketsSold: number;
}

export interface OrderWithUser {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    document: string;
  };
  tickets: Ticket[];
  totalAmount: number;
  status: "RESERVED" | "PAID";
  createdAt: string;
  paidAt?: string;
}
```

---

### 3.6 Gerenciar Usuários

**Arquivo**: `src/app/[locale]/(admin)/admin/usuarios/page.tsx`

**O que fazer**:

- [ ] Criar hook `useAllUsersQuery()` (baseado em `listUsersService`)
- [ ] Tabela com: nome, email, CPF, telefone, role, status (ativo/inativo)
- [ ] Filtros: role (admin/user), status (ativo/inativo)
- [ ] Busca por nome/email/CPF
- [ ] Ações:
  - Editar usuário
  - Ativar/Desativar
  - Deletar (com confirmação)
  - Promover para admin / Rebaixar para user

**Hook** (criar em `src/querys/users/all.ts`):

```typescript
export function useAllUsersQuery() {
  // Similar ao useAllCampaingsQuery
}
```

**Actions necessárias** (criar em `src/app/actions/users/*`):

```typescript
export const listUsersAction = baseGetAction<ListUsersRequest, ListUsersResponse>(...);
export const toggleUserActiveAction = basePostAction<ToggleActiveRequest, ToggleActiveResponse>(...);
export const deleteUserAction = baseDeleteAction<string, DeleteUserResponse>(...);
```

---

### 3.7 Visualizar Logs

**Arquivo**: `src/app/[locale]/(admin)/admin/logs/page.tsx`

**O que fazer**:

- [ ] Criar hook `useLogsQuery()` (baseado em `listLogsService`)
- [ ] Tabela com: data/hora, rota, usuário, email, role, ação
- [ ] Filtros:
  - Data (intervalo)
  - Role (admin/user)
  - Rota específica
  - Usuário (email/nome)
- [ ] Paginação
- [ ] Exportar logs (opcional)

**Hook** (criar em `src/querys/logs/all.ts`):

```typescript
export function useAllLogsQuery() {
  // Usar listLogsService
}
```

**Action** (criar em `src/app/actions/logs/gets.ts`):

```typescript
export const listLogsAction = baseGetAction<ListLogsRequest, ListLogsResponse>(
  listLogsService,
  "Logs obtidos.",
  "Erro ao obter logs."
);
```

---

## FASE 4: MELHORIAS E AJUSTES FINAIS ✨

### 4.1 Sistema de Notificações

- [ ] Toast notifications (já usa `sonner`)
- [ ] Notificações em tempo real (Socket.io?) - quando campanha é sorteada
- [ ] Email notifications (backend já envia?)

### 4.2 SEO e Meta Tags

- [ ] Adicionar meta tags dinâmicas por página
- [ ] Open Graph tags para compartilhamento social
- [ ] Sitemap.xml
- [ ] robots.txt

### 4.3 Responsividade

- [ ] Testar todas as telas em mobile
- [ ] Ajustar breakpoints
- [ ] Menu mobile (hamburger)

### 4.4 Testes

- [ ] Testes E2E (Playwright/Cypress)
- [ ] Testes unitários dos hooks
- [ ] Testes de integração das actions

### 4.5 Performance

- [ ] Lazy loading de imagens
- [ ] Code splitting
- [ ] Otimização de bundle
- [ ] Lighthouse score > 90

---

## 📊 Priorização Sugerida

### 🔥 SPRINT 1 (Semana 1-2) - MVP Funcional

1. ✅ Integração da listagem de campanhas (CONCLUÍDO)
2. Detalhes da campanha (integração real)
3. Seleção e compra de tickets
4. Checkout com PIX
5. Confirmação de pagamento
6. Meus tickets (visualização básica)

### 🚀 SPRINT 2 (Semana 3-4) - Área do Usuário

1. Perfil do usuário (edição)
2. Esqueci/Resetar senha
3. Cadastro público
4. Meus tickets (versão completa com filtros)

### 🔐 SPRINT 3 (Semana 5-6) - Painel Admin

1. Dashboard principal
2. Criar campanha (formulário completo)
3. Listar/Editar campanhas
4. Gerenciar usuários (básico)
5. Pedidos da campanha

### ✨ SPRINT 4 (Semana 7-8) - Refinamento

1. Logs (visualização)
2. Melhorias de UX
3. Responsividade
4. Testes
5. Deploy

---

## 🛠️ Ferramentas e Libs Sugeridas

### Já Instaladas

- ✅ React Query (`@tanstack/react-query`)
- ✅ React Hook Form (`react-hook-form`)
- ✅ Zod (`zod`)
- ✅ Axios (`axios`)
- ✅ Sonner (`sonner`) - toasts
- ✅ Radix UI - componentes
- ✅ TailwindCSS

### Para Instalar

```bash
pnpm add react-dropzone qrcode.react date-fns-tz recharts
pnpm add -D @types/qrcode.react
```

---

## 📝 Checklist de Tipagens Faltantes

### `@types/campaings/index.ts`

- [ ] Completar `CreateCampaignResponse`
- [ ] Completar `GetCampaignByIdResponse`
- [ ] Completar `UpdateCampaignResponse`
- [ ] Completar `BuyTicketsManualResponse`
- [ ] Completar `BuyTicketsRandomResponse`
- [ ] Completar `ConfirmPaymentRequest` (campos adicionais?)
- [ ] Completar `ConfirmPaymentResponse`
- [ ] Completar `MyOrdersResponse`
- [ ] Completar `GetCampaignOrdersResponse`
- [ ] Criar `Ticket` interface
- [ ] Criar `OrderItem` interface
- [ ] Criar `OrderWithUser` interface

### `@types/users/index.ts` (CRIAR)

- [ ] `CreatePublicUserRequest`
- [ ] `CreatePublicUserResponse`
- [ ] `CreateUserRequest`
- [ ] `CreateUserResponse`
- [ ] `ListUsersRequest`
- [ ] `ListUsersResponse`
- [ ] `GetUserByIdResponse`
- [ ] `UpdateUserRequest`
- [ ] `UpdateUserResponse`
- [ ] `DeleteUserResponse`
- [ ] `ToggleActiveRequest`
- [ ] `ToggleActiveResponse`

### `@types/logs/index.ts` (CRIAR)

- [ ] `ListLogsRequest` (já existe em `src/services/logs/types.ts`)
- [ ] `ListLogsResponse` (já existe em `src/services/logs/types.ts`)
- [ ] Mover types para `@types/logs/`

### `@types/payments/index.ts` (CRIAR)

- [ ] `WebhookEFIRequest` (já existe em `src/services/payments/types.ts`)
- [ ] `WebhookEFIResponse` (já existe em `src/services/payments/types.ts`)
- [ ] Mover types para `@types/payments/`
- [ ] Criar types para gerar QR Code PIX (se houver endpoint)

---

## 🎨 Componentes UI a Criar

### Payments

- [ ] `src/components/payment/pix-qr-code.tsx`
- [ ] `src/components/payment/payment-timer.tsx`
- [ ] `src/components/payment/payment-summary.tsx`

### Admin

- [ ] `src/components/admin/data-table.tsx` (genérico, com sorting/pagination)
- [ ] `src/components/admin/campaign-form.tsx`
- [ ] `src/components/admin/image-upload.tsx`
- [ ] `src/components/admin/stats-card.tsx`

### User

- [ ] `src/components/user/ticket-card.tsx`
- [ ] `src/components/user/order-history-item.tsx`
- [ ] `src/components/user/profile-form.tsx`

### Campaign

- [ ] `src/components/campaign/ticket-selector.tsx`
- [ ] `src/components/campaign/ticket-grid.tsx` (grid de números)
- [ ] `src/components/campaign/campaign-rules.tsx`

---

## 🔒 Segurança e Validações

### Middleware

- [ ] Proteger rotas `/admin/*` - apenas role="admin"
- [ ] Proteger rotas `/meus-tickets`, `/perfil` - usuário autenticado
- [ ] Rate limiting (backend?)

### Validações (Zod Schemas)

- [ ] Schema de criação de campanha
- [ ] Schema de edição de campanha
- [ ] Schema de compra de tickets
- [ ] Schema de perfil do usuário
- [ ] Schema de cadastro público
- [ ] Schema de resetar senha

---

## 📞 Endpoints da API que Faltam (Backend)

> Verificar com o backend se esses endpoints existem:

### Pagamentos

- [ ] `POST /payments/generate-pix` - Gerar QR Code PIX
- [ ] `GET /payments/:id/status` - Verificar status de pagamento

### Campanhas

- [ ] `GET /campaigns/:id/tickets` - Listar todos os tickets (disponíveis/reservados/pagos)
- [ ] `GET /campaigns/:id/available-numbers` - Listar números disponíveis
- [ ] `POST /campaigns/:id/draw` - Realizar sorteio (admin)
- [ ] `GET /campaigns/:id/winner` - Ver ganhador

### Tickets

- [ ] `GET /tickets/:id` - Ver ticket individual
- [ ] `DELETE /tickets/:id` - Cancelar reserva (antes de pagar)

---

## 🎯 Métricas de Sucesso

- [ ] Usuário consegue se cadastrar em < 2 minutos
- [ ] Compra de tickets em < 5 cliques
- [ ] Tempo de carregamento da listagem < 2s
- [ ] Admin consegue criar campanha em < 5 minutos
- [ ] Taxa de conversão (visualização → compra) > 10%
- [ ] Zero erros de tipagem (TypeScript strict mode)

---

## 📚 Documentação Adicional

### Para o Desenvolvedor

- [ ] README.md com instruções de setup
- [ ] Documentar variáveis de ambiente (`.env.example`)
- [ ] Documentar estrutura de pastas
- [ ] Guia de contribuição

### Para o Usuário Final

- [ ] FAQ - Perguntas frequentes
- [ ] Tutorial de como participar de uma rifa
- [ ] Termos de uso
- [ ] Política de privacidade

---

## ✅ Resumo da Sessão Atual

### O que foi feito hoje:

1. ✅ Ajustada tipagem `ListCampaignsResponse` com todos os campos da API
2. ✅ Criado hook `useAllCampaingsQuery()` com paginação, busca e cache de 3 minutos
3. ✅ Criado hook `useCampaingByIdQuery()` com cache de 3 minutos
4. ✅ Integrado `RifasGrid` com API real (removido mock)
5. ✅ Atualizado `RifaCard` para usar tipagens `CampaignListItem`
6. ✅ Ajustado filtros de "arma" para "status"
7. ✅ Adicionado loading states
8. ✅ Criado arquivo de exports `src/querys/campaings/index.ts`

### Próximos passos sugeridos:

1. Definir `GetCampaignByIdResponse` com campos completos
2. Integrar página de detalhes da campanha
3. Criar componente de seleção de tickets
4. Implementar fluxo de compra completo

---

**Criado em**: 13/01/2026  
**Última atualização**: 13/01/2026  
**Versão**: 1.0
