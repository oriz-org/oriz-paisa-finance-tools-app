/**
 * FinSuite OS - Word Finder
 */
import { getSynonyms, getRhymes, getMeansLike } from '@/services/utility';

export function render(): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">✍️ Word Finder</h1>
      <p class="page-subtitle">Synonyms, rhymes & related words</p>
    </header>
    <div class="glass-card" style="padding: var(--space-6); margin-bottom: var(--space-6);">
      <div class="input-group">
        <label class="input-label" for="word">Enter a word</label>
        <div style="display: flex; gap: var(--space-3);">
          <input type="text" class="input" id="word" placeholder="e.g., happy, money, success...">
          <button class="btn btn--primary" id="find-btn">Find</button>
        </div>
      </div>
    </div>
    <div id="word-results"></div>
  `;

  const wordInput = container.querySelector('#word') as HTMLInputElement;
  const findBtn = container.querySelector('#find-btn') as HTMLButtonElement;
  const resultsEl = container.querySelector('#word-results') as HTMLElement;

  async function findWords(): Promise<void> {
    const word = wordInput.value.trim().toLowerCase();
    if (!word) return;

    findBtn.disabled = true;
    resultsEl.innerHTML = '<div class="skeleton" style="height: 300px;"></div>';

    try {
      const [synonyms, rhymes, related] = await Promise.all([
        getSynonyms(word, 15),
        getRhymes(word, 15),
        getMeansLike(word, 15),
      ]);

      resultsEl.innerHTML = `
        ${
          synonyms.length > 0
            ? `
          <div class="glass-card" style="padding: var(--space-5); margin-bottom: var(--space-4);">
            <h3 style="margin-bottom: var(--space-3);">📗 Synonyms</h3>
            <div style="display: flex; flex-wrap: wrap; gap: var(--space-2);">
              ${synonyms.map((s) => `<span style="padding: var(--space-2) var(--space-3); background: var(--glass-bg); border-radius: var(--radius-full); font-size: var(--text-sm);">${s.word}</span>`).join('')}
            </div>
          </div>
        `
            : ''
        }

        ${
          rhymes.length > 0
            ? `
          <div class="glass-card" style="padding: var(--space-5); margin-bottom: var(--space-4);">
            <h3 style="margin-bottom: var(--space-3);">🎵 Rhymes</h3>
            <div style="display: flex; flex-wrap: wrap; gap: var(--space-2);">
              ${rhymes.map((r) => `<span style="padding: var(--space-2) var(--space-3); background: var(--glass-bg); border-radius: var(--radius-full); font-size: var(--text-sm);">${r.word}</span>`).join('')}
            </div>
          </div>
        `
            : ''
        }

        ${
          related.length > 0
            ? `
          <div class="glass-card" style="padding: var(--space-5);">
            <h3 style="margin-bottom: var(--space-3);">🔗 Related Words</h3>
            <div style="display: flex; flex-wrap: wrap; gap: var(--space-2);">
              ${related.map((r) => `<span style="padding: var(--space-2) var(--space-3); background: var(--glass-bg); border-radius: var(--radius-full); font-size: var(--text-sm);">${r.word}</span>`).join('')}
            </div>
          </div>
        `
            : ''
        }

        ${
          synonyms.length === 0 && rhymes.length === 0 && related.length === 0
            ? `
          <div class="glass-card" style="padding: var(--space-6); text-align: center;">No results found</div>
        `
            : ''
        }
      `;
    } catch {
      resultsEl.innerHTML =
        '<div class="glass-card" style="padding: var(--space-6); text-align: center;">Search failed</div>';
    } finally {
      findBtn.disabled = false;
    }
  }

  findBtn.addEventListener('click', findWords);
  wordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') findWords();
  });

  return container;
}
