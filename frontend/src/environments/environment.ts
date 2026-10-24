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
    if (typeof window !== 'undefined' && (window as any).__STOCKSMART_API_URL__) {
      const raw = sanitizeUrl((window as any).__STOCKSMART_API_URL__);
      return raw.endsWith('/api') ? raw : `${raw}/api`;
    }
    return 'http://localhost:5656/api';
  }
};
