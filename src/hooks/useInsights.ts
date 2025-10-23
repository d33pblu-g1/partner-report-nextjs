/**
 * useInsights Hook
 * React Query hook for fetching partner insights
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getInsights } from '@/lib/api';
import type { PartnerInsight } from '@/types';

/**
 * Fetch insights for a partner
 */
export function useInsights(partnerId?: string): UseQueryResult<PartnerInsight[], Error> {
  return useQuery({
    queryKey: ['insights', partnerId],
    queryFn: () => getInsights(partnerId!),
    enabled: !!partnerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

