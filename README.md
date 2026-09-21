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

For both projects running locally, start the backend on its configured port 4500 and use `NEXT_PUBLIC_API_URL=http://localhost:4500/api`; run this frontend on port 3000. Keep `/api` in the base URL. A local frontend can also use the deployed backend with the URL above.

Set `NEXT_PUBLIC_API_URL` in the frontend deployment environment **before building**, then rebuild/redeploy after any change. Configure backend `CORS_ORIGINS` with the actual deployed frontend origin and `http://localhost:3000` (comma-separated, no paths/trailing slashes). Keep `SKIP_JWT_AUTH_FOR_TESTING=false`; configure stable `JWT_SECRET` and `JWT_REFRESH_SECRET` and seed the admin in the database used by that backend. See the backend's `docs/10_admin_auth.md` for setup.

## Commands

```bash
npm run dev
npm run lint
npm run test:auth
npm run build
npm run start
```

## API contract

- `POST /api/admin/login` accepts `{ email, password }` and returns an admin access token.
- Password recovery uses `POST /api/admin/forgot-password`, `POST /api/admin/verify-otp`, and `POST /api/admin/reset-password`.
- All admin user routes receive `Authorization: Bearer <accessToken>` and are protected by the backend's admin middleware:
  - `GET /api/admin/users`
  - `GET /api/admin/users/:_id`
  - `DELETE /api/admin/users/:_id` (soft delete)
  - `DELETE /api/admin/users/:_id/permanent` (permanent delete)

The shared Axios instance attaches `data.accessToken` to each protected request. On 401 it calls `POST /api/auth/refresh-token` with `data.refreshToken`, saves the renewed token, and retries once. Concurrent failures share one refresh request. Rejected refresh tokens clear the session and return to login; temporary network/server errors remain retryable. Public login and recovery requests never include a stale token.

Every dashboard route validates the session using `GET /api/auth/me` before mounting page content. Logout calls `POST /api/auth/logout` with the refresh token, then clears browser session state. Sessions are scoped to the configured backend URL. Existing legacy sessions require a fresh login after this update.

The backend returns the full users list; search and verification filtering are performed in the frontend. Login opens this list directly. Users and user details both use the shared authenticated client.

## Production notes

- The app includes baseline response-security headers in `next.config.ts`.
- Authentication authorization remains enforced by the backend. The browser-side admin check is an interface guard, not a security boundary.
- The frontend keeps access and refresh tokens in `sessionStorage` for the current tab, matching the backend's Bearer-token contract. No JWT secret belongs in the frontend.
