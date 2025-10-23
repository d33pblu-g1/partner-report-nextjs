/**
 * Deriv Brand Theme Configuration
 * Based on official Frontify brand guidelines
 * https://deriv.frontify.com
 */

// ============================================================================
// Brand Colors
// ============================================================================

export const derivColors = {
  // Primary Brand Colors
  brand: {
    red: '#FF444F',
    redDark: '#D33636',
    blue: '#377CFC',
    blueDark: '#2563D1',
  },
  
  // Light Theme Colors
  light: {
    background: '#FFFFFF',
    surface: '#F2F3F4',
    border: '#D6DADB',
    textPrimary: '#333333',
    textSecondary: '#6E6E6E',
    textDisabled: '#999999',
  },
  
  // Dark Theme Colors
  dark: {
    background: '#0E0E0E',
    surface: '#151717',
    border: '#323738',
    textPrimary: '#FFFFFF',
    textSecondary: '#C2C2C2',
    textDisabled: '#6E6E6E',
  },
  
  // Status Colors
  status: {
    success: '#4BB4B3',
    successDark: '#3A9493',
    warning: '#FF6444',
    warningDark: '#E84C2C',
    error: '#EC3F3F',
    errorDark: '#C92A2A',
    info: '#377CFC',
    infoDark: '#2563D1',
  },
} as const;

// ============================================================================
// Typography
// ============================================================================

export const derivTypography = {
  fontFamily: {
    sans: 'var(--font-ibm-plex-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)',
    mono: 'var(--font-ibm-plex-mono, "SF Mono", "Monaco", "Consolas", monospace)',
  },
  
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
  },
  
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

// ============================================================================
// Chart Colors
// ============================================================================

export const derivChartColors = {
  primary: [
    '#FF444F',  // Deriv Red
    '#377CFC',  // Deriv Blue
    '#4BB4B3',  // Success Green
    '#FF6444',  // Warning Orange
    '#EC3F3F',  // Error Red
  ],
  
  // Sequential color scales for data visualization
  reds: ['#FFE5E7', '#FFCCD0', '#FF99A0', '#FF6670', '#FF444F', '#D33636', '#A82A2A'],
  blues: ['#E5EFFF', '#CCDEFF', '#99BDFF', '#669CFF', '#377CFC', '#2563D1', '#1E4FA1'],
  greens: ['#E5F5F5', '#CCEBEB', '#99D7D7', '#66C3C3', '#4BB4B3', '#3A9493', '#2E7372'],
  
  // Gradient combinations
  gradients: {
    redToBlue: ['#FF444F', '#377CFC'],
    greenToRed: ['#4BB4B3', '#FF6444'],
    blueToGreen: ['#377CFC', '#4BB4B3'],
  },
} as const;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get color based on theme mode
 */
export function getThemeColor(
  colorKey: keyof typeof derivColors.light,
  isDark: boolean
): string {
  return isDark 
    ? derivColors.dark[colorKey as keyof typeof derivColors.dark] 
    : derivColors.light[colorKey];
}

/**
 * Get status color with optional dark variant
 */
export function getStatusColor(
  status: 'success' | 'warning' | 'error' | 'info',
  isDark = false
): string {
  return isDark 
    ? derivColors.status[`${status}Dark` as keyof typeof derivColors.status]
    : derivColors.status[status];
}

/**
 * Get brand color (primary or secondary)
 */
export function getBrandColor(
  variant: 'primary' | 'secondary' = 'primary',
  hover = false
): string {
  if (variant === 'primary') {
    return hover ? derivColors.brand.redDark : derivColors.brand.red;
  }
  return hover ? derivColors.brand.blueDark : derivColors.brand.blue;
}

/**
 * Get chart color by index (cycles through primary colors)
 */
export function getChartColor(index: number): string {
  return derivChartColors.primary[index % derivChartColors.primary.length];
}

/**
 * Generate CSS variable reference
 */
export function cssVar(name: string): string {
  return `var(--${name})`;
}

// ============================================================================
// Tailwind Color Classes (for reference)
// ============================================================================

export const derivTailwindClasses = {
  // Primary Button
  primaryButton: 'bg-[#FF444F] hover:bg-[#D33636] text-white',
  
  // Secondary Button
  secondaryButton: 'bg-[#377CFC] hover:bg-[#2563D1] text-white',
  
  // Card Backgrounds
  cardLight: 'bg-white border-[#D6DADB]',
  cardDark: 'dark:bg-[#151717] dark:border-[#323738]',
  
  // Text Colors
  textPrimary: 'text-[#333333] dark:text-white',
  textSecondary: 'text-[#6E6E6E] dark:text-[#C2C2C2]',
  
  // Status
  success: 'text-[#4BB4B3] bg-[#4BB4B3]/10',
  warning: 'text-[#FF6444] bg-[#FF6444]/10',
  error: 'text-[#EC3F3F] bg-[#EC3F3F]/10',
  info: 'text-[#377CFC] bg-[#377CFC]/10',
} as const;

// ============================================================================
// Export Everything
// ============================================================================

export default {
  colors: derivColors,
  typography: derivTypography,
  chartColors: derivChartColors,
  getThemeColor,
  getStatusColor,
  getBrandColor,
  getChartColor,
  cssVar,
  tailwindClasses: derivTailwindClasses,
};

