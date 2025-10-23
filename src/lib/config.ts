/**
 * Application Configuration
 * Centralized configuration for API endpoints and app settings
 */

// API Base URL - can be overridden by environment variable
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/index.php';

// API endpoints
export const API_ENDPOINTS = {
  partners: 'partners',
  clients: 'clients',
  commissions: 'commissions',
  badges: 'badges',
  cubes: 'cubes',
  metrics: 'metrics',
  charts: 'charts',
  partnerLinks: 'partner_links',
  tableData: 'table_data',
  allTables: 'all_tables',
} as const;

// App settings
export const APP_CONFIG = {
  appName: 'Partner Report Dashboard',
  version: '2.0.0',
  defaultLanguage: 'en',
  defaultTheme: 'light',
} as const;

// Helper function to build API URL with query params
export function buildApiUrl(endpoint: string, params?: Record<string, string | number | null | undefined>): string {
  const url = new URL(API_BASE_URL);
  url.searchParams.set('endpoint', endpoint);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  
  return url.toString();
}

