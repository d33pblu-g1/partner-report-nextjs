# Tier Badge Implementation

## Overview

Added a color-coded tier badge to the home page that displays the selected partner's current tier with appropriate colors matching the tier level (Bronze, Silver, Gold, Platinum).

## Changes Made

### 1. Created TierBadge Component

**File:** `/src/components/tiers/TierBadge.tsx`

A reusable component that displays a styled badge with tier-specific colors:

- **Bronze** 🥉: Amber/brown colors (`bg-amber-700`, `text-amber-100`)
- **Silver** 🥈: Gray/silver colors (`bg-gray-400`, `text-gray-900`)
- **Gold** 🥇: Yellow/gold colors (`bg-yellow-500`, `text-yellow-900`)
- **Platinum** 💎: Purple colors (`bg-purple-600`, `text-purple-100`)

**Features:**
- Tier-specific colors and icons (emojis)
- Dark mode support with proper color variants
- Responsive styling with Tailwind CSS
- Border and shadow for visual emphasis
- Fallback styling for unknown tiers

### 2. Updated Home Page

**File:** `/src/app/page.tsx`

**Changes:**
- Imported `TierBadge` component
- Modified header section to use flexbox layout
- Added tier badge next to page title
- Badge only displays when:
  - Metrics have loaded (`!metricsLoading`)
  - A specific partner is selected (not "All partners")
  - Partner has a tier assigned (`metrics.partnerTier`)

**Before:**
```tsx
<div className="mb-8">
  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
    Partner Dashboard
  </h1>
  ...
</div>
```

**After:**
```tsx
<div className="mb-8">
  <div className="flex items-center gap-4 mb-2">
    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
      Partner Dashboard
    </h1>
    {!metricsLoading && metrics && metrics.partnerName !== 'All partners' && metrics.partnerTier && (
      <TierBadge tier={metrics.partnerTier} />
    )}
  </div>
  ...
</div>
```

## Visual Examples

### Bronze Tier
```
Partner Dashboard [🥉 Bronze]  ← Amber/brown badge
```

### Silver Tier
```
Partner Dashboard [🥈 Silver]  ← Gray/silver badge
```

### Gold Tier
```
Partner Dashboard [🥇 Gold]  ← Yellow/gold badge
```

### Platinum Tier
```
Partner Dashboard [💎 Platinum]  ← Purple badge
```

## Color Specifications

| Tier     | Background (Light/Dark)         | Text (Light/Dark)           | Border (Light/Dark)           | Icon |
|----------|----------------------------------|-----------------------------|-----------------------------|------|
| Bronze   | `amber-700` / `amber-800`       | `amber-100`                 | `amber-600` / `amber-700`   | 🥉   |
| Silver   | `gray-400` / `gray-500`         | `gray-900` / `white`        | `gray-500` / `gray-600`     | 🥈   |
| Gold     | `yellow-500` / `yellow-600`     | `yellow-900` / `yellow-100` | `yellow-600` / `yellow-700` | 🥇   |
| Platinum | `purple-600` / `purple-700`     | `purple-100`                | `purple-700` / `purple-800` | 💎   |
| Default  | `gray-500` / `gray-600`         | `white`                     | `gray-600` / `gray-700`     | ⭐   |

## Component API

### TierBadge Props

```typescript
interface TierBadgeProps {
  tier: string;        // The tier name (Bronze, Silver, Gold, Platinum)
  className?: string;  // Optional additional CSS classes
}
```

**Usage:**
```tsx
import { TierBadge } from '@/components/tiers/TierBadge';

<TierBadge tier="Gold" />
<TierBadge tier="Platinum" className="ml-4" />
```

## Files Created

- `/src/components/tiers/TierBadge.tsx` - Tier badge component

## Files Modified

- `/src/app/page.tsx` - Added tier badge to header

## Design Decisions

1. **Position**: Badge placed next to the page title (inline) for maximum visibility
2. **Conditional Display**: Only shows when a specific partner is selected
3. **Colors**: Matched to actual metal/material colors (bronze=brown, silver=gray, gold=yellow, platinum=purple)
4. **Icons**: Used medal emojis (🥉🥈🥇) and diamond (💎) for visual reinforcement
5. **Responsive**: Uses flexbox with gap for clean spacing
6. **Dark Mode**: All colors have dark mode variants for consistent appearance

## Notes

- The existing tier display in the blue info box (lines 109-123) has been **kept** to provide additional context below the metrics
- The badge uses the tier value from `metrics.partnerTier` which comes from the API
- Tier names are case-insensitive (normalized to lowercase for matching)
- Unknown tiers fall back to a neutral gray badge with a star icon

## Future Enhancements

Possible improvements:
- Add tier progress indicator
- Add tooltip showing tier benefits
- Animate tier changes
- Add tier upgrade/downgrade indicators
- Show historical tier information

---

**Status:** ✅ Complete  
**Date:** 2025-01-22

