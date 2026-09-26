# Mailra Admin — Audit & Makeover Plan

Companion to `REDESIGN_PLAN.md`. The public site now speaks "Stil Licht"; the admin
panel still looks and behaves like the v0 scaffold it started as — and, more
importantly, several parts of it are **broken or unsafe**. This plan fixes function
first, then brings the admin into the same design language as a calm, fast,
purpose-built back office.

---

## 1. Audit — what is wrong today

Severity: **P0** = security hole or feature that does not work · **P1** = wrong
data / data loss risk · **P2** = UX & polish.

### 1.1 Security

| # | Sev | Where | Finding |
|---|-----|-------|---------|
| S1 | P0 | `middleware.ts:18` | Auth only checks that an `admin_session` cookie **exists**. Any value (`admin_session=x`, set in devtools) opens `/admin`. |
| S2 | P0 | `app/api/products/*`, `app/api/categories/*` | Every write endpoint (create, update, delete, toggle) is **unauthenticated**. The middleware matcher only covers `/admin/:path*`, so `curl -X DELETE /api/products?id=…` works for anyone on the internet. |
| S3 | P0 | `app/api/auth/login/route.ts:27` | Session cookie value is the raw admin user id (guessable format `admin_<timestamp>`), unsigned, no expiry check server-side. |
| S4 | P1 | `lib/db.ts:293` | Password-reset tokens use `Math.random()` (not cryptographically secure), are stored in plaintext, live 24 h and are not single-use until a reset succeeds. |
| S5 | P1 | `lib/db.ts:276` | Login leaks which e-mails exist via timing (bcrypt only runs for known users). |
| S6 | P2 | `app/api/*` | No input validation — arbitrary JSON is written straight into SQL params (safe from injection thanks to tagged templates, but empty names, 20 MB images, unknown categories are all accepted). |

### 1.2 Broken functionality

| # | Sev | Where | Finding |
|---|-----|-------|---------|
| F1 | P0 | `app/api/products/[id]/*`, `app/api/categories/[id]/*` | Next 16 passes `params` as a **Promise**. The handlers read `params.id` synchronously → `undefined`. Result: **editing a product and the active/inactive toggle never work** (this is the "Product met ID … niet gevonden" dialog in `app/admin/products/page.tsx:128`). |
| F2 | P0 | `app/admin/page.tsx:5` | Dashboard counts come from the static `lib/products.ts` seed file, not the database. Numbers never change; "Actieve Items" is just the product count again. |
| F3 | P1 | `app/admin/products/page.tsx:60–83` | Save errors are swallowed — if the API fails the form closes as if it succeeded. |
| F4 | P1 | `app/admin/products/page.tsx:173` | Bulk delete ignores individual failures and removes rows from the UI regardless. |
| F5 | P1 | `app/api/categories/route.ts:58` | Deleting a category that still has products orphans them (they vanish from the public filter but stay "active"). |
| F6 | P1 | `app/admin/categories/page.tsx:82` | Category id = `name.toLowerCase().replace(/\s+/g,'-')` — "Decoratie & Bloemen" becomes `decoratie-&-bloemen` (breaks `?category=` URLs); duplicates crash with a silent 500. Same for product ids. |
| F7 | P1 | `components/admin/product-form.tsx:65` | Images are stored as raw base64 of the original file. A 6 MB phone photo becomes an 8 MB DB row and exceeds Vercel's 4.5 MB request limit → silent save failure. |
| F8 | P1 | all mutations | Public pages are not revalidated after edits; the home page shows stale data for up to 5 min and cached pages until next deploy. |
| F9 | P1 | `scripts/create-admin.ts:10` | Seeds a known default password and says "change it after first login" — but there is **no change-password screen**. |
| F10 | P2 | `app/api/auth/forgot-password/route.ts:36` | Reset link is only `console.log`ged; no mail is sent. The UI says "check your e-mail". |
| F11 | P2 | `app/admin/categories/page.tsx:124` | Dead variable `productCount = 0`; the deactivate warning never tells you how many products are affected. |

### 1.3 UX & design

- Admin renders **inside the public site chrome** (marketing header + big footer),
  so the working area is squeezed and the logout lives in two places.
- Uses `alert()` / `confirm()` for every message — blocking, unstyled, not accessible.
- Product form appears **inline above the table**, pushing the list off-screen;
  editing row 40 means scrolling back up.
- Status colours are raw Tailwind `green-500` / `gray-500` / `blue-500` / `purple-500`,
  outside the verified palette; pill-shaped `rounded-full` buttons clash with the
  near-square controls of the new system.
