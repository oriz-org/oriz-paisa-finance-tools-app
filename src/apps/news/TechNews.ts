/**
 * FinSuite OS - Tech News (HackerNews)
 */
import { getHNTopStories, type HNStory } from '@/services/news';
import { askAI } from '@/core/puter';
import { formatDistanceToNow } from 'date-fns';

export async function render(): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">💻 Tech News</h1>
      <p class="page-subtitle">Top stories from HackerNews</p>
    </header>
    <div id="news-list"><div class="skeleton" style="height: 400px;"></div></div>
  `;

  const listEl = container.querySelector('#news-list') as HTMLElement;

  try {
    const stories = await getHNTopStories(30);
    listEl.innerHTML = renderStories(stories);

    // Add AI summarize handlers
    listEl.querySelectorAll('[data-summarize]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const title = (btn as HTMLElement).dataset.summarize!;
        (btn as HTMLButtonElement).disabled = true;
        btn.textContent = 'Summarizing...';
        try {
          const summary = await askAI(`Summarize this tech news briefly: "${title}"`, 'summarizer');
          const parent = btn.closest('.news-card');
          if (parent) {
            const summaryEl = document.createElement('div');
            summaryEl.className = 'ai-insight mt-3';
            summaryEl.innerHTML = `<div class="ai-insight-header"><span class="ai-insight-icon">✨</span><span class="ai-insight-title">TL;DR</span></div><div class="ai-insight-content">${summary}</div>`;
            parent.appendChild(summaryEl);
            btn.remove();
          }
        } catch {
          btn.textContent = 'Failed';
        }
      });
    });
  } catch {
    listEl.innerHTML = '<div class="glass-card" style="padding: var(--space-6); text-align: center;">Failed to load news</div>';
  }

  return container;
}

function renderStories(stories: HNStory[]): string {
  return `
    <div class="flex flex-col gap-4">
      ${stories.map((s, i) => `
        <div class="glass-card news-card" style="padding: var(--space-5);">
          <div style="display: flex; gap: var(--space-4);">
            <span style="color: var(--text-tertiary); font-size: var(--text-lg); font-weight: 600; min-width: 30px;">${i + 1}</span>
            <div style="flex: 1;">
              <a href="${s.url || `https://news.ycombinator.com/item?id=${s.id}`}" target="_blank" style="color: var(--text-primary); text-decoration: none; font-weight: 500; line-height: 1.4;">
                ${s.title}
              </a>
              <div style="display: flex; gap: var(--space-4); margin-top: var(--space-2); font-size: var(--text-sm); color: var(--text-tertiary);">
                <span>▲ ${s.score}</span>
                <span>by ${s.by}</span>
                <span>${formatDistanceToNow(s.time * 1000, { addSuffix: true })}</span>
                <span>${s.descendants || 0} comments</span>
              </div>
              <button class="btn btn--ghost btn--sm mt-3" data-summarize="${s.title.replace(/"/g, '\\"')}">✨ Summarize</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
