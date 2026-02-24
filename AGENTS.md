# AGENTS.md

## Cursor Cloud specific instructions

### Overview

KGB Skins is a Next.js 15 (App Router) frontend for a Brazilian CS:GO skin raffle platform. It connects to a **separate backend API** (not in this repo) via the `BASE_URL_NODE` env var.

### Running the dev server

```bash
pnpm dev
```

Runs on port 3000. Requires `.env.local` with at least `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and `BASE_URL_NODE`. See `env.example` for the template.

### Lint / Build

- `pnpm lint` — ESLint (warnings only, no errors as of now)
- `pnpm build` — Has a pre-existing error with the 404 page (`<Html>` imported outside `pages/_document`). Dev server works fine regardless.

### Auth architecture

The app uses a dual token storage system:
1. **NextAuth JWT session** — for session management, route protection, user info (`useSession`, `getToken`, `getServerSession`)
2. **Custom httpOnly cookies** (`kgb-admin-access-token`, `kgb-admin-refresh-token`) — for API authentication via the axios interceptor in `src/services/axiosNodeApi.ts`

The axios interceptor handles 401 responses by refreshing the access token server-side via `src/app/actions/auth/refresh-token.ts`. Concurrent 401s are deduplicated with a shared Promise pattern to avoid race conditions when the backend rotates refresh tokens.

### Known dead code

- `src/context/AuthContext.tsx` — reads a legacy cookie name (`biomob-node-admin.token`) that is never set. `useAuth()` is not called anywhere.
- `src/app/actions/auth/access-token.ts` — client-side function that tries to read an httpOnly cookie via `nookies`, which always returns `undefined`.

### Package manager

Uses **pnpm 9.4.0** (enforced via `packageManager` field). Enable via `corepack enable && corepack prepare pnpm@9.4.0 --activate`.
