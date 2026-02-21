"use client";

import { parseJwt } from "@/utils/parseJwt";
import { usePathname } from "next/navigation";
import { parseCookies } from "nookies";
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";

type userProps = {
  gymId: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

interface AuthContextType {
  user: userProps | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
});

type AuthContextProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [user, setUser] = useState<userProps | null>(null);
  const [lastVerification, setLastVerification] = useState<Date | null>(null);
  const pathName = usePathname();

  useEffect(() => {
    const checkToken = async () => {
      let cookies = parseCookies();
      const { "biomob-node-admin.token": token } = cookies;
      try {
        const claims = parseJwt(token);
        setUser({
          gymId: claims!.gymId || "gymId_not_found",
          email: claims!.email,
          exp: claims!.exp,
          iat: claims!.iat,
          name: claims!.name,
          phone: claims!.phone,
          role: claims!.role,
          userId: claims!.userId || "userId_not_found",
        });
      } catch {}
    };

    if (lastVerification != null) {
      let now = new Date();
      let difference = now.getTime() - lastVerification.getTime();
      let differenceInMinutes = difference / (1000 * 60);

      if (differenceInMinutes > 5) {
        checkToken();
        return;
      }
    }

    if (!lastVerification) {
      setLastVerification(new Date());
      checkToken();
    }
  }, [pathName, lastVerification]);

  const contextValue = useMemo(() => {
    return {
      user,
    };
  }, [user]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
