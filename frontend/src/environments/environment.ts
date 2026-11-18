function sanitizeUrl(url: string): string {
  if (!url) return '';
  let trimmed = url.trim();
  while (trimmed.endsWith('/')) {
    trimmed = trimmed.substring(0, trimmed.length - 1);
  }
  return trimmed;
}

export const environment = {
  production: false,
  get apiUrl(): string {
    // 1. Explicit localStorage override (highest priority)
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('stocksmart_api_url');
      if (stored) {
        const raw = sanitizeUrl(stored);
        if (raw) return raw.endsWith('/api') ? raw : `${raw}/api`;
      }
    }

    // 2. If running locally, default to local backend
    if (typeof window !== 'undefined' && window.location) {
      const host = window.location.hostname;
      if (host === 'localhost' || host === '127.0.0.1') {
        return 'http://localhost:5656/api';
      }
    }

    // 3. Fallback to window config or localhost
    if (typeof window !== 'undefined' && (window as any).__STOCKSMART_API_URL__) {
      const raw = sanitizeUrl((window as any).__STOCKSMART_API_URL__);
      if (raw) return raw.endsWith('/api') ? raw : `${raw}/api`;
    }
    return 'http://localhost:5656/api';
  }
};
