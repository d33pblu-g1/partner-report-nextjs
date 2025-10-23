/**
 * useCommissions Hook
 * React Query hook for fetching commission data
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getCommissions } from '@/lib/api';
import type { CommissionData } from '@/types';

/**
 * Fetch commission data
 */
export function useCommissions(partnerId?: string): UseQueryResult<CommissionData[], Error> {
  return useQuery({
    queryKey: ['commissions', partnerId || 'all'],
    queryFn: () => getCommissions(partnerId),
  });
}