- No loading skeletons (products page shows "Geen producten gevonden" while loading),
  no filtering by category/status, no sorting, no empty-state guidance.
- Raw `<input>`/`<select>` elements with hand-written classes instead of the shadcn
  primitives already in `components/ui`.
- Product/category ids shown to the user (`ID: stoelen`) — developer noise.

---

## 2. Goals

1. **Safe:** nobody without a valid, signed, unexpired session can read admin data or
   change anything — enforced in the proxy *and* in every handler.
2. **Works:** every button does what it says, errors are surfaced, the public site
   reflects edits immediately.
3. **Calm & fast:** an app shell dedicated to the work, one primary action per screen,
   edits in a slide-over, feedback via toasts, no page jumps.
4. **On brand:** same tokens, type and restraint as the public site — the admin should
   feel like the back room of the same shop.

Non-goals: multi-user roles, audit log, e-mail delivery provider, blob storage
(see §7).

---

## 3. Security & data layer

### 3.1 Signed sessions — `lib/auth/session.ts`

- Cookie `admin_session` = `base64url(payload).base64url(HMAC-SHA256(payload))`,
  payload `{ uid, exp }`, 7-day expiry. Implemented with **Web Crypto** so the same
  code verifies in the proxy and in route handlers.
- Secret: `ADMIN_SESSION_SECRET` env var; falls back to `POSTGRES_URL` (already a
  server-only secret on Vercel) so existing deployments keep working. Documented.
- `requireAdmin()` helper for route handlers → returns the session or a `401` response.
- `getSession()` for server components (dashboard, account page).

### 3.2 Proxy (`middleware.ts` → `proxy.ts`, Next 16 convention)

- Matcher: `/admin/:path*`, `/api/products/:path*`, `/api/categories/:path*`,
  `/api/admin/:path*`.
- Pages → redirect to `/admin/login?next=…`; API → `401 JSON`.
- Logged-in user visiting `/admin/login` → redirect to `/admin`.

### 3.3 API hardening

- All handlers `await params` (fixes F1).
- `zod` schemas for product / category payloads (name 1–120 chars, category must
  exist, image ≤ 1.5 MB data URL or a `/…` path, etc.) → `400` with a Dutch message.
- Server generates ids via `slugify()` (diacritics stripped, `[a-z0-9-]` only) and
  de-duplicates (`-2`, `-3`…) (fixes F6).
- Category delete returns `409` with the product count when products still use it (F5).
- Every mutation calls `revalidatePath("/")`, `"/producten"`, `"/sitemap.xml"` (F8).
- Bulk endpoint `POST /api/products/bulk` `{ action: "activate"|"deactivate"|"delete", ids }`
  — one round-trip, one transaction-ish statement (`WHERE id = ANY(...)`) (F4).
- New `lib/db.ts` helpers: `getAdminStats()`, `countProductsInCategory()`,
  `setProductsActive()`, `deleteProducts()`, `changeAdminPassword()`.

### 3.4 Password handling

- Reset tokens: `crypto.randomBytes(32)`, stored as SHA-256 hash, 1 h expiry,
  all older tokens for the user invalidated on issue (S4).
- Login runs bcrypt against a dummy hash for unknown e-mails (S5).
- New **Account** page: change password (current + new + confirm, min 10 chars) (F9).
- Forgot-password copy made honest: the link is delivered by the site owner's
  configured channel; in development it is logged to the server console (F10).

---

## 4. Information architecture

```
/admin/login               centred card, no site chrome
/admin/forgot-password     "
/admin/reset-password      "
/admin                     Overzicht (dashboard)
/admin/products            Producten  (list + slide-over editor)
/admin/categories          Categorieën (list + dialog editor)
/admin/account             Account (change password, sign out)
```

Admin gets its **own shell** — the public `Header`/`Footer` are removed from `/admin`.

---

## 5. Design

### 5.1 Shell

- **Sidebar** (desktop ≥ 1024 px, 248 px wide): `olive-deep` background, Fraunces
  wordmark "Mailra" + eyebrow "Beheer", nav items in canvas/70 with a gold 2 px
  indicator on the active item, footer block with "Bekijk website ↗" and signed-in
  e-mail + "Uitloggen".
- **Top bar** (all sizes): page title in Fraunces, contextual primary action on the
  right (e.g. "Nieuw product"). On mobile the bar carries the menu button that opens
  the same nav in a `Sheet`.
- Content on `canvas`, cards on `surface` with `hairline` borders, radius 2 px —
  identical tokens to the public site; no new colours.

### 5.2 Components (all from `components/ui`)

