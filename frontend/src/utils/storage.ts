import { STORAGE_KEYS } from './constants';

/**
 * Generic local storage wrapper with error handling
 */
export const storage = {
  /**
   * Get item from localStorage
   */
  get: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage (key: ${key}):`, error);
      return defaultValue;
    }
  },

  /**
   * Set item in localStorage
   */
  set: <T>(key: string, value: T): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (key: ${key}):`, error);
      return false;
    }
  },

  /**
   * Remove item from localStorage
   */
  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (key: ${key}):`, error);
      return false;
    }
  },

  /**
   * Clear all localStorage
   */
  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  /**
   * Check if key exists in localStorage
   */
  has: (key: string): boolean => {
    try {
      return localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  },
};

/**
 * Form Draft Management
 */
export const formDraftStorage = {
  save: (data: Record<string, unknown>): void => {
    storage.set(STORAGE_KEYS.formDraft, {
      data,
      timestamp: new Date().toISOString(),
    });
  },

  load: (): Record<string, unknown> | null => {
    const draft = storage.get<{ data: Record<string, unknown>; timestamp: string }>(
      STORAGE_KEYS.formDraft
    );
    
    if (!draft) return null;
    
    // Check if draft is older than 24 hours
    const draftTime = new Date(draft.timestamp).getTime();
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    if (now - draftTime > twentyFourHours) {
      formDraftStorage.clear();
      return null;
    }
    
    return draft.data;
  },

  clear: (): void => {
    storage.remove(STORAGE_KEYS.formDraft);
  },

  hasDraft: (): boolean => {
    return storage.has(STORAGE_KEYS.formDraft);
  },
};

/**
 * Theme Storage
 */
export const themeStorage = {
  get: (): 'light' | 'dark' | 'high-contrast' => {
    return storage.get<'light' | 'dark' | 'high-contrast'>(STORAGE_KEYS.theme, 'light') || 'light';
  },

  set: (theme: 'light' | 'dark' | 'high-contrast'): void => {
    storage.set(STORAGE_KEYS.theme, theme);
    document.documentElement.classList.remove('light', 'dark', 'high-contrast');
    document.documentElement.classList.add(theme);
  },
};

/**
 * Language Storage
 */
export const languageStorage = {
  get: (): 'en' | 'hi' => {
    return storage.get<'en' | 'hi'>(STORAGE_KEYS.language, 'en') || 'en';
  },

  set: (language: 'en' | 'hi'): void => {
    storage.set(STORAGE_KEYS.language, language);
  },
};

/**
 * Font Size Storage
 */
export const fontSizeStorage = {
  get: (): 'normal' | 'large' | 'extra-large' => {
    return storage.get<'normal' | 'large' | 'extra-large'>(STORAGE_KEYS.fontSize, 'normal') || 'normal';
  },

  set: (size: 'normal' | 'large' | 'extra-large'): void => {
    storage.set(STORAGE_KEYS.fontSize, size);
    document.documentElement.classList.remove('text-normal', 'text-large', 'text-extra-large');
    document.documentElement.classList.add(`text-${size}`);
  },
};

/**
 * Admin Token Storage
 */
export const authStorage = {
  getToken: (): string | null => {
    return storage.get<string>(STORAGE_KEYS.adminToken);
  },

  setToken: (token: string): void => {
    storage.set(STORAGE_KEYS.adminToken, token);
  },

  clearToken: (): void => {
    storage.remove(STORAGE_KEYS.adminToken);
  },

  isAuthenticated: (): boolean => {
    return storage.has(STORAGE_KEYS.adminToken);
  },
};

/**
 * Last Search Storage
 */
export const searchStorage = {
  get: (): string | null => {
    return storage.get<string>(STORAGE_KEYS.lastSearch);
  },

  set: (certNo: string): void => {
    storage.set(STORAGE_KEYS.lastSearch, certNo);
  },

  clear: (): void => {
    storage.remove(STORAGE_KEYS.lastSearch);
  },
};
