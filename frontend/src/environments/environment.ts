function sanitizeApiUrl(url: string): string {
  if (!url) return '';
  let trimmed = url.trim();
  while (trimmed.endsWith('/')) {
    trimmed = trimmed.substring(0, trimmed.length - 1);
  }
  while (trimmed.endsWith('/api/api')) {
    trimmed = trimmed.substring(0, trimmed.length - 4);
  }
  if (!trimmed) return '';
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

const LOCAL_DEV_API_URL = 'http://localhost:5656/api';
const DEPLOYED_BACKEND_API_URL = 'https://stocksmart-backend-3rxv.onrender.com/api';

export const environment = {
  production: false,
  get apiUrl(): string {
    // 1. Explicit localStorage override (highest priority)
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('stocksmart_api_url');
      if (stored) {
        const sanitized = sanitizeApiUrl(stored);
        if (sanitized) return sanitized;
      }
    }

    // 2. If running locally, default to local backend
    if (typeof window !== 'undefined' && window.location) {
      const host = window.location.hostname;
      if (host === 'localhost' || host === '127.0.0.1') {
        return LOCAL_DEV_API_URL;
      }
    }

    // 3. Fallback to runtime config or deployed backend
    if (typeof window !== 'undefined' && (window as any).__STOCKSMART_API_URL__) {
      const runtimeConfig = sanitizeApiUrl((window as any).__STOCKSMART_API_URL__);
      if (runtimeConfig) return runtimeConfig;
    }

    return DEPLOYED_BACKEND_API_URL;
  }
};
