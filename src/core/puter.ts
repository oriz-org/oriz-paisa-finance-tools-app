/**
 * FinSuite OS - Puter.js Kernel Wrapper
 * Handles authentication, AI, and cloud storage
 */

// Puter.js types (loaded from CDN)
declare const puter: {
  ai: {
    chat: (prompt: string, options?: { model?: string }) => Promise<string>;
  };
  fs: {
    write: (path: string, content: string) => Promise<void>;
    read: (path: string) => Promise<Blob>;
    readdir: (path: string) => Promise<Array<{ name: string; path: string }>>;
    mkdir: (path: string) => Promise<void>;
    delete: (path: string) => Promise<void>;
  };
  kv: {
    get: (key: string) => Promise<string | null>;
    set: (key: string, value: string) => Promise<void>;
    del: (key: string) => Promise<void>;
    list: () => Promise<string[]>;
  };
  auth: {
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    isSignedIn: () => boolean;
    getUser: () => Promise<{ username: string; email?: string }>;
  };
};

const FINSUITE_DIR = 'finsuite';
const AI_MODEL = 'gpt-4o-mini';

const SYSTEM_PROMPTS = {
  advisor: `You are a financial advisor in FinSuite OS. Provide clear, actionable insights about investments, loans, and financial planning. Use Indian Rupees (₹) by default. Keep responses concise (2-3 sentences max).`,

  analyst: `You are a market analyst in FinSuite OS. Analyze market trends, crypto movements, and economic indicators. Be data-driven and highlight key risks/opportunities. Keep responses concise.`,

  strategist: `You are a debt strategist in FinSuite OS. Help users optimize loan repayments, suggest prepayment strategies, and calculate interest savings. Keep responses concise.`,

  summarizer: `You are a news summarizer in FinSuite OS. Provide TL;DR summaries of articles and news. Focus on key facts and implications. Keep it to 2-3 bullet points.`,

  assistant: `You are a general assistant in FinSuite OS. Help users with utilities, calculations, and general queries. Be helpful and concise.`,
};

export type AIRole = keyof typeof SYSTEM_PROMPTS;

/**
 * Ask AI for insights with role-specific system prompts
 */
export async function askAI(
  prompt: string,
  role: AIRole = 'advisor',
  context?: string
): Promise<string> {
  try {
    const systemPrompt = SYSTEM_PROMPTS[role];
    const fullPrompt = context
      ? `${systemPrompt}\n\nContext: ${context}\n\nUser Question: ${prompt}`
      : `${systemPrompt}\n\nUser Question: ${prompt}`;

    const response = await puter.ai.chat(fullPrompt, { model: AI_MODEL });
    return typeof response === 'string' ? response : String(response);
  } catch (error) {
    console.error('AI Error:', error);
    return 'Unable to get AI insights at the moment. Please try again.';
  }
}

/**
 * Save data to Puter cloud storage
 */
export async function saveToCloud(filename: string, data: unknown): Promise<boolean> {
  try {
    const path = `${FINSUITE_DIR}/${filename}`;
    await puter.fs.write(path, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Save Error:', error);
    return false;
  }
}

/**
 * Load data from Puter cloud storage
 */
export async function loadFromCloud<T>(filename: string): Promise<T | null> {
  try {
    const path = `${FINSUITE_DIR}/${filename}`;
    const blob = await puter.fs.read(path);
    const text = await blob.text();
    return JSON.parse(text) as T;
  } catch (error) {
    console.error('Load Error:', error);
    return null;
  }
}

/**
 * List saved files in FinSuite directory
 */
export async function listSavedFiles(): Promise<string[]> {
  try {
    const files = await puter.fs.readdir(FINSUITE_DIR);
    return files.map((f) => f.name);
  } catch (error) {
    console.error('List Error:', error);
    return [];
  }
}

/**
 * Delete a file from cloud storage
 */
export async function deleteFromCloud(filename: string): Promise<boolean> {
  try {
    const path = `${FINSUITE_DIR}/${filename}`;
    await puter.fs.delete(path);
    return true;
  } catch (error) {
    console.error('Delete Error:', error);
    return false;
  }
}

/**
 * Key-Value store operations for user preferences
 */
export const kvStore = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await puter.kv.get(`finsuite:${key}`);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  },

  async set(key: string, value: unknown): Promise<boolean> {
    try {
      await puter.kv.set(`finsuite:${key}`, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  async delete(key: string): Promise<boolean> {
    try {
      await puter.kv.del(`finsuite:${key}`);
      return true;
    } catch {
      return false;
    }
  },
};

/**
 * Authentication helpers
 */
export const auth = {
  async signIn(): Promise<boolean> {
    try {
      await puter.auth.signIn();
      return true;
    } catch {
      return false;
    }
  },

  async signOut(): Promise<void> {
    await puter.auth.signOut();
  },

  isSignedIn(): boolean {
    return puter.auth.isSignedIn();
  },

  async getUser(): Promise<{ username: string; email?: string } | null> {
    try {
      return await puter.auth.getUser();
    } catch {
      return null;
    }
  },
};

/**
 * Initialize FinSuite directory in cloud
 */
export async function initializeCloud(): Promise<void> {
  try {
    await puter.fs.mkdir(FINSUITE_DIR);
  } catch {
    // Directory already exists, ignore
  }
}
