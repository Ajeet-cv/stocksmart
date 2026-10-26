function sanitizeUrl(url: string): string {
  if (!url) return '';
  let trimmed = url.trim();
  while (trimmed.endsWith('/')) {
    trimmed = trimmed.substring(0, trimmed.length - 1);
  }
  return trimmed;
}

export const environment = {
  production: true,
  get apiUrl(): string {
    // 1. Explicit runtime config (from app-config.js)
    if (typeof window !== 'undefined' && (window as any).__STOCKSMART_API_URL__) {
      const raw = sanitizeUrl((window as any).__STOCKSMART_API_URL__);
      if (raw) {
        return raw.endsWith('/api') ? raw : `${raw}/api`;
      }
    }

    // 2. Browser localStorage override (useful for testing alternative backend URLs without redeployment)
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('stocksmart_api_url');
      if (stored) {
        const raw = sanitizeUrl(stored);
        if (raw) {
          return raw.endsWith('/api') ? raw : `${raw}/api`;
        }
      }
    }

    // 3. Render cloud auto-resolution:
    // If running on Render frontend (e.g., https://stocksmart-frontend.onrender.com),
    // automatically target the corresponding backend service.
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      const host = window.location.hostname;
      if (host.endsWith('.onrender.com')) {
        if (host.includes('stocksmart-frontend')) {
          const backendHost = host.replace('stocksmart-frontend', 'stocksmart-backend');
          return `https://${backendHost}/api`;
        }
        return 'https://stocksmart-backend.onrender.com/api';
      }
    }

    return '/api';
  }
};
