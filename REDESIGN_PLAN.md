# Mailra — Redesign Plan
### "Stil Licht" · a quiet, luminous editorial identity for Caftan by Mailra

**Scope:** a complete visual redesign of the public website.
**Constraint:** the stack does not change and nothing stops working — same Next.js 16 / React 19 / Tailwind v4 / shadcn-ui / Vercel Postgres, same routes, same API contracts, same admin panel behaviour.
**Date:** 26 September 2026

---

## 0. The one-paragraph version

Today Mailra looks like a competent template: a dark-scrimmed stock hero, three rounded cards, a saturated green that fights every photograph on the site, and animation applied by the handful rather than by intent. The redesign replaces that with a warm, ivory, gallery-like editorial site built on **one verified colour system drawn from Mailra's own photography**, **two typefaces**, **a single fluid spatial rhythm**, and **motion that only ever does one thing: reveal**. Every shadcn semantic token keeps its exact name, so the 60+ UI components and the whole admin panel are re-skinned for free and keep functioning byte-for-byte. On top of that we add the SEO layer the site has never had — metadata base, Open Graph, sitemap, robots, JSON-LD LocalBusiness/Product/FAQ, and Dutch-language semantics — and cut ~40 MB of unserved image weight down to a real performance budget.

---

## 1. Where the site actually stands today

An honest audit, from the code and the assets — not impressions.

### 1.1 What is good and must be preserved
- Clean route structure: `/`, `/producten`, `/over-ons`, `/contact`, `/admin/*`.
- Server components reading from Postgres (`lib/db.ts`), with `getProducts(true)` / `getCategoriesWithProductCounts(true)` correctly filtering inactive items.
- A working admin CRUD surface over `/api/products`, `/api/categories`, `/api/auth/*`, protected by `middleware.ts` on the `admin_session` cookie.
- Dutch copy that has a real voice (from `over ons.md` and `beleid.md`) — currently underused.

### 1.2 Design problems
| # | Problem | Evidence |
|---|---|---|
| 1 | **The primary colour fights the photography.** `--primary: oklch(0.35 0.10 145)` is a saturated green. Sampling all 14 brand photos, the dominant colours cluster at hue **55–95° (amber/bronze/linen)** with chroma 0.01–0.12. The greens that *do* appear sit at chroma **0.006–0.015** — twenty times less saturated than the UI green. | Colour extraction, §3.1 |
| 2 | **Whitespace is uniform, not rhythmic.** Nearly every section is `py-24`. Nothing breathes differently, so nothing feels important. | `app/page.tsx`, `over-ons`, `contact` |
| 3 | **Motion is decorative, not communicative.** `animate-pulse-subtle` on static icons, `animate-float` on abstract blobs, `hover:scale-105` on nearly every button. Effects compete instead of cooperating. | `app/globals.css`, `app/page.tsx` |
| 4 | **The hero hides the product.** A `from-foreground/70 via-foreground/50 to-foreground/70` scrim darkens the entire image to make white text work — the one thing a rental company sells (how the room *looks*) is dimmed to 50%. | `app/page.tsx` hero |
| 5 | **Two type roles, three type jobs.** Instrument Serif carries display, DM Sans carries everything else, and nothing carries the wide-tracked caps voice that is literally in the logo ("STYLING & RENTALS"). | `app/layout.tsx` |
| 6 | **The product grid is a spec sheet.** Square crop, name, truncated description, dimensions, capacity, outline button — identical treatment for a €4 candle holder and a 200×220 backdrop. | `components/product-grid.tsx` |
| 7 | **The logo's own palette is unused.** The mark is champagne gold + sage leaf on white. The site uses neither. | `public/logo.png` |
| 8 | **Brand name is inconsistent.** The site says "Mailra"; the logo, `over ons.md` and `beleid.md` all say **"Caftan by Mailra"** with the tagline *"Jouw feest, onze sfeer."* | mixed |

### 1.3 Technical problems (all fixable inside "looks and feel")
| # | Problem | Evidence |
|---|---|---|
| 9 | **`images: { unoptimized: true }`** disables every Next.js image optimisation — no WebP/AVIF, no responsive `srcset`, no lazy sizing. | `next.config.mjs` |
| 10 | **42 MB of images in `public/`**, of which `images/misc/` alone is **38 MB** across 9 files (one is 8.2 MB), plus `about-us.jpg` at 2.7 MB / 6000×4000. | `du -sh public` |
| 11 | **No SEO layer at all**: no `metadataBase`, no `openGraph`, no `twitter`, no `sitemap.ts`, no `robots.ts`, no canonical URLs, no JSON-LD, `generator: 'v0.app'` still in metadata. | `app/layout.tsx` |
| 12 | **Sticky-offset magic numbers.** The products filter bar uses `top-[73px]`, the admin layout a `h-[72px]` spacer — both hard-code the header height. Any header change silently breaks both. | `producten/page.tsx`, `admin/layout.tsx` |
| 13 | **No `/verhuurbeleid` page** although the full rental policy exists in `beleid.md` — a missed trust signal *and* a missed long-tail SEO page. | repo root |
| 14 | **No dark-mode toggle** although `.dark` tokens and `next-themes` are installed. Dead weight, or an opportunity. | `globals.css` |

### 1.4 Known issues we will **not** fix (out of scope — flagging, not touching)
- **Both contact forms are simulated.** `components/contact-form.tsx` and `components/contact-page-form.tsx` `await new Promise(setTimeout, 1000)` and then show a success message. **No enquiry is ever sent or stored.** This is a business-critical bug, but it is logic, not looks — it needs a decision from you (see §14).
- Placeholder contact data throughout: `+31 6 1234 5678`, `info@mailra.nl`, `wa.me/31612345678`, "Amsterdam, Nederland".
- FAQ copy on `/contact` **contradicts `beleid.md`**: the page says 3-day minimum and 30% deposit; the policy says 24 hours and 50%. The redesign will render whatever copy you confirm — flagging so the wrong one isn't set in beautiful type.
- `lib/products.ts` static data is still the source for the admin dashboard counters while the rest of the site reads Postgres.

