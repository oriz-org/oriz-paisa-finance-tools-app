/**
 * Per-site config — passed to shared @chirag127/oriz-ui components so every
 * site renders header/footer/SEO with its own slug, name, and tagline while
 * sharing the same component code.
 */
export interface OrizSiteConfig {
  slug: string
  name: string
  origin: string
  tagline: string
  description: string
}

export const SITE_CONFIG: OrizSiteConfig = {
  slug: 'finance',
  name: 'Finance',
  origin: 'https://finance.oriz.in',
  tagline: 'SIP, EMI, FIRE, tax — calculators that show the math',
  description: 'SIP, EMI, FIRE, tax — calculators that show the math',
}
