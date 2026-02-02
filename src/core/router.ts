/**
 * FinSuite OS - Router
 * Virtual router for 40+ app routes
 */

export interface Route {
  path: string;
  title: string;
  icon: string;
  component: () => Promise<HTMLElement>;
  drive: 'wealth' | 'banking' | 'market' | 'news' | 'util' | 'system';
}

export interface RouteMatch {
  route: Route;
  params: Record<string, string>;
}

// Route definitions for all 40+ apps
export const routes: Route[] = [
  // ========== DRIVE A: WEALTH (10 Apps) ==========
  { path: '/apps/wealth/sip', title: 'SIP Calculator', icon: '📈', component: () => import('@/apps/wealth/SIPCalculator').then(m => m.render()), drive: 'wealth' },
  { path: '/apps/wealth/lumpsum', title: 'Lumpsum Calculator', icon: '💰', component: () => import('@/apps/wealth/LumpsumCalculator').then(m => m.render()), drive: 'wealth' },
  { path: '/apps/wealth/step-up', title: 'Step-Up SIP', icon: '📊', component: () => import('@/apps/wealth/StepUpCalculator').then(m => m.render()), drive: 'wealth' },
  { path: '/apps/wealth/fire', title: 'FIRE Calculator', icon: '🔥', component: () => import('@/apps/wealth/FIRECalculator').then(m => m.render()), drive: 'wealth' },
  { path: '/apps/wealth/cagr', title: 'CAGR Calculator', icon: '📉', component: () => import('@/apps/wealth/CAGRCalculator').then(m => m.render()), drive: 'wealth' },
  { path: '/apps/wealth/swp', title: 'SWP Planner', icon: '💸', component: () => import('@/apps/wealth/SWPCalculator').then(m => m.render()), drive: 'wealth' },
  { path: '/apps/wealth/goal', title: 'Goal Planner', icon: '🎯', component: () => import('@/apps/wealth/GoalCalculator').then(m => m.render()), drive: 'wealth' },
  { path: '/apps/wealth/tax', title: 'Income Tax', icon: '🧾', component: () => import('@/apps/wealth/TaxCalculator').then(m => m.render()), drive: 'wealth' },
  { path: '/apps/wealth/hra', title: 'HRA Calculator', icon: '🏠', component: () => import('@/apps/wealth/HRACalculator').then(m => m.render()), drive: 'wealth' },
  { path: '/apps/wealth/gst', title: 'GST Calculator', icon: '🏛️', component: () => import('@/apps/wealth/GSTCalculator').then(m => m.render()), drive: 'wealth' },

  // ========== DRIVE B: BANKING (8 Apps) ==========
  { path: '/apps/banking/emi-home', title: 'Home Loan EMI', icon: '🏠', component: () => import('@/apps/banking/HomeLoanCalculator').then(m => m.render()), drive: 'banking' },
  { path: '/apps/banking/emi-car', title: 'Car Loan EMI', icon: '🚗', component: () => import('@/apps/banking/CarLoanCalculator').then(m => m.render()), drive: 'banking' },
  { path: '/apps/banking/fd', title: 'FD Calculator', icon: '🏦', component: () => import('@/apps/banking/FDCalculator').then(m => m.render()), drive: 'banking' },
  { path: '/apps/banking/rd', title: 'RD Calculator', icon: '📅', component: () => import('@/apps/banking/RDCalculator').then(m => m.render()), drive: 'banking' },
  { path: '/apps/banking/ppf', title: 'PPF Calculator', icon: '🏛️', component: () => import('@/apps/banking/PPFCalculator').then(m => m.render()), drive: 'banking' },
  { path: '/apps/banking/ssy', title: 'SSY Calculator', icon: '👧', component: () => import('@/apps/banking/SSYCalculator').then(m => m.render()), drive: 'banking' },
  { path: '/apps/banking/nps', title: 'NPS Calculator', icon: '👴', component: () => import('@/apps/banking/NPSCalculator').then(m => m.render()), drive: 'banking' },
  { path: '/apps/banking/inflation', title: 'Inflation Calculator', icon: '📈', component: () => import('@/apps/banking/InflationCalculator').then(m => m.render()), drive: 'banking' },

  // ========== DRIVE C: MARKETS (6 Apps) ==========
  { path: '/apps/market/crypto', title: 'Crypto Dashboard', icon: '₿', component: () => import('@/apps/market/CryptoDashboard').then(m => m.render()), drive: 'market' },
  { path: '/apps/market/converter', title: 'Currency Converter', icon: '💱', component: () => import('@/apps/market/CurrencyConverter').then(m => m.render()), drive: 'market' },
  { path: '/apps/market/sentiment', title: 'Market Sentiment', icon: '📊', component: () => import('@/apps/market/SentimentDashboard').then(m => m.render()), drive: 'market' },
  { path: '/apps/market/bitcoin', title: 'Satoshi Converter', icon: '⚡', component: () => import('@/apps/market/SatoshiConverter').then(m => m.render()), drive: 'market' },
  { path: '/apps/market/gold', title: 'Gold Tracker', icon: '🥇', component: () => import('@/apps/market/GoldTracker').then(m => m.render()), drive: 'market' },
  { path: '/apps/market/watchlist', title: 'Watchlist', icon: '👀', component: () => import('@/apps/market/Watchlist').then(m => m.render()), drive: 'market' },

  // ========== DRIVE D: NEWS (5 Apps) ==========
  { path: '/apps/news/tech', title: 'Tech News', icon: '💻', component: () => import('@/apps/news/TechNews').then(m => m.render()), drive: 'news' },
  { path: '/apps/news/crypto', title: 'Crypto News', icon: '🪙', component: () => import('@/apps/news/CryptoNews').then(m => m.render()), drive: 'news' },
  { path: '/apps/news/dev', title: 'Dev Articles', icon: '👨‍💻', component: () => import('@/apps/news/DevArticles').then(m => m.render()), drive: 'news' },
  { path: '/apps/news/ai', title: 'AI News', icon: '🤖', component: () => import('@/apps/news/AINews').then(m => m.render()), drive: 'news' },
  { path: '/apps/news/search', title: 'News Search', icon: '🔍', component: () => import('@/apps/news/NewsSearch').then(m => m.render()), drive: 'news' },

  // ========== DRIVE E: UTILITY (6 Apps) ==========
  { path: '/apps/util/weather', title: 'Weather', icon: '🌤️', component: () => import('@/apps/util/Weather').then(m => m.render()), drive: 'util' },
  { path: '/apps/util/ip', title: 'IP Lookup', icon: '🌐', component: () => import('@/apps/util/IPLookup').then(m => m.render()), drive: 'util' },
  { path: '/apps/util/writer', title: 'Word Finder', icon: '✍️', component: () => import('@/apps/util/WordFinder').then(m => m.render()), drive: 'util' },
  { path: '/apps/util/password', title: 'Password Generator', icon: '🔐', component: () => import('@/apps/util/PasswordGenerator').then(m => m.render()), drive: 'util' },
  { path: '/apps/util/qr', title: 'QR Code', icon: '📱', component: () => import('@/apps/util/QRCode').then(m => m.render()), drive: 'util' },
  { path: '/apps/util/internet', title: 'Speed Test', icon: '⚡', component: () => import('@/apps/util/SpeedTest').then(m => m.render()), drive: 'util' },

  // ========== DRIVE F: SYSTEM (5 Apps) ==========
  { path: '/system/dashboard', title: 'Dashboard', icon: '🏠', component: () => import('@/apps/system/Dashboard').then(m => m.render()), drive: 'system' },
  { path: '/system/settings', title: 'Settings', icon: '⚙️', component: () => import('@/apps/system/Settings').then(m => m.render()), drive: 'system' },
  { path: '/system/files', title: 'Files', icon: '📁', component: () => import('@/apps/system/Files').then(m => m.render()), drive: 'system' },
  { path: '/system/chat', title: 'Ask FinSuite', icon: '💬', component: () => import('@/apps/system/AIAssistant').then(m => m.render()), drive: 'system' },
  { path: '/system/profile', title: 'Profile', icon: '👤', component: () => import('@/apps/system/Profile').then(m => m.render()), drive: 'system' },
];

