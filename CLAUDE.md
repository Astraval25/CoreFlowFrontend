# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server (Vite HMR)
npm run build      # production build
npm run lint       # ESLint
npm run preview    # preview production build locally
```

There is no test suite. No test runner is configured.

## Environment

Requires a `.env` file at the project root:
```
VITE_BASE_URL=https://coreflow.astraval.com/api
```

## Architecture

**Stack:** React 19 + Vite + Tailwind CSS v4 + React Router v7 + Axios + TanStack React Table + Recharts

### Request / Auth flow

`src/shared/services/apiService.js` — a single Axios instance used everywhere. It:
- Attaches `Authorization: Bearer <token>` from `localStorage.token` on every request
- On 401, automatically attempts a token refresh via `POST /auth/refresh-token` with `localStorage.refreshToken`, swaps the stored token, and retries once
- On refresh failure, clears both tokens and hard-redirects to `/login`

`src/shared/services/coreApi.js` — all API methods in one object that wraps the Axios instance. Add new endpoint methods here. Endpoint path constants live in `src/config/apiEndpoints.js`.

### Routing

`src/router.jsx` — single file, two zones:
- **Public routes** (`/`, `/features`, `/pricing`, `/about`, `/contact`, `/login`, `/signup`, `/verify/user`) — no auth required; `/login`, `/signup`, `/verify/user` are wrapped in `RedirectIfLoggedIn` (bounce to `/admin/dashboard` if already authed)
- **Protected routes** under `/admin` — wrapped in `ProtectedRoute` (redirects to `/login` if no token), rendered inside `MainLayout`

### Layout (`MainLayout`)

Fixed sidebar (left, 256 px on md+) + fixed topbar (top, 64 px) + scrollable `<main>`. The `<Outlet />` renders the active admin page inside `<main>`.

### Feature modules (`src/features/<name>/`)

Each feature follows the same shape:
```
pages/       ← route-level components (what the router imports)
components/  ← sub-components used only by this feature
hooks/       ← all state + API logic extracted into custom hooks
```

Pages are thin: they import a hook and pass data to components. All API calls and state live in hooks. The hooks decode the JWT themselves with `jwtDecode` to get `companyId` (`decode.defaultComp[0]`) and company name (`decode.defaultComp[1]`). Never read the JWT in a page component — do it in the hook.

List pages use **TanStack React Table** with `getCoreRowModel`, `getFilteredRowModel`, `getPaginationRowModel`, `getSortedRowModel`. The table instance is created inside the hook and returned to the page.

### Theme system (`src/index.css`)

All design tokens are CSS custom properties on `:root`. Use these variables — never hardcode colors:

| Variable | Purpose |
|---|---|
| `--sidebar-bg / --sidebar-hover / --sidebar-active-bg` | Dark sidebar (`#1c2e21`, blue active) |
| `--accent / --accent-hover / --accent-light` | Brand green |
| `--text-main / --text-sub / --text-muted` | Text hierarchy |
| `--line` | Borders and dividers |
| `--surface-bg / --surface-soft` | Card and input backgrounds |
| `--shadow / --shadow-md` | Box shadows |
| `--red / --orange / --blue` | Status colors |

Reusable utility classes also defined in `index.css`: `.card`, `.btn-primary`, `.btn-outline`, `.btn-ghost`, `.form-input`, `.data-table`, `.badge`, `.badge-{green,red,orange,blue,gray}`, `.thin-scroll`.

Tailwind `blue-*` utilities are overridden globally in `index.css` to map to the green accent — existing components that use `bg-blue-600`, `text-blue-600`, etc. automatically render in brand green.

### Dashboard analytics

The dashboard (`src/features/dashboard/`) calls three endpoints, all under `/companies/{companyId}/analytics/dashboard/`:
- `kpi` — summary numbers (revenue, expense, profit, order counts, receivables/payables)
- `cash-flow` — monthly array with `openingBalance`, `incoming`, `outgoing`, `closingBalance`
- `revenue-expense` — monthly array with `revenue`, `expense`, `netProfit`, running totals

Date range is the current fiscal year (April–March), computed in `useDashboard.js`.
