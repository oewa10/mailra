# Admin Panel

Back office for managing the product collection shown on the public site.
See `ADMIN_REDESIGN_PLAN.md` for the audit and design rationale.

## Access

- URL: `/admin` (redirects to `/admin/login` when signed out)
- Screens: **Overzicht** (dashboard), **Producten**, **Categorieën**, **Account**
- Sessions last 7 days; sign out from the sidebar.
- Changing or resetting the password signs out every other device immediately.

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `POSTGRES_URL` (and the other Vercel Postgres vars) | yes | Database |
| `ADMIN_SESSION_SECRET` | recommended | Signs the admin session cookie. At least 32 characters, e.g. `openssl rand -base64 32`. Falls back to `POSTGRES_URL` if unset or shorter. |
| `NEXT_PUBLIC_BASE_URL` | optional | Base URL used in password-reset links (defaults to the request origin). |

## First-time setup

```bash
npx tsx scripts/init-db.ts            # create or upgrade tables and indexes (safe to re-run)
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a long passphrase' npx tsx scripts/create-admin.ts
```

Then sign in and change the password under **Account** if you used a temporary one.

## Security

- **Login throttling:** 8 wrong passwords for one account from one address, 30 from one address
  in total, or 50 for one account from anywhere, within 15 minutes, block further attempts
  (HTTP 429) until the window passes. Reset-link requests are limited to 3 per address per
  hour. Attempts are stored hashed in `auth_attempts`; if that table is unreachable the checks
  are skipped rather than locking you out.
- **Sessions** are signed cookies bound to the current password. The server checks every admin
  request against the database, so a leaked cookie stops working after a password change.
- **Requests from other sites** that try to change data are refused (Origin / Sec-Fetch-Site
  check), and API bodies must be JSON under ~2 MB.
- Passwords are hashed with bcrypt (cost 12); older, weaker hashes are upgraded at the next login.
- Reset links are single-use, expire after an hour and are stored only as a hash.
- Every page is served with `X-Frame-Options`, `nosniff`, a referrer policy and a basic CSP;
  `/admin` and `/api` are marked `noindex` and API responses are never cached.

After deploying this version, run `npx tsx scripts/init-db.ts` once more: it widens
`products.category` and creates the `auth_attempts` table (the app also creates that table on
first use). Everyone has to log in again once, because sessions now carry a password fingerprint.

## Password reset

"Wachtwoord vergeten" creates a single-use link valid for one hour. No mail provider is
configured yet, so the link is written to the server log (Vercel → Project → Logs, search
for `Password reset link`). Hooking up Resend/Postmark is listed as a follow-up in the plan.

`init-db.ts` also upgrades databases created before the visibility switches existed. It only
seeds the starter products into an empty `products` table, so it never brings back products
you deleted.

## How visibility works

A product is shown on the public site only when **both** the product and its category are
switched on. Hiding a category never changes the products' own settings. A category appears
on the site (filter bar, its own page, homepage tiles, footer, sitemap) only while it has at
least one visible product.

## How the public site stays fast and up to date

- `/producten` and each category page `/producten/<categorie-id>` are static pages served
  from cache. Old `/producten?category=x` links redirect permanently to the new URLs.
- Every change in the admin (save, switch, bulk action, delete) refreshes the whole public
  site on demand, so the change is visible on the next page view. The pages also refresh
  hourly as a safety net, e.g. after editing the database by hand.
- A category page keeps its URL when the category is renamed. New categories get their page
  the first time someone opens it.
- The homepage shows up to three categories with live item counts. Stoelen, Tafels and
  Decoratie use their curated photos; other categories use their first product photo.
- If the database is briefly unreachable while a page refreshes, visitors keep seeing the
  last good version instead of an empty collection.

## Images

Photos are resized in the browser (max 1400 px, WebP) before upload and stored in the
`products.image` column as a data URL. Pages never embed that data. They link to
`/media/products/<id>/<version>`, which serves the bytes with a one-year immutable cache
header, and `next/image` delivers resized AVIF/WebP versions from there. The version changes
whenever the product is saved, so a replaced photo shows up immediately. Existing images can
also be plain paths such as `/products/chiavari-chair.jpg` from the `public/` folder.

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

When updating a product, send the `image` value you received back unchanged to keep the
stored photo, a new `data:image/...` URL to replace it, or `""` to remove it.

Public (no session): `GET /media/products/[id]/[version]` serves a product photo.
