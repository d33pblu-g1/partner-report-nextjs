/**
 * Custom hooks for Partner Tier System
 */

import { useQuery } from '@tanstack/react-query';
import { buildApiUrl } from '@/lib/config';
import type { TierConfig, MonthlyCommission, TierDistribution, TierStatistics } from '@/types/tiers';

// Fetch tier configuration
export function useTierConfig() {
  return useQuery({
    queryKey: ['tierConfig'],
    queryFn: async () => {
      const response = await fetch(buildApiUrl('tiers', { action: 'config' }));
      if (!response.ok) {
        throw new Error('Failed to fetch tier configuration');
      }
      const data = await response.json();
      return data.data as TierConfig[];
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (tier config rarely changes)
  });
}

// Fetch commission history for a partner
export function useCommissionHistory(partnerId: string | null, limit = 12) {
  return useQuery({
    queryKey: ['commissionHistory', partnerId, limit],
    queryFn: async () => {
      if (!partnerId) return [];
      
      const response = await fetch(
        buildApiUrl('tiers', { action: 'history', partner_id: partnerId, limit: limit.toString() })
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch commission history');
      }
      
      const data = await response.json();
      return data.data as MonthlyCommission[];
    },
    enabled: !!partnerId,
  });
}

// Fetch tier distribution
export function useTierDistribution() {
  return useQuery({
    queryKey: ['tierDistribution'],
    queryFn: async () => {
      const response = await fetch(buildApiUrl('tiers', { action: 'distribution' }));
      
      if (!response.ok) {
        throw new Error('Failed to fetch tier distribution');
      }
      
      const data = await response.json();
      return data.data as {
        distribution: TierDistribution[];
        total_partners: number;
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch tier statistics for a partner
export function useTierStatistics(partnerId: string | null) {
  return useQuery({
    queryKey: ['tierStatistics', partnerId],
    queryFn: async () => {
      if (!partnerId) return null;
      
      const response = await fetch(
        buildApiUrl('tiers', { action: 'statistics', partner_id: partnerId })
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch tier statistics');
      }
      
      const data = await response.json();
      return data.data as TierStatistics;
    },
    enabled: !!partnerId,
  });
}

// Fetch overall tier statistics
export function useOverallTierStatistics() {
  return useQuery({
    queryKey: ['tierStatisticsOverall'],
    queryFn: async () => {
      const response = await fetch(buildApiUrl('tiers', { action: 'statistics' }));
      
      if (!response.ok) {
        throw new Error('Failed to fetch overall tier statistics');
      }
      
      const data = await response.json();
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Trigger tier calculation (mutation)
export async function calculateTiers(partnerId?: string): Promise<void> {
  const params = partnerId ? { action: 'calculate', partner_id: partnerId } : { action: 'calculate' };
  const response = await fetch(buildApiUrl('tiers', params), {
    method: 'GET', // Using GET as specified in API
  });
  
  if (!response.ok) {
    throw new Error('Failed to calculate tiers');
  }
  
  return response.json();
}

