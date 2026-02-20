/**
 * FinSuite OS - News Search
 */
import { searchDevArticles, searchWiki } from '@/services/news';

export function render(): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">🔍 News Search</h1>
      <p class="page-subtitle">Search articles and knowledge</p>
    </header>
    <div class="glass-card" style="padding: var(--space-6); margin-bottom: var(--space-6);">
      <div class="input-group">
        <label class="input-label" for="search-query">Search Query</label>
        <div style="display: flex; gap: var(--space-3);">
          <input type="text" class="input" id="search-query" placeholder="e.g., TypeScript, React, Investing...">
          <button class="btn btn--primary" id="search-btn">Search</button>
        </div>
      </div>
    </div>
    <div id="search-results"></div>
  `;

  const queryInput = container.querySelector('#search-query') as HTMLInputElement;
  const searchBtn = container.querySelector('#search-btn') as HTMLButtonElement;
  const resultsEl = container.querySelector('#search-results') as HTMLElement;

  async function search(): Promise<void> {
    const query = queryInput.value.trim();
    if (!query) return;

    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';
    resultsEl.innerHTML = '<div class="skeleton" style="height: 200px;"></div>';

    try {
      const [devResults, wikiResults] = await Promise.all([
        searchDevArticles(query),
        searchWiki(query, 5),
      ]);

      resultsEl.innerHTML = `
        ${
          wikiResults.length > 0
            ? `
          <h3 style="margin-bottom: var(--space-4);">📚 Wikipedia</h3>
          <div class="grid grid--auto gap-4 mb-6">
            ${wikiResults
              .map(
                (w) => `
              <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(w.title)}" target="_blank" class="glass-card" style="padding: var(--space-4); text-decoration: none;">
                <div style="font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-2);">${w.title}</div>
                <p style="font-size: var(--text-sm); color: var(--text-secondary);">${w.snippet.replace(/<[^>]*>/g, '').slice(0, 150)}...</p>
              </a>
            `
              )
              .join('')}
          </div>
        `
            : ''
        }

        ${
          devResults.length > 0
            ? `
          <h3 style="margin-bottom: var(--space-4);">📝 Dev.to Articles</h3>
          <div class="grid grid--auto gap-4">
            ${devResults
              .slice(0, 10)
              .map(
                (a) => `
              <a href="${a.url}" target="_blank" class="glass-card" style="padding: var(--space-4); text-decoration: none;">
                <div style="font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-2);">${a.title}</div>
                <div style="font-size: var(--text-sm); color: var(--text-tertiary);">
                  ${a.user.name} • ${a.reading_time_minutes} min read
                </div>
              </a>
            `
              )
              .join('')}
          </div>
        `
            : ''
        }

        ${
          devResults.length === 0 && wikiResults.length === 0
            ? `
          <div class="glass-card" style="padding: var(--space-6); text-align: center;">
            No results found for "${query}"
          </div>
        `
            : ''
        }
      `;
    } catch {
      resultsEl.innerHTML =
        '<div class="glass-card" style="padding: var(--space-6); text-align: center;">Search failed</div>';
    } finally {
      searchBtn.disabled = false;
      searchBtn.textContent = 'Search';
    }
  }

  searchBtn.addEventListener('click', search);
  queryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') search();
  });

  return container;
}
