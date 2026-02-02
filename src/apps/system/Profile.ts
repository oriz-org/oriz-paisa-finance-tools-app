/**
 * FinSuite OS - Profile
 */
import { auth, loadFromCloud, saveToCloud } from '@/core/puter';

export async function render(): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">👤 Profile</h1>
      <p class="page-subtitle">Your financial profile</p>
    </header>
    <div id="profile-content"><div class="skeleton" style="height: 400px;"></div></div>
  `;

  const contentEl = container.querySelector('#profile-content') as HTMLElement;

  // Load profile
  let profile = {
    name: 'User',
    age: 30,
    income: 500000,
    riskTolerance: 'moderate' as 'low' | 'moderate' | 'high',
    goals: [] as string[],
  };

  try {
    const saved = await loadFromCloud<typeof profile>('profile.json');
    if (saved) profile = { ...profile, ...saved };
  } catch {
    // Use defaults
  }

  async function saveProfile(): Promise<void> {
    const success = await saveToCloud('profile.json', profile);
    if (success) window.showToast?.('Profile saved!', 'success');
    else window.showToast?.('Failed to save', 'error');
  }

  const isLoggedIn = auth.isSignedIn();

  if (!isLoggedIn) {
    contentEl.innerHTML = `
      <div class="glass-card" style="padding: var(--space-8); text-align: center;">
        <div style="font-size: 48px; margin-bottom: var(--space-4);">🔐</div>
        <h3 style="margin-bottom: var(--space-2);">Sign in Required</h3>
        <p style="color: var(--text-secondary); margin-bottom: var(--space-4);">Sign in to save your profile to the cloud</p>
        <button class="btn btn--primary" id="login-btn">Sign In with Puter</button>
      </div>
    `;
    contentEl.querySelector('#login-btn')?.addEventListener('click', () => auth.signIn());
    return container;
  }

  contentEl.innerHTML = `
    <div class="glass-card" style="padding: var(--space-6); margin-bottom: var(--space-6);">
      <h3 style="margin-bottom: var(--space-5);">📋 Personal Details</h3>
      <div class="input-group mb-4">
        <label class="input-label" for="name">Name</label>
        <input type="text" class="input" id="name" value="${profile.name}">
      </div>
      <div class="input-group mb-4">
        <label class="input-label" for="age">Age</label>
        <input type="number" class="input" id="age" value="${profile.age}" min="18" max="100">
      </div>
      <div class="input-group">
        <label class="input-label" for="income">Annual Income</label>
        <input type="number" class="input" id="income" value="${profile.income}">
      </div>
    </div>

    <div class="glass-card" style="padding: var(--space-6); margin-bottom: var(--space-6);">
      <h3 style="margin-bottom: var(--space-5);">📊 Investment Profile</h3>
      <div class="input-group">
        <label class="input-label" for="risk">Risk Tolerance</label>
        <select class="input" id="risk">
          <option value="low" ${profile.riskTolerance === 'low' ? 'selected' : ''}>Low (Conservative)</option>
          <option value="moderate" ${profile.riskTolerance === 'moderate' ? 'selected' : ''}>Moderate (Balanced)</option>
          <option value="high" ${profile.riskTolerance === 'high' ? 'selected' : ''}>High (Aggressive)</option>
        </select>
      </div>
    </div>

    <div class="glass-card" style="padding: var(--space-6); margin-bottom: var(--space-6);">
      <h3 style="margin-bottom: var(--space-5);">🎯 Financial Goals</h3>
      <div id="goals-list" style="margin-bottom: var(--space-4);">
        ${profile.goals.map((g, i) => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-3); background: var(--glass-bg); border-radius: var(--radius-md); margin-bottom: var(--space-2);">
            <span>${g}</span>
            <button class="btn btn--ghost btn--sm" data-remove="${i}">✕</button>
          </div>
        `).join('')}
      </div>
      <div style="display: flex; gap: var(--space-3);">
        <input type="text" class="input flex-1" id="new-goal" placeholder="Add a goal (e.g., Buy a house, Retire early)">
        <button class="btn btn--secondary" id="add-goal-btn">Add</button>
      </div>
    </div>

    <button class="btn btn--primary btn--lg" id="save-btn" style="width: 100%;">💾 Save Profile to Cloud</button>
  `;

  // Event handlers
  contentEl.querySelector('#name')?.addEventListener('change', (e) => { profile.name = (e.target as HTMLInputElement).value; });
  contentEl.querySelector('#age')?.addEventListener('change', (e) => { profile.age = parseInt((e.target as HTMLInputElement).value); });
  contentEl.querySelector('#income')?.addEventListener('change', (e) => { profile.income = parseInt((e.target as HTMLInputElement).value); });
  contentEl.querySelector('#risk')?.addEventListener('change', (e) => { profile.riskTolerance = (e.target as HTMLSelectElement).value as typeof profile.riskTolerance; });
  contentEl.querySelector('#save-btn')?.addEventListener('click', saveProfile);

  contentEl.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt((btn as HTMLElement).dataset.remove!);
      profile.goals.splice(idx, 1);
      render().then((el) => { contentEl.replaceWith(el.querySelector('#profile-content')!); });
    });
  });

  contentEl.querySelector('#add-goal-btn')?.addEventListener('click', () => {
    const input = contentEl.querySelector('#new-goal') as HTMLInputElement;
    if (input.value.trim()) {
      profile.goals.push(input.value.trim());
      input.value = '';
      render().then((el) => { contentEl.replaceWith(el.querySelector('#profile-content')!); });
    }
  });

  return container;
}
