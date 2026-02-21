import NextAuth, { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { nodeLogin } from "@/app/actions/auth/login";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        phone: { label: "CPF", type: "text" },
        loginType: { label: "Login Type", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        // Valida se é login com email ou telefone
        const isEmailLogin = credentials.loginType === "email";
        const isPhoneLogin = credentials.loginType === "phone";

        if (isEmailLogin && (!credentials.email || !credentials.password)) {
          return null;
        }

        if (isPhoneLogin && !credentials.phone) {
          return null;
        }

        try {
          const loginParams = isEmailLogin
            ? {
                email: credentials.email,
                password: credentials.password,
                loginType: "email" as const,
              }
            : {
                phone: credentials.phone,
                loginType: "phone" as const,
              };

          const result = await nodeLogin(loginParams);

          if (result.success && result.data) {
            const user = {
              id: result.data.userId,
              name: result.data.name,
              email: result.data.email,
              role: result.data.role,
              phone: result.data.phone,
              accessToken: result.data.access_token,
              refreshToken: result.data.refresh_token,
              inviteCount: result.data.invite_count,
              inviteCode: result.data.invite_code,
              hasReferredByInviteCode: result.data.has_referred_by_invite_code,
            };

            return user;
          } else {
            throw new Error(result.message || "Falha na autenticação");
          }
        } catch (error: any) {
          throw new Error(error?.message || "Falha na autenticação");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        // Atualiza o token com os dados do usuário na primeira autenticação
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.phone = user.phone;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.inviteCount = user.inviteCount;
        token.inviteCode = user.inviteCode;
        token.hasReferredByInviteCode = user.hasReferredByInviteCode;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      // Passa os dados do token para a sessão
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        role: token.role,
        phone: token.phone,
        inviteCount: token.inviteCount,
        inviteCode: token.inviteCode,
        hasReferredByInviteCode: token.hasReferredByInviteCode,
      };
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt" as const,
  },
};

export default NextAuth(authOptions);
