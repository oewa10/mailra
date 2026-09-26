# SEO audit & improvement plan — Caftan by Mailra

_Audit date: 26 September 2026. Method: read every public route and the SEO plumbing (`app/layout.tsx`, `robots.ts`, `sitemap.ts`, `manifest.ts`, JSON-LD), ran a production build (`next build && next start`), parsed the rendered HTML of every public page, and ran Lighthouse 12 (mobile) on `/`, `/producten` and `/contact`. The build had no database, so the catalog was empty: category pages returned 404, and product grids were empty._

---

## Status (26 September 2026)

**Done: Phase 1 technical SEO**, plus the Phase 0 business details:
- **Business details:** real phone, WhatsApp, email and Amersfoort address (`lib/site-config.ts`). Every call, WhatsApp and form link reads from there.
- **Domain:** `https://mailra.nl` is canonical, and `www.mailra.nl` 301s to it (`next.config.mjs`).
- **Per-page metadata:** a `pageMetadata()` helper (`lib/seo.tsx`) gives every page its own canonical, Open Graph, Twitter and share image. 404s have no canonical and one `noindex`.
- **Titles and headings:** new titles, keyword H1 on the homepage, sentence-case headings. Header and footer now sit outside `<main>` via `app/(site)/layout.tsx`.
- **Structured data:** a LocalBusiness + WebSite graph, breadcrumbs starting at Home, and rental `Offer` markup for priced products.
- **Sitemap:** `lastModified` from the database and image entries; `priority` and `changefreq` removed.
- **Product prices:** managed in the admin (`price`, `price_unit`). Shown as "€ 4,50 per stuk" or "Prijs op aanvraag".
- **Brand assets:** Mailra monogram icons replace the v0 template favicons; a photographic share image with the brand font.
- **Images and fixes:** event photos renamed and recompressed (`public/images/werk/`), unused assets removed. Contrast and form-label fixes bring accessibility to 100.

**Update (post-launch):** the live domain briefly redirect-looped (`mailra.nl` ⇄ `www.mailra.nl`) because Vercel had `www` set as the Production domain while the app redirected `www → mailra.nl`. Fixed by making `mailra.nl` primary in Vercel. Deployment Protection was also blocking Googlebot (fine for a signed-in browser, 401 for a crawler) — now disabled. Sitemap is submitted and fetchable in Search Console.

**Still to do (owner):**
- Verify in **Bing Webmaster Tools** too (separate from Google) and submit `https://mailra.nl/sitemap.xml` there.
- Enter prices in the admin.
- Add a "Caftans" category in the admin.
- Fill in `siteConfig.social`.
- Over the next few weeks: watch Search Console's Coverage/Indexing report to confirm pages actually get indexed, and Core Web Vitals once it has enough field data (~28 days).

**Deliberately skipped for now:** product detail pages (§2.2), Phase 3 and Phase 4.

**Performance note:** on an unthrottled run the main content paints at about 0.13 s. The lab LCP of about 3 s comes from Lighthouse's slow-4G simulation charging the two preloaded fonts (~96 KB, mostly Fraunces with its optical-size axis). Trimming them would change the typography, so check real-user numbers in Vercel Speed Insights first.

---

## 1. Summary

The technical base is solid. Pages are static, there's one `<h1>` per page, titles and descriptions are unique, `lang="nl"`, robots and the sitemap work, admin and API routes are noindexed, and JSON-LD is present. Lighthouse SEO scores **100**, but that is only a basic checklist.

Three things hold the site back from ranking:

1. **Placeholder business data.** The phone number (`+31 6 1234 5678`), the WhatsApp number, the address (Amsterdam), the domain (`// TODO: confirm live domain`) and the social profiles are all placeholders. They also appear in the LocalBusiness schema. Local SEO can't work until they're real and match a Google Business Profile.
2. **Very little indexable content.** There are only 5 URLs plus a handful of category pages. Pages have 130–360 words, there are no product pages, and there are no pages for occasions, locations or inspiration. Google has very little to rank.
3. **A few metadata bugs.** They make every social share look like the homepage and point 404 pages at the homepage (details in §3).

