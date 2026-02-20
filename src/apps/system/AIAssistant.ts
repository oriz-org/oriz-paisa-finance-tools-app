/**
 * FinSuite OS - AI Assistant
 */
import { askAI, type AIRole } from '@/core/puter';

export function render(): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">🤖 AI Assistant</h1>
      <p class="page-subtitle">Your personal financial AI advisor</p>
    </header>
    <div class="glass-card" style="padding: var(--space-6); margin-bottom: var(--space-4);">
      <div class="input-group mb-4">
        <label class="input-label" for="ai-role">AI Role</label>
        <select class="input" id="ai-role">
          <option value="advisor">💼 Financial Advisor</option>
          <option value="analyst">📊 Market Analyst</option>
          <option value="strategist">🎯 Investment Strategist</option>
          <option value="educator">📚 Finance Educator</option>
          <option value="summarizer">📝 Summarizer</option>
        </select>
      </div>
      <div class="input-group">
        <label class="input-label" for="ai-question">Ask anything about finance</label>
        <textarea class="input" id="ai-question" rows="4" placeholder="e.g., How should I diversify my portfolio? What is compound interest? Explain SIP vs Lumpsum..."></textarea>
      </div>
      <button class="btn btn--primary mt-4" id="ask-btn" style="width: 100%;">🚀 Ask AI</button>
    </div>
    <div id="ai-response"></div>

    <div class="glass-card" style="padding: var(--space-5); margin-top: var(--space-6);">
      <h3 style="margin-bottom: var(--space-4);">💡 Quick Questions</h3>
      <div style="display: flex; flex-wrap: wrap; gap: var(--space-2);" id="quick-questions">
        <button class="btn btn--secondary btn--sm" data-q="What is the 50-30-20 budgeting rule?">50-30-20 Rule</button>
        <button class="btn btn--secondary btn--sm" data-q="Explain the difference between SIP and lumpsum investment">SIP vs Lumpsum</button>
        <button class="btn btn--secondary btn--sm" data-q="What are the best tax saving options in India under Section 80C?">Tax Saving 80C</button>
        <button class="btn btn--secondary btn--sm" data-q="How does compound interest work?">Compound Interest</button>
        <button class="btn btn--secondary btn--sm" data-q="What is FIRE movement and how to achieve financial independence?">FIRE Movement</button>
        <button class="btn btn--secondary btn--sm" data-q="What are the risks of crypto investment?">Crypto Risks</button>
      </div>
    </div>
  `;

  const roleSelect = container.querySelector('#ai-role') as HTMLSelectElement;
  const questionInput = container.querySelector('#ai-question') as HTMLTextAreaElement;
  const askBtn = container.querySelector('#ask-btn') as HTMLButtonElement;
  const responseEl = container.querySelector('#ai-response') as HTMLElement;
  const quickQuestions = container.querySelector('#quick-questions') as HTMLElement;

  async function ask(question: string): Promise<void> {
    if (!question.trim()) {
      window.showToast?.('Please enter a question', 'warning');
      return;
    }

    askBtn.disabled = true;
    askBtn.textContent = '⏳ Thinking...';
    responseEl.innerHTML =
      '<div class="ai-insight"><div class="ai-insight-content"><div class="spinner" style="margin: 0 auto;"></div></div></div>';

    try {
      const role = roleSelect.value as AIRole;
      const response = await askAI(question, role);

      responseEl.innerHTML = `
        <div class="ai-insight">
          <div class="ai-insight-header">
            <span class="ai-insight-icon">✨</span>
            <span class="ai-insight-title">AI ${roleSelect.options[roleSelect.selectedIndex].text}</span>
          </div>
          <div class="ai-insight-content" style="white-space: pre-wrap;">${response}</div>
        </div>
      `;
    } catch (error) {
      responseEl.innerHTML = `
        <div class="ai-insight" style="border-color: var(--accent-cost);">
          <div class="ai-insight-content" style="color: var(--accent-cost);">
            Failed to get AI response. Please try again.
          </div>
        </div>
      `;
    } finally {
      askBtn.disabled = false;
      askBtn.textContent = '🚀 Ask AI';
    }
  }

  askBtn.addEventListener('click', () => ask(questionInput.value));
  questionInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) ask(questionInput.value);
  });

  quickQuestions.querySelectorAll('[data-q]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const question = (btn as HTMLElement).dataset.q!;
      questionInput.value = question;
      ask(question);
    });
  });

  return container;
}
