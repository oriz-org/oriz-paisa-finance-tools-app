---
description: Deploy the application to Cloudflare Pages
---

1. Build the production bundle
// turbo
2. npm run build

3. Deploy using Wrangler
   - If not logged in, run: `npx wrangler login`
   - Deploy command: `npx wrangler pages deploy dist --project-name finsuite --branch main`

4. Configure Custom Domain
   - Go to Cloudflare Dashboard > Pages > finsuite > Custom Domains
   - Add `money.chirag127.in`
