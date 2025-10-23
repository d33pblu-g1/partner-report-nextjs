/**
 * usePartners Hook
 * React Query hook for fetching partner data
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getPartners, getPartner } from '@/lib/api';
import type { Partner } from '@/types';

/**
 * Fetch all partners
 */
export function usePartners(): UseQueryResult<Partner[], Error> {
  return useQuery({
    queryKey: ['partners'],
    queryFn: getPartners,
  });
}

/**
 * Fetch single partner
 */
export function usePartner(partnerId: string): UseQueryResult<Partner, Error> {
  return useQuery({
    queryKey: ['partner', partnerId],
    queryFn: () => getPartner(partnerId),
    enabled: !!partnerId,
  });
}

