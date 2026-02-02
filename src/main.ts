/**
 * FinSuite OS - Main Entry Point
 * Bootloader for the application
 */

import './styles/theme.css';
import { shell } from './core/shell';
import { router } from './core/router';
import { initializeCloud } from './core/puter';

// Extensions
declare global {
  interface Window {
    router: typeof router;
  }
}

// Expose router for HTML onclick handlers
window.router = router;

// Initialize the application

// Initialize the application
async function boot(): Promise<void> {
  console.log('🚀 FinSuite OS Booting...');

  // Get app container
  const app = document.getElementById('app');
  if (!app) {
    console.error('App container not found');
    return;
  }

  // Initialize Puter cloud directory
  try {
    await initializeCloud();
    console.log('☁️ Cloud storage initialized');
  } catch (error) {
    console.warn('Cloud storage initialization skipped:', error);
  }

  // Initialize shell (sidebar, dock, router)
  shell.init(app);
  console.log('✅ FinSuite OS Ready');
}

// Boot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