| Area | State | Score |
|---|---|---|
| Crawlability / indexing | Good: static, robots, sitemap, noindex on admin | 8/10 |
| On-page metadata | Titles OK; OG/canonical inheritance bugs | 6/10 |
| Structured data | Present but based on placeholders; no Organization/WebSite/Product | 4/10 |
| Content depth / keyword coverage | Thin; no product, occasion or local pages | 2/10 |
| Local SEO (NAP, GBP, reviews) | Not started | 1/10 |
| Performance (mobile) | Perf 89–94, **LCP 3.1–3.7 s** (target < 2.5 s), CLS 0 | 7/10 |
| Accessibility (affects UX signals) | 91–100; contrast + unnamed selects | 8/10 |
| Off-page / authority | No profiles, citations or backlinks | 1/10 |

---

## 2. Measured results

**Rendered HTML per page**

| URL | `<title>` | Canonical | og:url / og:title | H1 | Words |
|---|---|---|---|---|---|
| `/` | Caftan by Mailra — Verhuur voor Bruiloften & Evenementen | `https://www.mailra.nl` | homepage | "Jouw feest, onze sfeer." (no keyword) | 358 |
| `/producten` | Meubilair, Styling en Decoratie Huren \| Caftan by Mailra | ✅ | ❌ homepage's | ✅ | 134 |
| `/over-ons` | **Over Caftan by Mailra \| Caftan by Mailra** (brand twice) | ✅ | ❌ homepage's | ✅ | 303 |
| `/contact` | Offerte Aanvragen \| Caftan by Mailra | ✅ | ❌ homepage's | ✅ | 263 |
| `/verhuurbeleid` | Verhuurbeleid \| Caftan by Mailra | ✅ | ❌ homepage's | ✅ | 672 |
| any 404 | homepage title | ❌ **homepage** | ❌ | ✅ | 107 |

**Lighthouse (mobile, local production build)**

| Page | Perf | A11y | BP | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 89 | 96 | 96 | 100 | **3.7 s** (hero image, 2.8 s load time) | 0 | 110 ms |
| `/producten` | 94 | 100 | 96 | 100 | **3.1 s** (h1, 2.6 s render delay) | 0 | 40 ms |
| `/contact` | 91 | 91 | 96 | 100 | **3.1 s** (lead text, 2.6 s render delay) | 0 | 190 ms |

The console errors are from `/_vercel/insights` 404-ing locally. They don't happen on Vercel.

---

## 3. Phase 1: technical fixes (1–2 days, no business input needed)

Each item lists the file and a done-when check.

### 1.1 Social metadata inherited from the homepage 🔴
`openGraph` and `twitter` are set only in `app/layout.tsx`. Next.js doesn't merge nested `openGraph` objects, so every page ships the homepage's `og:url`, `og:title` and `og:description`. Shares of `/producten` or a category look like the homepage.
**Fix:** add a `pageMetadata({ title, description, path, image? })` helper in `lib/seo.ts` that returns `title`, `description`, `alternates.canonical`, `openGraph` (url, title, description, images) and `twitter`. Use it in every page and in `generateMetadata`.
**Done when:** each page's `og:url` equals its canonical.

### 1.2 Canonical on 404 pages points at the homepage 🔴
`alternates: { canonical: "/" }` in the root layout is inherited by `not-found` (and by any future page that forgets its own canonical). 404 pages also carry both `noindex` and `index, follow` robots tags.
**Fix:** remove `alternates` from the root layout and set it in `app/page.tsx`. Remove the root `robots` block, since indexing is the default; keep only `googleBot.max-image-preview`. Give `not-found.tsx` `title: "Pagina niet gevonden"`.
**Done when:** a 404 has no canonical and a single `noindex`.

