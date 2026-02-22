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

export const adminNavItems = (recentStores?: Customer[]): NavItem[] => {
  const baseNavItems: NavItem[] = [
    {
      title: "Site principal",
      url: "/",
      icon: "laptop",
      isActive: false,
      external: true,
    },
    {
      title: "Campanhas",
      url: "/pt/dashboard/campanhas",
      icon: "post",
      isActive: false,
      shortcut: ["v", "g"],
      items: [],
    },
    {
      title: "Todos os usuários",
      url: "/pt/dashboard/usuarios",
      icon: "users",
      isActive: false,
      shortcut: ["u", "s"],
    },
    {
      title: "Top Convidadores",
      url: "/pt/dashboard/usuarios/top-inviters",
      icon: "userPlus",
      isActive: false,
      shortcut: ["t", "c"],
    },
    {
      title: "Maiores Compradores",
      url: "/pt/dashboard/usuarios/best-buyers",
      icon: "shoppingCart",
      isActive: false,
      shortcut: ["m", "c"],
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
