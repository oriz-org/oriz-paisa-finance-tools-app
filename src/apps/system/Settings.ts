/**
 * FinSuite OS - Settings
 */
import { kvStore, auth } from '@/core/puter';

export async function render(): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">⚙️ Settings</h1>
      <p class="page-subtitle">FinSuite OS preferences</p>
    </header>
    <div id="settings-content"><div class="skeleton" style="height: 400px;"></div></div>
  `;

  const contentEl = container.querySelector('#settings-content') as HTMLElement;

  // Load settings
  let settings = {
    theme: 'dark',
    currency: 'INR',
    haptics: true,
    aiEnabled: true,
    cloudSync: true,
  };

  try {
    const saved = await kvStore.get<typeof settings>('settings');
    if (saved) settings = { ...settings, ...saved };
  } catch {
    // Use defaults
  }

  async function saveSettings(): Promise<void> {
    try {
      await kvStore.set('settings', settings);
      window.showToast?.('Settings saved!', 'success');
    } catch {
      window.showToast?.('Failed to save settings', 'error');
    }
  }

  function renderSettings(): void {
    contentEl.innerHTML = `
      <div class="glass-card" style="padding: var(--space-6); margin-bottom: var(--space-6);">
        <h3 style="margin-bottom: var(--space-5);">👤 Account</h3>
        <div id="auth-section"></div>
      </div>

      <div class="glass-card" style="padding: var(--space-6); margin-bottom: var(--space-6);">
        <h3 style="margin-bottom: var(--space-5);">🎨 Appearance</h3>
        <div class="setting-row">
          <div>
            <div style="font-weight: 500;">Theme</div>
            <div style="font-size: var(--text-sm); color: var(--text-tertiary);">Color scheme preference</div>
          </div>
          <select class="input" style="width: 150px;" id="theme-select">
            <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
            <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Light</option>
            <option value="auto" ${settings.theme === 'auto' ? 'selected' : ''}>Auto</option>
          </select>
        </div>
      </div>

      <div class="glass-card" style="padding: var(--space-6); margin-bottom: var(--space-6);">
        <h3 style="margin-bottom: var(--space-5);">💰 Finance</h3>
        <div class="setting-row">
          <div>
            <div style="font-weight: 500;">Default Currency</div>
            <div style="font-size: var(--text-sm); color: var(--text-tertiary);">For calculations and display</div>
          </div>
          <select class="input" style="width: 150px;" id="currency-select">
            <option value="INR" ${settings.currency === 'INR' ? 'selected' : ''}>₹ INR</option>
            <option value="USD" ${settings.currency === 'USD' ? 'selected' : ''}>$ USD</option>
            <option value="EUR" ${settings.currency === 'EUR' ? 'selected' : ''}>€ EUR</option>
            <option value="GBP" ${settings.currency === 'GBP' ? 'selected' : ''}>£ GBP</option>
          </select>
        </div>
      </div>

      <div class="glass-card" style="padding: var(--space-6); margin-bottom: var(--space-6);">
        <h3 style="margin-bottom: var(--space-5);">🤖 AI & Cloud</h3>
        <div class="setting-row">
          <div>
            <div style="font-weight: 500;">AI Insights</div>
            <div style="font-size: var(--text-sm); color: var(--text-tertiary);">Enable AI-powered recommendations</div>
          </div>
          <label class="toggle">
            <input type="checkbox" id="ai-toggle" ${settings.aiEnabled ? 'checked' : ''}>
            <span class="toggle-track"></span>
          </label>
        </div>
        <div class="setting-row">
          <div>
            <div style="font-weight: 500;">Cloud Sync</div>
            <div style="font-size: var(--text-sm); color: var(--text-tertiary);">Sync data across devices</div>
          </div>
          <label class="toggle">
            <input type="checkbox" id="cloud-toggle" ${settings.cloudSync ? 'checked' : ''}>
            <span class="toggle-track"></span>
          </label>
        </div>
      </div>

      <div class="glass-card" style="padding: var(--space-6);">
        <h3 style="margin-bottom: var(--space-5);">ℹ️ About</h3>
        <div style="color: var(--text-secondary); font-size: var(--text-sm);">
          <p><strong>FinSuite OS</strong> v1.0.0</p>
          <p style="margin-top: var(--space-2);">A premium financial planning operating system.</p>
          <p style="margin-top: var(--space-2);">Built with TypeScript, Vite, and Puter.js</p>
          <p style="margin-top: var(--space-4); color: var(--text-tertiary);">© 2025 FinSuite • <a href="https://chirag127.in" target="_blank" style="color: var(--accent-primary);">chirag127.in</a></p>
        </div>
      </div>
    `;

    // Auth section
    const authEl = contentEl.querySelector('#auth-section') as HTMLElement;
    const loggedIn = auth.isSignedIn();

    if (loggedIn) {
      authEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 500;">Logged in to Puter</div>
            <div style="font-size: var(--text-sm); color: var(--text-tertiary);">Your data is synced to cloud</div>
          </div>
          <button class="btn btn--secondary" id="logout-btn">Log Out</button>
        </div>
      `;
      authEl.querySelector('#logout-btn')?.addEventListener('click', async () => {
        await auth.signOut();
        renderSettings();
      });
    } else {
      authEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 500;">Not logged in</div>
            <div style="font-size: var(--text-sm); color: var(--text-tertiary);">Sign in to sync your data</div>
          </div>
          <button class="btn btn--primary" id="login-btn">Sign In with Puter</button>
        </div>
      `;
      authEl.querySelector('#login-btn')?.addEventListener('click', async () => {
        await auth.signIn();
      });
    }

    // Event handlers
    contentEl.querySelector('#theme-select')?.addEventListener('change', (e) => {
      settings.theme = (e.target as HTMLSelectElement).value;
      saveSettings();
    });
    contentEl.querySelector('#currency-select')?.addEventListener('change', (e) => {
      settings.currency = (e.target as HTMLSelectElement).value;
      saveSettings();
    });
    contentEl.querySelector('#ai-toggle')?.addEventListener('change', (e) => {
      settings.aiEnabled = (e.target as HTMLInputElement).checked;
      saveSettings();
    });
    contentEl.querySelector('#cloud-toggle')?.addEventListener('change', (e) => {
      settings.cloudSync = (e.target as HTMLInputElement).checked;
      saveSettings();
    });
  }

  renderSettings();

  // Add CSS for setting rows
  const style = document.createElement('style');
  style.textContent = `
    .setting-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-4) 0;
      border-bottom: 1px solid var(--glass-border);
    }
    .setting-row:last-child { border-bottom: none; }
  `;
  container.appendChild(style);

  return container;
}