---

## 2. Research findings

### 2.1 What is actually winning awards in 2026
- **Spatial silence.** The prevailing high-end pattern (e.g. Carles Faus Arquitectura, Awwwards SOTD) is photography as structural element with whitespace as breathing room — not decoration layered on top of images. ([Elementor](https://elementor.com/blog/website-design-inspirations-to-define/))
- **Type as architecture.** Oversized editorial headlines carrying the layout, rather than headlines sitting inside boxes. ([Fireart](https://fireart.studio/blog/the-best-web-design-trends/), [Awwwards](https://www.awwwards.com/awwwards/collections/typography-in-web-design/))
- **Champagne neutrals + refined serif** is the current signature of "luxury without loudness" — and it is exactly the combination already sitting in Mailra's logo. ([Elementor](https://elementor.com/blog/website-design-inspirations-to-define/))
- **Selective adoption beats wholesale.** Trends work when a site picks two or three and commits. We commit to: spatial silence, editorial type, and scroll-driven reveal. ([nopanicdesign](https://www.nopanicdesign.com/blog/web-design-trends-2026-colors-fonts/))

### 2.2 The 2026 event/wedding colour direction
The market has moved **away from stark white and cool grey toward warm neutrals** — *champagne rather than white, sage rather than mint*. The dominant luxury palette is blush / ivory / champagne / soft sage / pale gold, and **champagne has overtaken bright gold as the accent metallic**. ([Paperlust](https://paperlust.co/blog/2026-wedding-color-palettes/), [37 Frames](https://37framesphotographyblog.com/luxury-wedding-color-palettes-2026/), [Curated Events](https://curatedevents.com/blog/perfect-color-palettes-for-high-end-wedding-rentals-in-2025/))

**This is not a trend we are chasing — it is where Mailra's logo and photography already are.** That convergence is the whole basis of the palette in §3.1.

### 2.3 Platform capability, mid-2026
- **CSS scroll-driven animations** (`animation-timeline: view()` / `scroll()`) are at ~84% global support: Chrome/Edge 115+, Safari 18+ (stable and bug-fixed by 26.5). **Firefox stable is still behind a flag as of 152.** ([frontendhorizon](https://www.frontendhorizon.com/blog/view-transitions-api-and-css-scroll-driven-animations-the-browser-wins-of-2026), [Mintec](https://mintec.co/blog/scroll-driven-view-transitions-css-2026/))
  → **Decision: use them, always behind `@supports (animation-timeline: view())`, with the un-animated state being the finished, correct design.** No JavaScript, no IntersectionObserver, no layout thrash. Firefox users get a beautiful static site, not a broken one.
- **Next.js 16 SEO** is file-convention based: `metadataBase` + title template in the root layout, `sitemap.ts` and `robots.ts` generated programmatically from the database so they can never drift, JSON-LD inlined per route. ([Webkul](https://webkul.com/blog/next-js-16-seo-best-practices/), [Next.js Launchpad](https://nextjslaunchpad.com/article/nextjs-seo-metadata-api-sitemaps-json-ld-og-images))

### 2.4 Dutch competitive/SEO landscape
Direct competitors (Brisked, Feline Styling, Velvet Green Rentals, Save the Date, InStyle Styling, By Dorine) rank on **long-tail, region-qualified Dutch phrases**, not on brand terms:
`bruiloft aankleding huren` · `decoratie verhuur bruiloft` · `bruiloft meubilair huren` · `tafeldecoratie huren` · `stylingverhuur [regio]` · `chiavari stoelen huren` · `backdrop huren bruiloft` · `bruiloftstyling huren`
([ThePerfectWedding](https://www.theperfectwedding.nl/blog/2703/huren-bruiloft), [Save the Date](https://www.savethedateweddings.nl/verhuur), [Brisked](https://www.brisked.nl/))

Mailra currently targets **none** of these. Its `<h1>`s are *"Maak uw evenement onvergetelijk"*, *"Onze Producten"*, *"Over Mailra"*, *"Contact"* — zero keyword surface. §10 fixes this without making the copy read like SEO copy.

---

## 3. The design system

> **The compatibility rule that governs everything below:** every existing shadcn semantic token keeps its **exact variable name** — `--background`, `--foreground`, `--card`, `--primary`, `--muted-foreground`, `--border`, `--ring`, `--sidebar-*`, `--radius`, and all `--chart-*`. We **redefine their values**; we never rename them. Result: all 60+ files in `components/ui/`, every admin screen, every form, every dialog and toast re-skins automatically and keeps working. New brand tokens are *added alongside*, never *instead of*.

### 3.1 Colour — derived, then verified

Sampling the dominant 3 colours of all 14 brand photographs gives a single, unambiguous read:

| Source | Dominant hues (OKLCH) | Chroma range |
|---|---|---|
| 9 × `images/misc/*` | 49–157°, clustered **55–90°** | 0.006 – 0.115 |
| `hero-event`, `about-us`, 3 × category | 51–99° | 0.013 – 0.073 |

**Conclusion:** Mailra's world is warm — amber, bronze, linen, candlelight — with green appearing only as a near-neutral botanical whisper. The palette follows the photography, and the logo confirms it.

#### The tokens

```css
/* ── Surfaces: warm ivory, never cold white ───────────────── */
--canvas    : oklch(0.983 0.006 85);   /* #FBF9F5  page */
--surface   : oklch(0.997 0.002 85);   /* #FFFEFD  cards, raised */
--linen     : oklch(0.958 0.012 85);   /* #F5F1E8  alternating band */
--sand      : oklch(0.928 0.018 84);   /* #EDE6DA  inputs, quiet chips */
--hairline  : oklch(0.895 0.012 85);   /* #E0DCD4  1px rules */

/* ── Ink: warm near-black, never pure #000 ────────────────── */
--ink       : oklch(0.215 0.018 66);   /* #1F1811  headings, body */
--ink-70    : oklch(0.455 0.020 66);   /* #5F554B  secondary */
--ink-55    : oklch(0.520 0.018 68);   /* #70675E  tertiary */

/* ── Brand ────────────────────────────────────────────────── */
--gold      : oklch(0.760 0.090 82);   /* #CEAC6D  champagne — DECORATIVE ONLY */
--gold-ink  : oklch(0.470 0.075 68);   /* #775229  bronze — accent TEXT + focus */
--sage      : oklch(0.620 0.035 140);  /* #7B8C78  botanical, large/decorative */
--olive-ink : oklch(0.300 0.028 135);  /* #283123  primary action, dark panels */
--olive-deep: oklch(0.240 0.024 135);  /* #1A2216  deep sections, footer */
```

#### Verified contrast — computed, not estimated

| Pair | Ratio | Verdict |
|---|---|---|
| `ink` on `canvas` | **16.68** | AAA |
| `ink-70` on `canvas` | **6.92** | AAA (small text) |
| `ink-55` on `canvas` | **5.27** | AA |
| `ink-55` on `linen` | **4.91** | AA |
| `ink-55` on `sand` | **4.47** | ✗ **fails** — see rule below |
| `ink-70` on `sand` | **5.86** | AA |
| `gold-ink` on `canvas` | **6.61** | AAA (small text) |
| `gold-ink` on `sand` | **5.60** | AA |
| `gold` on `canvas` | **2.05** | ✗ never text |
| `canvas` on `olive-ink` (primary button) | **12.85** | AAA |
| `canvas` on `olive-deep` (footer) | **15.55** | AAA |
| `gold` on `olive-deep` (footer accent) | **7.59** | AAA |
| `sage` on `olive-deep` | **4.57** | AA |
| `gold-ink` focus ring on `canvas` | **6.61** | ≫ 3:1 non-text ✓ |

**Three hard rules, enforceable in review:**
1. **`--gold` is never text.** It is hairlines, underlines, dividers, icon strokes, the ring around a number, and text *only* on `olive-deep`/`olive-ink`. Accent text on light is always `--gold-ink`.
2. **On `--sand`, the lightest permitted text is `--ink-70`.** (`ink-55` fails there at 4.47.)
3. **Focus is always `--gold-ink`**, 2px, with a 2px `--canvas` offset. Never removed, never `--gold`.

#### Mapping onto the existing shadcn names (no renames)

| shadcn token | new value | rationale |
|---|---|---|
| `--background` | `--canvas` | warm ivory page |
| `--foreground` | `--ink` | warm near-black |
| `--card` / `--popover` | `--surface` | raised = brighter, not shadowed |
| `--primary` | `--olive-ink` | brand-rooted deep olive; 12.85:1 with its foreground |
| `--primary-foreground` | `--canvas` | |
| `--secondary` / `--muted` | `--linen` | |
| `--secondary-foreground` / `--muted-foreground` | `--ink-70` | ← **raised** from today's `oklch(0.50…)`; fixes several sub-AA labels |
| `--accent` | `--sand` | hover fills stay neutral so gold never becomes a background |
| `--accent-foreground` | `--ink` | |
| `--border` | `--hairline` | |
| `--input` | `--sand` | |
| `--ring` | `--gold-ink` | the single focus colour |
| `--destructive` | unchanged | admin depends on it |
| `--sidebar-*` | linen/ink/olive set | admin sidebar inherits the new skin |
| `--chart-1…5` | gold → bronze → sage → olive → ink-70 | one warm sequential ramp |

**Dark mode:** the `.dark` block is rewritten to a *warm* dark (`olive-deep` canvas, `linen` ink, `gold` accent) rather than today's neutral grey. It stays available for `next-themes` but **ships toggle-less** — the light design is the design. (Toggle is a one-line addition later if you want it.)

### 3.2 Typography

**Recommendation: Fraunces (display) + Instrument Sans (text).** Both are on Google Fonts, both are variable — two font files total for the entire site.

- **Fraunces** — a variable old-style serif with `opsz`, `SOFT` and `WONK` axes. At `opsz: 144, wght: 300, SOFT: 0, WONK: 0` it renders as a high-contrast, warm, slightly calligraphic display face that is a near-sibling of the "Mailra" wordmark in the logo — refined, not quirky. Its optical-size axis means a 120px headline and a 28px subhead are genuinely *different drawings*, not one outline scaled. That is the detail that separates award sites from good ones.
- **Instrument Sans** — variable, geometric-humanist, exceptionally clean at 14–18px, with a wide-tracked uppercase that reproduces the logo's "STYLING & RENTALS" voice exactly.
- *Lower-risk alternate if you prefer:* keep **Instrument Serif + DM Sans** — the system below works unchanged with either pair.

```ts
// app/layout.tsx
const display = Fraunces({ subsets:['latin'], axes:['SOFT','WONK','opsz'], variable:'--font-display', display:'swap' })
const sans    = Instrument_Sans({ subsets:['latin'], variable:'--font-sans', display:'swap' })
```
*(Axis names are verified at implementation against `next/font`; if `axes` rejects a name we drop to `Fraunces({subsets:['latin']})` and set `font-variation-settings` in CSS. Either way the type scale is untouched.)*

#### The four voices — and only four

| Voice | Family | Treatment |
|---|---|---|
| **Display** | Fraunces | `wght 300`, `opsz 144`, `letter-spacing: -0.02em`, `line-height: 0.95–1.05`, `text-wrap: balance` |
| **Body** | Instrument Sans | `wght 400`, `17px`, `line-height: 1.7`, `max-width: 65ch` |
| **Eyebrow** | Instrument Sans | `12px`, `wght 500`, `uppercase`, `letter-spacing: 0.22em`, colour `--gold-ink` |
| **Quote** | Fraunces *italic* | `wght 300`, used exactly once per page, maximum |

#### Fluid scale — computed for a 390 → 1440 px viewport

| Token | `clamp()` | 390px | 1440px |
|---|---|---|---|
| `--fs-display-1` | `clamp(3.25rem, 1.671rem + 6.48vw, 7.5rem)` | 52 | 120 |
| `--fs-display-2` | `clamp(2.5rem, 1.664rem + 3.43vw, 4.75rem)` | 40 | 76 |
| `--fs-h2` | `clamp(2rem, 1.536rem + 1.9vw, 3.25rem)` | 32 | 52 |
| `--fs-h3` | `clamp(1.375rem, 1.236rem + 0.571vw, 1.75rem)` | 22 | 28 |
| `--fs-lead` | `clamp(1.125rem, 1.055rem + 0.286vw, 1.312rem)` | 18 | 21 |
| `--fs-body` | `1.0625rem` | 17 | 17 |
| `--fs-small` | `0.875rem` | 14 | 14 |
| `--fs-eyebrow` | `0.75rem` | 12 | 12 |

**Typographic rules:** one display size per viewport per page. Never two `display-1`s. `text-wrap: balance` on every heading, `text-wrap: pretty` on every paragraph. No heading is ever centred *and* full-width — centred headings cap at `28ch`.

### 3.3 Space — one rhythm, deliberately uneven

Base unit **8px**. Everything is a multiple. But the *section* rhythm is intentionally varied, because uniform `py-24` is what makes today's site feel flat.

| Token | `clamp()` | 390px | 1440px | Used for |
|---|---|---|---|---|
| `--space-section` | `clamp(4.5rem, 2.086rem + 9.9vw, 11rem)` | 72 | 176 | standard section |
| `--space-section-lg` | `calc(var(--space-section) * 1.5)` | 108 | 264 | the two "hero moment" sections |
| `--space-section-sm` | `calc(var(--space-section) * 0.6)` | 43 | 106 | tight pairs that belong together |
| `--gutter` | `clamp(1.5rem, 0.943rem + 2.29vw, 3rem)` | 24 | 48 | page side padding |
| `--gap-grid` | `clamp(1.5rem, 1.129rem + 1.52vw, 2.5rem)` | 24 | 40 | grid gaps |

**Layout containers** (replacing the single `max-w-7xl` everywhere):

| Container | Width | For |
|---|---|---|
| `.u-wide` | `min(100% - 2*var(--gutter), 88rem)` | 1408px — galleries, full grids |
| `.u-page` | `min(100% - 2*var(--gutter), 75rem)` | 1200px — default |
| `.u-text` | `min(100% - 2*var(--gutter), 42rem)` | 672px — running prose |
| `.u-bleed` | `100vw` via a 12-col grid escape | edge-to-edge imagery |

**The whitespace doctrine — how we actually get "spacious":**
1. Whitespace goes **around the focal element, asymmetrically**. A 7/5 or 8/4 column split with the short side empty reads as confident; a centred block with big padding reads as an empty box.
2. **Left-aligned by default.** Centring is reserved for exactly two moments per page.
3. **One idea per screen.** If a section has three headings, it is three sections.
4. **The grid is 12 columns and visible in the rhythm** — every section starts on a column line, so the eye finds an invisible order.

### 3.4 Form — shape, line, depth

- **Radius rewritten.** `--radius: 0.5rem` becomes a **two-value system**: `--radius: 2px` for controls (inputs, buttons, chips — near-square reads editorial and expensive) and `--radius-image: 0` for photography, with **one signature exception**: the **arch**. Hero and portfolio images use a top-arch mask (`border-radius: 50vw 50vw 2px 2px`) — the shape of a doorway, a backdrop, a floral arbour. It is the site's one memorable form, used three times total and never more.
  *(Because shadcn derives `--radius-sm/md/lg/xl` from `--radius`, changing the one value re-shapes every UI component coherently, admin included.)*
- **Depth is drawn, not blurred.** Almost no box-shadows. Separation comes from the ivory ladder — `linen` band, `surface` card on it, `hairline` rule between. Shadows appear only on genuinely floating things (dropdowns, dialogs, the mobile menu) as `0 1px 2px rgb(31 24 17 / .04), 0 12px 32px -12px rgb(31 24 17 / .12)` — warm-tinted, never neutral grey.
- **The hairline is a brand asset.** A 1px `--gold` rule at 40% opacity under eyebrows, between list rows, above the footer. Cheap, distinctive, everywhere.

### 3.5 Motion — one verb: *reveal*

**Delete** from `globals.css`: `animate-pulse-subtle`, `animate-float`, `animate-slide-in-right`, `subtleZoom`, and every `hover:scale-105`.

**Replace** with a three-part system:

1. **Entrance — CSS scroll-driven, zero JS.**
```css
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .u-reveal {
      animation: reveal linear both;
      animation-timeline: view();
      animation-range: entry 8% cover 34%;
    }
  }
}
@keyframes reveal { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:none } }
```
Only `opacity` and `transform` → compositor thread → never drops a frame. No `animation-delay` staircases (today's `style={{animationDelay:'0.9s'}}` pattern is deleted); stagger comes from elements genuinely entering the viewport at different moments, which is what makes it feel real.

2. **Parallax — also scroll-driven.** Hero and section images drift `translateY(-6%)` across their own `view()` range. Six percent. Not sixteen.

3. **Interaction — 160ms, one property.**
   - Links: a `--gold` underline growing `scaleX(0 → 1)` from the left.
   - Buttons: background darkens one step. No scale, no shadow bloom, no glow.
   - Product cards: image `scale(1.03)` over 600ms `cubic-bezier(.16,1,.3,1)`, caption unmoved.
   - `View Transitions` (`view-transition-name`) on product-card → contact navigation, behind `@supports`.

**Every animation is progressive enhancement.** With `@supports` false, or `prefers-reduced-motion: reduce`, the page renders in its *final* state — correct, complete, beautiful. Today's `animate-fade-in-up` sets `opacity: 0` unconditionally, which means **any JS/CSS failure leaves the homepage blank**. That risk is removed.

---

## 4. Imagery & generated assets

### 4.1 What I can and cannot produce — stated plainly

**I cannot generate photographs.** There is no image-generation model in this environment, and AI-generated event photos would in any case be the wrong call for a rental company whose entire proposition is *"this is the actual chair you will get."*

**I can, and will, generate:**

| Asset | How | Why it matters |
|---|---|---|
| **Optimised derivatives of every existing photo** | Pillow (WebP + AVIF verified available) → 3 widths each (640/1280/1920), quality-tuned | 42 MB → target **< 3 MB** shipped |
| **`blurDataURL` for every image** | 12×12 downsample → base64, emitted to a generated `lib/image-blur.ts` | Eliminates layout pop; real LCP/CLS gain |
| **Art-directed crops** | Pillow, entropy-weighted | Portrait 4:5 for category cards, 3:2 editorial, 1:1 product — instead of one square crop fitting nothing |
| **Open Graph image** | Next.js `ImageResponse` at `app/opengraph-image.tsx` — a genuinely *generated* 1200×630 in the new type and palette | Every WhatsApp/LinkedIn share currently previews nothing |
| **SVG botanical line-art set** | Hand-authored SVG echoing the logo's olive sprig | Section dividers, the 404, the quote mark — brand texture with ~2 KB total |
| **SVG paper grain** | `feTurbulence` at 3% opacity as a CSS `background-image` | Keeps large ivory areas from looking like unpainted drywall. **The single most effective "expensive" trick there is.** |
| **Monogram + favicon set** | SVG "M" in Fraunces inside the logo's gold ring; `icon.svg`, 32/180/512 PNG | Today's favicon set is generic |
| **Arch mask + gradient scrims** | CSS/SVG | The signature shape |

### 4.2 Photography direction (for whatever you shoot or license next)
Warm daylight or candlelight only — the sampled palette *is* the brief. Shoot at least one **horizontal, bright, uncluttered** hero where the setup fills the frame and the top-left third is quiet enough for type without a scrim. Prefer detail macros (a fold of linen, a glass, a candle) over wide room shots for section breaks — intimacy reads as craft.

### 4.3 Handling of what exists
- `images/misc/` (38 MB, mixed provenance, several clearly stock/AI) → **not deleted**, but excluded from the shipped build; the 4 usable ones are processed into the portfolio strip at web weight.
- `about-us.jpg` (6000×4000, the best real photograph on the site) → becomes the Over-ons hero, art-directed at three widths.
- `hero-event.jpg` → demoted from hero to a section image; too obviously synthetic to carry the front door.
- **`next.config.mjs`: `images.unoptimized` → removed.** This alone restores AVIF/WebP negotiation and responsive `srcset` across the whole site.

---

## 5. Page-by-page blueprint

### 5.1 Home — `/`
The current page is hero → stats → 3 cards → text+image → contact. The new page is a **scroll narrative** where each section answers the next question a visitor actually has.

| # | Section | Design |
|---|---|---|
| 1 | **Hero** | Full-bleed photograph, **no dark scrim**. Type sits in the quiet upper-left third on a 7/5 grid; legibility from a 0→45% `olive-deep` gradient in *that corner only*, so the room stays lit. `display-1` in Fraunces: **"Jouw feest, onze sfeer."** — the brand's own line, finally used. Below: one `lead` sentence and two actions (`Bekijk de collectie` solid olive / `Vraag een offerte` ghost with gold underline). Bottom-left: a thin gold rule and a scroll cue. **Arch mask** on the image bottom. |
| 2 | **Marquee proof** | A single slow horizontal line of service words (`Bruiloften · Feesten · Styling · Bezorging door heel Nederland ·`) in wide-tracked caps between two gold hairlines. Replaces the invented "50+ / 100% / 100%" stats, which are not credible and not verifiable. |
| 3 | **Collectie** | Categories, **asymmetric**: one tall 4:5 portrait spanning two rows beside two 3:2 landscapes. Live product counts from the DB ("14 items"). Caption *below* the image on ivory — never a gradient-scrimmed overlay. Hover: image `scale(1.03)`, a gold rule draws under the name. |
| 4 | **Zo werkt het** | The 4-step process moved here from `/over-ons` — it is the top pre-enquiry objection. Numbers set in Fraunces `display-2` at 12% opacity behind each step, a gold hairline connecting them. |
| 5 | **Quote** | One sentence from `over ons.md` in Fraunces italic on a `linen` band, `u-text` width, enormous breathing room, a small SVG sprig above. The page's emotional pause. |
| 6 | **Sfeerbeeld** | Full-bleed 3-image editorial strip from the real photography, scroll-parallax. |
| 7 | **Contact** | A `olive-deep` panel — the page's only dark moment, arriving as a resolution. Left: phone / mail / WhatsApp / hours as large tappable rows with gold hairlines. Right: the form on `surface`. Gold text on olive-deep verified at 7.59:1. |

### 5.2 Producten — `/producten`
- **Header becomes a real page opener**: eyebrow `VERHUUR`, `display-2` *"Meubilair, styling en decoratie huren"* (keyword-bearing and human), one lead line, `u-page`.
- **Filter bar**: `position: sticky` with `top: var(--header-h)` — a real token replacing `top-[73px]`. Pills become wide-tracked caps text links with a gold underline on the active one. Product count shown per filter.
- **Grid**: 4:5 portrait crops on a 2/3/4-column responsive grid with `--gap-grid`. Card = image, name in `h3`, one metadata line (`120 cm ø · 8 personen`) in `small`/`ink-70`. **The per-card outline button is removed** — the whole card is the link, which removes 30+ competing buttons from the page and is what makes a grid feel like a gallery.
- **Empty state** gets designed instead of being one grey sentence.
- **Skeleton** rebuilt in `linen` at the real aspect ratio, so nothing shifts.
- **CTA band** reworked to olive-deep with the arch motif.

### 5.3 Over ons — `/over-ons`
- Hero: `about-us.jpg` full-bleed with an arch mask, headline overlapping the image's lower edge by 80px — the one deliberate overlap on the site.
- Story: `u-text`, the real copy from `over ons.md`, with **a pull-quote in Fraunces italic** breaking the column.
- Values: three columns, **numbered not iconed** (`01 / 02 / 03` in Fraunces), gold hairlines between. Removes three more generic lucide circles.
- Werkgebied: the `nl.svg` map kept, restyled — `sand` landmass, `gold` pins, `linen` ground — beside region chips in wide-tracked caps. (The map component's logic is untouched.)
- **New: "Zo werkt het" is removed here** (promoted to Home) and replaced by a short **"Goed om te weten"** block linking to the new `/verhuurbeleid`.

### 5.4 Contact — `/contact`
- Two-column from the top: form left (**primary, above the fold**), channels right. Today the form is the third thing you meet.
- The four info cards become **four hairline-separated rows** — no boxes, no icon circles. More elegant, and they stop looking like buttons.
- WhatsApp keeps its `#25D366` (recognisability beats palette purity) but as a flat pill with no scale-hover.
- **FAQ becomes a real `<Accordion>`** (shadcn, already installed) — and is the anchor for FAQPage JSON-LD (§10).

### 5.5 New: Verhuurbeleid — `/verhuurbeleid`
`beleid.md` rendered as a proper long-form page: `u-text`, numbered sections, sticky table of contents on desktop, gold section rules. **Costs one page, buys a trust signal, a legal surface, footer link equity, and a long-tail SEO page** (`borg`, `annulering`, `bezorgkosten`, `huurperiode`).

### 5.6 New: `not-found.tsx`
Fraunces `display-1` "404", an SVG sprig, one line of copy, two links. Currently the site falls back to the unstyled Next.js default.

### 5.7 Header & Footer
- **Header**: transparent over the hero, then on scroll acquires `--canvas` at 88% + `backdrop-blur` + a gold hairline — via scroll-driven CSS, **no scroll listener**. Height exposed as `--header-h` (a token, killing both magic numbers). Logo, four wide-tracked caps links with gold underline-on-hover, one solid CTA.
- **Mobile menu**: the existing full-screen pattern is good and is kept — restyled to `linen`, staggered Fraunces items, and given `aria-expanded`, `aria-controls`, focus trap and Escape-to-close, which it currently lacks.
- **Footer**: `olive-deep`, four columns → brand + tagline, navigation, categories (**live from the DB**), contact. Gold hairline above, wide-tracked caps headings, and a bottom row with the KvK/BTW line and the `/verhuurbeleid` link.

---

## 6. Component inventory

**New** — `components/site/`: `section.tsx` (rhythm + reveal wrapper), `container.tsx`, `eyebrow.tsx`, `display-heading.tsx`, `hairline.tsx`, `arch-image.tsx`, `marquee.tsx`, `sprig.tsx`, `reveal.tsx`, `stat-row.tsx`, `process-steps.tsx`, `pull-quote.tsx`, `toc.tsx`.

**Restyled, logic untouched** — `header`, `footer`, `product-grid`, `category-filter`, `contact-form`, `contact-page-form`, `netherlands-map`, `portfolio-inspiration`.

**Token-only (zero file edits)** — all 60+ `components/ui/*`. They inherit through the CSS variables. This is the whole point of the naming rule in §3.

**Deleted** — nothing. `portfolio-inspiration.tsx` stays (still commented out on Home) so no behaviour is lost.

---

## 7. The admin panel — the hard guarantee

The admin panel is how Mailra runs the business. It **will keep working**, and here is the mechanism, not just the promise.

**Untouched, not one character:**
```
app/api/**                 all 11 route handlers
lib/db.ts                  all queries
middleware.ts              auth gate
scripts/*.ts               init-db, create-admin, migrate-add-active
app/admin/login|forgot-password|reset-password/page.tsx   (auth flows)
```

**Changes only through CSS variables** (no JSX edits): every `components/ui/*` control inside the admin — buttons, inputs, tables, dialogs, toasts, selects, switches.

**Minimal, surgical JSX edits, behaviour preserved:**
| File | Edit | Guarantee |
|---|---|---|
| `app/admin/layout.tsx` | `h-[72px]` → `h-[var(--header-h)]` | same rendered height |
| `components/admin-sidebar.tsx` | class names only | every `href`, `onClick`, `handleLogout`, `isActive` identical |
| `app/admin/page.tsx` | card styling only | counters untouched |
| `app/admin/products/page.tsx` | class names only | **all 6 `fetch()` calls, states, handlers byte-identical** |
| `app/admin/categories/page.tsx` | class names only | **all 5 `fetch()` calls byte-identical** |
| `components/admin/product-form.tsx` | class names only | category fetch, base64 upload, validation untouched |
| `components/admin/product-table.tsx` | class names only | selection, bulk delete, toggle-active untouched |

**Verification gate — the redesign is not "done" until all of this passes by hand:**
`login → dashboard → create product → edit → upload image → toggle active → verify it disappears from /producten → bulk-select → delete → create category → toggle category → verify empty categories hide on /producten → forgot-password → reset-password → logout → verify /admin redirects to /admin/login`.

Plus: `git diff` is reviewed for **any** change inside `app/api/`, `lib/db.ts`, `middleware.ts`, or any `fetch(` line. A non-empty result is a bug, not a feature.

**Note:** the admin is deliberately given the *restrained* end of the new system — linen surfaces, hairlines, near-square controls, no arches, no reveals. A CMS should feel fast and quiet, not theatrical.

---

## 8. Accessibility

Not a checklist at the end — three of the decisions above *are* the accessibility work.

- Every palette pair in §3.1 is **computed**, and the three that fail are named with their replacement rule.
- `--muted-foreground` rises from `oklch(0.50…)` to `oklch(0.455…)`, fixing several currently-sub-AA labels across the *whole* site including the admin.
- Motion is `@supports` + `prefers-reduced-motion` gated, and the un-animated state is the finished state — the opposite of today's `opacity: 0` default.
- Focus is a single, always-visible 2px `--gold-ink` ring at 6.61:1.
- The mobile menu gains `aria-expanded` / `aria-controls` / focus trap / Escape.
- Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`), one `<h1>` per page, no heading-level skips, a skip-to-content link.
- Every decorative SVG `aria-hidden`; every photo a real Dutch `alt` (today's `alt="Mailra Logo"`, `alt="Stoelen"` are close to useless).
- Targets ≥ 44×44 px. Forms: real `<label>`, `aria-describedby` errors, `aria-live` on submit states.

**Target: Lighthouse Accessibility 100, and zero axe violations on all six pages.**

---

## 9. Performance budget

| Metric | Now (est.) | Target |
|---|---|---|
| Homepage images transferred | ~0.5 MB unoptimised JPEG | **< 250 KB** AVIF/WebP |
| `public/` shipped weight | 42 MB | **< 3 MB** |
| Fonts | 2 families, static | **2 variable files, `display: swap`, preloaded** |
| Animation JS | inline delays + hover handlers | **0 bytes** (CSS only) |
| LCP (mobile 4G) | — | **< 2.0 s** |
| CLS | image pop, no blur | **< 0.02** (blurDataURL + fixed aspect) |
| Lighthouse Perf / A11y / BP / SEO | — | **95+ / 100 / 100 / 100** |

Levers: remove `images.unoptimized`; three widths per image; `priority` on exactly one LCP image; `loading="lazy"` + `decoding="async"` everywhere else; `sizes` on every `fill` image; zero animation JS; two font files.

---

## 10. SEO — the largest untapped win on this project

The site currently has **no** `metadataBase`, `openGraph`, `sitemap`, `robots`, canonical, or structured data, and still declares `generator: 'v0.app'`.

### 10.1 Technical foundation
- **Root layout**: `metadataBase: new URL('https://www.mailra.nl')`, `title: { default, template: '%s | Caftan by Mailra' }`, `openGraph` (locale `nl_NL`, type `website`, the generated OG image), `twitter: summary_large_image`, `alternates.canonical`, `robots` directives. `generator` removed.
- **`app/sitemap.ts`** — generated from Postgres so category URLs can never drift from reality.
- **`app/robots.ts`** — allow all, **disallow `/admin` and `/api`**, point to the sitemap. (Right now the admin panel is crawlable.)
- **`app/opengraph-image.tsx`** — real generated 1200×630 via `ImageResponse`.
- **`lang="nl"`** already correct; add `<html>` `dir`, geo meta, and `manifest.ts`.

### 10.2 Structured data (JSON-LD)
| Schema | Where | Rich result |
|---|---|---|
| `LocalBusiness` + `areaServed` | root layout | Knowledge panel, local pack |
| `ItemList` / `Product` (`offers.availability`, no price) | `/producten` | Product carousels |
| `BreadcrumbList` | every sub-page | Breadcrumb trail |
| `FAQPage` | `/contact` accordion | **FAQ rich snippet — the highest-CTR win available here** |
| `Organization` + `logo` + `sameAs` | root | Brand panel |

### 10.3 On-page semantics — keywords without SEO-voice
| Page | `<h1>` now | `<h1>` after |
|---|---|---|
| `/` | "Maak uw evenement onvergetelijk" | **"Jouw feest, onze sfeer."** + H2 *"Meubilair, styling en decoratie huren voor bruiloften en feesten"* |
| `/producten` | "Onze Producten" | **"Meubilair, styling en decoratie huren"** |
| `/over-ons` | "Over Mailra" | **"Over Caftan by Mailra — styling en verhuur voor bruiloften"** |
| `/contact` | "Contact" | **"Offerte aanvragen voor bruiloft- of feestverhuur"** |
| `/verhuurbeleid` | — | **"Verhuurbeleid — huurperiode, borg, bezorging en annulering"** |

Category filters get real H2s (`Stoelen huren`, `Tafels huren`, `Decoratie huren`), product names get keyword-bearing alts, and the footer carries a region line. **Title/description written per page**, all within Google's pixel limits.

### 10.4 Content opportunities (flagged, not built)
Ranked by effort-to-value: per-category landing pages (`/producten/stoelen`) → per-product pages with `Product` schema → 3–5 region pages (`bruiloft aankleding huren Amsterdam`) → a small inspiration/blog surface using the real photography. Each is a follow-up project; the design system built here supports all of them without new components.

---

## 11. Implementation phases

Each phase ends green (`next build` passes, site renders, **admin verified**). Each is one commit on `claude/adoring-pascal-hvovsw`.

| Phase | Work | Files |
|---|---|---|
| **1 · Foundation** | Rewrite `globals.css`: new token values on existing names, brand tokens, fluid scales, `@theme inline` wiring, motion primitives. Fonts in `layout.tsx`. Remove `images.unoptimized`. | `app/globals.css`, `app/layout.tsx`, `next.config.mjs` |
| **2 · Assets** | Pillow pipeline → AVIF/WebP at 3 widths + `blurDataURL` map; SVG sprigs, grain, monogram, favicons; OG image route. | `scripts/optimize-images.ts`, `public/`, `lib/image-blur.ts`, `app/opengraph-image.tsx` |
| **3 · Primitives** | `components/site/*` — the 13 new components. | new |
| **4 · Chrome** | Header (`--header-h`, scroll-driven, a11y'd mobile menu) + Footer. | `components/header.tsx`, `footer.tsx` |
| **5 · Home** | All 7 sections. | `app/page.tsx` |
| **6 · Producten** | Header, sticky filter on the token, gallery grid, states. | `app/producten/page.tsx`, `product-grid.tsx`, `category-filter.tsx` |
| **7 · Over ons + Contact** | Both pages; FAQ → Accordion. | those routes, `contact-*-form.tsx` |
| **8 · New pages** | `/verhuurbeleid`, `not-found.tsx`. | new |
| **9 · Admin re-skin** | Class-name-only edits per §7, then **the full manual verification gate**. | `app/admin/*`, `components/admin*` |
| **10 · SEO** | `sitemap.ts`, `robots.ts`, `manifest.ts`, per-page metadata, all five JSON-LD blocks. | new + all routes |
| **11 · Polish** | Lighthouse ×6 pages, axe ×6, 320px/768px/1440px/2560px, keyboard-only pass, reduced-motion pass, Firefox no-scroll-timeline pass. | — |

---

## 12. Risks and how each is handled

| Risk | Handling |
|---|---|
| **Admin breaks** | Semantic tokens keep their names (§3); API/db/middleware untouched; class-name-only JSX edits; explicit manual gate; `git diff` audit of `fetch(`/`api/`/`db.ts`. |
| **`Fraunces` axes rejected by `next/font`** | Fall back to plain `Fraunces()` + CSS `font-variation-settings`, or to Instrument Serif. Scale unaffected either way. |
| **Firefox lacks scroll timelines** | Every animation is `@supports`-gated and the static state is the finished design. Explicitly tested in Firefox. |
| **Arch mask feels gimmicky** | Capped at three uses site-wide; removable by deleting one utility class. |
| **`--radius` 2px surprises you on admin controls** | It is one variable. `0.375rem` restores softness everywhere in one line. |
| **Removing per-card buttons hurts conversion** | The whole card becomes the link (larger target, not smaller), and the sticky filter bar carries a persistent "Offerte aanvragen". |
| **Image pipeline changes visible crops** | Originals are never overwritten; derivatives are written to `public/optimized/` and referenced explicitly. |
| **Build regressions hidden by `ignoreBuildErrors: true`** | Kept (out of scope to change) but `tsc --noEmit` is run manually each phase and reported. |

---

## 13. What this plan deliberately does **not** do

- Does not change the stack, the database schema, the API shape, or the auth model.
- Does not change admin *behaviour* — only its skin.
- Does not fix the non-functional contact forms (logic, not looks — §14).
- Does not invent testimonials, awards, client logos, or statistics. The current "50+ / 100% / 100%" block is **removed rather than restyled**, because unverifiable numbers in beautiful type are worse than none.
- Does not generate fake photography.
- Does not add a CMS, a blog engine, or a booking system.

---

## 14. Decisions I need from you

None of these block the start — Phases 1–4 proceed regardless — but they block *finishing*.

1. **Real contact details.** Phone, e-mail, WhatsApp number, city/region, KvK + BTW number, Instagram/Facebook URLs, and the live domain (assumed `www.mailra.nl` for `metadataBase`).
2. **Brand name in the UI**: "Mailra", or **"Caftan by Mailra"** as the logo and your own copy say? *(Recommendation: Caftan by Mailra, with "Mailra" as the short form.)*
3. **Typography**: Fraunces + Instrument Sans as recommended, or keep Instrument Serif + DM Sans?
4. **The FAQ contradiction**: `/contact` says 3-day minimum + 30% deposit; `beleid.md` says 24 hours + 50%. Which is true?
5. **The contact forms.** They currently send nothing. Options: (a) leave as-is, restyled — *not recommended*; (b) swap both CTAs to WhatsApp/mailto only — honest, zero backend; (c) a small follow-up to add a real `/api/contact` route with Resend + an `enquiries` table. *(Recommendation: (c), as a separate task after the redesign.)*
6. **Dark mode**: ship toggle-less (recommended), or expose a switch?
7. **New photography**: is a shoot possible? It is the single biggest remaining lever on "wow", and the design is built to make three great photographs look like thirty.

---

## 15. What "wow" concretely means here

Not effects. Five specific, checkable things:

1. **A hero that is genuinely bright** — the product lit, not scrimmed, with type that still reads at 16.68:1.
2. **Type that changes shape as it grows** — real optical sizing at 120px, which almost no competitor site has.
3. **Asymmetry with nerve** — an 8/4 split where the 4 is empty, and a headline that overlaps its photograph by exactly 80px, once.
4. **One remembered shape** — the arch. Used three times. Never four.
5. **Silence that was paid for** — 176px of vertical air between sections, grain in the ivory so it reads as paper rather than absence, and a single gold hairline doing the work that three shadows and two gradients do today.

That is the difference between a site that looks expensive and a site that *is* considered. This plan is for the second one.
