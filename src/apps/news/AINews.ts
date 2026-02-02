/**
 * FinSuite OS - AI News
 */
import { getAINews } from '@/services/news';

export async function render(): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">🤖 AI News</h1>
      <p class="page-subtitle">Latest AI & Machine Learning articles</p>
    </header>
    <div id="ai-news"><div class="skeleton" style="height: 400px;"></div></div>
  `;

  const newsEl = container.querySelector('#ai-news') as HTMLElement;

  try {
    const articles = await getAINews();
    newsEl.innerHTML = articles.length > 0 ? `
      <div class="grid grid--auto gap-4">
        ${articles.slice(0, 20).map((a) => `
          <a href="${a.url}" target="_blank" class="glass-card" style="padding: var(--space-5); text-decoration: none;">
            <div style="display: flex; gap: var(--space-3);">
              ${a.social_image ? `<img src="${a.social_image}" alt="" style="width: 80px; height: 60px; object-fit: cover; border-radius: var(--radius-md);">` : ''}
              <div>
                <h3 style="color: var(--text-primary); font-size: var(--text-base); margin-bottom: var(--space-2); line-height: 1.3;">${a.title}</h3>
                <div style="font-size: var(--text-xs); color: var(--text-tertiary);">
                  ${a.user.name} • ${a.reading_time_minutes} min • ❤️ ${a.positive_reactions_count}
                </div>
              </div>
            </div>
          </a>
        `).join('')}
      </div>
    ` : '<p style="color: var(--text-secondary); text-align: center;">No AI articles found</p>';
  } catch {
    newsEl.innerHTML = '<div class="glass-card" style="padding: var(--space-6); text-align: center;">Failed to load AI news</div>';
  }

  return container;
}
