/**
 * useClients Hook
 * React Query hook for fetching client data
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getClients } from '@/lib/api';
import type { Client, FilterOptions } from '@/types';

/**
 * Fetch clients with optional filters
 */
export function useClients(filters?: FilterOptions): UseQueryResult<Client[], Error> {
  return useQuery({
    queryKey: ['clients', filters],
    queryFn: () => getClients(filters),
  });
}

