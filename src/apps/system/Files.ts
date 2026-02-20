/**
 * FinSuite OS - Files
 */
import { listSavedFiles, deleteFromCloud } from '@/core/puter';

export async function render(): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">📁 Files</h1>
      <p class="page-subtitle">Your synchronized financial data</p>
    </header>
    <div id="file-list"><div class="skeleton" style="height: 400px;"></div></div>
  `;

  const listEl = container.querySelector('#file-list') as HTMLElement;

  async function loadFiles() {
    try {
      const files = await listSavedFiles();

      if (files.length === 0) {
        listEl.innerHTML = `
          <div class="glass-card" style="padding: var(--space-8); text-align: center;">
            <div style="font-size: 48px; margin-bottom: var(--space-4);">📂</div>
            <h3 style="margin-bottom: var(--space-2);">No files found</h3>
            <p style="color: var(--text-secondary);">Your saved calculators and scenarios will appear here.</p>
          </div>
        `;
        return;
      }

      listEl.innerHTML = `
        <div class="glass-card" style="padding: 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid var(--glass-border); text-align: left;">
                <th style="padding: var(--space-4);">Name</th>
                <th style="padding: var(--space-4); text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${files
                .map(
                  (file) => `
                <tr style="border-bottom: 1px solid var(--glass-border);">
                  <td style="padding: var(--space-4);">
                    <div style="display: flex; align-items: center; gap: var(--space-3);">
                      <span style="font-size: 20px;">📄</span>
                      <span>${file}</span>
                    </div>
                  </td>
                  <td style="padding: var(--space-4); text-align: right;">
                    <button class="btn btn--secondary btn--sm" data-delete="${file}">🗑️</button>
                  </td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      `;

      listEl.querySelectorAll('[data-delete]').forEach((btn) => {
        btn.addEventListener('click', async (e) => {
          const filename = (e.target as HTMLElement).closest('button')!.dataset.delete!;
          if (confirm(`Delete ${filename}?`)) {
            await deleteFromCloud(filename);
            loadFiles();
            window.showToast?.('File deleted', 'success');
          }
        });
      });
    } catch {
      listEl.innerHTML =
        '<div class="glass-card" style="padding: var(--space-6);">Failed to load files</div>';
    }
  }

  loadFiles();
  return container;
}