| Need | Primitive |
|------|-----------|
| Confirmations | `AlertDialog` (destructive action in `destructive` variant) |
| Feedback | `sonner` toasts (success / error with the API's message) |
| Product editor | `Sheet` (right, 560 px), sticky footer with Cancel / Save |
| Category editor | `Dialog` |
| Active toggle | `Switch` inline in the row — optimistic, rolls back on error |
| Filters | `Input` with search icon, category `Select`, status segmented `ToggleGroup` |
| Loading | `Skeleton` rows matching final layout |
| Status | `Badge` — Actief = olive-ink on linen, Inactief = ink-55 outline |

### 5.3 Screens

**Overzicht** — server component, live from DB.
- Greeting + date eyebrow.
- 4 stat tiles: Producten, Zichtbaar op site, Verborgen, Categorieën.
- "Aandachtspunten": products without image, without description, active products in
  an inactive category — each links to the filtered product list.
- "Recent bijgewerkt": last 5 products with thumbnail and relative time.
- Quick actions: Nieuw product · Nieuwe categorie · Bekijk website.

**Producten**
- Toolbar: search (name/description), category select, status toggle
  (Alle · Zichtbaar · Verborgen), result count. Filters are reflected in the URL
  (`?q=&category=&status=`) so dashboard links deep-link into them.
- Desktop table: checkbox · thumbnail 48 px · name + description line · category ·
  afmetingen · Switch · row menu (Bewerken / Verwijderen). Whole row opens the editor.
- Mobile: stacked cards, same data, Switch + menu in the card header.
- Bulk bar slides up from the bottom when ≥ 1 selected: "3 geselecteerd ·
  Zichtbaar maken · Verbergen · Verwijderen · ✕".
- Editor (Sheet): image drop zone with preview, replace / remove; client-side resize
  to max 1600 px WebP (q 0.82) before upload — typical 150–300 KB (fixes F7);
  name, category, description (with character count), afmetingen, capaciteit,
  "Zichtbaar op de website" switch. Dirty-state guard on close.

**Categorieën**
- List rows: name, description, product count ("12 producten"), Switch, menu.
- Deactivate confirm states the exact number of products that will be hidden.
- Delete disabled (with tooltip) when the category still has products.
- Editor dialog: name, description; the URL slug is shown read-only as a preview.

**Account**
- Signed-in e-mail, change-password form, sign-out button.

**Auth pages**
- Full-height `linen` background, centred `surface` card, Fraunces wordmark, eyebrow
  "Beheer", shadcn `Input`/`Label`, show/hide password toggle, errors inline in
  `destructive`. After login redirect to `?next=` (same-origin only) or `/admin`.

### 5.4 Accessibility

- Every control labelled; icon buttons have `aria-label`.
- Toasts announced via sonner's live region; dialogs trap focus (Radix).
- Active nav item `aria-current="page"`; table uses real `<table>` semantics with
  `scope="col"` headers.
- Hit targets ≥ 40 px on touch.

---

## 6. Implementation order

1. `lib/auth/session.ts`, `lib/slug.ts`, `lib/validation.ts`, db helpers.
2. `proxy.ts`; auth routes (login, logout, forgot, reset, change-password).
3. Product & category API routes (async params, auth, zod, revalidate, bulk).
4. Admin shell (`app/admin/(panel)/layout.tsx` route group vs. `(auth)` group so auth
   pages never render the shell — replaces the `pathname` check).
5. Screens: Overzicht → Producten (+ editor) → Categorieën → Account → auth pages.
6. `npm run build`, browser pass on desktop + mobile, curl checks for 401s.

### Acceptance checks

- [ ] `curl -X DELETE /api/products?id=x` without cookie → `401`.
- [ ] Forged `admin_session=anything` → redirected to login.
- [ ] Edit product, toggle active, bulk actions all persist after reload.
- [ ] Dashboard numbers equal `SELECT count(*)` results.
- [ ] Uploading a 5 MB photo saves successfully (< 400 KB stored).
- [ ] Deleting a category with products is refused with a clear message.
- [ ] Public `/producten` reflects an edit on next request.
- [ ] No `alert()`/`confirm()` left in `app/admin` or `components/admin`.
- [ ] Build passes; no console errors on any admin screen.

---

## 7. Follow-ups (out of scope, need a decision/credentials)

- **E-mail delivery** for password reset (Resend / Postmark API key).
- **Blob storage** (Vercel Blob) for product images instead of data URLs in Postgres.
- **Login rate limiting** — needs a shared store (Upstash/Vercel KV) to be meaningful
  on serverless.
- Product ordering (drag to sort) and multiple images per product.
