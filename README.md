# Asset Heaven Admin

A Next.js 16 administration panel for Asset Heaven. It authenticates against the Mobulous Tech backend and only permits accounts whose backend user record has `admin: true`.

## Stack

- Next.js App Router + TypeScript
- React 19
- Redux Toolkit + React Redux for global theme state
- Tailwind CSS 4

## Project structure

```text
app/                 Routes, global layout, providers, and route fallbacks
components/ui/       Reusable interface components
features/theme/      Redux feature state and actions
lib/                 Redux store and typed hooks
public/              Static files
```

## Environment

Copy `.env.example` to `.env.local` and set the backend API URL when needed:

```env
NEXT_PUBLIC_API_URL=https://mobulous-tech.vercel.app/api
```

The application defaults to the deployed API URL if this value is absent. Never place secrets in a `NEXT_PUBLIC_` environment variable.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## API contract

- `POST /api/login-user` accepts `{ email, password }` and returns `data.accessToken` plus `data.user`.
- `GET /api/users` receives `Authorization: Bearer <accessToken>` and is protected by the backend’s admin middleware.

The backend currently returns the full users list. Search, verification filtering, and page controls are performed in the frontend until server-side pagination is added.

## Production notes

- The app includes baseline response-security headers in `next.config.ts`.
- Authentication authorization remains enforced by the backend. The browser-side admin check is an interface guard, not a security boundary.
- The frontend keeps the access token in `sessionStorage` for the current tab. For a hardened production deployment, change the backend login flow to set secure, HttpOnly, same-site cookies and verify them in server-side route handlers/proxy.
