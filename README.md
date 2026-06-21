# oriz-finance

> 📊 Finance — SIP, EMI, FIRE, tax — calculators that show the math.

Part of the [oriz](https://oriz.in) family. Lives at
[finance.oriz.in](https://finance.oriz.in).

A static Astro 6 site themed by [`@chirag127/oriz-ui`](https://github.com/chirag127/oriz-ui).
Calculators are React islands; the math runs entirely in your browser. Inputs
never leave your device. Sign-in is optional and only powers cross-site features
(saved scenarios, bookmarks) that follow you across the oriz family via shared
Firebase Auth on `auth.oriz.in`.

## Develop

```bash
pnpm install
npx envpact-cli@0.2.0   # populate .env from the family-wide secrets store
pnpm dev                # astro dev on http://localhost:4321
```

## Build & deploy

Hosted on **Cloudflare Pages**. The custom domain
`finance.oriz.in -> oriz-finance` is bound via the Cloudflare dashboard.

```bash
pnpm build              # static output to ./dist
pnpm preview            # preview the build locally
pnpm deploy             # wrangler deploy to Cloudflare
```

## What lives here

| Path | Contents |
| ---- | -------- |
| `src/pages/` | Astro routes — home, about, contact, account, finish-sign-in, legal/* |
| `src/components/` | `Header.astro`, `Footer.astro`, `SiteSidebar.astro`, `HeaderControls.tsx` |
| `src/components/calculators/` | React-island calculators (SIP, EMI, …) |
| `src/layouts/BaseLayout.astro` | SEO + OG + JSON-LD + theme preflight + sidebar |
| `src/lib/` | `firebase.ts`, `siteConfig.ts`, `preflight.js`, `finmath.ts` |
| `src/styles/global.css` | Tailwind v4 + `@chirag127/oriz-ui/{styles,components.css}` |
| `astro.config.mjs` | Astro + React + Sitemap + Tailwind |
| `wrangler.toml` | Cloudflare Pages assets binding |
| `biome.json` | Lint + format (single quotes, no semicolons, 2-space) |

## Calculators

The catalogue covers four groups; each lives at `/calculators/<slug>/` once
wired up. SIP and EMI are live on the homepage as drop-in islands.

- **Investments** — SIP, lumpsum, step-up SIP, SWP, CAGR/XIRR, goal planner, FIRE
- **Loans & EMI** — home/car/personal/education loans, prepayment, comparison, eligibility
- **Banking & savings** — FD, RD, PPF, NPS, NSC, SSY, compound interest
- **Tax & salary** — take-home, TDS, HRA, gratuity, leave encashment, GST

Each calculator runs entirely in your browser. Inputs never leave the device.

## What is `oriz-finance-site`

`oriz-finance-site` is **site 002 of the oriz family** — a free, static,
browser-only personal-finance toolkit for India. Three things make it
different:

1. **The math is the product.** Every calculator shows the formula it used,
   the assumptions it made, and the year-by-year breakdown — not just an
   output number wrapped in a lead-capture form.
2. **Inputs never leave your device.** Calculators run as React islands in
   your browser. Sign-in is optional and only powers cross-site features
   (saved scenarios, bookmarks) via shared Firebase Auth on `auth.oriz.in`.
3. **One markets dashboard, fronted by a cache.** `/dashboard` (placeholder
   today) hosts a live-markets view via the forward-ref
   `<MarketDataChart />` island.

The shared site shell wires four locked components into every page via
`BaseLayout.astro`: `<MultiSearch />` (multi-engine search popover),
`<StatusBanner />` (Better Stack RSS consumer), `<JsonLd />` (Organization,
WebSite, and Person triple), and `<ConsentBanner />` (Klaro for EU/UK/CCPA).
These match the family-wide locks documented in
`knowledge/decisions/architecture/`.

## Markets dashboard — Alpha Vantage caching

The `/dashboard` route is the only part of the site that touches a remote
API. It uses [Alpha Vantage](https://www.alphavantage.co/) for Indian
indices, FX, and G-Sec yields.

### Free-tier limits (the design constraint)

Alpha Vantage's free tier allows:

- **25 requests / day** per API key
- **5 requests / minute** per API key

A static site that fanned out to the API from every visitor's browser would
burn the daily quota in seconds. Caching is mandatory.

### How the cache works

```text
visitor → finance.oriz.in/dashboard
            │
            └─ <MarketDataChart /> island (oriz-kit)
                  │  fetch(`${PUBLIC_ALPHA_VANTAGE_PROXY}/quote?symbol=^NSEI&interval=60min`)
                  ▼
            CF Worker (av.oriz.workers.dev)
                  │
                  ├─ KV cache hit  →  serve cached JSON
                  │                    (key: `<symbol>:<interval>`, TTL 12h)
                  │
                  └─ KV cache miss →  fetch Alpha Vantage with secret
                                       ALPHA_VANTAGE_API_KEY,
                                       write to KV with 12h TTL,
                                       return to client.
```

The 12-hour TTL means each `<symbol>:<interval>` pair costs at most
**2 quota calls per day**, so the 25/day budget covers ~12 distinct series
even if every visitor hits a different one. Real per-day usage is far lower
because the dashboard ships ~6 series total.

### Environment variables

| Var | Where | Purpose |
| --- | --- | --- |
| `ALPHA_VANTAGE_API_KEY` | CF Worker secret (NOT the static site) | Server-side key — never shipped to the browser. |
| `PUBLIC_ALPHA_VANTAGE_PROXY` | Static site `.env` | Public Worker URL the chart fetches from. Default: `https://av.oriz.workers.dev`. |

The static site never sees the API key. The Worker is the only thing that
holds it; CORS is locked down to `*.oriz.in`.

> See `ops/alpha-vantage-cache.md` for the Worker contract (request shape,
> error codes, KV key schema).

## SEBI disclaimer

oriz-finance is **not** registered with SEBI, IRDAI, or RBI and does not provide
investment, tax, or insurance advice. Calculators are mathematical tools that
compute outputs from your inputs — not predictions or recommendations. Read the
full [disclaimer](./src/pages/legal/disclaimer.astro) before use.

## Design system

All design tokens, theme variants (dark / light / sepia / hc), accents, and
shared components (`AccountPanel`, `FinishSignIn`, `ContactForm`, `Sidebar`,
`AdSlot`, `NewsletterCta`) live in
[`@chirag127/oriz-ui`](https://github.com/chirag127/oriz-ui). This site only
declares its slug, name, tagline, and the calculator-specific React islands.
