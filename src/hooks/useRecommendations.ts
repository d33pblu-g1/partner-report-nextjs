/**
 * useRecommendations Hook
 * React Query hook for fetching partner recommendations
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getRecommendations } from '@/lib/api';
import type { PartnerRecommendation } from '@/types';

/**
 * Fetch recommendations for a partner
 */
export function useRecommendations(partnerId?: string): UseQueryResult<PartnerRecommendation[], Error> {
  return useQuery({
    queryKey: ['recommendations', partnerId],
    queryFn: () => getRecommendations(partnerId!),
    enabled: !!partnerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

