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

const DEFAULT_PROD_API_URL = 'https://stocksmart-backend-3rxv.onrender.com/api';

export const environment = {
  production: true,
  get apiUrl(): string {
    // 1. Browser localStorage override (highest priority - allows instant URL configuration in browser)
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('stocksmart_api_url');
      if (stored) {
        const sanitized = sanitizeApiUrl(stored);
        if (sanitized) {
          return sanitized;
        }
      }
    }

    // 2. Explicit runtime config (from app-config.js if present)
    if (typeof window !== 'undefined' && (window as any).__STOCKSMART_API_URL__) {
      const runtimeConfig = sanitizeApiUrl((window as any).__STOCKSMART_API_URL__);
      if (runtimeConfig) {
        return runtimeConfig;
      }
    }

    // 3. Default to the deployed StockSmart backend on Render
    return DEFAULT_PROD_API_URL;
  }
};
