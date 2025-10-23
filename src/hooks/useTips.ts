/**
 * Custom hook for fetching affiliate tips
 */

import { useQuery } from '@tanstack/react-query';
import { getRandomTip } from '@/lib/api';
import type { AffiliateTip } from '@/types';

/**
 * Hook to fetch a random affiliate tip
 * @returns Query result with tip data, loading state, error, and refetch function
 */
export function useRandomTip() {
  return useQuery<AffiliateTip>({
    queryKey: ['randomTip'],
    queryFn: getRandomTip,
    staleTime: 0, // Always fetch fresh data when refetch is called
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
}

