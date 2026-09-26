# Admin Panel

Back office for managing the product collection shown on the public site.
See `ADMIN_REDESIGN_PLAN.md` for the audit and design rationale.

## Access

- URL: `/admin` (redirects to `/admin/login` when signed out)
- Screens: **Overzicht** (dashboard), **Producten**, **Categorieën**, **Account**
- Sessions last 7 days; sign out from the sidebar.

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `POSTGRES_URL` (and the other Vercel Postgres vars) | yes | Database |
| `ADMIN_SESSION_SECRET` | recommended | Signs the admin session cookie. Any long random string, e.g. `openssl rand -base64 32`. Falls back to `POSTGRES_URL` if unset. |
| `NEXT_PUBLIC_BASE_URL` | optional | Base URL used in password-reset links (defaults to the request origin). |

## First-time setup

```bash
npx tsx scripts/init-db.ts            # create tables
npx tsx scripts/migrate-add-active.ts # add `active` columns on older databases
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a long passphrase' npx tsx scripts/create-admin.ts
```

Then sign in and change the password under **Account** if you used a temporary one.

## Password reset

"Wachtwoord vergeten" creates a single-use link valid for one hour. No mail provider is
configured yet, so the link is written to the server log (Vercel → Project → Logs, search
for `Password reset link`). Hooking up Resend/Postmark is listed as a follow-up in the plan.

## How visibility works

A product is shown on the public site only when **both** the product and its category are
switched on. Hiding a category never changes the products' own settings.

## Images

Photos are resized in the browser (max 1400 px, WebP) before upload and stored in the
`products.image` column as a data URL. Existing images can also be plain paths such as
`/products/chiavari-chair.jpg` from the `public/` folder.

## API (all require an admin session)

| Method | Path | |
|--------|------|-|
| GET / POST | `/api/products` | list / create |
| GET / PUT / PATCH / DELETE | `/api/products/[id]` | read / update / `{ active }` / delete |
| POST | `/api/products/bulk` | `{ action: "activate" \| "deactivate" \| "delete", ids }` |
| GET / POST | `/api/categories` | list with counts / create |
| PUT / PATCH / DELETE | `/api/categories/[id]` | update / `{ active }` / delete (409 while it has products) |
| POST | `/api/admin/password` | change password |
| POST | `/api/auth/login`, `/logout`, `/forgot-password`, `/reset-password` | auth |
