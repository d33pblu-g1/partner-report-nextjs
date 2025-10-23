/**
 * useMetrics Hook
 * React Query hook for fetching metrics data
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getMetrics, getPartnerScorecard } from '@/lib/api';
import type { PartnerMetrics, PartnerScorecardCube } from '@/types';

/**
 * Fetch partner metrics
 */
export function useMetrics(partnerId?: string): UseQueryResult<PartnerMetrics, Error> {
  return useQuery({
    queryKey: ['metrics', partnerId || 'all'],
    queryFn: () => getMetrics(partnerId),
  });
}

/**
 * Fetch partner scorecard
 */
export function usePartnerScorecard(partnerId?: string): UseQueryResult<PartnerScorecardCube | PartnerScorecardCube[], Error> {
  return useQuery({
    queryKey: ['scorecard', partnerId || 'all'],
    queryFn: () => getPartnerScorecard(partnerId),
    enabled: !!partnerId, // Only fetch if partnerId is provided
  });
}

