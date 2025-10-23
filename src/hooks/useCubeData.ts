/**
 * Generic Hook for Fetching Cube Data
 * Provides a reusable way to fetch any cube with caching and error handling
 */

import { useQuery } from '@tanstack/react-query';
import { getCubeData } from '@/lib/api';

interface UseCubeDataOptions {
  cubeName: string;
  partnerId?: string;
  enabled?: boolean;
  refetchInterval?: number;
}

export function useCubeData<T = any>(options: UseCubeDataOptions) {
  const { cubeName, partnerId, enabled = true, refetchInterval } = options;

  return useQuery({
    queryKey: ['cube', cubeName, partnerId],
    queryFn: () => getCubeData<T>(cubeName, partnerId),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval,
    retry: 1, // Only retry once for missing cubes
    retryDelay: 1000, // Wait 1 second before retry
  });
}

// Specific cube hooks for better type safety
export function useDailyTrends(partnerId?: string) {
  return useCubeData({
    cubeName: 'daily_trends',
    partnerId,
  });
}

export function useCommissionsByPlan(partnerId?: string) {
  return useCubeData({
    cubeName: 'daily_commissions_plan',
    partnerId,
  });
}

export function useCommissionsByPlatform(partnerId?: string) {
  return useCubeData({
    cubeName: 'daily_commissions_platform',
    partnerId,
  });
}

export function useCommissionsByProduct(partnerId?: string) {
  return useCubeData({
    cubeName: 'commissions_product',
    partnerId,
  });
}

export function useCommissionsBySymbol(partnerId?: string) {
  return useCubeData({
    cubeName: 'commissions_symbol',
    partnerId,
  });
}

export function useDailySignups(partnerId?: string) {
  return useCubeData({
    cubeName: 'daily_signups',
    partnerId,
  });
}

export function useDailyFunding(partnerId?: string) {
  return useCubeData({
    cubeName: 'daily_funding',
    partnerId,
  });
}

export function useClientDemographics(partnerId?: string) {
  return useCubeData({
    cubeName: 'client_demographics',
    partnerId,
  });
}

export function useCountryPerformance(partnerId?: string) {
  return useCubeData({
    cubeName: 'country_performance',
    partnerId,
  });
}

export function useProductVolume(partnerId?: string) {
  return useCubeData({
    cubeName: 'product_volume',
    partnerId,
  });
}

export function useBadgeProgress(partnerId?: string) {
  return useCubeData({
    cubeName: 'badge_progress',
    partnerId,
  });
}

export function useMonthlyDeposits(partnerId?: string) {
  return useCubeData({
    cubeName: 'monthly_deposits',
    partnerId,
  });
}