### 1.3 Titles and H1s
- `/over-ons` title → `{ absolute: "Over ons — Caftan by Mailra | Decoratie & meubilair verhuur" }`, or just `"Over ons"`.
- Homepage title leads with the brand, and the H1 is a slogan with no search terms. Change to:
  - title: `Bruiloft decoratie, stoelen & tafels huren | Caftan by Mailra`
  - H1: `Decoratie, stoelen en tafels huren voor uw bruiloft of feest`, with the tagline as the eyebrow (keep the visual style).
- Category title: `${name} huren voor bruiloft & feest` instead of `${name} Huren`.
- Keep titles ≤ 60 characters and descriptions 140–160 characters, and add a small unit test that fails on duplicates or overlength.

### 1.4 Semantic structure
- `<Header>` and `<Footer>` are rendered **inside `<main>`** on every page. Move them into a shared `app/(site)/layout.tsx` route group so `<main>` holds only page content. This also removes the duplicated `<Header/>`/`<Footer/>` in 6 files.
- Footer column labels are `<h3>` with no `<h2>` above them. Change them to `<p>` (or `<h2 class="sr-only">Footer</h2>` + h3).
- Home step titles use Title Case ("Neem Contact Op"). Dutch uses sentence case, and it reads more naturally in snippets.

### 1.5 Sitemap
- Add `lastModified` using `updated_at`, which already exists in the `products` and `categories` tables.
- Remove `priority` and `changefreq`, which Google ignores.
- Add product URLs (Phase 2) and an `images` array per entry (Next's sitemap supports it) so product photos get into Google Images.

### 1.6 Structured data (`app/layout.tsx` → `lib/seo.ts`)
- Split it into an **Organization** node (`logo`, `sameAs`), a **WebSite** node, and a **LocalBusiness** node, with `@id` links between them. Schema.org has no event-rental type, so `LocalBusiness` plus a clear `description` is the right choice.
- Replace the `openingHours` string with `openingHoursSpecification`.
- Set `image` to a real photo (the hero) rather than the text OG image.
- Add `logo`, `sameAs` (Instagram, Facebook, Pinterest, TikTok), `geo` and `streetAddress`/`postalCode` once they're known.
- Add `hasOfferCatalog` listing categories.
- **Only publish values that are true.** Hide `telephone` and `address` in schema while `siteConfig` still has placeholders, e.g. with an `isPlaceholder` flag.
- BreadcrumbList: add `Home` as position 1, and add breadcrumbs to `/over-ons`, `/contact` and `/verhuurbeleid`.
- FAQPage: keep it, but don't expect rich results. Since 2023 Google shows FAQ snippets only for government and health sites.
- Validate everything with Rich Results Test and validator.schema.org.

### 1.7 Remove noise
- Remove `keywords` from metadata. Google ignores it, and it tells competitors your targets.
- Product cards link to `/contact?product=…`, which creates crawlable parameter URLs. The canonical handles it, but once product pages exist (Phase 2) cards should link there and only the "Vraag beschikbaarheid" button should go to the form, with `rel="nofollow"`.

### 1.8 Images
- Rename `public/images/misc/misc (22).jpg` and similar files to descriptive slugs (`bruidstafel-bloemenboog.jpg`, `dinertafel-kaarslicht-rozen.jpg`, …). Spaces and parentheses in URLs are ugly, and filenames are a small image-search signal.
- Delete assets nothing references (check with grep first): `category-*.jpg`, `hero-event.jpg`, `team.jpg`, `placeholder*`, and unused `misc` shots. `logo.png` is 104 KB, so ship an SVG or a 2× PNG ≤ 10 KB.
- Pre-compress sources. `public/images` is 5.2 MB and single JPEGs are up to 720 KB. `next/image` resizes them, but smaller sources mean faster first optimisation and cheaper Vercel image usage.
- Product alt text is always `"{name} huren bij Mailra"`. Use the product's description or colour or material too, e.g. "Goudkleurige chiavari stoel met wit kussen".
- ~~`/media/products/...` caching~~: already correct. The current version is served `immutable` for a year; the 60 s rule only covers outdated URLs.
- Add a real **photographic OG image** (1200×630, event photo + logo), since the current one is text-only, and per-category OG images (`app/producten/[category]/opengraph-image.tsx` using the cover photo).

### 1.9 Performance / Core Web Vitals (target: LCP < 2.5 s on mobile)
- **Home LCP (hero image, 2.8 s load):** check that `hero.webp` (314 KB source) is served as AVIF at a reasonable width, set `quality={60}` on the hero, and make sure the mobile crop doesn't download a 1920 px image.
- **Text LCP render delay 2.6 s on `/producten` and `/contact`:** the page waits for the web fonts. Two fonts are preloaded (Fraunces 67 KB + Instrument Sans 30 KB). Options:
  - Preload only the display font used by the H1.
  - Subset Fraunces to the weights used.
  - Keep `adjustFontFallback` on (default) so fallback metrics match.
  - Try `display: "optional"` for the display font.
- Reduce JavaScript: 28 KB unused and 13 KB legacy polyfills. Add a modern `browserslist` and trim unused Radix/`components/ui` imports from client bundles.
- Confirm on real users with Vercel Speed Insights, which is field data, not lab data.

### 1.10 Accessibility fixes that also help engagement
- The WhatsApp button (white on `#25D366`) fails contrast. Use `#128C7E` or dark text.
- The two Radix `Select` triggers in the contact form have no accessible name. Link them with `aria-labelledby` to their labels.

### 1.11 Hosting and search engines
- Pick one host (`www.mailra.nl` or `mailra.nl`) and 301 the other in Vercel domains settings. Make sure `siteConfig.url` matches it.
- Add `verification: { google, other: { "msvalidate.01": … } }` to the root metadata, or verify via DNS. Submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools.
- Enable IndexNow (Bing/Yandex) on admin publish. Optional.

---

## 4. Phase 0: business inputs (blockers; needed from the owner)

These can't be done in code, but they matter most.

1. **Real NAP (name, address, phone)** in `lib/site-config.ts`: phone, WhatsApp number, email, and a real street address or service-area business setting. Use exactly the same spelling everywhere: site, Google Business Profile, KvK, directories.
2. **One brand name.** The site mixes "Caftan by Mailra" and "Mailra". Pick the primary name (probably the one on the GBP and the KvK registration) and use the other as `alternateName`.
3. **Do you still rent caftans?** The brand name and the About page say so, but there's no caftan category. If yes, "caftan huren" is a very specific, low-competition keyword, and it needs its own category and landing page. If no, remove "caftans" from the About copy.
4. **Prices.** Showing "vanaf €X" per product or category improves click-through and is needed for Product rich results. If prices stay hidden, product pages still help, but without price snippets.
5. **Social profiles** (Instagram, Facebook, Pinterest, TikTok) for `sameAs` and the footer.
6. **Photos:** 3–6 per product, plus event photos with location and occasion. This is the raw material for Phase 2.
7. **Reviews:** a list of past clients to ask for Google reviews.

---

## 5. Phase 2: content architecture (the biggest growth lever, 2–6 weeks)

### 2.1 Target site structure
```
/                                   home — "bruiloft decoratie huren"
/producten                          full collection
/producten/[categorie]              e.g. /producten/stoelen — "stoelen huren bruiloft"
/producten/[categorie]/[product]    NEW — e.g. /producten/stoelen/chiavari-stoel-goud
/gelegenheden/[slug]                NEW — occasion landing pages
/werkgebied/[stad]                  NEW — only where there are real events to show
/inspiratie                         NEW — portfolio + guides
/inspiratie/[slug]                  NEW — event cases + articles
/over-ons, /contact, /verhuurbeleid
```

### 2.2 Product detail pages (`app/producten/[category]/[product]/page.tsx`)
Product IDs are already slugs (`lib/db.ts` `uniqueId` → `slugify`), so URLs are ready.
- Unique H1 ("Chiavari stoel goud huren"), description of 80–200 words (editable in admin), specs (dimensions, capacity, colour, material, quantity available), a photo gallery, "vaak gecombineerd met" related products, a "Vraag beschikbaarheid" CTA with the product prefilled.
- `Product` JSON-LD (name, image[], description, brand, category). Add `offers` only if prices are published.
- BreadcrumbList Home → Producten → Stoelen → product.
- `generateStaticParams` + revalidate on admin save (existing `lib/admin/revalidate.ts`).
- Admin: add fields for long description, extra photos, optional SEO title and meta description, and alt text.

### 2.3 Better category pages
- 150–300 words of intro copy per category (the admin field already exists; add a longer "SEO text" field shown below the grid), plus 3–5 category-specific FAQs.
- Link to related occasions ("Stoelen voor een henna-avond").

### 2.4 Occasion landing pages (high intent, low competition)
The photos (bloemenboog, draperieën, sweet table) and the caftan angle point to the wedding, henna and nikah niche. Proposed pages, each with 400–800 words, real photos, a curated product selection, FAQs and a CTA:

| Page | Primary keyword | Secondary |
|---|---|---|
| `/gelegenheden/bruiloft` | bruiloft decoratie huren | bruiloft aankleding huren, trouwdecoratie huren |
| `/gelegenheden/henna-avond` | henna avond decoratie huren | henna decoratie, henna stoel huren |
| `/gelegenheden/nikah` | nikah decoratie | islamitische bruiloft decoratie |
| `/gelegenheden/verloving` | verloving decoratie huren | verlovingsfeest aankleding |
| `/gelegenheden/babyshower` | babyshower decoratie huren | gender reveal decoratie |
| `/gelegenheden/verjaardag` | feest decoratie huren | verjaardag aankleding |
| `/gelegenheden/zakelijk` | event meubilair huren | bedrijfsfeest aankleding |

Standalone product-type pages if search volume supports them: **bloemenboog huren**, **backdrop huren**, **sweet table huren**, **ceremonie stoelen huren**, **caftan huren** (if applicable).

Before writing, check volumes and difficulty in Google Keyword Planner, Ahrefs or Semrush, and look at who ranks now. Adjust the list to what the data shows.

### 2.5 Local pages (carefully)
`/werkgebied/amsterdam`, `/rotterdam`, `/den-haag`, `/utrecht` and similar. Only publish a city page if it has **unique** content: events actually done there, venues served, delivery cost and time from base. Near-identical city pages are treated as doorway pages and can hurt the whole site. Start with 2–4 cities and grow from there.

### 2.6 Inspiration and portfolio (`/inspiratie`)
- **Event cases:** "Henna-avond in Rotterdam: goud & bordeaux". Include 8–15 photos with good alt text, the items used (linked to product pages), venue and city. Aim for about 2 per month. They feed image search and Pinterest, and give internal links to products.
- **Guides:** answer questions people search for:
  - "Hoeveel stoelen en tafels heb ik nodig voor 100 gasten?" (with a small calculator)
  - "Checklist bruiloft styling"
  - "Kleurthema's voor een henna-avond"
  - "Zelf decoreren of laten stylen?"
  - "Wat kost bruiloft decoratie huren?"
- Use `Article` schema with author and date, and link each guide to 2–3 products or categories.

### 2.7 Internal linking rules
- Home links to top categories and occasions. Categories link to products and occasions. Products link to their category, related products and relevant occasions. Articles link to products.
- Add an "Gelegenheden" column to the footer.
- Use descriptive anchor text ("stoelen huren voor uw bruiloft"), not "klik hier" or "Bekijk collectie".

### 2.8 Tone
The site uses formal "u". The target audience (couples, family planning a henna night) usually searches and writes informally ("je"), and the source copy in `over ons.md` uses "jij". Consider switching to "je". It's a brand decision; decide once and apply everywhere.

---

## 6. Phase 3: local SEO and off-page (ongoing, starts in week 1)

1. **Google Business Profile.** This is the biggest single lever for "decoratie huren + stad" and map results.
   - Category: primary *Party equipment rental service*, secondary *Wedding service* / *Event planner*.
   - Set it up as a service-area business if there's no public showroom.
   - Add 20+ photos, products, weekly posts, Q&A, and hours that match the site.
2. **Reviews.** After every event, send a direct review link (WhatsApp works well). Target 25+ reviews in 6 months. Show them on the site; a curated testimonial block is fine. **Don't** add AggregateRating markup for your own business, because Google ignores self-serving review markup.
3. **Citations** with identical NAP:
   - KvK, Google, Apple Business Connect, Bing Places
   - Telefoonboek, Opendi, Yelp NL, Trustoo, Hotfrog
   - Wedding directories: ThePerfectWedding.nl, Bruiloft.nl leveranciersgids, Trouwen.nl, WeddingWire-type platforms
4. **Visual platforms.** Pinterest (boards per occasion and colour, linking to product and inspiration pages) and Instagram (link in bio to occasion pages). This is a highly visual niche, and Pinterest drives real traffic to it.
5. **Partnerships and backlinks.** Venues (zalen, feestlocaties), wedding planners, photographers, henna artists, caterers. Offer "aanbevolen leverancier" link swaps, and ask photographers for credit links on shared shoots.
6. **PR.** Styled shoots with photographers get featured on wedding blogs, which gives strong, relevant links.

---

## 7. Phase 4: measurement

- **Google Search Console:** verify, submit the sitemap, watch the Indexing and Core Web Vitals reports, and review queries monthly.
- **Conversion tracking:** WhatsApp clicks, `tel:` / `mailto:` clicks and form sends as Vercel Analytics custom events (`track("whatsapp_click", { page })`). The WhatsApp link is the "conversion", so without this there's no way to see which pages produce leads.
- **Rank tracking:** about 30 keywords from the tables above, split by city (Amsterdam, Rotterdam, Den Haag, Utrecht).
- **GBP Insights:** calls, route requests, website clicks.
- **Monthly review:** new content shipped, pages indexed, top queries, leads per page.
- **KPIs at 6 months:**
  - Indexed pages: 5 → 60+
  - Non-brand clicks per month: at least 10× baseline
  - Map pack top-3 for "decoratie huren [basisstad]"
  - Google reviews: at least 25

---

## 8. Roadmap

| Week | Work |
|---|---|
| 0 | Phase 0 inputs from owner; GSC + Bing verification; domain redirect; start GBP |
| 1 | Phase 1 fixes 1.1–1.7 (metadata helper, canonical/404, titles/H1, layout group, sitemap, schema) |
| 1–2 | 1.8–1.10 (images, CWV, a11y); conversion events |
| 2–3 | Product detail pages + admin fields; product copy for the top 20 products |
| 3–4 | Category copy + FAQs; first 3 occasion pages (bruiloft, henna-avond, nikah) |
| 5–8 | Remaining occasion pages; `/inspiratie` with 4 event cases + 2 guides; citations |
| 8+ | 2 inspiration posts/month; city pages where there's real material; reviews and backlinks ongoing |

## 9. Checklist for any new page
- [ ] Unique title (≤ 60 chars) and description (140–160) via `pageMetadata()`
- [ ] Self-canonical, and og:url equal to the canonical
- [ ] One H1 containing the primary keyword; logical H2/H3
- [ ] At least 300 words of useful, original copy (products at least 80)
- [ ] Real photos with descriptive filenames and alt text
- [ ] Breadcrumb (visible + JSON-LD) and the matching schema type
- [ ] At least 3 internal links in and out
- [ ] Included in the sitemap with `lastModified`
- [ ] LCP < 2.5 s and CLS < 0.1 on mobile
