---
name: new-feature-implement
description: Scaffold and implement a complete new feature in CoreFlow. Reads the provided API spec and optional sample UI, then creates the full feature folder under src/features/[feature-name]/ with pages, hooks, and layouts following the project's established patterns. Use when adding any new section to the admin app.
argument-hint: [feature-name] [api-file-or-description] [sample-ui-file-or-description?]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

You are implementing a new feature in the CoreFlow frontend. The user has provided:

- **Feature name**: `$0`
- **API spec**: `$1`
- **Sample UI** (optional): `$2`

## Step 1 — Read project context

Before writing any code, read these files to understand the patterns you must follow:

- `CLAUDE.md` — architecture rules, hook pattern, JWT decode convention, theme variables
- `src/index.css` — all CSS custom properties (use these, never hardcode colors)
- `src/config/apiEndpoints.js` — where to register new endpoint keys
- `src/shared/services/coreApi.js` — where to register new API methods
- `src/router.jsx` — where to register the new route(s)
- `src/shared/components/Sidebar.jsx` — where to add the new nav link (follow the NAV array pattern)
- `src/features/customer/hooks/useCustomer.js` — reference hook pattern
- `src/features/customer/pages/CustomerPage.jsx` — reference list page pattern

If `$1` is a file path, read it. If `$2` is a file path, read it.

## Step 2 — Understand the API

Parse `$1` to extract:
- All HTTP endpoints (method, path, query params)
- Request body shapes
- Response shapes (`responseData` field structure)
- Which endpoints need `companyId` in the path

## Step 3 — Create the feature scaffold

Create this exact folder structure (no deviations):

```
src/features/$0/
  hooks/
    use$0.js            ← list page hook (fetch + TanStack Table)
    useCreate$0.js      ← create/edit form hook
    useView$0Detail.js  ← detail view hook (if a detail endpoint exists)
  page/
    $0Page.jsx          ← list page (thin, imports hook + renders table)
    Create$0Page.jsx    ← create/edit page
    View$0Page.jsx      ← detail view page (if applicable)
  layouts/
    $0Layout.jsx        ← optional wrapper layout only if needed; skip if not needed
```

Use PascalCase for the feature name in component names and camelCase for hook names. Mirror exactly the casing the user provided in `$0`.

## Step 4 — Rules for every file you write

### Hook files (`hooks/`)
- Import `coreApi` from `../../../shared/services/coreApi`
- Import `jwtDecode` from `jwt-decode` and extract `companyId` from `decode.defaultComp[0]` inside `useEffect`
- All API calls go in the hook — never in the page component
- For list hooks: set up a TanStack React Table instance (`useReactTable` with `getCoreRowModel`, `getFilteredRowModel`, `getPaginationRowModel`, `getSortedRowModel`) and return `table`, `globalFilter`, `setGlobalFilter` from the hook
- For create/edit hooks: manage form state with `useState`, submit via `coreApi`, navigate on success with `useNavigate`
- Follow the error handling pattern: `.catch((err) => console.error("...", err))`

### Page components (`page/`)
- Import the hook, destructure what's needed, render JSX — no direct API calls, no `jwtDecode`
- Apply global theme: use CSS variables (`var(--accent)`, `var(--text-main)`, `var(--line)`, etc.) and utility classes (`.card`, `.btn-primary`, `.btn-outline`, `.btn-ghost`, `.form-input`, `.data-table`, `.badge-*`) defined in `src/index.css`
- List pages must include: page header with title + "New" button, search input, table with `flexRender`, pagination with prev/next buttons — match the visual pattern from `CustomerPage.jsx`
- Tables: `<div className="card overflow-x-auto">` wrapping, `<table className="data-table">` with `<thead>` styled using `.data-table th` class

### If `$2` (sample UI) is provided
- Implement the layout, component arrangement, and visual hierarchy exactly as shown
- Map API fields to the UI elements as logically as possible
- Still use the global CSS variables — do not use the colors from the sample as literal values if they conflict with the theme

## Step 5 — Wire into the app

After creating all feature files, make these four edits:

1. **`src/config/apiEndpoints.js`** — add endpoint key(s) for this feature (follow the `CUSTOMERS: "/companies"` pattern)

2. **`src/shared/services/coreApi.js`** — add all CRUD methods for this feature using the endpoint keys

3. **`src/router.jsx`** — add route(s) under the `/admin` children array:
   ```js
   { path: "$0", element: <$0Page /> },
   { path: "create/$0", element: <Create$0Page /> },
   { path: "view/$0", element: <View$0Page /> },
   ```
   Import the new page components at the top of the file.

4. **`src/shared/components/Sidebar.jsx`** — add a new entry to the `NAV` array. Pick the most appropriate `react-icons` icon. If the feature belongs under an existing group (like "Manage"), add it as a child; otherwise add it as a top-level `type: "link"` entry.

## Step 6 — Verify

Run `npm run build` and fix any errors before finishing. Report what was created.
