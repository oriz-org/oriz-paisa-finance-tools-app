/**
 * FinSuite OS - Dev Articles
 */
import { getDevArticles, type DevArticle } from '@/services/news';

export async function render(): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">👨‍💻 Dev Articles</h1>
      <p class="page-subtitle">Latest from Dev.to</p>
    </header>
    <div id="dev-articles"><div class="skeleton" style="height: 400px;"></div></div>
  `;

  const articlesEl = container.querySelector('#dev-articles') as HTMLElement;

  try {
    const articles = await getDevArticles(1, 30);
    articlesEl.innerHTML = renderArticles(articles);
  } catch {
    articlesEl.innerHTML =
      '<div class="glass-card" style="padding: var(--space-6); text-align: center;">Failed to load articles</div>';
  }

  return container;
}

function renderArticles(articles: DevArticle[]): string {
  return `
    <div class="grid grid--auto gap-4">
      ${articles
        .map(
          (a) => `
        <a href="${a.url}" target="_blank" class="glass-card" style="padding: 0; text-decoration: none; overflow: hidden;">
          ${a.cover_image ? `<img src="${a.cover_image}" alt="${a.title}" style="width: 100%; height: 150px; object-fit: cover;">` : ''}
          <div style="padding: var(--space-5);">
            <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-3);">
              <img src="${a.user.profile_image}" alt="${a.user.name}" style="width: 24px; height: 24px; border-radius: 50%;">
              <span style="font-size: var(--text-sm); color: var(--text-secondary);">${a.user.name}</span>
            </div>
            <h3 style="color: var(--text-primary); margin-bottom: var(--space-2); font-size: var(--text-base); line-height: 1.4;">${a.title}</h3>
            <div style="display: flex; gap: var(--space-4); font-size: var(--text-xs); color: var(--text-tertiary);">
              <span>❤️ ${a.positive_reactions_count}</span>
              <span>💬 ${a.comments_count}</span>
              <span>📖 ${a.reading_time_minutes} min read</span>
            </div>
            <div style="display: flex; gap: var(--space-2); margin-top: var(--space-3); flex-wrap: wrap;">
              ${a.tag_list
                .slice(0, 3)
                .map(
                  (t) =>
                    `<span style="padding: 2px 8px; background: var(--glass-bg); border-radius: var(--radius-full); font-size: var(--text-xs); color: var(--accent-primary);">#${t}</span>`
                )
                .join('')}
            </div>
          </div>
        </a>
      `
        )
        .join('')}
    </div>
  `;
}
