/**
 * Utility Functions
 * Common helpers for formatting, calculations, etc.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency (safe - handles non-numeric values)
 */
export function formatCurrency(value: number | string | null | undefined, currency: string = 'USD'): string {
  const numValue = Number(value);
  if (isNaN(numValue) || !isFinite(numValue)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numValue);
}

/**
 * Format number with commas (safe - handles non-numeric values)
 */
export function formatNumber(value: number | string | null | undefined): string {
  const numValue = Number(value);
  if (isNaN(numValue) || !isFinite(numValue)) return '0';
  return new Intl.NumberFormat('en-US').format(numValue);
}

/**
 * Format percentage (safe - handles non-numeric values)
 */
export function formatPercentage(value: number | string | null | undefined, decimals: number = 1): string {
  const numValue = Number(value);
  if (isNaN(numValue) || !isFinite(numValue)) return `0.${'0'.repeat(decimals)}%`;
  return `${numValue.toFixed(decimals)}%`;
}

/**
 * Safely convert to number and format with fixed decimals
 * Handles null, undefined, strings, and non-numeric values
 */
export function safeToFixed(value: any, decimals: number = 2): string {
  const numValue = Number(value);
  if (isNaN(numValue) || !isFinite(numValue)) {
    return '0.' + '0'.repeat(decimals);
  }
  return numValue.toFixed(decimals);
}

/**
 * Format date
 */
export function formatDate(date: string | Date, format: 'short' | 'long' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'long') {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(d);
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Get tier color
 */
export function getTierColor(tier?: string): string {
  switch (tier?.toLowerCase()) {
    case 'platinum':
      return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
    case 'gold':
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    case 'silver':
      return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    case 'bronze':
      return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
    case 'vip':
      return 'text-red-600 bg-red-100 dark:bg-red-900/20';
    case 'active':
      return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    case 'new':
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    case 'dormant':
      return 'text-gray-500 bg-gray-100 dark:bg-gray-800/20';
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
  }
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number = 50): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Check if value is empty
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
}

/**
 * Safe JSON parse
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch (error) {
    return fallback;
  }
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Sort array by key
 */
export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Download data as file
 */
export function downloadFile(data: string, filename: string, type: string = 'text/plain'): void {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

