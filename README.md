# oriz-finance

> Finance — SIP, EMI, FIRE, tax — calculators that show the math.

Part of the [oriz](https://oriz.in) family. Lives at
[finance.oriz.in](https://finance.oriz.in).

This repository is being rebuilt on the shared oriz design system
([@chirag127/oriz-ui](https://github.com/chirag127/oriz-ui)) and Astro 6. The
prior FinSuite Vite app remains in `src/` for now and continues to work; the
new Astro scaffold sits alongside it under `src/layouts/`, `src/pages/`,
`src/components/`, `src/lib/`, and `src/styles/`. Once the migration lands the
legacy directories will be removed.

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
| `src/components/` | `Header.astro`, `Footer.astro`, `HeaderControls.tsx` (React island) |
| `src/layouts/BaseLayout.astro` | SEO meta, OG, JSON-LD, theme preflight, header/footer |
| `src/lib/` | `firebase.ts`, `siteConfig.ts`, `sites.ts`, `preflight.js` |
| `src/styles/global.css` | Tailwind v4 + theme tokens (4 themes × 6 accents) |
| `astro.config.mjs` | Astro + React + Sitemap + Tailwind |
| `wrangler.toml` | Cloudflare Pages assets binding |
| `biome.json` | Lint + format (single quotes, no semicolons, 2-space) |

## Calculators (planned)

- **Investments** — SIP, lumpsum, step-up SIP, SWP, CAGR/XIRR, goal planner, FIRE
- **Loans & EMI** — home/car/personal/education loans, prepayment, comparison, eligibility
- **Banking & savings** — FD, RD, PPF, NPS, NSC, SSY, compound interest
- **Tax & salary** — take-home, TDS, HRA, gratuity, leave encashment, GST

Each calculator runs entirely in your browser. Inputs never leave the device.

## SEBI disclaimer

oriz-finance is **not** registered with SEBI, IRDAI, or RBI and does not provide
investment, tax, or insurance advice. Calculators are mathematical tools that
compute outputs from your inputs — not predictions or recommendations. Read the
full [disclaimer](./src/pages/legal/disclaimer.astro) before use.

---

Below is the original FinSuite README for reference. The product has been
folded into oriz-finance.

<details>
<summary>Legacy FinSuite README</summary>

The original README is preserved at `README.legacy.md`.

</details>
