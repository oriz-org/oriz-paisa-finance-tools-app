/**
 * FinSuite OS - SEO Manager
 * Dynamic meta tag management for SPA
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogType?: string;
  canonical?: string;
}

const SITE_NAME = 'FinSuite OS';
const DEFAULT_OG_IMAGE = '/og-image.png';
const BASE_URL = 'https://money.chirag127.in';

/**
 * Update all SEO-related meta tags
 */
export function updateSEO(config: SEOConfig): void {
  const { title, description, keywords, ogImage, ogType = 'website', canonical } = config;

  // Update document title
  document.title = `${title} | ${SITE_NAME}`;

  // Helper to update or create meta tag
  const setMeta = (name: string, content: string, property = false): void => {
    const attr = property ? 'property' : 'name';
    let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attr, name);
      document.head.appendChild(meta);
    }
    meta.content = content;
  };

  // Standard meta tags
  setMeta('description', description);
  setMeta('keywords', keywords.join(', '));
  setMeta('author', 'FinSuite OS');
  setMeta('robots', 'index, follow');

  // Open Graph tags
  setMeta('og:title', `${title} | ${SITE_NAME}`, true);
  setMeta('og:description', description, true);
  setMeta('og:type', ogType, true);
  setMeta('og:image', ogImage || DEFAULT_OG_IMAGE, true);
  setMeta('og:site_name', SITE_NAME, true);
  setMeta('og:url', canonical || `${BASE_URL}${window.location.pathname}`, true);

  // Twitter Card tags
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', `${title} | ${SITE_NAME}`);
  setMeta('twitter:description', description);
  setMeta('twitter:image', ogImage || DEFAULT_OG_IMAGE);

  // Canonical URL
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = canonical || `${BASE_URL}${window.location.pathname}`;
}

/**
 * Generate JSON-LD structured data for a calculator page
 */
export function addStructuredData(
  type: 'Calculator' | 'WebApplication' | 'Article',
  data: Record<string, unknown>
): void {
  // Remove existing structured data
  document.querySelectorAll('script[type="application/ld+json"]').forEach((el) => el.remove());

  const script = document.createElement('script');
  script.type = 'application/ld+json';

  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  script.textContent = JSON.stringify(baseData);
  document.head.appendChild(script);
}
