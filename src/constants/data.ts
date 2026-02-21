import { Icons } from "@/components/icons";

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface Customer {
  id: string;
  user_id: string;
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
  qrCodes: number;
  qrcodeSlug?: string;
}

// export const adminNavItems = (recentStores?: Customer[]): NavItem[] => {
//   // Array base de itens de navegação
//   const baseNavItems: NavItem[] = [
//     {
//       title: "Visão geral",
//       url: "/pt/dashboard",
//       icon: "dashboard",
//       isActive: false,
//       shortcut: ["v", "g"],
//       items: [],
//     },
//     {
//       title: "Produtos",
//       url: "/pt/dashboard/produtos",
//       icon: "box",
//       shortcut: ["p", "r"],
//       isActive: false,
//       items: [
//         {
//           title: "Todos os produtos",
//           url: "/pt/dashboard/produtos",
//           isActive: false,
//         },
//         {
//           title: "Samsung",
//           url: "/pt/dashboard/produtos/samsung",
//           isActive: false,
//         },
//         {
//           title: "iPhone",
//           url: "/pt/dashboard/produtos/iphone",
//           isActive: false,
//         },
//         {
//           title: "Motorola",
//           url: "/pt/dashboard/produtos/motorola",
//           isActive: false,
//         },
//         {
//           title: "JOVI",
//           url: "/pt/dashboard/produtos/jovi",
//           isActive: false,
//         },
//       ],
//     },
//     {
//       title: "Lojas",
//       url: "/pt/dashboard/lojas",
//       icon: "store",
//       shortcut: ["l", "j"],
//       isActive: false,
//       items: [
//         {
//           title: "Todas as lojas",
//           url: "/pt/dashboard/lojas",
//           isActive: false,
//         },
//         {
//           title: "Com pendências relatoriais",
//           url: "/pt/dashboard/lojas/com-pendencias",
//           isActive: false,
//         },
//         {
//           title: "Sem pendências",
//           url: "/pt/dashboard/lojas/sem-pendencias",
//           isActive: false,
//         },
//         {
//           title: "Checkup atrasado",
//           url: "/pt/dashboard/lojas/checkup-atrasado",
//           isActive: false,
//         },
//       ],
//     },
//     {
//       title: "Funcionários",
//       url: "/pt/dashboard/funcionarios",
//       icon: "User",
//       shortcut: ["f", "n"],
//       isActive: false,
//       items: [],
//     },
//     {
//       title: "Mapa mundi",
//       url: "/pt/dashboard/mapa",
//       icon: "map",
//       shortcut: ["m", "m"],
//       isActive: false,
//       items: [],
//     },
//     {
//       title: "Estoque de QR Codes",
//       url: "/pt/dashboard/lojas/82ce0b17-8350-4f75-a8e2-253944d1114c/qrcodes",
//       icon: "qrcode",
//       shortcut: ["q", "r"],
//       isActive: false,
//       items: [],
//     },
//   ];

//   if (recentStores && recentStores.length > 0) {
//     const recentStoreItems: NavItem[] = recentStores.map((store) => ({
//       title: store.name,
//       url: `/pt/dashboard/lojas/${store.id}/relatorio`,
//       isActive: false,
//     }));

//     const recentStoresSection: NavItem = {
//       title: "Últimas lojas cadastradas",
//       url: "",
//       icon: "history",
//       items: [...recentStoreItems],
//     };

//     return [...baseNavItems, recentStoresSection];
//   }

//   return baseNavItems;
// };

export const adminNavItems = (recentStores?: Customer[]): NavItem[] => {
  // Array base de itens de navegação
  const baseNavItems: NavItem[] = [
    {
      title: "Site principal",
      url: "/",
      icon: "laptop",
      isActive: false,
      external: true,
    },
    {
      title: "Gerenciamento de Campanhas",
      url: "/pt/dashboard/campanhas",
      icon: "dashboard",
      isActive: false,
      shortcut: ["v", "g"],
      items: [],
    },
    {
      title: "Usuários",
      url: "/pt/dashboard/usuarios",
      icon: "User",
      isActive: false,
      shortcut: ["u", "s"],
      items: [],
    },
    {
      title: "Logs",
      url: "/pt/dashboard/logs",
      icon: "post",
      isActive: false,
      shortcut: ["l", "g"],
      items: [],
    },
    {
      title: "Changelog",
      url: "/pt/dashboard/changelog",
      icon: "history",
      isActive: false,
      shortcut: ["c", "g"],
      items: [],
    },
  ];

  return baseNavItems;
};