// Default route
const DEFAULT_ROUTE = '/system/dashboard';

class Router {
  private currentPath: string = '';
  private contentContainer: HTMLElement | null = null;
  private listeners: Array<(path: string) => void> = [];

  /**
   * Initialize the router
   */
  init(container: HTMLElement): void {
    this.contentContainer = container;

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      this.navigate(window.location.pathname, false);
    });

    // Handle initial route
    const path = window.location.pathname || DEFAULT_ROUTE;
    this.navigate(path, false);
  }

  /**
   * Navigate to a path
   */
  async navigate(path: string, pushState = true): Promise<void> {
    // Normalize path
    const normalizedPath = path === '/' ? DEFAULT_ROUTE : path;

    // Find matching route
    const route = this.findRoute(normalizedPath);

    if (!route) {
      console.warn(`Route not found: ${normalizedPath}`);
      await this.navigate(DEFAULT_ROUTE, false);
      return;
    }

    // Update browser history
    if (pushState && this.currentPath !== normalizedPath) {
      window.history.pushState({}, '', normalizedPath);
    }

    this.currentPath = normalizedPath;

    // Notify listeners
    this.listeners.forEach((fn) => fn(normalizedPath));

    // Load and render component
    if (this.contentContainer) {
      this.contentContainer.innerHTML = '<div class="flex items-center justify-center" style="min-height: 400px;"><div class="spinner"></div></div>';

      try {
        const element = await route.component();
        this.contentContainer.innerHTML = '';
        this.contentContainer.appendChild(element);
      } catch (error) {
        console.error('Route load error:', error);
        this.contentContainer.innerHTML = `
          <div class="glass-card" style="padding: var(--space-8); text-align: center;">
            <h2 style="color: var(--accent-cost); margin-bottom: var(--space-4);">Failed to load</h2>
            <p style="color: var(--text-secondary);">Unable to load this app. Please try again.</p>
            <button class="btn btn--primary mt-6" onclick="window.router.navigate('/system/dashboard')">
              Go to Dashboard
            </button>
          </div>
        `;
      }
    }
  }

  /**
   * Find a route by path
   */
  findRoute(path: string): Route | undefined {
    return routes.find((r) => r.path === path);
  }

  /**
   * Get routes by drive
   */
  getRoutesByDrive(drive: Route['drive']): Route[] {
    return routes.filter((r) => r.drive === drive);
  }

  /**
   * Get current path
   */
  getCurrentPath(): string {
    return this.currentPath;
  }

  /**
   * Subscribe to route changes
   */
  onNavigate(callback: (path: string) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((fn) => fn !== callback);
    };
  }
}

// Singleton instance
export const router = new Router();

// Make router globally available for onclick handlers
declare global {
  interface Window {
    router: Router;
  }
}
window.router = router;
