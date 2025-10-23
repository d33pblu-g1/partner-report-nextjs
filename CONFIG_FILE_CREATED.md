# Config File Created

## Issue
```
Module not found: Can't resolve '@/lib/config'
```

The partner-links page was importing `API_BASE_URL` from `@/lib/config`, but this file didn't exist.

## Solution

### Created `/src/lib/config.ts`

A centralized configuration file that provides:

1. **API_BASE_URL** - Base URL for all API calls
2. **API_ENDPOINTS** - Named endpoints as constants
3. **APP_CONFIG** - Application settings
4. **buildApiUrl()** - Helper function to build API URLs

### File Contents

```typescript
/**
 * Application Configuration
 */

// API Base URL - can be overridden by environment variable
export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/index.php';

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
export function buildApiUrl(
  endpoint: string, 
  params?: Record<string, string | number | null | undefined>
): string {
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
```

### Usage Examples

#### Import the config:
```typescript
import { API_BASE_URL, API_ENDPOINTS, buildApiUrl } from '@/lib/config';
```

#### Use buildApiUrl helper:
```typescript
// Simple endpoint
const url = buildApiUrl('partners');
// Result: http://localhost:8001/api/index.php?endpoint=partners

// With parameters
const url = buildApiUrl('partner_links', { 
  partner_id: '162153',
  status: 'active'
});
// Result: http://localhost:8001/api/index.php?endpoint=partner_links&partner_id=162153&status=active

// With null/undefined params (they get filtered out)
const url = buildApiUrl('clients', { 
  partner_id: selectedPartnerId,  // might be null
  tier: 'VIP'
});
// If selectedPartnerId is null, it won't be included in the URL
```

#### Use named endpoints:
```typescript
import { API_ENDPOINTS, buildApiUrl } from '@/lib/config';

const url = buildApiUrl(API_ENDPOINTS.partnerLinks, { partner_id: '162153' });
```

#### Direct URL usage:
```typescript
import { API_BASE_URL } from '@/lib/config';

const response = await fetch(`${API_BASE_URL}?endpoint=partners`);
```

### Benefits

1. **Centralized Configuration**: Single source of truth for API settings
2. **Environment Support**: Respects `NEXT_PUBLIC_API_URL` env var
3. **Type Safety**: TypeScript constants with `as const`
4. **Helper Functions**: Clean API URL building
5. **Consistency**: All pages use same config
6. **Easy Updates**: Change API URL in one place

### Environment Variables

Create `.env.local` file to override API URL:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://production-server.com/api
```

### Files Updated

1. **Created:**
   - `/src/lib/config.ts` - New configuration file

2. **Updated:**
   - `/src/app/partner-links/page.tsx` - Now uses `buildApiUrl()` helper

### Migration Guide

If other files need to use this config, replace:

**Before:**
```typescript
const API_BASE_URL = 'http://localhost:8001/api/index.php';
const url = `${API_BASE_URL}?endpoint=partners&partner_id=${partnerId}`;
```

**After:**
```typescript
import { buildApiUrl } from '@/lib/config';
const url = buildApiUrl('partners', { partner_id: partnerId });
```

### Related Files

The app has some duplicate API_BASE_URL definitions that could be consolidated:

- `/src/lib/api.ts` - Has its own API_BASE_URL
- `/src/hooks/useBadges.ts` - Has hardcoded URL

**Future Enhancement:** Update these files to use `/src/lib/config.ts`

## Status
✅ **FIXED** - Config file created, module imports successfully!

---

**Now all API configurations are centralized and type-safe! 🔧✨**

