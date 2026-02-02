/**
 * FinSuite OS - IP Lookup
 */
import { getIPInfo } from '@/services/utility';

export async function render(): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">🌐 IP Lookup</h1>
      <p class="page-subtitle">What is my IP?</p>
    </header>
    <div id="ip-info"><div class="skeleton" style="height: 300px;"></div></div>
  `;

  const infoEl = container.querySelector('#ip-info') as HTMLElement;

  try {
    const info = await getIPInfo();
    if (info) {
      infoEl.innerHTML = `
        <div class="glass-card" style="padding: var(--space-8); text-align: center; margin-bottom: var(--space-6);">
          <div style="font-size: var(--text-sm); color: var(--text-tertiary); margin-bottom: var(--space-2);">Your IP Address</div>
          <div style="font-size: var(--text-4xl); font-family: var(--font-mono); font-weight: 700; color: var(--accent-primary);">${info.ip}</div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📍</div>
            <div class="stat-value">${info.city}</div>
            <div class="stat-label">City</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏛️</div>
            <div class="stat-value">${info.region}</div>
            <div class="stat-label">Region</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🌍</div>
            <div class="stat-value">${info.country}</div>
            <div class="stat-label">Country</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🕐</div>
            <div class="stat-value">${info.timezone}</div>
            <div class="stat-label">Timezone</div>
          </div>
        </div>

        <div class="glass-card mt-6" style="padding: var(--space-5);">
          <h3 style="margin-bottom: var(--space-4);">Connection Details</h3>
          <div class="flex justify-between mb-2"><span>ISP</span><span style="color: var(--text-secondary);">${info.isp}</span></div>
          <div class="flex justify-between mb-2"><span>Organization</span><span style="color: var(--text-secondary);">${info.org}</span></div>
          <div class="flex justify-between mb-2"><span>ASN</span><span style="color: var(--text-secondary); font-family: var(--font-mono);">${info.as}</span></div>
          <div class="flex justify-between"><span>Coordinates</span><span style="color: var(--text-secondary); font-family: var(--font-mono);">${info.lat}, ${info.lon}</span></div>
        </div>
      `;
    } else {
      throw new Error('No data');
    }
  } catch {
    infoEl.innerHTML = '<div class="glass-card" style="padding: var(--space-6); text-align: center;">Failed to fetch IP info</div>';
  }

  return container;
}
